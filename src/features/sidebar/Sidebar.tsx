import { ListHeader } from './ListHeader';
import { Prototype } from './types/Prototype';
import { GatePrototype } from './GatePrototype';
import { StyledSidebar, StyledGrid } from './Sidebar.styles';

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
    <StyledSidebar>
      <ListHeader text="All gates" />
      <StyledGrid>{renderPrototypes(props.available)}</StyledGrid>
    </StyledSidebar>
  );
};
