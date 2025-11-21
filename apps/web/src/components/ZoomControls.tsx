import {
  makeStyles,
  tokens,
  Button,
  Slider,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import { ZoomIn24Regular, ZoomOut24Regular, ZoomFit24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  zoomLabel: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    minWidth: '50px',
    textAlign: 'center',
  },
  sliderContainer: {
    padding: '16px',
    minWidth: '200px',
  },
  sliderLabel: {
    fontSize: tokens.fontSizeBase200,
    marginBottom: '12px',
    textAlign: 'center',
  },
  presetButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
});

interface ZoomControlsProps {
  zoom: number;
  onZoomChange?: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

export function ZoomControls({
  zoom,
  onZoomChange,
  minZoom = 50,
  maxZoom = 200,
}: ZoomControlsProps) {
  const styles = useStyles();

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 10, maxZoom);
    if (onZoomChange) {
      onZoomChange(newZoom);
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 10, minZoom);
    if (onZoomChange) {
      onZoomChange(newZoom);
    }
  };

  const handleZoomReset = () => {
    if (onZoomChange) {
      onZoomChange(100);
    }
  };

  const handleZoomPreset = (preset: number) => {
    if (onZoomChange) {
      onZoomChange(preset);
    }
  };

  return (
    <div className={styles.container}>
      <Button
        appearance="subtle"
        icon={<ZoomOut24Regular />}
        onClick={handleZoomOut}
        disabled={zoom <= minZoom}
        title="Zoom Out"
      />

      <Popover>
        <PopoverTrigger disableButtonEnhancement>
          <Button appearance="subtle" title="Zoom">
            <span className={styles.zoomLabel}>{zoom}%</span>
          </Button>
        </PopoverTrigger>
        <PopoverSurface>
          <div className={styles.sliderContainer}>
            <div className={styles.sliderLabel}>Zoom: {zoom}%</div>
            <Slider
              min={minZoom}
              max={maxZoom}
              value={zoom}
              onChange={(_, data) => onZoomChange?.(data.value)}
            />
            <div className={styles.presetButtons}>
              <Button
                appearance="subtle"
                size="small"
                onClick={() => handleZoomPreset(50)}
              >
                50%
              </Button>
              <Button
                appearance="subtle"
                size="small"
                onClick={() => handleZoomPreset(75)}
              >
                75%
              </Button>
              <Button
                appearance="subtle"
                size="small"
                onClick={() => handleZoomPreset(100)}
              >
                100%
              </Button>
              <Button
                appearance="subtle"
                size="small"
                onClick={() => handleZoomPreset(150)}
              >
                150%
              </Button>
              <Button
                appearance="subtle"
                size="small"
                onClick={() => handleZoomPreset(200)}
              >
                200%
              </Button>
            </div>
          </div>
        </PopoverSurface>
      </Popover>

      <Button
        appearance="subtle"
        icon={<ZoomIn24Regular />}
        onClick={handleZoomIn}
        disabled={zoom >= maxZoom}
        title="Zoom In"
      />

      <Button
        appearance="subtle"
        icon={<ZoomFit24Regular />}
        onClick={handleZoomReset}
        title="Reset Zoom"
      />
    </div>
  );
}
