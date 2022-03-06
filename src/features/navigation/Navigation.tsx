import { FC } from 'react';
import { NavigationItem } from './NavigationItem';
import { NavigationButton } from './NavigationButton';
import { StyledActionGroup, StyledContainer, StyledNavigation } from './Navigation.styles';

interface NavigationProps {
  color?: string;
  left: NavigationItem[];
  right: NavigationItem[];
}

export const Navigation: FC<NavigationProps> = (props) => {
  const renderActions = (items: NavigationItem[]) => {
    return items.map((it, i) => <NavigationButton icon={it.icon} onClick={it.onClick} text={it.text} key={i} tooltip={it.tooltip} />);
  };

  return (
    <StyledNavigation style={{ background: props.color ?? '#fff' }}>
      <StyledActionGroup side="left">{renderActions(props.left)}</StyledActionGroup>
      <StyledContainer style={{ justifyContent: 'center' }}>{props.children}</StyledContainer>
      <StyledActionGroup side="right">{renderActions(props.right)}</StyledActionGroup>
    </StyledNavigation>
  );
};
