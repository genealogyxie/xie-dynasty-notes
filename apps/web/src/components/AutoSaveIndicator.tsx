import { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
  Spinner,
} from '@fluentui/react-components';
import { Checkmark24Regular, Warning24Regular, CloudOff24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    fontSize: tokens.fontSizeBase200,
    borderRadius: tokens.borderRadiusMedium,
  },
  saved: {
    color: tokens.colorPaletteGreenForeground2,
  },
  saving: {
    color: tokens.colorNeutralForeground3,
  },
  error: {
    color: tokens.colorPaletteRedForeground2,
  },
  offline: {
    color: tokens.colorNeutralForeground3,
  },
  text: {
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface AutoSaveIndicatorProps {
  status: 'saved' | 'saving' | 'error' | 'offline';
  lastSavedTime?: Date;
}

export function AutoSaveIndicator({ status, lastSavedTime }: AutoSaveIndicatorProps) {
  const styles = useStyles();
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastSavedTime) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = now.getTime() - lastSavedTime.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (seconds < 10) {
        setTimeAgo('just now');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else if (minutes < 60) {
        setTimeAgo(`${minutes}m ago`);
      } else {
        setTimeAgo(`${hours}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [lastSavedTime]);

  const getStatusContent = () => {
    switch (status) {
      case 'saved':
        return (
          <div className={`${styles.container} ${styles.saved}`}>
            <Checkmark24Regular />
            <span className={styles.text}>Saved {timeAgo}</span>
          </div>
        );
      case 'saving':
        return (
          <div className={`${styles.container} ${styles.saving}`}>
            <Spinner size="tiny" />
            <span className={styles.text}>Saving...</span>
          </div>
        );
      case 'error':
        return (
          <div className={`${styles.container} ${styles.error}`}>
            <Warning24Regular />
            <span className={styles.text}>Save failed</span>
          </div>
        );
      case 'offline':
        return (
          <div className={`${styles.container} ${styles.offline}`}>
            <CloudOff24Regular />
            <span className={styles.text}>Offline - changes saved locally</span>
          </div>
        );
    }
  };

  return getStatusContent();
}
