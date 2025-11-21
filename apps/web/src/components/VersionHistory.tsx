import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { History24Regular, ArrowUndo24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '800px',
    width: '90vw',
    maxHeight: '80vh',
  },
  timelineList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '500px',
    overflowY: 'auto',
  },
  timelineItem: {
    padding: '16px',
    borderLeft: `3px solid ${tokens.colorBrandBackground}`,
    marginLeft: '20px',
    marginBottom: '16px',
    position: 'relative',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  timelineDot: {
    position: 'absolute',
    left: '-9px',
    top: '20px',
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    border: `3px solid ${tokens.colorNeutralBackground1}`,
  },
  versionTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  versionMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  versionPreview: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    padding: '8px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    maxHeight: '100px',
    overflow: 'hidden',
  },
});

interface Version {
  id: string;
  timestamp: Date;
  author: string;
  changes: string;
  preview: string;
}

interface VersionHistoryProps {
  open: boolean;
  onClose: () => void;
  pageId: number;
  onRestore?: (versionId: string) => void;
}

export function VersionHistory({ open, onClose, pageId, onRestore }: VersionHistoryProps) {
  const styles = useStyles();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadVersionHistory();
    }
  }, [open, pageId]);

  const loadVersionHistory = async () => {
    setLoading(true);
    
    const mockVersions: Version[] = [
      {
        id: 'v1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        author: 'Current User',
        changes: 'Added new paragraph and formatting',
        preview: 'This is the latest version of the page with recent changes...',
      },
      {
        id: 'v2',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        author: 'Current User',
        changes: 'Updated heading and added bullet points',
        preview: 'Previous version with different heading structure...',
      },
      {
        id: 'v3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        author: 'Collaborator',
        changes: 'Initial content creation',
        preview: 'First draft of the page content...',
      },
    ];

    setTimeout(() => {
      setVersions(mockVersions);
      setLoading(false);
    }, 500);
  };

  const handleRestore = (versionId: string) => {
    if (onRestore) {
      onRestore(versionId);
    }
    onClose();
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History24Regular />
              Version History
            </div>
          </DialogTitle>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              Loading version history...
            </div>
          ) : (
            <ul className={styles.timelineList}>
              {versions.map((version, index) => (
                <li key={version.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.versionTitle}>
                    {index === 0 ? 'Current Version' : `Version ${versions.length - index}`}
                  </div>
                  <div className={styles.versionMeta}>
                    {formatTimestamp(version.timestamp)} • {version.author}
                  </div>
                  <div style={{ marginBottom: '8px', fontSize: tokens.fontSizeBase200 }}>
                    {version.changes}
                  </div>
                  <div className={styles.versionPreview}>
                    {version.preview}
                  </div>
                  {index > 0 && (
                    <Button
                      appearance="subtle"
                      icon={<ArrowUndo24Regular />}
                      onClick={() => handleRestore(version.id)}
                      style={{ marginTop: '8px' }}
                    >
                      Restore this version
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button appearance="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
