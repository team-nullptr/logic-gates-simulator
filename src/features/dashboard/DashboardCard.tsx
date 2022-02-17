import blueprintImage from '../../assets/images/blueprint.png';
import { Project } from '../../core/project-manager/ProjectManager';
import { StyledCard, StyledImage, StyledDescription, StyledTitle, StyledDate } from './DashboardCard.styles';
import { formatRelative } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

interface CardProps {
  project: Project;
}

export const DashboardCard = ({ project: { id, name, modifiedAt } }: CardProps) => {
  const navigate = useNavigate();

  const openEditor = () => {
    navigate(`/edit/${id}`);
  };

  return (
    <StyledCard onDoubleClick={openEditor}>
      <StyledImage src={blueprintImage} alt="blueprint" />
      <StyledDescription>
        <StyledTitle>{name}</StyledTitle>
        <StyledDate>{formatRelative(modifiedAt, new Date())}</StyledDate>
      </StyledDescription>
    </StyledCard>
  );
};
