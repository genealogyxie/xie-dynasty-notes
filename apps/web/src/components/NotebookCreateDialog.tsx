import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Input,
  Textarea,
  Field,
} from '@fluentui/react-components';
import {
  Notebook24Regular,
  Dismiss24Regular,
  Add24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '450px',
  },
  colorPicker: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  colorSwatch: {
    width: '32px',
    height: '32px',
    borderRadius: tokens.borderRadiusCircular,
    cursor: 'pointer',
    border: `2px solid transparent`,
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'scale(1.1)',
    },
  },
  selectedColor: {
    border: `2px solid ${tokens.colorBrandBackground}`,
    transform: 'scale(1.1)',
  },
});

interface NotebookCreateDialogProps {
  open: boolean;
  onClose?: () => void;
  onCreate?: (name: string, description: string, color: string) => void;
}

const notebookColors = [
  '#0078D4', '#106EBE', '#005A9E', '#50E6FF', '#00B7C3',
  '#00CC6A', '#10893E', '#107C10', '#FFB900', '#FF8C00',
  '#F7630C', '#E74856', '#E81123', '#C50F1F', '#B146C2',
  '#881798', '#5C2D91', '#8E562E', '#7A7574', '#69797E',
];

export function NotebookCreateDialog({
  open,
  onClose,
  onCreate,
}: NotebookCreateDialogProps) {
  const styles = useStyles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(notebookColors[0]);

  const handleCreate = () => {
    if (name.trim()) {
      onCreate?.(name.trim(), description.trim(), color);
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setColor(notebookColors[0]);
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && handleClose()}>
      <DialogSurface>
        <DialogTitle
          action={
            <Button
              appearance="subtle"
              icon={<Dismiss24Regular />}
              onClick={handleClose}
            />
          }
        >
          <Notebook24Regular style={{ marginRight: '8px' }} />
          Create New Notebook
        </DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <Field label="Notebook Name" required>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter notebook name"
                autoFocus
              />
            </Field>

            <Field label="Description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)"
                rows={3}
              />
            </Field>

            <Field label="Color">
              <div className={styles.colorPicker}>
                {notebookColors.map((c) => (
                  <div
                    key={c}
                    className={`${styles.colorSwatch} ${color === c ? styles.selectedColor : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                    title={c}
                  />
                ))}
              </div>
            </Field>
          </DialogContent>
        </DialogBody>
        <DialogActions>
          <Button appearance="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Create Notebook
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
