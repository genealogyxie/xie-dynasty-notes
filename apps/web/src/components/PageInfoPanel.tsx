import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Info24Regular, Calendar24Regular, Person24Regular, Edit24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '500px',
    width: '90vw',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    marginTop: '16px',
    marginBottom: '16px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  infoIcon: {
    marginTop: '2px',
    color: tokens.colorBrandForeground1,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '4px',
  },
  infoValue: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginTop: '16px',
    marginBottom: '16px',
  },
  statCard: {
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    textAlign: 'center',
  },
  statValue: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
});

interface PageInfo {
  title: string;
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  wordCount: number;
  characterCount: number;
  versionCount: number;
  tags: string[];
  collaborators: string[];
}

interface PageInfoPanelProps {
  open: boolean;
  onClose: () => void;
  pageInfo: PageInfo;
}

export function PageInfoPanel({ open, onClose, pageInfo }: PageInfoPanelProps) {
  const styles = useStyles();

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return formatDate(date);
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Info24Regular />
              Page Information
            </div>
          </DialogTitle>

          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <Person24Regular className={styles.infoIcon} />
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Created by</div>
                <div className={styles.infoValue}>{pageInfo.createdBy}</div>
                <div className={styles.infoLabel} style={{ marginTop: '4px' }}>
                  {formatDate(pageInfo.createdAt)}
                </div>
              </div>
            </div>

            <div className={styles.infoRow}>
              <Edit24Regular className={styles.infoIcon} />
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Last modified by</div>
                <div className={styles.infoValue}>{pageInfo.lastModifiedBy}</div>
                <div className={styles.infoLabel} style={{ marginTop: '4px' }}>
                  {formatRelativeTime(pageInfo.lastModifiedAt)}
                </div>
              </div>
            </div>

            <div className={styles.infoRow}>
              <Calendar24Regular className={styles.infoIcon} />
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Collaborators</div>
                <div className={styles.infoValue}>
                  {pageInfo.collaborators.length > 0
                    ? pageInfo.collaborators.join(', ')
                    : 'None'}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{pageInfo.wordCount}</div>
              <div className={styles.statLabel}>Words</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{pageInfo.characterCount}</div>
              <div className={styles.statLabel}>Characters</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{pageInfo.versionCount}</div>
              <div className={styles.statLabel}>Versions</div>
            </div>
          </div>

          {pageInfo.tags.length > 0 && (
            <div className={styles.infoRow}>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Tags</div>
                <div className={styles.infoValue}>
                  {pageInfo.tags.map((tag, idx) => (
                    <span key={idx}>
                      #{tag}
                      {idx < pageInfo.tags.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <Button appearance="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
