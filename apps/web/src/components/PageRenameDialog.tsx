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
  Field,
} from '@fluentui/react-components';
import {
  Rename24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '400px',
  },
  info: {
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
  },
});

interface PageRenameDialogProps {
  open: boolean;
  currentName: string;
  onClose?: () => void;
  onRename?: (newName: string) => void;
}

export function PageRenameDialog({
  open,
  currentName,
  onClose,
  onRename,
}: PageRenameDialogProps) {
  const styles = useStyles();
  const [newName, setNewName] = useState(currentName);

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== currentName) {
      onRename?.(newName.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setNewName(currentName);
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
          <Rename24Regular style={{ marginRight: '8px' }} />
          Rename Page
        </DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <div className={styles.info}>
              Current name: <strong>{currentName}</strong>
            </div>

            <Field label="New Name" required>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new page name"
                autoFocus
              />
            </Field>
          </DialogContent>
        </DialogBody>
        <DialogActions>
          <Button appearance="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleRename}
            disabled={!newName.trim() || newName.trim() === currentName}
          >
            Rename
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
