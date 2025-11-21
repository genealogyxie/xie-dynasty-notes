import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
} from '@fluentui/react-components';
import { EyeOff24Regular, Eye24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '16px 24px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '48px',
    display: 'flex',
    justifyContent: 'center',
  },
  editor: {
    maxWidth: '900px',
    width: '100%',
  },
});

interface FocusModeProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function FocusMode({ open, onClose, children }: FocusModeProps) {
  const styles = useStyles();

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <Button
          appearance="subtle"
          icon={<Eye24Regular />}
          onClick={onClose}
        >
          Exit Focus Mode
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.editor}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function FocusModeToggle({ onToggle }: { onToggle: (enabled: boolean) => void }) {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const handleToggle = () => {
    const newState = !isFocusMode;
    setIsFocusMode(newState);
    onToggle(newState);
  };

  return (
    <Button
      appearance="subtle"
      icon={isFocusMode ? <Eye24Regular /> : <EyeOff24Regular />}
      onClick={handleToggle}
      title={isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
    >
      {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
    </Button>
  );
}
