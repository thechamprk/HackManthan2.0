const express = require('express');
const { listInteractions } = require('../services/hindsight.service');

const router = express.Router();

function calculateDashboardMetrics(interactions) {
  const total = interactions.length;
  const avgEffectiveness =
    total === 0
      ? 0
      : interactions.reduce((sum, i) => sum + (i.effectiveness_score || 0), 0) / total;

  const byIssue = interactions.reduce((acc, item) => {
    const key = item.issue_type || 'unknown';
    if (!acc[key]) acc[key] = { count: 0, effectivenessTotal: 0 };
    acc[key].count += 1;
    acc[key].effectivenessTotal += item.effectiveness_score || 0;
    return acc;
  }, {});

  const topIssues = Object.entries(byIssue)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([issue, data]) => ({
      issue,
      count: data.count,
      avg_effectiveness: Number((data.effectivenessTotal / data.count).toFixed(2))
    }));

  const effectivenessByCategory = Object.fromEntries(
    Object.entries(byIssue).map(([issue, data]) => [
      issue,
      Number((data.effectivenessTotal / data.count).toFixed(2))
    ])
  );

  const sortedByTime = [...interactions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const midpoint = Math.floor(sortedByTime.length / 2);
  const oldSlice = sortedByTime.slice(0, midpoint);
  const newSlice = sortedByTime.slice(midpoint);

  const oldAvg = oldSlice.length
    ? oldSlice.reduce((s, i) => s + (i.effectiveness_score || 0), 0) / oldSlice.length
    : 0;
  const newAvg = newSlice.length
    ? newSlice.reduce((s, i) => s + (i.effectiveness_score || 0), 0) / newSlice.length
    : 0;

  const learningTrend = oldAvg === 0 ? 0 : Number((((newAvg - oldAvg) / oldAvg) * 100).toFixed(2));

  return {
    total_interactions: total,
    avg_effectiveness: Number(avgEffectiveness.toFixed(2)),
    learning_trend: learningTrend,
    top_issues: topIssues,
    effectiveness_by_category: effectivenessByCategory
  };
}

function calculateDetailedMetrics(interactions) {
  const dashboard = calculateDashboardMetrics(interactions);

  const mostEffectiveSolutions = [...interactions]
    .sort((a, b) => (b.effectiveness_score || 0) - (a.effectiveness_score || 0))
    .slice(0, 5)
    .map((item) => ({
      interaction_id: item.interaction_id,
      issue_type: item.issue_type,
      effectiveness_score: item.effectiveness_score,
      response_preview: (item.agent_response || '').slice(0, 160)
    }));

  const estimatedResolutionMinutes = interactions.map((item) => {
    const score = item.effectiveness_score || 0.5;
    return Number((20 - score * 10).toFixed(2));
  });

  const avgResolutionTime = estimatedResolutionMinutes.length
    ? Number(
        (
          estimatedResolutionMinutes.reduce((sum, val) => sum + val, 0) /
          estimatedResolutionMinutes.length
        ).toFixed(2)
      )
    : 0;

  const customerSatisfaction = Number((dashboard.avg_effectiveness * 100).toFixed(2));

  return {
    ...dashboard,
    most_effective_solutions: mostEffectiveSolutions,
    week_over_week_improvement: dashboard.learning_trend,
    resolution_time_metrics: {
      avg_resolution_minutes: avgResolutionTime,
      sample_size: estimatedResolutionMinutes.length
    },
    customer_satisfaction_trending: {
      score_percent: customerSatisfaction,
      label:
        customerSatisfaction >= 85
          ? 'Excellent'
          : customerSatisfaction >= 70
            ? 'Good'
            : customerSatisfaction >= 55
              ? 'Moderate'
              : 'Needs Improvement'
    }
  };
}

router.get('/dashboard', async (req, res, next) => {
  try {
    const interactions = await listInteractions({ limit: 500 });
    const metrics = calculateDashboardMetrics(interactions);

    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
});

router.get('/interactions', async (req, res, next) => {
  try {
    const { customer_id, issue_type, query, limit } = req.query;
    const interactions = await listInteractions({ customer_id, issue_type, query, limit });

    res.status(200).json({
      success: true,
      data: interactions,
      meta: {
        count: interactions.length
      }
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
});

router.get('/metrics', async (_req, res, next) => {
  try {
    const interactions = await listInteractions({ limit: 1000 });
    const detailed = calculateDetailedMetrics(interactions);

    res.status(200).json({
      success: true,
      data: detailed
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
});

module.exports = router;
module.exports.calculateDashboardMetrics = calculateDashboardMetrics;
module.exports.calculateDetailedMetrics = calculateDetailedMetrics;
