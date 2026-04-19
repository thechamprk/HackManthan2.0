const { v4: uuidv4 } = require('uuid');
const { listInteractions, retrieve } = require('./hindsight.service');

const projects = new Map();

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
  return Array.from(projects.values()).sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
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
  const normalizedContext = String(context || '').trim();

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
        ? `Convert input context into categorized tasks: ${normalizedContext.slice(0, 140)}`
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
    ai_todo_count: tasks.length
  };
  projects.set(project.project_id, updated);

  return {
    project: updated,
    tasks
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

  const steps = baseline.map((step) => ({
    step,
    status: step === activeStep ? 'in_progress' : baseline.indexOf(step) < baseline.indexOf(activeStep) ? 'done' : 'pending'
  }));

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
  searchGrants,
  continueOnboarding,
  deepSearchSummary
};
