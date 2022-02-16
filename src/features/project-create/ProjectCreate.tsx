import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectManager } from '../../core/project-manager/ProjectManager';
import { messageBus } from '../message-bus/MessageBus';

export const ProjectCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    try {
      projectManager.createProject(name);

      messageBus.push({
        type: 'success',
        body: 'Project created successfully'
      });

      navigate('/');
    } catch (err) {
      console.log('failed to create');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button>create</button>
    </form>
  );
};
