import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Input,
  Field,
  Tab,
  TabList,
} from '@fluentui/react-components';
import { Checkmark24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    minWidth: '320px',
  },
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: '8px',
  },
  colorSwatch: {
    width: '36px',
    height: '36px',
    borderRadius: tokens.borderRadiusSmall,
    cursor: 'pointer',
    border: `2px solid transparent`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'scale(1.1)',
      border: `2px solid ${tokens.colorBrandBackground}`,
    },
  },
  selectedSwatch: {
    border: `2px solid ${tokens.colorBrandBackground}`,
    transform: 'scale(1.1)',
  },
  customColorSection: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  colorPreview: {
    width: '48px',
    height: '48px',
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface ColorPalettePickerProps {
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
}

const standardColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#808080', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0',
  '#FFA500', '#FFC0CB', '#A52A2A', '#FFD700', '#4B0082', '#FF1493', '#00CED1', '#32CD32',
  '#FF6347', '#DDA0DD', '#8B4513', '#F0E68C', '#9370DB', '#FF69B4', '#40E0D0', '#98FB98',
];

const themeColors = [
  '#0078D4', '#106EBE', '#005A9E', '#004578', '#003152',
  '#50E6FF', '#00B7C3', '#038387', '#005B70', '#004B50',
  '#00CC6A', '#10893E', '#107C10', '#0B6A0B', '#063D06',
  '#FFB900', '#FF8C00', '#F7630C', '#CA5010', '#8E562E',
  '#E74856', '#E81123', '#C50F1F', '#A80000', '#750B1C',
  '#B146C2', '#881798', '#5C2D91', '#401B6C', '#32145A',
];

export function ColorPalettePicker({ selectedColor, onColorSelect }: ColorPalettePickerProps) {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState<'standard' | 'theme' | 'custom'>('standard');
  const [customColor, setCustomColor] = useState('#000000');

  const handleColorClick = (color: string) => {
    onColorSelect?.(color);
  };

  const handleCustomColorChange = (value: string) => {
    setCustomColor(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onColorSelect?.(value);
    }
  };

  const renderColorGrid = (colors: string[]) => (
    <div className={styles.colorGrid}>
      {colors.map((color) => (
        <div
          key={color}
          className={`${styles.colorSwatch} ${selectedColor === color ? styles.selectedSwatch : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => handleColorClick(color)}
          title={color}
        >
          {selectedColor === color && (
            <Checkmark24Regular style={{ color: color === '#FFFFFF' ? '#000000' : '#FFFFFF' }} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <TabList
        selectedValue={activeTab}
        onTabSelect={(_, data) => setActiveTab(data.value as 'standard' | 'theme' | 'custom')}
      >
        <Tab value="standard">Standard</Tab>
        <Tab value="theme">Theme</Tab>
        <Tab value="custom">Custom</Tab>
      </TabList>

      {activeTab === 'standard' && renderColorGrid(standardColors)}
      {activeTab === 'theme' && renderColorGrid(themeColors)}
      {activeTab === 'custom' && (
        <div className={styles.customColorSection}>
          <Field label="Hex Color">
            <Input
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              placeholder="#000000"
            />
          </Field>
          <div
            className={styles.colorPreview}
            style={{ backgroundColor: customColor }}
          />
        </div>
      )}
    </div>
  );
}
