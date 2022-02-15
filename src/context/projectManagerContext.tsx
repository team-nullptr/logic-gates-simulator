import { createContext, ReactNode } from 'react';
import { ProjectManager } from '../core/project-manager/ProjectManager';

export const ProjectManagerContext = createContext<ProjectManager>(new ProjectManager());

interface ProjectManagerProviderProps {
  children: ReactNode;
}

export const ProjectManagerProvider = ({ children }: ProjectManagerProviderProps) => {
  return <ProjectManagerContext.Provider value={new ProjectManager()}>{children}</ProjectManagerContext.Provider>;
};
