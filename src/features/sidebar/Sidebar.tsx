import { ListHeader } from './ListHeader';
import styles from './Sidebar.module.scss';
import styled from 'styled-components';
import { Prototype } from './types/Prototype';
import { GatePrototype } from './GatePrototype';

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 64px;
  grid-gap: 16px;
  padding: 0 24px;
  margin-bottom: 8px;
`;

export const Sidebar = (props: {
  available: Prototype[];
  onEdit: (type: string) => void;
  onDelete: (type: string) => void;
}) => {
  const renderPrototypes = (blocks: Prototype[]) => {
    return blocks.map((it, i) => (
      <GatePrototype
        prototype={it}
        onEdit={() => props.onEdit(it.type)}
        onDelete={() => props.onDelete(it.type)}
        key={i}
      />
    ));
  };

  return (
    <div className={styles.sidebar}>
      <ListHeader text="All gates" />
      <StyledGrid>{renderPrototypes(props.available)}</StyledGrid>
    </div>
  );
};
