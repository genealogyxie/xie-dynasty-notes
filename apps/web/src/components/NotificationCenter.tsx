import {
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  Button,
  makeStyles,
  tokens,
  Badge,
} from '@fluentui/react-components';
import {
  Alert24Regular,
  Dismiss24Regular,
  CheckmarkCircle24Regular,
  Info24Regular,
  Warning24Regular,
  ErrorCircle24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  notificationsList: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
  },
  notificationCard: {
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    marginTop: '2px',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  notificationMessage: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  notificationTime: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  notificationActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  unreadIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    marginTop: '6px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 16px',
    color: tokens.colorNeutralForeground3,
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
});

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

export function NotificationCenter({
  open,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}: NotificationCenterProps) {
  const styles = useStyles();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckmarkCircle24Regular style={{ color: tokens.colorPaletteGreenForeground1 }} />;
      case 'warning':
        return <Warning24Regular style={{ color: tokens.colorPaletteYellowForeground1 }} />;
      case 'error':
        return <ErrorCircle24Regular style={{ color: tokens.colorPaletteRedForeground1 }} />;
      default:
        return <Info24Regular style={{ color: tokens.colorBrandForeground1 }} />;
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Drawer open={open} onOpenChange={(_, { open }) => !open && onClose()} position="end">
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <div className={styles.headerActions}>
              {unreadCount > 0 && (
                <Button appearance="subtle" size="small" onClick={onMarkAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button appearance="subtle" size="small" onClick={onClearAll}>
                Clear all
              </Button>
              <Button
                appearance="subtle"
                icon={<Dismiss24Regular />}
                onClick={onClose}
              />
            </div>
          }
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Alert24Regular />
            Notifications
            {unreadCount > 0 && (
              <Badge appearance="filled" color="brand">
                {unreadCount}
              </Badge>
            )}
          </div>
        </DrawerHeaderTitle>
      </DrawerHeader>

      <DrawerBody>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <Alert24Regular style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>No notifications</div>
            <div style={{ fontSize: tokens.fontSizeBase200, marginTop: '8px' }}>
              You're all caught up!
            </div>
          </div>
        ) : (
          <div className={styles.notificationsList}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={styles.notificationCard}
                style={{
                  backgroundColor: notification.isRead
                    ? tokens.colorNeutralBackground2
                    : tokens.colorNeutralBackground1,
                }}
              >
                {!notification.isRead && <div className={styles.unreadIndicator} />}
                <div className={styles.notificationIcon}>{getIcon(notification.type)}</div>
                <div className={styles.notificationContent}>
                  <div className={styles.notificationTitle}>{notification.title}</div>
                  <div className={styles.notificationMessage}>{notification.message}</div>
                  <div className={styles.notificationTime}>{formatTime(notification.timestamp)}</div>
                  {notification.actionLabel && (
                    <div className={styles.notificationActions}>
                      <Button
                        appearance="primary"
                        size="small"
                        onClick={notification.onAction}
                      >
                        {notification.actionLabel}
                      </Button>
                      {!notification.isRead && (
                        <Button
                          appearance="subtle"
                          size="small"
                          onClick={() => onMarkAsRead?.(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DrawerBody>
    </Drawer>
  );
}
