const { v4: uuidv4 } = require('uuid');
const { listInteractions, retrieve } = require('./hindsight.service');

const projects = new Map();
const CONTEXT_PREVIEW_CHAR_LIMIT = 140;

function truncatePreview(text = '', limit = CONTEXT_PREVIEW_CHAR_LIMIT) {
  if (text.length <= limit) return text;
  const preview = text.slice(0, limit);
  const lastWordIndex = preview.lastIndexOf(' ');
  const safePreview = lastWordIndex > 40 ? preview.slice(0, lastWordIndex) : preview;
  return `${safePreview}...`;
}

const grantCatalog = [
  {
    id: 'grant_foundation_ai_01',
    title: 'AI Product Acceleration Grant',
    provider: 'Innovation Foundation',
    stages: ['prototype', 'pilot'],
    amount_usd: 25000,
    summary: 'Supports early-stage AI products with clear execution milestones.',
    tags: ['ai', 'execution', 'prototype']
  },
  {
    id: 'grant_public_sector_02',
    title: 'Digital Public Problem-Solving Fund',
    provider: 'Civic Tech Board',
    stages: ['pilot', 'growth'],
    amount_usd: 50000,
    summary: 'Funds solutions addressing real-world public service workflows.',
    tags: ['onboarding', 'operations', 'impact']
  },
  {
    id: 'grant_research_03',
    title: 'Deep Research Fellowship',
    provider: 'Applied Research Council',
    stages: ['research', 'prototype'],
    amount_usd: 15000,
    summary: 'For teams validating product direction through evidence-driven research.',
    tags: ['research', 'product thinking', 'discovery']
  }
];

function listProjects() {
  return Array.from(projects.values()).sort((a, b) => {
    const aTime = Date.parse(a.updated_at || '1970-01-01T00:00:00.000Z');
    const bTime = Date.parse(b.updated_at || '1970-01-01T00:00:00.000Z');
    return bTime - aTime;
  });
}

function createProject({ name, goal, owner, timeline_weeks }) {
  const id = `proj_${uuidv4()}`;
  const now = new Date().toISOString();
  const project = {
    project_id: id,
    name,
    goal,
    owner: owner || 'unassigned',
    timeline_weeks: Number(timeline_weeks) || 4,
    status: 'active',
    ai_tasks: [],
    created_at: now,
    updated_at: now
  };
  projects.set(id, project);
  return project;
}

async function generateAiTodoStructure({ project_id, context }) {
  const project = projects.get(project_id);
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const recent = await listInteractions({ limit: 50 });
  const topIssue = recent[0]?.issue_type || 'general_support';
  const normalizedContext = String(context || '')
    .trim()
    .slice(0, 500);

  const tasks = [
    {
      id: `task_${uuidv4()}`,
      title: 'Define execution checkpoints',
      module: 'Project HUB',
      status: 'pending',
      description: `Break "${project.name}" into weekly delivery milestones.`,
      priority: 'high'
    },
    {
      id: `task_${uuidv4()}`,
      title: 'Structure AI task map',
      module: 'AI To-Do engine',
      status: 'pending',
      description: normalizedContext
        ? `Convert input context into categorized tasks: ${truncatePreview(normalizedContext)}`
        : 'Generate objective-based tasks grouped by discovery, build, and validation.',
      priority: 'high'
    },
    {
      id: `task_${uuidv4()}`,
      title: 'Prepare grant continuity checklist',
      module: 'Grant + onboarding',
      status: 'pending',
      description: `Document grant-readiness artifacts for ${project.timeline_weeks} week timeline.`,
      priority: 'medium'
    },
    {
      id: `task_${uuidv4()}`,
      title: 'Run deep search synthesis',
      module: 'Deep Search',
      status: 'pending',
      description: `Summarize prior support trends; latest dominant issue type is "${topIssue}".`,
      priority: 'medium'
    }
  ];

  const updated = {
    ...project,
    updated_at: new Date().toISOString(),
    ai_todo_count: tasks.length,
    ai_tasks: tasks
  };
  projects.set(project.project_id, updated);

  return {
    project: updated,
    tasks
  };
}

function buildProjectNameFromInstruction(instruction = '') {
  const clean = String(instruction).trim().replace(/\s+/g, ' ');
  if (!clean) return 'AI Task Plan';
  const words = clean.split(' ').slice(0, 6).join(' ');
  return words.length > 48 ? `${words.slice(0, 48)}...` : words;
}

async function createTasksFromInstruction({ instruction, owner }) {
  const cleanInstruction = String(instruction || '').trim();
  if (!cleanInstruction) {
    const error = new Error('Instruction is required');
    error.statusCode = 400;
    throw error;
  }

  const project = createProject({
    name: buildProjectNameFromInstruction(cleanInstruction),
    goal: cleanInstruction,
    owner: owner || 'unassigned',
    timeline_weeks: 4
  });

  const todoPayload = await generateAiTodoStructure({
    project_id: project.project_id,
    context: cleanInstruction
  });

  return {
    trigger: 'instruction_auto_create',
    project: todoPayload.project,
    tasks: todoPayload.tasks
  };
}

function searchGrants({ query, stage }) {
  const normalizedQuery = String(query || '')
    .toLowerCase()
    .trim();
  const normalizedStage = String(stage || '').toLowerCase().trim();

  return grantCatalog.filter((item) => {
    const inStage = !normalizedStage || item.stages.includes(normalizedStage);
    const inQuery =
      !normalizedQuery ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.summary.toLowerCase().includes(normalizedQuery) ||
      item.tags.some((tag) => tag.includes(normalizedQuery));

    return inStage && inQuery;
  });
}

function continueOnboarding({ project_id, current_step, team_size }) {
  const project = project_id ? projects.get(project_id) : null;
  const baseline = ['scope_alignment', 'access_setup', 'delivery_rhythm', 'grant_followthrough'];
  const activeStep = String(current_step || baseline[0]);
  const size = Number(team_size) || 1;

  const activeIndex = baseline.indexOf(activeStep);
  const steps = baseline.map((step, index) => {
    let status = 'pending';
    if (index < activeIndex) status = 'done';
    if (step === activeStep) status = 'in_progress';
    return { step, status };
  });

  return {
    project: project || null,
    team_size: size,
    current_step: activeStep,
    continuation_plan: [
      `Assign owners for each milestone (${size} member team).`,
      'Confirm onboarding artifacts and communication channels.',
      'Schedule weekly review to maintain grant and delivery continuity.'
    ],
    steps
  };
}

async function deepSearchSummary({ query, limit }) {
  const size = Number(limit) || 5;
  const [memoryMatches, analyticsMatches] = await Promise.all([
    retrieve(query, size),
    listInteractions({ query, limit: size })
  ]);

  const combined = [...memoryMatches, ...analyticsMatches].slice(0, size);
  const issueCounts = combined.reduce((acc, item) => {
    const key = item.issue_type || 'general_support';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const topIssue = Object.entries(issueCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'general_support';

  return {
    query,
    matches: combined,
    summary: {
      total_matches: combined.length,
      dominant_issue: topIssue,
      recommendation: `Prioritize experiments around "${topIssue}" and validate against latest support memory.`
    }
  };
}

module.exports = {
  listProjects,
  createProject,
  generateAiTodoStructure,
  createTasksFromInstruction,
  searchGrants,
  continueOnboarding,
  deepSearchSummary
};
