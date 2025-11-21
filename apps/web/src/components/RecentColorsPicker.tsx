import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Color24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  colorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    gap: '8px',
    padding: '12px',
    minWidth: '280px',
  },
  colorSwatch: {
    width: '28px',
    height: '28px',
    borderRadius: tokens.borderRadiusCircular,
    cursor: 'pointer',
    border: `2px solid transparent`,
    ':hover': {
      transform: 'scale(1.1)',
      border: `2px solid ${tokens.colorBrandBackground}`,
    },
  },
  selectedColor: {
    border: `2px solid ${tokens.colorBrandBackground}`,
    transform: 'scale(1.1)',
  },
  section: {
    marginBottom: '12px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '8px',
    color: tokens.colorNeutralForeground2,
  },
});

interface RecentColorsPickerProps {
  onSelectColor?: (color: string) => void;
  selectedColor?: string;
}

const standardColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#808080', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0',
];

export function RecentColorsPicker({ onSelectColor, selectedColor }: RecentColorsPickerProps) {
  const styles = useStyles();
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentColors');
    if (stored) {
      setRecentColors(JSON.parse(stored));
    }
  }, []);

  const handleColorSelect = (color: string) => {
    if (onSelectColor) {
      onSelectColor(color);
    }

    const updated = [color, ...recentColors.filter(c => c !== color)].slice(0, 8);
    setRecentColors(updated);
    localStorage.setItem('recentColors', JSON.stringify(updated));
  };

  return (
    <Popover>
      <PopoverTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          icon={<Color24Regular />}
          style={{
            backgroundColor: selectedColor || 'transparent',
            border: `2px solid ${tokens.colorNeutralStroke2}`,
          }}
          title="Text Color"
        />
      </PopoverTrigger>
      <PopoverSurface>
        <div>
          {recentColors.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Recent Colors</div>
              <div className={styles.colorGrid}>
                {recentColors.map((color) => (
                  <div
                    key={color}
                    className={`${styles.colorSwatch} ${selectedColor === color ? styles.selectedColor : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>
          )}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Standard Colors</div>
            <div className={styles.colorGrid}>
              {standardColors.map((color) => (
                <div
                  key={color}
                  className={`${styles.colorSwatch} ${selectedColor === color ? styles.selectedColor : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverSurface>
    </Popover>
  );
}
