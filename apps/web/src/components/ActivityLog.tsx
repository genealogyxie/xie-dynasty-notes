import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  makeStyles,
  tokens,
  Avatar,
} from '@fluentui/react-components';
import {
  History24Regular,
  DocumentEdit24Regular,
  DocumentAdd24Regular,
  Delete24Regular,
  Share24Regular,
  Comment24Regular,
  Person24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '700px',
    width: '90vw',
  },
  activityList: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    marginTop: '16px',
    marginBottom: '16px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  activityItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  activityIcon: {
    marginTop: '2px',
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  activityUser: {
    fontWeight: tokens.fontWeightSemibold,
  },
  activityAction: {
    fontSize: tokens.fontSizeBase300,
    marginBottom: '4px',
  },
  activityDetails: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  activityTime: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  timeline: {
    position: 'relative',
    paddingLeft: '32px',
  },
  timelineLine: {
    position: 'absolute',
    left: '16px',
    top: '32px',
    bottom: '0',
    width: '2px',
    backgroundColor: tokens.colorNeutralStroke2,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
});

interface ActivityLogEntry {
  id: string;
  type: 'create' | 'edit' | 'delete' | 'share' | 'comment' | 'user_join';
  user: string;
  userEmail: string;
  action: string;
  details?: string;
  timestamp: Date;
}

interface ActivityLogProps {
  open: boolean;
  onClose: () => void;
  activities: ActivityLogEntry[];
}

export function ActivityLog({ open, onClose, activities }: ActivityLogProps) {
  const styles = useStyles();

  const getIcon = (type: ActivityLogEntry['type']) => {
    switch (type) {
      case 'create':
        return <DocumentAdd24Regular style={{ color: tokens.colorPaletteGreenForeground1 }} />;
      case 'edit':
        return <DocumentEdit24Regular style={{ color: tokens.colorBrandForeground1 }} />;
      case 'delete':
        return <Delete24Regular style={{ color: tokens.colorPaletteRedForeground1 }} />;
      case 'share':
        return <Share24Regular style={{ color: tokens.colorPaletteBlueForeground2 }} />;
      case 'comment':
        return <Comment24Regular style={{ color: tokens.colorPalettePurpleForeground2 }} />;
      case 'user_join':
        return <Person24Regular style={{ color: tokens.colorPaletteGreenForeground1 }} />;
      default:
        return <History24Regular />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleString();
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <History24Regular />
              Activity Log
            </div>
          </DialogTitle>

          <div className={styles.activityList}>
            {activities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: tokens.colorNeutralForeground3 }}>
                <History24Regular style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>No activity yet</div>
                <div style={{ fontSize: tokens.fontSizeBase200, marginTop: '8px' }}>
                  Activity will appear here as you and others work on this page
                </div>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className={styles.activityItem}>
                  <Avatar
                    name={activity.user}
                    initials={getInitials(activity.user)}
                    size={32}
                  />
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <span className={styles.activityUser}>{activity.user}</span>
                      {getIcon(activity.type)}
                    </div>
                    <div className={styles.activityAction}>{activity.action}</div>
                    {activity.details && (
                      <div className={styles.activityDetails}>{activity.details}</div>
                    )}
                    <div className={styles.activityTime}>{formatTime(activity.timestamp)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.actions}>
            <Button appearance="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
