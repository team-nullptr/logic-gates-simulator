import styles from './Card.module.scss';
import blueprintImage from '../../assets/images/blueprint.png';
import { Project } from './Dashboard';
import { formatRelative } from 'date-fns';

interface CardProps {
  project: Project;
}

export const Card = ({ project: { name, modified } }: CardProps) => {
  return (
    <article className={styles.card}>
      <img className={styles.card__image} src={blueprintImage} alt='blueprint' />
      <div className={styles.card__meta}>
        <p className={styles.card__title}>{name}</p>
        <span className={styles.card__modified}>{formatRelative(modified, new Date())}</span>
      </div>
    </article>
  );
};
