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
    maxWidth: '400px',
    width: '90vw',
  },
  colorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '12px',
    marginTop: '16px',
    marginBottom: '24px',
  },
  colorButton: {
    width: '50px',
    height: '50px',
    borderRadius: tokens.borderRadiusCircular,
    cursor: 'pointer',
    border: `3px solid transparent`,
    transition: 'all 0.2s',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  selectedColor: {
    border: `3px solid ${tokens.colorBrandBackground}`,
    transform: 'scale(1.1)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
});

interface NotebookColorPickerProps {
  open: boolean;
  onClose: () => void;
  currentColor?: string;
  onSelectColor?: (color: string) => void;
}

const notebookColors = [
  { name: 'Blue', value: '#0078D4' },
  { name: 'Purple', value: '#8764B8' },
  { name: 'Pink', value: '#E3008C' },
  { name: 'Red', value: '#D13438' },
  { name: 'Orange', value: '#FF8C00' },
  { name: 'Yellow', value: '#FFB900' },
  { name: 'Green', value: '#107C10' },
  { name: 'Teal', value: '#008272' },
  { name: 'Cyan', value: '#00B7C3' },
  { name: 'Gray', value: '#69797E' },
  { name: 'Dark Blue', value: '#004E8C' },
  { name: 'Dark Purple', value: '#5C2E91' },
  { name: 'Dark Pink', value: '#B4009E' },
  { name: 'Dark Red', value: '#A4262C' },
  { name: 'Dark Orange', value: '#CA5010' },
  { name: 'Dark Yellow', value: '#C19C00' },
  { name: 'Dark Green', value: '#0B6A0B' },
  { name: 'Dark Teal', value: '#00635C' },
];

export function NotebookColorPicker({ open, onClose, currentColor, onSelectColor }: NotebookColorPickerProps) {
  const styles = useStyles();

  const handleSelectColor = (color: string) => {
    if (onSelectColor) {
      onSelectColor(color);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>Choose Notebook Color</DialogTitle>

          <div className={styles.colorsGrid}>
            {notebookColors.map((color) => (
              <div
                key={color.value}
                className={`${styles.colorButton} ${currentColor === color.value ? styles.selectedColor : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleSelectColor(color.value)}
                title={color.name}
              />
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
