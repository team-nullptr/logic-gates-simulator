import { StyledWrapper, StyledGrid, StyledHeader, StyledTitle } from './Dashboard.styles';
import { DashboardCard } from './DashboardCard';
import { useState } from 'react';
import { Project } from '../../core/project-manager/ProjectManager';
import { projectManager } from '../../core/project-manager/ProjectManager';
import { DashboardNavigation } from './DashboardNavigation';

export const Dashboard = () => {
  const [projects] = useState<Project[]>(projectManager.projects);

  return (
    <>
      <DashboardNavigation />
      <StyledWrapper>
        <StyledHeader>
          <StyledTitle>Projects</StyledTitle>
        </StyledHeader>
        <StyledGrid>
          {projects.map((project) => (
            <DashboardCard project={project} key={project.id} />
          ))}
        </StyledGrid>
      </StyledWrapper>
    </>
  );
};
