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
import { Delete24Regular, ArrowUndo24Regular, DeleteDismiss24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '700px',
    width: '90vw',
    maxHeight: '80vh',
  },
  itemsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '500px',
    overflowY: 'auto',
  },
  item: {
    padding: '12px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  itemMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  emptyState: {
    padding: '40px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
});

interface DeletedItem {
  id: string;
  type: 'page' | 'section' | 'notebook';
  title: string;
  deletedAt: Date;
  deletedBy: string;
}

interface RecycleBinProps {
  open: boolean;
  onClose: () => void;
  onRestore?: (itemId: string, itemType: string) => void;
  onPermanentDelete?: (itemId: string, itemType: string) => void;
}

export function RecycleBin({ open, onClose, onRestore, onPermanentDelete }: RecycleBinProps) {
  const styles = useStyles();
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadDeletedItems();
    }
  }, [open]);

  const loadDeletedItems = async () => {
    setLoading(true);
    
    const mockItems: DeletedItem[] = [
      {
        id: 'p1',
        type: 'page',
        title: 'Meeting Notes - Q4 Planning',
        deletedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        deletedBy: 'Current User',
      },
      {
        id: 's1',
        type: 'section',
        title: 'Old Projects',
        deletedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        deletedBy: 'Current User',
      },
      {
        id: 'p2',
        type: 'page',
        title: 'Draft Ideas',
        deletedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        deletedBy: 'Collaborator',
      },
    ];

    setTimeout(() => {
      setDeletedItems(mockItems);
      setLoading(false);
    }, 500);
  };

  const handleRestore = (itemId: string, itemType: string) => {
    if (onRestore) {
      onRestore(itemId, itemType);
    }
    setDeletedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handlePermanentDelete = (itemId: string, itemType: string) => {
    if (confirm('Are you sure you want to permanently delete this item? This cannot be undone.')) {
      if (onPermanentDelete) {
        onPermanentDelete(itemId, itemType);
      }
      setDeletedItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const handleEmptyBin = () => {
    if (confirm('Are you sure you want to permanently delete all items in the recycle bin? This cannot be undone.')) {
      setDeletedItems([]);
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Delete24Regular />
                Recycle Bin
              </div>
              {deletedItems.length > 0 && (
                <Button
                  appearance="subtle"
                  icon={<DeleteDismiss24Regular />}
                  onClick={handleEmptyBin}
                >
                  Empty Bin
                </Button>
              )}
            </div>
          </DialogTitle>

          {loading ? (
            <div className={styles.emptyState}>
              Loading deleted items...
            </div>
          ) : deletedItems.length === 0 ? (
            <div className={styles.emptyState}>
              <Delete24Regular style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>Recycle bin is empty</div>
              <div style={{ fontSize: tokens.fontSizeBase200, marginTop: '8px' }}>
                Deleted items will appear here and be automatically removed after 60 days
              </div>
            </div>
          ) : (
            <ul className={styles.itemsList}>
              {deletedItems.map((item) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.itemMeta}>
                      {getTypeLabel(item.type)} • Deleted {formatTimestamp(item.deletedAt)} by {item.deletedBy}
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <Button
                      appearance="subtle"
                      icon={<ArrowUndo24Regular />}
                      onClick={() => handleRestore(item.id, item.type)}
                    >
                      Restore
                    </Button>
                    <Button
                      appearance="subtle"
                      icon={<DeleteDismiss24Regular />}
                      onClick={() => handlePermanentDelete(item.id, item.type)}
                    >
                      Delete Forever
                    </Button>
                  </div>
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
