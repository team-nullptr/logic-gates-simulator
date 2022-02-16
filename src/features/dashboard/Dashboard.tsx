import styles from './Dashboard.module.scss';
import { Card } from './Card';
import { ProjectManagerContext, ProjectManagerProvider } from '../../context/projectManagerContext';
import { useContext, useState } from 'react';
import { Project } from '../../core/project-manager/ProjectManager';

export const Dashboard = () => {
  const projectManager = useContext(ProjectManagerContext);
  const [projects] = useState<Project[]>(projectManager.projects);

  return (
    <ProjectManagerProvider>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.header__title}>Projects</h1>
        </header>
        <section className={styles.projects}>
          {projects.map((project) => (
            <Card project={project} key={project.id} />
          ))}
        </section>
      </main>
    </ProjectManagerProvider>
  );
};
