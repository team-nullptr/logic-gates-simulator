import { StyledGrid, StyledInfo, StyledWrapper } from './Dashboard.styles';
import { DashboardCard } from './DashboardCard';
import { useEffect, useState } from 'react';
import { Project, projectManager } from '../../core/project-manager/ProjectManager';
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
  };

  const createProject = () => {
    try {
      const id = projectManager.createProject('Untitled');
      navigate(`/editor/${id}`);
    } catch (err) {
      messageBus.push({ type: 'error', body: 'Failed to create a new project' });
    }
  };

  return (
    <>
      <DashboardNavigation />
      <StyledWrapper>
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
