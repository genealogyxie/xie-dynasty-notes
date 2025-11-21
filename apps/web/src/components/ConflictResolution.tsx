import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Warning24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '800px',
    width: '90vw',
  },
  warningHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: tokens.colorPaletteYellowBackground2,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: '16px',
  },
  versionsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  versionPanel: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '16px',
  },
  versionHeader: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '8px',
    fontSize: tokens.fontSizeBase400,
  },
  versionMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '12px',
  },
  versionContent: {
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    fontFamily: 'monospace',
    fontSize: tokens.fontSizeBase200,
    maxHeight: '300px',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  selectedVersion: {
    border: `2px solid ${tokens.colorBrandBackground}`,
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
  },
  diffHighlight: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    padding: '2px 4px',
    borderRadius: tokens.borderRadiusSmall,
  },
});

interface ConflictVersion {
  id: string;
  author: string;
  timestamp: Date;
  content: string;
}

interface ConflictResolutionProps {
  open: boolean;
  onClose: () => void;
  localVersion: ConflictVersion;
  remoteVersion: ConflictVersion;
  onResolve?: (selectedVersion: 'local' | 'remote' | 'merge') => void;
}

export function ConflictResolution({
  open,
  onClose,
  localVersion,
  remoteVersion,
  onResolve,
}: ConflictResolutionProps) {
  const styles = useStyles();
  const [selectedVersion, setSelectedVersion] = useState<'local' | 'remote' | null>(null);

  const handleResolve = (resolution: 'local' | 'remote' | 'merge') => {
    if (onResolve) {
      onResolve(resolution);
    }
    onClose();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>Resolve Conflict</DialogTitle>

          <div className={styles.warningHeader}>
            <Warning24Regular style={{ fontSize: '24px', color: tokens.colorPaletteYellowForeground1 }} />
            <div>
              <div style={{ fontWeight: tokens.fontWeightSemibold }}>
                Conflicting changes detected
              </div>
              <div style={{ fontSize: tokens.fontSizeBase200 }}>
                This page was modified by multiple users. Choose which version to keep.
              </div>
            </div>
          </div>

          <div className={styles.versionsContainer}>
            <div
              className={`${styles.versionPanel} ${selectedVersion === 'local' ? styles.selectedVersion : ''}`}
              onClick={() => setSelectedVersion('local')}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.versionHeader}>Your Version (Local)</div>
              <div className={styles.versionMeta}>
                Modified by {localVersion.author} at {formatTime(localVersion.timestamp)}
              </div>
              <div className={styles.versionContent}>
                {localVersion.content}
              </div>
              <Button
                appearance="primary"
                style={{ marginTop: '12px', width: '100%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleResolve('local');
                }}
              >
                Keep This Version
              </Button>
            </div>

            <div
              className={`${styles.versionPanel} ${selectedVersion === 'remote' ? styles.selectedVersion : ''}`}
              onClick={() => setSelectedVersion('remote')}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.versionHeader}>Server Version (Remote)</div>
              <div className={styles.versionMeta}>
                Modified by {remoteVersion.author} at {formatTime(remoteVersion.timestamp)}
              </div>
              <div className={styles.versionContent}>
                {remoteVersion.content}
              </div>
              <Button
                appearance="primary"
                style={{ marginTop: '12px', width: '100%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleResolve('remote');
                }}
              >
                Keep This Version
              </Button>
            </div>
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={() => handleResolve('merge')}
            >
              Merge Both (Advanced)
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
