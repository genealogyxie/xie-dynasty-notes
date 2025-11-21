import {
  makeStyles,
  tokens,
  Card,
} from '@fluentui/react-components';
import {
  Document24Regular,
  Clock24Regular,
  Edit24Regular,
  Eye24Regular,
  People24Regular,
  TextBold24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    padding: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  statCard: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  statValue: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  statLabel: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
});

interface PageStatisticsProps {
  wordCount: number;
  characterCount: number;
  createdAt: Date;
  modifiedAt: Date;
  viewCount: number;
  editCount: number;
  collaboratorCount: number;
}

export function PageStatistics({
  wordCount,
  characterCount,
  createdAt,
  modifiedAt,
  viewCount,
  editCount,
  collaboratorCount,
}: PageStatisticsProps) {
  const styles = useStyles();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysSince = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <TextBold24Regular />
            <span>Words</span>
          </div>
          <div className={styles.statValue}>{wordCount.toLocaleString()}</div>
          <div className={styles.statLabel}>{characterCount.toLocaleString()} characters</div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <Document24Regular />
            <span>Created</span>
          </div>
          <div className={styles.statValue}>{getDaysSince(createdAt)}</div>
          <div className={styles.statLabel}>days ago ({formatDate(createdAt)})</div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <Clock24Regular />
            <span>Modified</span>
          </div>
          <div className={styles.statValue}>{getDaysSince(modifiedAt)}</div>
          <div className={styles.statLabel}>days ago ({formatDate(modifiedAt)})</div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <Eye24Regular />
            <span>Views</span>
          </div>
          <div className={styles.statValue}>{viewCount.toLocaleString()}</div>
          <div className={styles.statLabel}>total page views</div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <Edit24Regular />
            <span>Edits</span>
          </div>
          <div className={styles.statValue}>{editCount.toLocaleString()}</div>
          <div className={styles.statLabel}>total edits made</div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <People24Regular />
            <span>Collaborators</span>
          </div>
          <div className={styles.statValue}>{collaboratorCount}</div>
          <div className={styles.statLabel}>people with access</div>
        </Card>
      </div>
    </div>
  );
}
