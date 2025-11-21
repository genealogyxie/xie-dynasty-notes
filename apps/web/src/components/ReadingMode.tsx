import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Slider,
  Dropdown,
  Option,
} from '@fluentui/react-components';
import { BookOpen24Regular, Dismiss24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  controls: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '48px',
    display: 'flex',
    justifyContent: 'center',
  },
  reader: {
    maxWidth: '800px',
    width: '100%',
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '24px',
  },
  body: {
    lineHeight: '1.8',
  },
});

interface ReadingModeProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function ReadingMode({ open, onClose, title, content }: ReadingModeProps) {
  const styles = useStyles();
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('system-ui');
  const [lineSpacing, setLineSpacing] = useState(1.8);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen24Regular />
          <span style={{ fontWeight: tokens.fontWeightSemibold }}>Reading Mode</span>
        </div>

        <div className={styles.controls}>
          <span style={{ fontSize: tokens.fontSizeBase200 }}>Font:</span>
          <Dropdown
            value={fontFamily}
            onOptionSelect={(_, data) => setFontFamily(data.optionValue as string)}
            style={{ minWidth: '150px' }}
          >
            <Option value="system-ui">System</Option>
            <Option value="Georgia, serif">Serif</Option>
            <Option value="Arial, sans-serif">Sans Serif</Option>
            <Option value="'Courier New', monospace">Monospace</Option>
          </Dropdown>

          <span style={{ fontSize: tokens.fontSizeBase200 }}>Size:</span>
          <div style={{ width: '120px' }}>
            <Slider
              min={12}
              max={24}
              value={fontSize}
              onChange={(_, data) => setFontSize(data.value)}
            />
          </div>
          <span style={{ fontSize: tokens.fontSizeBase200, minWidth: '40px' }}>
            {fontSize}px
          </span>

          <span style={{ fontSize: tokens.fontSizeBase200 }}>Spacing:</span>
          <div style={{ width: '120px' }}>
            <Slider
              min={1.2}
              max={2.5}
              step={0.1}
              value={lineSpacing}
              onChange={(_, data) => setLineSpacing(data.value)}
            />
          </div>

          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            onClick={onClose}
          >
            Exit
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.reader}>
          <h1
            className={styles.title}
            style={{
              fontFamily,
              fontSize: `${fontSize + 8}px`,
            }}
          >
            {title}
          </h1>
          <div
            className={styles.body}
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              lineHeight: lineSpacing,
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
