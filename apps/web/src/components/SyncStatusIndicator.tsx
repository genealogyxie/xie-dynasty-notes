import { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
  Spinner,
} from '@fluentui/react-components';
import { Checkmark24Regular, CloudSync24Regular, CloudOff24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px',
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase200,
  },
  synced: {
    color: tokens.colorPaletteGreenForeground1,
  },
  syncing: {
    color: tokens.colorBrandForeground1,
  },
  offline: {
    color: tokens.colorNeutralForeground3,
  },
  error: {
    color: tokens.colorPaletteRedForeground1,
  },
});

type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface SyncStatusIndicatorProps {
  status?: SyncStatus;
  lastSyncTime?: Date;
}

export function SyncStatusIndicator({ status = 'synced', lastSyncTime }: SyncStatusIndicatorProps) {
  const styles = useStyles();
  const [displayStatus, setDisplayStatus] = useState<SyncStatus>(status);

  useEffect(() => {
    setDisplayStatus(status);
  }, [status]);

  const getStatusIcon = () => {
    switch (displayStatus) {
      case 'synced':
        return <Checkmark24Regular className={styles.synced} />;
      case 'syncing':
        return <Spinner size="tiny" />;
      case 'offline':
        return <CloudOff24Regular className={styles.offline} />;
      case 'error':
        return <CloudSync24Regular className={styles.error} />;
      default:
        return <Checkmark24Regular className={styles.synced} />;
    }
  };

  const getStatusText = () => {
    switch (displayStatus) {
      case 'synced':
        if (lastSyncTime) {
          const now = new Date();
          const diffMs = now.getTime() - lastSyncTime.getTime();
          const diffSecs = Math.floor(diffMs / 1000);
          if (diffSecs < 5) return 'Saved';
          if (diffSecs < 60) return `Saved ${diffSecs}s ago`;
          const diffMins = Math.floor(diffSecs / 60);
          if (diffMins < 60) return `Saved ${diffMins}m ago`;
          return 'Saved';
        }
        return 'Saved';
      case 'syncing':
        return 'Saving...';
      case 'offline':
        return 'Offline';
      case 'error':
        return 'Sync error';
      default:
        return 'Saved';
    }
  };

  return (
    <div className={styles.container}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
}
