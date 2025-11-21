import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Document24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    padding: '16px',
    borderLeft: `3px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tocList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  tocItem: {
    padding: '6px 0',
    cursor: 'pointer',
    ':hover': {
      color: tokens.colorBrandForeground1,
    },
  },
  tocItemH1: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    paddingLeft: '0',
  },
  tocItemH2: {
    fontSize: tokens.fontSizeBase300,
    paddingLeft: '16px',
  },
  tocItemH3: {
    fontSize: tokens.fontSizeBase200,
    paddingLeft: '32px',
    color: tokens.colorNeutralForeground3,
  },
  emptyState: {
    padding: '16px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

interface TocItem {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

interface TableOfContentsProps {
  items: TocItem[];
  onNavigate?: (itemId: string) => void;
}

export function TableOfContents({ items, onNavigate }: TableOfContentsProps) {
  const styles = useStyles();

  const handleNavigate = (itemId: string) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  const getItemClassName = (level: number) => {
    switch (level) {
      case 1:
        return `${styles.tocItem} ${styles.tocItemH1}`;
      case 2:
        return `${styles.tocItem} ${styles.tocItemH2}`;
      case 3:
        return `${styles.tocItem} ${styles.tocItemH3}`;
      default:
        return styles.tocItem;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Document24Regular />
        Table of Contents
      </div>
      {items.length === 0 ? (
        <div className={styles.emptyState}>
          No headings found. Add headings to your page to generate a table of contents.
        </div>
      ) : (
        <ul className={styles.tocList}>
          {items.map((item) => (
            <li
              key={item.id}
              className={getItemClassName(item.level)}
              onClick={() => handleNavigate(item.id)}
            >
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
