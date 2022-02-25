import blueprintImage from '../../assets/images/blueprint.png';
import { Project, projectManager } from '../../core/project-manager/ProjectManager';
import { StyledCard, StyledImage, StyledDescription, StyledDate } from './DashboardCard.styles';
import { formatRelative } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Editable } from '../common/Editable';

interface CardProps {
  project: Project;
}

export const DashboardCard = ({ project }: CardProps) => {
  const navigate = useNavigate();

  const openEditor = () => {
    navigate(`/editor/${project.id}`);
  };

  const handleProjectRename = (name: string) => {
    project.name = name;
    projectManager.saveProject(project);
  };

  return (
    <StyledCard onDoubleClick={openEditor}>
      <StyledImage src={blueprintImage} alt="blueprint" />
      <StyledDescription>
        <Editable value={project.name} onEdit={handleProjectRename} />
        <StyledDate>{formatRelative(project.modifiedAt, new Date())}</StyledDate>
      </StyledDescription>
    </StyledCard>
  );
};
