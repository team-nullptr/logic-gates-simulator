import { createPortal } from 'react-dom';
import { FormEvent, MouseEvent, useRef, useState } from 'react';
import {
  StyledButton,
  StyledColorPreview,
  StyledInput,
  StyledPickerWrapper,
  StyledPopup,
  StyledRow,
  StyledWrapper
} from './CreateGateForm.styles';
import { BlockPicker, ColorChangeHandler } from 'react-color';

export type GateCreateHandler = ({ name, color }: { name: string; color: string }) => void;

interface CreateGateFormProps {
  onSubmit: GateCreateHandler;
  onCancel: () => void;
}

const randomColor = () => {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return '#' + hex.padStart(6, '0');
};

export const CreateGateForm = ({ onSubmit, onCancel }: CreateGateFormProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(randomColor());

  const colorPreviewRef = useRef<HTMLDivElement>(null);
  const [colorPickerPos, setColorPickerPos] = useState({ x: 0, y: 0 });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const handleColorPickerOpen = () => {
    setColorPickerOpen(true);
    if (!colorPreviewRef.current) return;
    const { width, height, top, left } = colorPreviewRef.current.getBoundingClientRect();
    setColorPickerPos({ x: left + width / 2 - 85, y: top + height + 10 });
  };

  const handleColorPickerClose = (e: MouseEvent) => {
    if (e.target === colorPreviewRef.current) return;

    if (colorPickerOpen) {
      setColorPickerOpen(false);
    } else {
      onCancel();
    }
  };

  const handlePopupSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, color });
  };

  return createPortal(
    <StyledWrapper onMouseDown={handleColorPickerClose}>
      <StyledPopup
        onMouseDown={(e) => {
          if (!colorPickerOpen) e.stopPropagation();
        }}
        onSubmit={handlePopupSubmit}
      >
        <StyledRow style={{ alignItems: 'center' }}>
          <StyledInput
            placeholder="Enter a name"
            type="text"
            maxLength={8}
            minLength={1}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <StyledColorPreview color={color} onClick={handleColorPickerOpen} ref={colorPreviewRef} />
          {colorPickerOpen && (
            <StyledPickerWrapper x={colorPickerPos.x} y={colorPickerPos.y} onMouseDown={(e) => e.stopPropagation()}>
              <BlockPicker color={color} onChangeComplete={({ hex }) => setColor(hex)} />
            </StyledPickerWrapper>
          )}
        </StyledRow>
        <StyledRow>
          <StyledButton type="button" onClick={onCancel}>
            Cancel
          </StyledButton>
          <StyledButton type="submit" primary>
            Submit
          </StyledButton>
        </StyledRow>
      </StyledPopup>
    </StyledWrapper>,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.querySelector('#popup')!
  );
};
