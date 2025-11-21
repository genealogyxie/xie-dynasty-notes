import {
  makeStyles,
  tokens,
  Button,
} from '@fluentui/react-components';
import { Tag24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cloud: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center',
  },
  tag: {
    padding: '4px 12px',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
});

interface Tag {
  name: string;
  count: number;
}

interface TagCloudProps {
  tags: Tag[];
  onTagClick?: (tagName: string) => void;
  maxTags?: number;
}

export function TagCloud({ tags, onTagClick, maxTags = 50 }: TagCloudProps) {
  const styles = useStyles();

  const sortedTags = [...tags]
    .sort((a, b) => b.count - a.count)
    .slice(0, maxTags);

  const maxCount = Math.max(...sortedTags.map((t) => t.count), 1);
  const minCount = Math.min(...sortedTags.map((t) => t.count), 1);
  const countRange = maxCount - minCount || 1;

  const getFontSize = (count: number) => {
    const normalized = (count - minCount) / countRange;
    const minSize = 12;
    const maxSize = 28;
    return minSize + normalized * (maxSize - minSize);
  };

  const getOpacity = (count: number) => {
    const normalized = (count - minCount) / countRange;
    return 0.5 + normalized * 0.5;
  };

  if (tags.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          <Tag24Regular />
          <span>Tags</span>
        </div>
        <div style={{ color: tokens.colorNeutralForeground3, textAlign: 'center', padding: '24px' }}>
          No tags yet
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Tag24Regular />
        <span>Tags ({tags.length})</span>
      </div>
      <div className={styles.cloud}>
        {sortedTags.map((tag) => (
          <Button
            key={tag.name}
            appearance="subtle"
            className={styles.tag}
            onClick={() => onTagClick?.(tag.name)}
            style={{
              fontSize: `${getFontSize(tag.count)}px`,
              opacity: getOpacity(tag.count),
            }}
            title={`${tag.name} (${tag.count} pages)`}
          >
            {tag.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
