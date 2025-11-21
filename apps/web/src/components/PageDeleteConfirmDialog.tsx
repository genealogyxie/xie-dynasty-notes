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
  Checkbox,
} from '@fluentui/react-components';
import {
  Delete24Regular,
  Dismiss24Regular,
  Warning24Regular,
} from '@fluentui/react-icons';
import { useState } from 'react';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '450px',
  },
  warning: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: tokens.colorPaletteRedBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  warningIcon: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: '24px',
    flexShrink: 0,
  },
  warningText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  info: {
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    paddingLeft: '16px',
  },
});

interface PageDeleteConfirmDialogProps {
  open: boolean;
  pageName: string;
  hasSubpages?: boolean;
  subpageCount?: number;
  hasAttachments?: boolean;
  attachmentCount?: number;
  onClose?: () => void;
  onConfirm?: (moveToRecycleBin: boolean) => void;
}

export function PageDeleteConfirmDialog({
  open,
  pageName,
  hasSubpages = false,
  subpageCount = 0,
  hasAttachments = false,
  attachmentCount = 0,
  onClose,
  onConfirm,
}: PageDeleteConfirmDialogProps) {
  const styles = useStyles();
  const [moveToRecycleBin, setMoveToRecycleBin] = useState(true);

  const handleConfirm = () => {
    onConfirm?.(moveToRecycleBin);
    handleClose();
  };

  const handleClose = () => {
    setMoveToRecycleBin(true);
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
          <Delete24Regular style={{ marginRight: '8px' }} />
          Delete Page
        </DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <div className={styles.warning}>
              <Warning24Regular className={styles.warningIcon} />
              <div className={styles.warningText}>
                {moveToRecycleBin
                  ? 'This page will be moved to the Recycle Bin and can be restored later.'
                  : 'This page will be permanently deleted and cannot be recovered.'}
              </div>
            </div>

            <div className={styles.info}>
              <strong>Page to delete:</strong> {pageName}
              
              {(hasSubpages || hasAttachments) && (
                <div className={styles.itemsList}>
                  {hasSubpages && (
                    <div>• {subpageCount} subpage{subpageCount !== 1 ? 's' : ''} will also be deleted</div>
                  )}
                  {hasAttachments && (
                    <div>• {attachmentCount} attachment{attachmentCount !== 1 ? 's' : ''} will also be deleted</div>
                  )}
                </div>
              )}
            </div>

            <Checkbox
              label="Move to Recycle Bin (can be restored later)"
              checked={moveToRecycleBin}
              onChange={(_, data) => setMoveToRecycleBin(data.checked as boolean)}
            />
          </DialogContent>
        </DialogBody>
        <DialogActions>
          <Button appearance="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            style={{
              backgroundColor: tokens.colorPaletteRedBackground3,
              color: tokens.colorNeutralForegroundOnBrand,
            }}
            onClick={handleConfirm}
          >
            {moveToRecycleBin ? 'Move to Recycle Bin' : 'Delete Permanently'}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
