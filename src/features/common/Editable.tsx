import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { StyledInput, StyledSpan } from './Editable.styles';

export const Editable = (props: {
  value: string;
  onEdit: (text: string) => void;
  prefix?: string;
  prefixColor?: string;
  maxLength?: number;
}) => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState(props.value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (active) ref.current?.select();
  }, [active]);

  const edit = () => {
    if (text === '') setText(props.value);
    else props.onEdit(text);

    setActive(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      edit();
    } else if (event.key === 'Escape') {
      setActive(false);
      setText(props.value);
    }
  };

  if (!active) {
    return (
      <StyledSpan onClick={() => setActive(true)}>
        <span style={{ opacity: 0.4, color: props.prefixColor ?? '#000' }}>{props.prefix}</span>
        {text}
      </StyledSpan>
    );
  }

  return (
    <StyledInput
      type="text"
      value={text}
      ref={ref}
      onKeyDown={handleKeyDown}
      onChange={(event) => setText(event.target.value)}
      onBlur={edit}
      maxLength={props.maxLength}
    />
  );
};
