import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '4px 12px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  label: {
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface WordCountProps {
  content: string;
}

export function WordCount({ content }: WordCountProps) {
  const styles = useStyles();

  const getStats = () => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    return { words, characters, charactersNoSpaces };
  };

  const stats = getStats();

  return (
    <div className={styles.container}>
      <div className={styles.stat}>
        <span className={styles.label}>Words:</span>
        <span>{stats.words}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Characters:</span>
        <span>{stats.characters}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Characters (no spaces):</span>
        <span>{stats.charactersNoSpaces}</span>
      </div>
    </div>
  );
}
