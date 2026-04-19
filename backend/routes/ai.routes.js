const express = require('express');
const { z } = require('zod');
const { generateResponse } = require('../services/groq.service');
const { grantsDataset } = require('../data/store');
const { successResponse } = require('../utils/response');
const { GROQ_MODEL } = require('../utils/constants');

const router = express.Router();

const breakdownSchema = z.object({
  goal: z.string().trim().min(1)
});

const grantsSchema = z.object({
  description: z.string().trim().min(1)
});

const summarySchema = z.object({
  query: z.string().trim().min(1),
  results: z.array(z.any()).default([])
});

function extractJsonArray(text) {
  if (Array.isArray(text)) return text;
  if (!text || typeof text !== 'string') return null;

  const cleaned = text
    .replace(/```json/gi, '```')
    .replace(/```/g, '')
    .replace(/^[\s\S]*?(\[)/, '$1')
    .replace(/(\])[\s\S]*$/, '$1')
    .trim();

  const attempts = [cleaned, text.trim()];

  for (const candidate of attempts) {
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed)) return parsed;
    } catch (_error) {
      const match = candidate.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed)) return parsed;
        } catch (_innerError) {
          // Ignore and continue
        }
      }
    }
  }

  return null;
}

async function runJsonArrayPrompt(systemPrompt, userPrompt) {
  const response = await generateResponse(systemPrompt, userPrompt, 0.2, {
    model: GROQ_MODEL
  });

  return extractJsonArray(response.content);
}

router.post('/breakdown', async (req, res) => {
  try {
    const parsed = breakdownSchema.parse(req.body || {});

    const data = await runJsonArrayPrompt(
      'You are a productivity AI. Return ONLY a JSON array. No prose. Format: [{"text":"","tag":"","priority":"high|medium|low","estimatedMinutes":20}]',
      `Break down this goal into practical subtasks: ${parsed.goal}`
    );

    const fallback = parsed.goal
      .split(/,| and /i)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5)
      .map((item, index) => ({
        text: item,
        tag: 'execution',
        priority: index === 0 ? 'high' : 'medium',
        estimatedMinutes: index === 0 ? 45 : 25
      }));

    let selected = data;
    if (!Array.isArray(selected) || selected.length === 0) {
      selected = fallback.length
        ? fallback
        : [
            {
              text: `Plan first action for: ${parsed.goal}`,
              tag: 'planning',
              priority: 'high',
              estimatedMinutes: 30
            }
          ];
    }

    const normalized = selected.map((item) => ({
      text: String(item.text || '').trim() || 'Untitled task',
      tag: String(item.tag || 'general').trim(),
      priority: ['high', 'medium', 'low'].includes(String(item.priority))
        ? String(item.priority)
        : 'medium',
      estimatedMinutes: Number(item.estimatedMinutes) > 0 ? Number(item.estimatedMinutes) : 30
    }));

    return res.status(200).json(successResponse(normalized));
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        message: error?.errors?.[0]?.message || error.message || 'Invalid request body'
      }
    });
  }
});

router.post('/grants', async (req, res) => {
  try {
    const parsed = grantsSchema.parse(req.body || {});

    const data = await runJsonArrayPrompt(
      'Suggest exactly 4 startup grants based on the user profile. Return ONLY JSON array: [{"name":"","organization":"","amount":"","deadline":"YYYY-MM-DD","matchPercent":80,"description":""}]',
      `Profile description: ${parsed.description}`
    );

    const normalized = (data && data.length ? data.slice(0, 4) : grantsDataset.slice(0, 4)).map((item) => ({
      name: String(item.name || 'Grant Opportunity').trim(),
      organization: String(item.organization || 'Funding Org').trim(),
      amount: String(item.amount || 'TBD').trim(),
      deadline: String(item.deadline || '2026-12-31').trim(),
      matchPercent: Math.max(50, Math.min(99, Number(item.matchPercent) || 75)),
      description: String(item.description || 'Potentially relevant grant for your goals.').trim()
    }));

    return res.status(200).json(successResponse(normalized));
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        message: error?.errors?.[0]?.message || error.message || 'Invalid request body'
      }
    });
  }
});

router.post('/search-summary', async (req, res) => {
  try {
    const parsed = summarySchema.parse(req.body || {});

    const safeResults = Array.isArray(parsed.results) ? parsed.results.slice(0, 20) : [];

    const response = await generateResponse(
      'Summarize search results in 2-3 sentences. Keep it concise and actionable.',
      `Query: ${parsed.query}\nResults: ${JSON.stringify(safeResults)}`,
      0.2,
      { model: GROQ_MODEL }
    );

    const summary = String(response.content || '').trim() || `Found ${parsed.results.length} relevant results for "${parsed.query}".`;

    return res.status(200).json(successResponse({ summary }));
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        message: error?.errors?.[0]?.message || error.message || 'Invalid request body'
      }
    });
  }
});

module.exports = router;
