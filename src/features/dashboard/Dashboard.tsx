import { StyledWrapper, StyledGrid, StyledHeader, StyledTitle } from './Dashboard.styles';
import { DashboardCard } from './DashboardCard';
import { useState } from 'react';
import { Project } from '../../core/project-manager/ProjectManager';
import { projectManager } from '../../core/project-manager/ProjectManager';
import { DashboardNavigation } from './DashboardNavigation';
import { messageBus } from '../message-bus/MessageBus';

export const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>(projectManager.projects);

  const handleProjectDelete = (id: string) => {
    projectManager.deleteProject(id);
    setProjects(projects.filter((it) => it.id !== id));
    messageBus.push({ type: 'success', body: 'project deleted successfully' });
  };

  return (
    <>
      <DashboardNavigation />
      <StyledWrapper>
        <StyledHeader>
          <StyledTitle>Projects</StyledTitle>
        </StyledHeader>
        <StyledGrid>
          {projects.map((project) => (
            <DashboardCard onDelete={() => handleProjectDelete(project.id)} project={project} key={project.id} />
          ))}
        </StyledGrid>
      </StyledWrapper>
    </>
  );
};
