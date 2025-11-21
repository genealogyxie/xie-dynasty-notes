import { useState, useEffect } from 'react';
import { Button, makeStyles } from '@fluentui/react-components';
import { FullScreenMaximize24Regular, FullScreenMinimize24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  button: {
    minWidth: '40px',
  },
});

interface FullScreenModeProps {
  onToggle?: (isFullScreen: boolean) => void;
}

export function FullScreenMode({ onToggle }: FullScreenModeProps) {
  const styles = useStyles();
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const fullScreenElement = document.fullscreenElement;
      const newIsFullScreen = !!fullScreenElement;
      setIsFullScreen(newIsFullScreen);
      if (onToggle) {
        onToggle(newIsFullScreen);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [onToggle]);

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  return (
    <Button
      appearance="subtle"
      icon={isFullScreen ? <FullScreenMinimize24Regular /> : <FullScreenMaximize24Regular />}
      onClick={toggleFullScreen}
      className={styles.button}
      title={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
    />
  );
}
