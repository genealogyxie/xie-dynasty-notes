import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Slider,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import {
  Pen24Regular,
  Eraser24Regular,
  Highlight24Regular,
  Circle24Regular,
  Square24Regular,
  ArrowRight24Regular,
  ArrowUndo24Regular,
  ArrowRedo24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  toolGroup: {
    display: 'flex',
    gap: '4px',
    paddingRight: '12px',
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  toolButton: {
    minWidth: '40px',
  },
  activeTool: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  colorPicker: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px',
    padding: '12px',
  },
  colorSwatch: {
    width: '32px',
    height: '32px',
    borderRadius: tokens.borderRadiusCircular,
    cursor: 'pointer',
    border: `2px solid transparent`,
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  selectedColor: {
    border: `2px solid ${tokens.colorBrandBackground}`,
    transform: 'scale(1.1)',
  },
  sliderContainer: {
    padding: '12px',
    minWidth: '200px',
  },
  sliderLabel: {
    fontSize: tokens.fontSizeBase200,
    marginBottom: '8px',
  },
});

interface DrawingToolsPanelProps {
  onToolChange?: (tool: 'pen' | 'highlighter' | 'eraser' | 'circle' | 'square' | 'arrow') => void;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: number) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000',
  '#FFC0CB', '#A52A2A', '#808080', '#C0C0C0', '#FFFFFF',
];

export function DrawingToolsPanel({
  onToolChange,
  onColorChange,
  onSizeChange,
  onUndo,
  onRedo,
}: DrawingToolsPanelProps) {
  const styles = useStyles();
  const [activeTool, setActiveTool] = useState<'pen' | 'highlighter' | 'eraser' | 'circle' | 'square' | 'arrow'>('pen');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);

  const handleToolChange = (tool: typeof activeTool) => {
    setActiveTool(tool);
    if (onToolChange) {
      onToolChange(tool);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (onColorChange) {
      onColorChange(color);
    }
  };

  const handleSizeChange = (size: number) => {
    setBrushSize(size);
    if (onSizeChange) {
      onSizeChange(size);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolGroup}>
        <Button
          appearance="subtle"
          icon={<Pen24Regular />}
          className={`${styles.toolButton} ${activeTool === 'pen' ? styles.activeTool : ''}`}
          onClick={() => handleToolChange('pen')}
          title="Pen"
        />
        <Button
          appearance="subtle"
          icon={<Highlight24Regular />}
          className={`${styles.toolButton} ${activeTool === 'highlighter' ? styles.activeTool : ''}`}
          onClick={() => handleToolChange('highlighter')}
          title="Highlighter"
        />
        <Button
          appearance="subtle"
          icon={<Eraser24Regular />}
          className={`${styles.toolButton} ${activeTool === 'eraser' ? styles.activeTool : ''}`}
          onClick={() => handleToolChange('eraser')}
          title="Eraser"
        />
      </div>

      <div className={styles.toolGroup}>
        <Button
          appearance="subtle"
          icon={<Circle24Regular />}
          className={`${styles.toolButton} ${activeTool === 'circle' ? styles.activeTool : ''}`}
          onClick={() => handleToolChange('circle')}
          title="Circle"
        />
        <Button
          appearance="subtle"
          icon={<Square24Regular />}
          className={`${styles.toolButton} ${activeTool === 'square' ? styles.activeTool : ''}`}
          onClick={() => handleToolChange('square')}
          title="Square"
        />
        <Button
          appearance="subtle"
          icon={<ArrowRight24Regular />}
          className={`${styles.toolButton} ${activeTool === 'arrow' ? styles.activeTool : ''}`}
          onClick={() => handleToolChange('arrow')}
          title="Arrow"
        />
      </div>

      <Popover>
        <PopoverTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            style={{
              backgroundColor: selectedColor,
              border: `2px solid ${tokens.colorNeutralStroke2}`,
              minWidth: '40px',
              height: '32px',
            }}
            title="Color"
          />
        </PopoverTrigger>
        <PopoverSurface>
          <div className={styles.colorPicker}>
            {colors.map((color) => (
              <div
                key={color}
                className={`${styles.colorSwatch} ${selectedColor === color ? styles.selectedColor : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </PopoverSurface>
      </Popover>

      <Popover>
        <PopoverTrigger disableButtonEnhancement>
          <Button appearance="subtle" title="Brush Size">
            Size: {brushSize}px
          </Button>
        </PopoverTrigger>
        <PopoverSurface>
          <div className={styles.sliderContainer}>
            <div className={styles.sliderLabel}>Brush Size: {brushSize}px</div>
            <Slider
              min={1}
              max={20}
              value={brushSize}
              onChange={(_, data) => handleSizeChange(data.value)}
            />
          </div>
        </PopoverSurface>
      </Popover>

      <div className={styles.toolGroup} style={{ borderRight: 'none', paddingRight: 0 }}>
        <Button
          appearance="subtle"
          icon={<ArrowUndo24Regular />}
          onClick={onUndo}
          title="Undo"
        />
        <Button
          appearance="subtle"
          icon={<ArrowRedo24Regular />}
          onClick={onRedo}
          title="Redo"
        />
      </div>
    </div>
  );
}
