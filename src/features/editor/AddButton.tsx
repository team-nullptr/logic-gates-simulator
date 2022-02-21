import { Plus } from 'react-feather';
import { Button } from './Button';

export const AddButton = () => {
  return (
    <Button color="#089E2F" active={false} onClick={console.log}>
      <Plus width={20} />
    </Button>
  );
};
