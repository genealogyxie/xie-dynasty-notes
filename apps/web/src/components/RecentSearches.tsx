import { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
  Button,
} from '@fluentui/react-components';
import {
  History24Regular,
  Dismiss24Regular,
  Search24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  title: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  searchItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  searchText: {
    flex: 1,
    fontSize: tokens.fontSizeBase300,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  searchTime: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  removeButton: {
    minWidth: '24px',
  },
  emptyState: {
    padding: '24px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
  },
});

interface RecentSearch {
  id: string;
  query: string;
  timestamp: Date;
}

interface RecentSearchesProps {
  onSearchSelect?: (query: string) => void;
  maxItems?: number;
}

export function RecentSearches({ onSearchSelect }: RecentSearchesProps) {
  const styles = useStyles();
  const [searches, setSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = () => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSearches(parsed.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp),
      })));
    }
  };


  const removeSearch = (id: string) => {
    const updated = searches.filter((s) => s.id !== id);
    setSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearAll = () => {
    setSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (searches.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <History24Regular />
            <span>Recent Searches</span>
          </div>
        </div>
        <div className={styles.emptyState}>
          No recent searches
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <History24Regular />
          <span>Recent Searches</span>
        </div>
        <Button
          appearance="subtle"
          size="small"
          onClick={clearAll}
        >
          Clear All
        </Button>
      </div>
      {searches.map((search) => (
        <div
          key={search.id}
          className={styles.searchItem}
          onClick={() => onSearchSelect?.(search.query)}
        >
          <Search24Regular />
          <span className={styles.searchText}>{search.query}</span>
          <span className={styles.searchTime}>{formatTime(search.timestamp)}</span>
          <Button
            appearance="subtle"
            size="small"
            icon={<Dismiss24Regular />}
            className={styles.removeButton}
            onClick={(e) => {
              e.stopPropagation();
              removeSearch(search.id);
            }}
          />
        </div>
      ))}
    </div>
  );
}
