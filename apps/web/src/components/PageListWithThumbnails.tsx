import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  Document24Regular,
  MoreVertical24Regular,
  Star24Regular,
  Delete24Regular,
  Share24Regular,
  Copy24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    overflowY: 'auto',
  },
  viewToggle: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  },
  gridView: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  listView: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  pageCard: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  thumbnail: {
    width: '100%',
    height: '120px',
    backgroundColor: tokens.colorNeutralBackground3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: `${tokens.borderRadiusMedium} ${tokens.borderRadiusMedium} 0 0`,
    overflow: 'hidden',
  },
  thumbnailIcon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground3,
  },
  cardContent: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  pageTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  pageMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  listThumbnail: {
    width: '60px',
    height: '60px',
    backgroundColor: tokens.colorNeutralBackground3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.borderRadiusMedium,
    flexShrink: 0,
  },
  listContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
  },
});

interface Page {
  id: string;
  title: string;
  modifiedAt: Date;
  thumbnail?: string;
  preview?: string;
}

interface PageListWithThumbnailsProps {
  pages: Page[];
  viewMode?: 'grid' | 'list';
  onPageClick?: (pageId: string) => void;
  onPageAction?: (pageId: string, action: 'favorite' | 'delete' | 'share' | 'copy') => void;
}

export function PageListWithThumbnails({
  pages,
  viewMode: initialViewMode = 'grid',
  onPageClick,
  onPageAction,
}: PageListWithThumbnailsProps) {
  const styles = useStyles();
  const [viewMode, setViewMode] = useState(initialViewMode);

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
    });
  };

  const renderGridView = () => (
    <div className={styles.gridView}>
      {pages.map((page) => (
        <Card key={page.id} className={styles.pageCard}>
          <div onClick={() => onPageClick?.(page.id)}>
            <div className={styles.thumbnail}>
              {page.thumbnail ? (
                <img src={page.thumbnail} alt={page.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Document24Regular className={styles.thumbnailIcon} />
              )}
            </div>
            <div className={styles.cardContent}>
              <div className={styles.pageTitle}>{page.title}</div>
              <div className={styles.pageMeta}>
                <span>{formatDate(page.modifiedAt)}</span>
              </div>
            </div>
          </div>
          <div className={styles.pageActions} style={{ padding: '0 12px 12px' }}>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<MoreVertical24Regular />}
                  onClick={(e) => e.stopPropagation()}
                />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    icon={<Star24Regular />}
                    onClick={() => onPageAction?.(page.id, 'favorite')}
                  >
                    Add to Favorites
                  </MenuItem>
                  <MenuItem
                    icon={<Share24Regular />}
                    onClick={() => onPageAction?.(page.id, 'share')}
                  >
                    Share
                  </MenuItem>
                  <MenuItem
                    icon={<Copy24Regular />}
                    onClick={() => onPageAction?.(page.id, 'copy')}
                  >
                    Copy Link
                  </MenuItem>
                  <MenuItem
                    icon={<Delete24Regular />}
                    onClick={() => onPageAction?.(page.id, 'delete')}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className={styles.listView}>
      {pages.map((page) => (
        <Card key={page.id} className={styles.listItem} onClick={() => onPageClick?.(page.id)}>
          <div className={styles.listThumbnail}>
            {page.thumbnail ? (
              <img src={page.thumbnail} alt={page.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Document24Regular />
            )}
          </div>
          <div className={styles.listContent}>
            <div className={styles.pageTitle}>{page.title}</div>
            <div className={styles.pageMeta}>
              <span>Modified {formatDate(page.modifiedAt)}</span>
            </div>
            {page.preview && (
              <div style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {page.preview}
              </div>
            )}
          </div>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              <Button
                appearance="subtle"
                size="small"
                icon={<MoreVertical24Regular />}
                onClick={(e) => e.stopPropagation()}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem
                  icon={<Star24Regular />}
                  onClick={() => onPageAction?.(page.id, 'favorite')}
                >
                  Add to Favorites
                </MenuItem>
                <MenuItem
                  icon={<Share24Regular />}
                  onClick={() => onPageAction?.(page.id, 'share')}
                >
                  Share
                </MenuItem>
                <MenuItem
                  icon={<Copy24Regular />}
                  onClick={() => onPageAction?.(page.id, 'copy')}
                >
                  Copy Link
                </MenuItem>
                <MenuItem
                  icon={<Delete24Regular />}
                  onClick={() => onPageAction?.(page.id, 'delete')}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </Card>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.viewToggle}>
        <Button
          appearance={viewMode === 'grid' ? 'primary' : 'subtle'}
          size="small"
          onClick={() => setViewMode('grid')}
        >
          Grid
        </Button>
        <Button
          appearance={viewMode === 'list' ? 'primary' : 'subtle'}
          size="small"
          onClick={() => setViewMode('list')}
        >
          List
        </Button>
      </div>
      {viewMode === 'grid' ? renderGridView() : renderListView()}
    </div>
  );
}
