import {
  makeStyles,
  tokens,
  Button,
} from '@fluentui/react-components';
import { Star24Filled } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    padding: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '12px',
  },
  favoritesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  favoriteItem: {
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
  favoriteTitle: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    padding: '16px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

interface FavoriteItem {
  id: number;
  title: string;
  type: 'page' | 'notebook' | 'section';
}

interface FavoritesPanelProps {
  favorites: FavoriteItem[];
  onNavigate?: (item: FavoriteItem) => void;
  onToggleFavorite?: (itemId: number) => void;
}

export function FavoritesPanel({ favorites, onNavigate, onToggleFavorite }: FavoritesPanelProps) {
  const styles = useStyles();

  const handleNavigate = (item: FavoriteItem) => {
    if (onNavigate) {
      onNavigate(item);
    }
  };

  const handleToggleFavorite = (itemId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(itemId);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>⭐ Favorites</div>
      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          No favorites yet. Click the star icon on any page to add it here.
        </div>
      ) : (
        <ul className={styles.favoritesList}>
          {favorites.map((item) => (
            <li
              key={item.id}
              className={styles.favoriteItem}
              onClick={() => handleNavigate(item)}
            >
              <div className={styles.favoriteTitle}>{item.title}</div>
              <Button
                appearance="subtle"
                icon={<Star24Filled />}
                onClick={(e) => handleToggleFavorite(item.id, e)}
                size="small"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
