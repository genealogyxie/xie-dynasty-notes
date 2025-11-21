import {
  makeStyles,
  tokens,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@fluentui/react-components';
import {
  History24Regular,
  Clock24Regular,
  ArrowUndo24Regular,
  Eye24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  versionItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  versionTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  versionMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  currentVersion: {
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface PageVersion {
  id: string;
  timestamp: Date;
  author: string;
  description?: string;
  isCurrent?: boolean;
}

interface PageVersionsDropdownProps {
  versions: PageVersion[];
  onSelectVersion?: (versionId: string) => void;
  onViewHistory?: () => void;
  onRestoreVersion?: (versionId: string) => void;
}

export function PageVersionsDropdown({
  versions,
  onSelectVersion,
  onViewHistory,
  onRestoreVersion,
}: PageVersionsDropdownProps) {
  const styles = useStyles();

  const formatTimestamp = (date: Date) => {
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

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          icon={<History24Regular />}
          title="Version History"
        >
          Versions
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem
            icon={<Clock24Regular />}
            onClick={onViewHistory}
          >
            View Full History
          </MenuItem>
          <MenuDivider />
          {versions.slice(0, 5).map((version) => (
            <Menu key={version.id}>
              <MenuTrigger disableButtonEnhancement>
                <MenuItem>
                  <div className={styles.versionItem}>
                    <div className={version.isCurrent ? styles.currentVersion : styles.versionTitle}>
                      {version.description || 'Untitled Version'}
                      {version.isCurrent && ' (Current)'}
                    </div>
                    <div className={styles.versionMeta}>
                      {version.author} • {formatTimestamp(version.timestamp)}
                    </div>
                  </div>
                </MenuItem>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    icon={<Eye24Regular />}
                    onClick={() => onSelectVersion?.(version.id)}
                  >
                    View This Version
                  </MenuItem>
                  {!version.isCurrent && (
                    <MenuItem
                      icon={<ArrowUndo24Regular />}
                      onClick={() => onRestoreVersion?.(version.id)}
                    >
                      Restore This Version
                    </MenuItem>
                  )}
                </MenuList>
              </MenuPopover>
            </Menu>
          ))}
          {versions.length > 5 && (
            <>
              <MenuDivider />
              <MenuItem onClick={onViewHistory}>
                View All {versions.length} Versions...
              </MenuItem>
            </>
          )}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
