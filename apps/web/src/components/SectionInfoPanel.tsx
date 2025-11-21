import {
  makeStyles,
  tokens,
  Card,
  Button,
  Badge,
} from '@fluentui/react-components';
import {
  Folder24Regular,
  Calendar24Regular,
  Document24Regular,
  People24Regular,
  Edit24Regular,
  Delete24Regular,
  Add24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    maxWidth: '400px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  sectionIcon: {
    fontSize: '48px',
    color: tokens.colorBrandForeground1,
  },
  headerInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sectionName: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  sectionDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  statCard: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'center',
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
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: tokens.fontSizeBase300,
  },
  pagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  pageItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  pageName: {
    flex: 1,
    fontSize: tokens.fontSizeBase300,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    paddingTop: '8px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface SectionInfo {
  id: string;
  name: string;
  description?: string;
  pageCount: number;
  createdAt: Date;
  modifiedAt: Date;
  owner: string;
  pages: Array<{
    id: string;
    name: string;
    modifiedAt: Date;
  }>;
}

interface SectionInfoPanelProps {
  section: SectionInfo;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddPage?: () => void;
  onPageClick?: (pageId: string) => void;
}

export function SectionInfoPanel({
  section,
  onEdit,
  onDelete,
  onAddPage,
  onPageClick,
}: SectionInfoPanelProps) {
  const styles = useStyles();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return formatDate(date);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Folder24Regular className={styles.sectionIcon} />
        <div className={styles.headerInfo}>
          <div className={styles.sectionName}>{section.name}</div>
          {section.description && (
            <div className={styles.sectionDescription}>{section.description}</div>
          )}
        </div>
      </div>

      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <Document24Regular />
          <div className={styles.statValue}>{section.pageCount}</div>
          <div className={styles.statLabel}>Pages</div>
        </Card>
        <Card className={styles.statCard}>
          <People24Regular />
          <div className={styles.statValue}>{section.owner}</div>
          <div className={styles.statLabel}>Owner</div>
        </Card>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Details</div>
        <div className={styles.infoRow}>
          <Calendar24Regular />
          <span>Created: {formatDate(section.createdAt)}</span>
        </div>
        <div className={styles.infoRow}>
          <Calendar24Regular />
          <span>Modified: {formatDate(section.modifiedAt)}</span>
        </div>
      </div>

      {section.pages.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Recent Pages</div>
          <div className={styles.pagesList}>
            {section.pages.slice(0, 10).map((page) => (
              <div
                key={page.id}
                className={styles.pageItem}
                onClick={() => onPageClick?.(page.id)}
              >
                <Document24Regular />
                <span className={styles.pageName}>{page.name}</span>
                <Badge appearance="outline" size="small">
                  {formatRelativeDate(page.modifiedAt)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={onAddPage}
        >
          Add Page
        </Button>
        <Button
          appearance="subtle"
          icon={<Edit24Regular />}
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button
          appearance="subtle"
          icon={<Delete24Regular />}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
