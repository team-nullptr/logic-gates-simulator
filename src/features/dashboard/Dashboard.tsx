import { StyledWrapper, StyledGrid, StyledHeader, StyledTitle, StyledInfo, StyledSpan } from './Dashboard.styles';
import { DashboardCard } from './DashboardCard';
import { useEffect, useState } from 'react';
import { Project } from '../../core/project-manager/ProjectManager';
import { projectManager } from '../../core/project-manager/ProjectManager';
import { DashboardNavigation } from './DashboardNavigation';
import { messageBus } from '../message-bus/MessageBus';
import { NavigationButton } from '../navigation/NavigationButton';
import { Plus } from 'react-feather';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(projectManager.projects);
  }, []);

  const handleProjectDelete = (id: string) => {
    projectManager.deleteProject(id);
    setProjects(projects.filter((it) => it.id !== id));
    messageBus.push({ type: 'success', body: 'project deleted successfully' });
  };

  const createProject = () => {
    try {
      const id = projectManager.createProject('Untitled');
      messageBus.push({ type: 'success', body: 'A new project has been created successfully' });
      navigate(`/editor/${id}`);
    } catch (err) {
      messageBus.push({ type: 'error', body: 'Failed to create a new project' });
    }
  };

  return (
    <>
      <DashboardNavigation />
      <StyledWrapper>
        <StyledHeader>
          <StyledTitle>Projects</StyledTitle>
        </StyledHeader>
        {projects.length ? (
          <StyledGrid>
            {projects.map((project) => (
              <DashboardCard onDelete={() => handleProjectDelete(project.id)} project={project} key={project.id} />
            ))}
          </StyledGrid>
        ) : (
          <StyledInfo>
            <p>You don&apos;t have any projects yet!</p>
            <NavigationButton icon={Plus} text="New project" onClick={createProject} />
          </StyledInfo>
        )}
      </StyledWrapper>
    </>
  );
};
