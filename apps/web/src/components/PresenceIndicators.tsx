import {
  makeStyles,
  tokens,
  Avatar,
  Tooltip,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
  },
  avatarGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginLeft: '-8px',
    border: `2px solid ${tokens.colorNeutralBackground1}`,
    ':first-child': {
      marginLeft: 0,
    },
  },
  activeIndicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: tokens.colorPaletteGreenBackground3,
    border: `2px solid ${tokens.colorNeutralBackground1}`,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  moreCount: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginLeft: '8px',
  },
});

interface User {
  id: string;
  name: string;
  email: string;
  color?: string;
  isActive: boolean;
}

interface PresenceIndicatorsProps {
  users: User[];
  maxVisible?: number;
}

export function PresenceIndicators({ users, maxVisible = 5 }: PresenceIndicatorsProps) {
  const styles = useStyles();
  
  const activeUsers = users.filter(user => user.isActive);
  const visibleUsers = activeUsers.slice(0, maxVisible);
  const remainingCount = activeUsers.length - visibleUsers.length;

  if (activeUsers.length === 0) {
    return null;
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={styles.container}>
      <div className={styles.avatarGroup}>
        {visibleUsers.map((user) => (
          <Tooltip key={user.id} content={`${user.name} is viewing`} relationship="label">
            <div style={{ position: 'relative' }}>
              <Avatar
                className={styles.avatar}
                name={user.name}
                initials={getInitials(user.name)}
                color={user.color as any}
                size={32}
              />
              <div className={styles.activeIndicator} />
            </div>
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <span className={styles.moreCount}>+{remainingCount} more</span>
        )}
      </div>
    </div>
  );
}
