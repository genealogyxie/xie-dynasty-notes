import { useState, useEffect } from 'react';
import {
  makeStyles,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import { CloudOff24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  banner: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});

export function OfflineBanner() {
  const styles = useStyles();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <MessageBar intent="warning" icon={<CloudOff24Regular />}>
        <MessageBarBody>
          You are currently offline. Changes will be saved locally and synced when you reconnect.
        </MessageBarBody>
      </MessageBar>
    </div>
  );
}
