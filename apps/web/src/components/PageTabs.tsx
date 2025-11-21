import {
  makeStyles,
  tokens,
  Button,
} from '@fluentui/react-components';
import { Dismiss24Regular, Add24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: tokens.colorNeutralBackground2,
    padding: '4px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    overflowX: 'auto',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: tokens.borderRadiusSmall,
    cursor: 'pointer',
    fontSize: tokens.fontSizeBase300,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    minWidth: '120px',
    maxWidth: '200px',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  activeTab: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  tabTitle: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  closeButton: {
    minWidth: '20px',
    padding: '2px',
  },
  addButton: {
    minWidth: '32px',
  },
});

interface PageTab {
  id: string;
  title: string;
}

interface PageTabsProps {
  tabs: PageTab[];
  activeTabId: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onNewTab?: () => void;
}

export function PageTabs({ tabs, activeTabId, onTabChange, onTabClose, onNewTab }: PageTabsProps) {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`${styles.tab} ${activeTabId === tab.id ? styles.activeTab : ''}`}
          onClick={() => onTabChange?.(tab.id)}
        >
          <span className={styles.tabTitle}>{tab.title}</span>
          {tabs.length > 1 && (
            <Button
              appearance="subtle"
              size="small"
              icon={<Dismiss24Regular />}
              className={styles.closeButton}
              onClick={(e) => {
                e.stopPropagation();
                onTabClose?.(tab.id);
              }}
            />
          )}
        </div>
      ))}
      <Button
        appearance="subtle"
        size="small"
        icon={<Add24Regular />}
        className={styles.addButton}
        onClick={onNewTab}
        title="New Tab"
      />
    </div>
  );
}
