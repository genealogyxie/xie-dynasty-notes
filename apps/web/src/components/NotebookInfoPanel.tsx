import {
  makeStyles,
  tokens,
  Card,
  Button,
  Avatar,
  Badge,
} from '@fluentui/react-components';
import {
  Notebook24Regular,
  Calendar24Regular,
  Document24Regular,
  People24Regular,
  Storage24Regular,
  Edit24Regular,
  Share24Regular,
  Delete24Regular,
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
  notebookIcon: {
    fontSize: '48px',
  },
  headerInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  notebookName: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  notebookDescription: {
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
  collaborators: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
  },
  avatarGroup: {
    display: 'flex',
    marginLeft: '-8px',
  },
  avatar: {
    marginLeft: '-8px',
    border: `2px solid ${tokens.colorNeutralBackground1}`,
  },
  actions: {
    display: 'flex',
    gap: '8px',
    paddingTop: '8px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface NotebookInfo {
  id: string;
  name: string;
  description?: string;
  color: string;
  sectionCount: number;
  pageCount: number;
  createdAt: Date;
  modifiedAt: Date;
  owner: string;
  size: string;
  collaborators: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

interface NotebookInfoPanelProps {
  notebook: NotebookInfo;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}

export function NotebookInfoPanel({ notebook, onEdit, onShare, onDelete }: NotebookInfoPanelProps) {
  const styles = useStyles();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Notebook24Regular
          className={styles.notebookIcon}
          style={{ color: notebook.color }}
        />
        <div className={styles.headerInfo}>
          <div className={styles.notebookName}>{notebook.name}</div>
          {notebook.description && (
            <div className={styles.notebookDescription}>{notebook.description}</div>
          )}
        </div>
      </div>

      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <Document24Regular />
          <div className={styles.statValue}>{notebook.pageCount}</div>
          <div className={styles.statLabel}>Pages</div>
        </Card>
        <Card className={styles.statCard}>
          <Notebook24Regular />
          <div className={styles.statValue}>{notebook.sectionCount}</div>
          <div className={styles.statLabel}>Sections</div>
        </Card>
        <Card className={styles.statCard}>
          <People24Regular />
          <div className={styles.statValue}>{notebook.collaborators.length}</div>
          <div className={styles.statLabel}>Collaborators</div>
        </Card>
        <Card className={styles.statCard}>
          <Storage24Regular />
          <div className={styles.statValue}>{notebook.size}</div>
          <div className={styles.statLabel}>Size</div>
        </Card>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Details</div>
        <div className={styles.infoRow}>
          <Calendar24Regular />
          <span>Created: {formatDate(notebook.createdAt)}</span>
        </div>
        <div className={styles.infoRow}>
          <Calendar24Regular />
          <span>Modified: {formatDate(notebook.modifiedAt)}</span>
        </div>
        <div className={styles.infoRow}>
          <People24Regular />
          <span>Owner: {notebook.owner}</span>
        </div>
      </div>

      {notebook.collaborators.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Collaborators</div>
          <div className={styles.collaborators}>
            <div className={styles.avatarGroup}>
              {notebook.collaborators.slice(0, 5).map((collaborator) => (
                <Avatar
                  key={collaborator.id}
                  className={styles.avatar}
                  name={collaborator.name}
                  image={collaborator.avatar ? { src: collaborator.avatar } : undefined}
                  size={32}
                />
              ))}
            </div>
            {notebook.collaborators.length > 5 && (
              <Badge appearance="filled" size="small">
                +{notebook.collaborators.length - 5}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          appearance="subtle"
          icon={<Edit24Regular />}
          onClick={onEdit}
        >
          Edit
        </Button>
        <Button
          appearance="subtle"
          icon={<Share24Regular />}
          onClick={onShare}
        >
          Share
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
