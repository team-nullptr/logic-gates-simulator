import { SerializedSimulator, Simulator } from '../simulator/Simulator';

export interface Project {
  name: string;
  modifiedAt: Date;
  simulator: Simulator;
}

export interface SerializedProject {
  name: string;
  modifiedAt: string;
  simulator: SerializedSimulator;
}

type SavedProjects = { [name: string]: SerializedProject };

export class ProjectManager {
  constructor() {
    // If there aren't any projects saved already create a new projects list
    if (!localStorage.getItem('projects')) localStorage.setItem('projects', JSON.stringify({}));
  }

  /**
   * All saved projects.
   */
  get projects(): Project[] {
    return Object.values(this.fetchProjects()).map(({ name, modifiedAt, simulator: serializedSim }) => {
      const simulator = Simulator.deserialize(serializedSim);
      return { name, modifiedAt: new Date(modifiedAt), simulator: simulator };
    });
  }

  /**
   * Saves project in localStorage.
   */
  saveProject({ name, modifiedAt, simulator }: Project) {
    const serialized: SerializedProject = {
      name,
      modifiedAt: modifiedAt.toString(),
      simulator: simulator.serialize()
    };

    const projects = this.fetchProjects();
    localStorage.setItem('projects', JSON.stringify({ ...projects, [serialized.name]: serialized }));
  }

  /**
   * Creates a new project and saves it in the localStorage.
   * @param name Name of the project.
   */
  createProject(name: string) {
    const projects = this.fetchProjects();

    localStorage.setItem(
      'projects',
      JSON.stringify({
        ...projects,
        [name]: { name, modifiedAt: new Date().toString(), simulator: new Simulator().serialize() }
      })
    );
  }

  /**
   * Loads project from localStorage and makes it the currently project.
   * @param name Name of the project.
   */
  loadProject(name: string): Project {
    const serializedProject = this.fetchProjects()[name];
    if (!serializedProject) throw new Error('Unable to find a project');

    const project = {
      name: serializedProject.name,
      modifiedAt: new Date(serializedProject.modifiedAt),
      simulator: Simulator.deserialize(serializedProject.simulator)
    };

    return project;
  }

  /**
   * Fetches all projects saved in localStorage.
   */
  private fetchProjects(): SavedProjects {
    const projects = localStorage.getItem('projects');
    if (!projects) throw new Error('projects item missing in localStorage');

    // FIXME: handle the error somehow
    return JSON.parse(projects) as SavedProjects;
  }
}
