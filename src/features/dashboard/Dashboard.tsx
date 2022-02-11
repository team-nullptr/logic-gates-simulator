import styles from './Dashboard.module.scss';
import { Card } from './Card';

export interface Project {
  id: string;
  name: string;
  created: Date;
  modified: Date;
}

const projects: Project[] = [
  {
    id: '1',
    name: 'testowy projekt',
    created: new Date(),
    modified: new Date()
  },
  {
    id: '2',
    name: 'testowy projekt',
    created: new Date(),
    modified: new Date()
  },
  {
    id: '3',
    name: 'testowy projekt',
    created: new Date(),
    modified: new Date()
  },
  {
    id: '4',
    name: 'testowy projekt',
    created: new Date(),
    modified: new Date()
  },
  {
    id: '5',
    name: 'testowy projekt',
    created: new Date(),
    modified: new Date()
  }
];

export const Dashboard = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.header__title}>Projects</h1>
      </header>
      <section className={styles.projects}>
        {projects.map(project => (
          <Card project={project} key={project.id} />
        ))}
      </section>
    </div>
  );
};
