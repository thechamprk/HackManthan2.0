import React, { useState } from 'react';
import ProjectTile from '../components/ProjectTile';
import ProjectModal from '../components/ProjectModal';
import ProjectHubForm from '../components/ProjectHubForm';
import AIToDoForm from '../components/AIToDoForm';
import GrantsForm from '../components/GrantsForm';
import DeepSearchForm from '../components/DeepSearchForm';
import ThemeToggle from '../components/ThemeToggle';
import styles from '../styles/ProjectsHub.module.css';

export default function ProjectsHub() {
  const [activeModal, setActiveModal] = useState(null);

  const projects = [
    {
      id: 'hub',
      title: '📦 Project HUB',
      description: 'Click to create a project, define goals, and start execution planning.',
      icon: '📦'
    },
    {
      id: 'ai-todo',
      title: '🤖 AI To-Do Engine',
      description: 'Click to create tasks, assign work, track progress, and remove completed items.',
      icon: '🤖'
    },
    {
      id: 'grants',
      title: '📋 Grants + Onboarding',
      description: 'Click to create grant and onboarding actions with continuity checkpoints.',
      icon: '📋'
    },
    {
      id: 'search',
      title: '🔍 Deep Search',
      description: 'Click to create deep-research prompts and capture insights for product decisions.',
      icon: '🔍'
    }
  ];

  return (
    <div className={styles['projects-hub']}>
      <header className={styles['hub-header']}>
        <div>
          <h1>INSIGHTS</h1>
          <p>Project execution + intelligence modules</p>
        </div>
        <ThemeToggle />
      </header>

      <div className={styles['tiles-grid']}>
        {projects.map((project) => (
          <ProjectTile
            key={project.id}
            title={project.title}
            description={project.description}
            icon={project.icon}
            onClick={() => setActiveModal(project.id)}
          />
        ))}
      </div>

      <ProjectModal
        title="1) Project HUB (execution)"
        isOpen={activeModal === 'hub'}
        onClose={() => setActiveModal(null)}
      >
        <ProjectHubForm onClose={() => setActiveModal(null)} />
      </ProjectModal>

      <ProjectModal
        title="2) AI To-Do engine (structure)"
        isOpen={activeModal === 'ai-todo'}
        onClose={() => setActiveModal(null)}
      >
        <AIToDoForm />
      </ProjectModal>

      <ProjectModal
        title="3) Grant + onboarding (continuation)"
        isOpen={activeModal === 'grants'}
        onClose={() => setActiveModal(null)}
      >
        <GrantsForm />
      </ProjectModal>

      <ProjectModal
        title="4) Deep Search (product thinking)"
        isOpen={activeModal === 'search'}
        onClose={() => setActiveModal(null)}
      >
        <DeepSearchForm />
      </ProjectModal>
    </div>
  );
}
