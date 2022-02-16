import { FormEvent, useContext, useState } from 'react';
import { Simulator } from '../../core/simulator/Simulator';
import { ProjectManagerContext, ProjectManagerProvider } from '../../context/projectManagerContext';
import { useNavigate } from 'react-router-dom';

export const ProjectCreate = () => {
  const projectManager = useContext(ProjectManagerContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    try {
      projectManager.createProject(name);
      navigate('/');
    } catch (err) {
      console.log('failed to create');
    }
  };

  return (
    <ProjectManagerProvider>
      <form onSubmit={onSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button>create</button>
      </form>
    </ProjectManagerProvider>
  );
};
