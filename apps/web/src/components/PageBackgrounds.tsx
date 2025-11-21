import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '500px',
    width: '90vw',
  },
  backgroundsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '16px',
    marginTop: '16px',
    marginBottom: '24px',
  },
  backgroundCard: {
    padding: '16px',
    border: `2px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    textAlign: 'center',
    cursor: 'pointer',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  backgroundPreview: {
    width: '100%',
    height: '100%',
    borderRadius: tokens.borderRadiusSmall,
  },
  backgroundName: {
    marginTop: '8px',
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
});

interface Background {
  id: string;
  name: string;
  style: React.CSSProperties;
}

interface PageBackgroundsProps {
  open: boolean;
  onClose: () => void;
  onSelectBackground?: (background: Background) => void;
}

const backgrounds: Background[] = [
  {
    id: 'blank',
    name: 'Blank',
    style: { backgroundColor: '#ffffff' },
  },
  {
    id: 'ruled',
    name: 'Ruled',
    style: {
      backgroundColor: '#ffffff',
      backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e0e0e0 31px, #e0e0e0 32px)',
    },
  },
  {
    id: 'grid',
    name: 'Grid',
    style: {
      backgroundColor: '#ffffff',
      backgroundImage: 'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
  },
  {
    id: 'dotted',
    name: 'Dotted',
    style: {
      backgroundColor: '#ffffff',
      backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    },
  },
  {
    id: 'graph',
    name: 'Graph',
    style: {
      backgroundColor: '#ffffff',
      backgroundImage: 'linear-gradient(#d0d0d0 1px, transparent 1px), linear-gradient(90deg, #d0d0d0 1px, transparent 1px), linear-gradient(#e8e8e8 1px, transparent 1px), linear-gradient(90deg, #e8e8e8 1px, transparent 1px)',
      backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
    },
  },
  {
    id: 'cream',
    name: 'Cream',
    style: { backgroundColor: '#fef9e7' },
  },
];

export function PageBackgrounds({ open, onClose, onSelectBackground }: PageBackgroundsProps) {
  const styles = useStyles();

  const handleSelectBackground = (background: Background) => {
    if (onSelectBackground) {
      onSelectBackground(background);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>Choose Page Background</DialogTitle>

          <div className={styles.backgroundsGrid}>
            {backgrounds.map((background) => (
              <div key={background.id} onClick={() => handleSelectBackground(background)}>
                <div className={styles.backgroundCard}>
                  <div className={styles.backgroundPreview} style={background.style} />
                </div>
                <div className={styles.backgroundName}>{background.name}</div>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
