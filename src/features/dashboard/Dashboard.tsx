import styles from './Dashboard.module.scss';
import { DashboardCard } from './DashboardCard';
import { useState } from 'react';
import { Project } from '../../core/project-manager/ProjectManager';
import { projectManager } from '../../core/project-manager/ProjectManager';
import { DashboardNavigation } from './DashboardNavigation';

export const Dashboard = () => {
  const [projects] = useState<Project[]>(projectManager.projects);

  return (
    <>
      <DashboardNavigation />
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.header__title}>Projects</h1>
        </header>
        <section className={styles.projects}>
          {projects.map((project) => (
            <DashboardCard project={project} key={project.id} />
          ))}
        </section>
      </main>
    </>
  );
};
