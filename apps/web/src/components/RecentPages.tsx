import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Clock24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    padding: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  recentList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  recentItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px',
    borderRadius: tokens.borderRadiusSmall,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  itemInfo: {
    flex: 1,
    overflow: 'hidden',
  },
  itemTitle: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginBottom: '2px',
  },
  itemTime: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  emptyState: {
    padding: '16px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

interface RecentPage {
  id: number;
  title: string;
  lastAccessed: Date;
}

interface RecentPagesProps {
  pages: RecentPage[];
  onNavigate?: (pageId: number) => void;
}

export function RecentPages({ pages, onNavigate }: RecentPagesProps) {
  const styles = useStyles();

  const handleNavigate = (pageId: number) => {
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Clock24Regular />
        Recent Pages
      </div>
      {pages.length === 0 ? (
        <div className={styles.emptyState}>
          No recent pages yet. Pages you view will appear here.
        </div>
      ) : (
        <ul className={styles.recentList}>
          {pages.slice(0, 10).map((page) => (
            <li
              key={page.id}
              className={styles.recentItem}
              onClick={() => handleNavigate(page.id)}
            >
              <div className={styles.itemInfo}>
                <div className={styles.itemTitle}>{page.title}</div>
                <div className={styles.itemTime}>{formatTime(page.lastAccessed)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
