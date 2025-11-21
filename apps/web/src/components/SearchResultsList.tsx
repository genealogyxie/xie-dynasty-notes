import {
  makeStyles,
  tokens,
  Card,
  Badge,
} from '@fluentui/react-components';
import {
  Document24Regular,
  Calendar24Regular,
  Notebook24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    overflowY: 'auto',
  },
  resultCard: {
    cursor: 'pointer',
    padding: '16px',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  resultTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  resultMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  resultSnippet: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: '1.5',
    marginBottom: '8px',
  },
  highlight: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  resultTags: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: tokens.colorNeutralForeground3,
  },
  emptyStateTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '8px',
  },
  emptyStateText: {
    fontSize: tokens.fontSizeBase300,
  },
});

interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  notebook: string;
  section: string;
  modifiedAt: Date;
  tags?: string[];
  matchCount?: number;
}

interface SearchResultsListProps {
  results: SearchResult[];
  query?: string;
  onResultClick?: (resultId: string) => void;
}

export function SearchResultsList({ results, query, onResultClick }: SearchResultsListProps) {
  const styles = useStyles();

  const formatDate = (date: Date) => {
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
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const highlightText = (text: string, query?: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className={styles.highlight}>{part}</span>
      ) : (
        part
      )
    );
  };

  if (results.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>No results found</div>
          <div className={styles.emptyStateText}>
            {query ? `No pages match "${query}"` : 'Try searching for something'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {results.map((result) => (
        <Card
          key={result.id}
          className={styles.resultCard}
          onClick={() => onResultClick?.(result.id)}
        >
          <div className={styles.resultHeader}>
            <Document24Regular />
            <div className={styles.resultTitle}>{highlightText(result.title, query)}</div>
            {result.matchCount && result.matchCount > 1 && (
              <Badge appearance="filled" color="informative">
                {result.matchCount} matches
              </Badge>
            )}
          </div>

          <div className={styles.resultMeta}>
            <div className={styles.metaItem}>
              <Notebook24Regular />
              <span>{result.notebook} / {result.section}</span>
            </div>
            <div className={styles.metaItem}>
              <Calendar24Regular />
              <span>{formatDate(result.modifiedAt)}</span>
            </div>
          </div>

          <div className={styles.resultSnippet}>
            {highlightText(result.snippet, query)}
          </div>

          {result.tags && result.tags.length > 0 && (
            <div className={styles.resultTags}>
              {result.tags.map((tag) => (
                <Badge key={tag} appearance="outline" size="small">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
