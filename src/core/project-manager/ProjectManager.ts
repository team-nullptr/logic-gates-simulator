import { SerializedSimulator, Simulator } from '../simulator/Simulator';
import { v4 as uuid } from 'uuid';

export interface Project {
  id: string;
  name: string;
  modifiedAt: Date;
  simulator: Simulator;
}

export interface SerializedProject {
  id: string;
  name: string;
  modifiedAt: string;
  simulator: SerializedSimulator;
}

type SavedProjects = { [name: string]: SerializedProject };

class ProjectManager {
  constructor() {
    // If there aren't any projects saved already create a new projects list
    if (!localStorage.getItem('projects')) localStorage.setItem('projects', JSON.stringify({}));
  }

  /**
   * All saved projects.
   */
  get projects(): Project[] {
    return Object.values(ProjectManager.fetchProjects()).map(({ modifiedAt, simulator, ...meta }) => {
      return { ...meta, modifiedAt: new Date(modifiedAt), simulator: Simulator.deserialize(simulator) };
    });
  }

  /**
   * Fetches all projects saved in localStorage.
   */
  static fetchProjects(): SavedProjects {
    const projects = localStorage.getItem('projects');
    if (!projects) throw new Error('projects item missing in localStorage');

    // FIXME: handle the error somehow
    return JSON.parse(projects) as SavedProjects;
  }

  /**
   * Saves project in localStorage.
   */
  saveProject({ modifiedAt, simulator, ...meta }: Project) {
    const serialized: SerializedProject = {
      ...meta,
      modifiedAt: modifiedAt.toString(),
      simulator: simulator.serialize()
    };

    const projects = ProjectManager.fetchProjects();
    localStorage.setItem('projects', JSON.stringify({ ...projects, [serialized.id]: serialized }));
  }

  /**
   * Creates a new project and saves it in the localStorage.
   * @param name Name of the project.
   */
  createProject(name: string) {
    // FIXME: Disallow adding projects with the same name
    const id = uuid();
    this.saveProject({ id, name, modifiedAt: new Date(), simulator: new Simulator() });
    return id;
  }

  /**
   * Loads project from localStorage and makes it the currently project.
   * @param id Id of the project.
   */
  loadProject(id: string): Project {
    const serializedProject = ProjectManager.fetchProjects()[id];
    if (!serializedProject) throw new Error('Unable to find a project');

    const { modifiedAt, simulator, ...meta } = serializedProject;

    const _simulator = Simulator.deserialize(simulator);
    _simulator.circuit.simulate();

    return {
      ...meta,
      modifiedAt: new Date(modifiedAt),
      simulator: _simulator
    };
  }

  deleteProject(id: string): void {
    const projects = ProjectManager.fetchProjects();
    delete projects[id];
    console.log(projects);
    localStorage.setItem('projects', JSON.stringify(projects));
  }
}

export const projectManager = new ProjectManager();
