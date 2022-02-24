import { createPortal } from 'react-dom';
import { useState, MouseEvent, useRef, useEffect } from 'react';
import {
  StyledWrapper,
  StyledPopup,
  StyledPickerWrapper,
  StyledColorPreview,
  StyledInput,
  StyledRow,
  StyledButton
} from './CreateGateForm.styles';
import { BlockPicker, ColorChangeHandler } from 'react-color';

export type GateCreateHandler = ({ name, color }: { name: string; color: string }) => void;

interface CreateGateFormProps {
  onSubmit: GateCreateHandler;
  onCancel: () => void;
}

export const CreateGateForm = ({ onSubmit, onCancel }: CreateGateFormProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6601eb');

  const colorPreviewRef = useRef<HTMLDivElement>(null);
  const [colorPickerPos, setcolorPickerPos] = useState({ x: 0, y: 0 });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  useEffect(() => {
    if (!colorPreviewRef.current) return;
    const { width, height, top, left } = colorPreviewRef.current.getBoundingClientRect();
    setcolorPickerPos({ x: left + width / 2 - 85, y: top + height + 10 });
  }, [colorPreviewRef]);

  const handleColorPickerClose = (e: MouseEvent) => {
    if (e.target === colorPreviewRef.current) return;
    setColorPickerOpen(false);
  };

  const handleColorChange: ColorChangeHandler = ({ hex }) => setColor(hex);

  return createPortal(
    <StyledWrapper onClick={handleColorPickerClose}>
      <StyledPopup>
        <StyledRow>
          <StyledInput placeholder="Enter a name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <StyledColorPreview color={color} onClick={() => setColorPickerOpen(true)} ref={colorPreviewRef} />
          {colorPickerOpen && (
            <StyledPickerWrapper x={colorPickerPos.x} y={colorPickerPos.y}>
              <BlockPicker color={color} onChangeComplete={handleColorChange} />
            </StyledPickerWrapper>
          )}
        </StyledRow>
        <StyledRow>
          <StyledButton onClick={onCancel}>cancel</StyledButton>
          <StyledButton onClick={() => onSubmit({ name, color })} primary>
            submit
          </StyledButton>
        </StyledRow>
      </StyledPopup>
    </StyledWrapper>,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.querySelector('#popup')!
  );
};
