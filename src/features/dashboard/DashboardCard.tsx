import styles from './DashboardCard.module.scss';
import blueprintImage from '../../assets/images/blueprint.png';
import { Project } from '../../core/project-manager/ProjectManager';
import { formatRelative } from 'date-fns';
import { Link } from 'react-router-dom';

interface CardProps {
  project: Project;
}

export const DashboardCard = ({ project: { id, name, modifiedAt } }: CardProps) => {
  return (
    <Link to={`/edit/${id}`}>
      <article className={styles.card}>
        <img className={styles.card__image} src={blueprintImage} alt="blueprint" />
        <div className={styles.card__meta}>
          <p className={styles.card__title}>{name}</p>
          <span className={styles.card__modified}>{formatRelative(modifiedAt, new Date())}</span>
        </div>
      </article>
    </Link>
  );
};
