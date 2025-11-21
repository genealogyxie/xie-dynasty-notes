import {
  makeStyles,
  tokens,
  Avatar,
  Badge,
  Tooltip,
} from '@fluentui/react-components';
import {
  People24Regular,
  Eye24Regular,
  Edit24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '8px 16px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  avatarGroup: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '-8px',
  },
  avatar: {
    marginLeft: '-8px',
    border: `2px solid ${tokens.colorNeutralBackground1}`,
  },
  count: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: tokens.borderRadiusCircular,
    marginRight: '4px',
  },
  viewing: {
    backgroundColor: tokens.colorPaletteGreenForeground2,
  },
  editing: {
    backgroundColor: tokens.colorPaletteBlueForeground2,
  },
});

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'viewing' | 'editing';
  color?: string;
}

interface CollaborationStatusBarProps {
  collaborators: Collaborator[];
  totalViewers?: number;
  totalEditors?: number;
}

export function CollaborationStatusBar({
  collaborators,
  totalViewers = 0,
  totalEditors = 0,
}: CollaborationStatusBarProps) {
  const styles = useStyles();

  const viewers = collaborators.filter((c) => c.status === 'viewing');
  const editors = collaborators.filter((c) => c.status === 'editing');

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <People24Regular />
        <span className={styles.count}>{collaborators.length}</span>
        <span className={styles.label}>online</span>
      </div>

      {editors.length > 0 && (
        <div className={styles.section}>
          <div className={`${styles.statusDot} ${styles.editing}`} />
          <Edit24Regular />
          <span className={styles.count}>{totalEditors || editors.length}</span>
          <span className={styles.label}>editing</span>
          <div className={styles.avatarGroup}>
            {editors.slice(0, 3).map((editor) => (
              <Tooltip
                key={editor.id}
                content={`${editor.name} (${editor.email})`}
                relationship="label"
              >
                <Avatar
                  className={styles.avatar}
                  name={editor.name}
                  image={editor.avatar ? { src: editor.avatar } : undefined}
                  badge={{ status: 'available' }}
                  size={24}
                  color={editor.color as any}
                />
              </Tooltip>
            ))}
            {editors.length > 3 && (
              <Badge appearance="filled" size="small" style={{ marginLeft: '4px' }}>
                +{editors.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {viewers.length > 0 && (
        <div className={styles.section}>
          <div className={`${styles.statusDot} ${styles.viewing}`} />
          <Eye24Regular />
          <span className={styles.count}>{totalViewers || viewers.length}</span>
          <span className={styles.label}>viewing</span>
          <div className={styles.avatarGroup}>
            {viewers.slice(0, 3).map((viewer) => (
              <Tooltip
                key={viewer.id}
                content={`${viewer.name} (${viewer.email})`}
                relationship="label"
              >
                <Avatar
                  className={styles.avatar}
                  name={viewer.name}
                  image={viewer.avatar ? { src: viewer.avatar } : undefined}
                  badge={{ status: 'available' }}
                  size={24}
                  color={viewer.color as any}
                />
              </Tooltip>
            ))}
            {viewers.length > 3 && (
              <Badge appearance="filled" size="small" style={{ marginLeft: '4px' }}>
                +{viewers.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
