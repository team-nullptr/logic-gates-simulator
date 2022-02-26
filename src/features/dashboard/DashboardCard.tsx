import blueprintImage from '../../assets/images/blueprint.png';
import { Project, projectManager } from '../../core/project-manager/ProjectManager';
import {
  StyledCard,
  StyledImage,
  StyledDescription,
  StyledDate,
  StyledDeleteButton,
  StyledHeader,
  StyledDescriptionSection,
  StyledOptionBar
} from './DashboardCard.styles';
import { X } from 'react-feather';
import { formatRelative } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Editable } from '../common/Editable';
import { messageBus } from '../message-bus/MessageBus';

interface CardProps {
  project: Project;
  onDelete: () => void;
}

export const DashboardCard = ({ project, onDelete }: CardProps) => {
  const navigate = useNavigate();

  const openEditor = () => {
    navigate(`/editor/${project.id}`);
  };

  const handleProjectRename = (name: string) => {
    if (name.length === 0) {
      messageBus.push({ type: 'error', body: "Project name can't be empty" });
      return;
    }

    project.name = name;
    projectManager.saveProject(project);
  };

  return (
    <StyledCard onDoubleClick={openEditor}>
      <StyledHeader>
        <StyledOptionBar>
          <StyledDeleteButton onClick={onDelete}>
            <X />
          </StyledDeleteButton>
        </StyledOptionBar>
        <StyledImage src={blueprintImage} />
      </StyledHeader>
      <StyledDescription>
        <StyledDescriptionSection>
          {/* TODO: text does not wrap when title is too long */}
          <Editable value={project.name} onEdit={handleProjectRename} />
          <StyledDate>{formatRelative(project.modifiedAt, new Date())}</StyledDate>
        </StyledDescriptionSection>
      </StyledDescription>
    </StyledCard>
  );
};
