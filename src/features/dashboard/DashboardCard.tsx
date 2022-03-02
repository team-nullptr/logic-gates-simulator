import { Project, projectManager } from '../../core/project-manager/ProjectManager';
import {
  StyledCard,
  StyledDate,
  StyledDeleteButton,
  StyledDescription,
  StyledDescriptionSection,
  StyledHeader,
  StyledIcon,
  StyledOptionBar
} from './DashboardCard.styles';
import { GitPullRequest, X } from 'react-feather';
import { formatRelative } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Editable } from '../common/Editable';
import { MouseEvent } from 'react';

interface CardProps {
  project: Project;
  onDelete: () => void;
}

export const DashboardCard = ({ project, onDelete }: CardProps) => {
  const navigate = useNavigate();

  const openEditor = () => {
    navigate(`/editor/${project.id}`);
  };

  const handleDelete = (event: MouseEvent) => {
    event.stopPropagation();
    onDelete();
  };

  const handleProjectRename = (name: string) => {
    project.name = name;
    projectManager.saveProject(project);
  };

  return (
    <StyledCard onClick={openEditor}>
      <StyledHeader>
        <StyledOptionBar>
          <StyledDeleteButton onClick={handleDelete}>
            <X width={18} height={18} />
          </StyledDeleteButton>
        </StyledOptionBar>
        <StyledIcon>
          <GitPullRequest color="#6601EB" />
        </StyledIcon>
      </StyledHeader>
      <StyledDescription>
        <StyledDescriptionSection onClick={(event) => event.stopPropagation()}>
          <Editable value={project.name} onEdit={handleProjectRename} />
          <StyledDate>{formatRelative(project.modifiedAt, new Date())}</StyledDate>
        </StyledDescriptionSection>
      </StyledDescription>
    </StyledCard>
  );
};
