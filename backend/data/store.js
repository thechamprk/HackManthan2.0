const { v4: uuidv4 } = require('uuid');

function createId(prefix) {
  return `${prefix}_${uuidv4().slice(0, 8)}`;
}

const now = Date.now();

const projects = [
  {
    id: 'proj_001',
    name: 'Volunteer Match AI',
    tag: 'community',
    description: 'AI-assisted matching for volunteers and local causes.',
    status: 'active',
    progress: 72,
    team: ['RP', 'AK', 'SN'],
    dueDate: new Date(now + 1000 * 60 * 60 * 24 * 12).toISOString(),
    color: '#4caf82',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 20).toISOString()
  },
  {
    id: 'proj_002',
    name: 'Women Founder Grants Finder',
    tag: 'grants',
    description: 'Surface matching grants and simplify eligibility checks.',
    status: 'review',
    progress: 48,
    team: ['TR', 'MK'],
    dueDate: new Date(now + 1000 * 60 * 60 * 24 * 8).toISOString(),
    color: '#e8a84c',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 15).toISOString()
  },
  {
    id: 'proj_003',
    name: 'Campus Skills OS',
    tag: 'education',
    description: 'Student career roadmap and task execution workflow.',
    status: 'planning',
    progress: 24,
    team: ['JS', 'PD', 'AL'],
    dueDate: new Date(now + 1000 * 60 * 60 * 24 * 28).toISOString(),
    color: '#a3c4e8',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 9).toISOString()
  },
  {
    id: 'proj_004',
    name: 'SME Credit Insights',
    tag: 'finance',
    description: 'Risk scoring assistant with explainable decision trace.',
    status: 'blocked',
    progress: 35,
    team: ['HG', 'VM'],
    dueDate: new Date(now + 1000 * 60 * 60 * 24 * 16).toISOString(),
    color: '#e86060',
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 11).toISOString()
  }
];

const tasks = [
  {
    id: 'task_001',
    projectId: 'proj_001',
    text: 'Finalize matching heuristic tuning',
    tag: 'model',
    dueDate: new Date(now + 1000 * 60 * 60 * 24).toISOString(),
    done: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
    priority: 'high',
    estimatedMinutes: 45
  },
  {
    id: 'task_002',
    projectId: 'proj_002',
    text: 'Update grant eligibility scoring fields',
    tag: 'grants',
    dueDate: new Date(now + 1000 * 60 * 60 * 24 * 2).toISOString(),
    done: true,
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 4).toISOString(),
    priority: 'medium',
    estimatedMinutes: 30
  },
  {
    id: 'task_003',
    projectId: 'proj_003',
    text: 'Draft onboarding checklist copy',
    tag: 'content',
    dueDate: new Date(now + 1000 * 60 * 60 * 24).toISOString(),
    done: false,
    createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    priority: 'low',
    estimatedMinutes: 25
  }
];

const onboardingTemplate = [
  {
    id: 'onb_001',
    section: 'Profile Setup',
    title: 'Complete your profile',
    description: 'Add role, skills, and focus area.',
    done: true
  },
  {
    id: 'onb_002',
    section: 'Profile Setup',
    title: 'Set your working cadence',
    description: 'Pick daily planning and review windows.',
    done: false
  },
  {
    id: 'onb_003',
    section: 'First Project',
    title: 'Create first project card',
    description: 'Set goals, team, and timeline.',
    done: true
  },
  {
    id: 'onb_004',
    section: 'Integrations',
    title: 'Connect calendar',
    description: 'Sync deadlines and reminders.',
    link: '/integrations/calendar',
    done: false
  },
  {
    id: 'onb_005',
    section: 'AI Features',
    title: 'Try AI task breakdown',
    description: 'Generate subtasks from a single goal prompt.',
    done: false
  }
];

const onboardingByUser = {};

const grantsDataset = [
  {
    id: 'grant_001',
    name: 'National Innovation Seed Grant',
    organization: 'Innovation Mission India',
    amount: '₹10,00,000',
    deadline: '2026-06-15',
    matchPercent: 87,
    description: 'Supports early-stage technology pilots with social impact.'
  },
  {
    id: 'grant_002',
    name: 'Women in Tech Catalyst Fund',
    organization: 'FutureBuild Foundation',
    amount: '₹7,50,000',
    deadline: '2026-05-30',
    matchPercent: 81,
    description: 'Funding and mentorship for women-led startups.'
  },
  {
    id: 'grant_003',
    name: 'Rural Impact Acceleration Grant',
    organization: 'Rural Development Council',
    amount: '₹12,00,000',
    deadline: '2026-07-20',
    matchPercent: 76,
    description: 'Designed for projects improving livelihoods in rural regions.'
  },
  {
    id: 'grant_004',
    name: 'EduTech Prototype Support',
    organization: 'Digital Learning Trust',
    amount: '₹5,00,000',
    deadline: '2026-05-25',
    matchPercent: 73,
    description: 'Supports products that improve student outcomes.'
  }
];

const activity = [
  {
    id: createId('act'),
    text: 'Volunteer Match AI reached 72% progress',
    timestamp: new Date(now - 1000 * 60 * 90).toISOString()
  },
  {
    id: createId('act'),
    text: 'Task completed: Update grant eligibility scoring fields',
    timestamp: new Date(now - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: createId('act'),
    text: 'New project created: Campus Skills OS',
    timestamp: new Date(now - 1000 * 60 * 60 * 20).toISOString()
  }
];

const milestones = [
  {
    id: createId('mile'),
    title: 'Beta testing sprint close',
    dueDate: new Date(now + 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: createId('mile'),
    title: 'Grant submission package',
    dueDate: new Date(now + 1000 * 60 * 60 * 24 * 6).toISOString()
  }
];

function ensureUserOnboarding(userId) {
  if (!onboardingByUser[userId]) {
    onboardingByUser[userId] = onboardingTemplate.map((item) => ({ ...item }));
  }
  return onboardingByUser[userId];
}

module.exports = {
  createId,
  projects,
  tasks,
  grantsDataset,
  onboardingByUser,
  ensureUserOnboarding,
  activity,
  milestones
};
