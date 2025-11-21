import {
  makeStyles,
  tokens,
  Tab,
  TabList,
} from '@fluentui/react-components';
import { FormattingToolbar } from './FormattingToolbar';
import { DrawingToolsPanel } from './DrawingToolsPanel';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  tabList: {
    padding: '0 16px',
  },
  toolbarContainer: {
    padding: '8px 16px',
  },
});

interface ContextualRibbonProps {
  activeTab?: 'home' | 'insert' | 'draw' | 'view';
  onTabChange?: (tab: 'home' | 'insert' | 'draw' | 'view') => void;
  onFormat?: (format: string, value?: string) => void;
  onDrawingAction?: (action: string, value?: string) => void;
}

export function ContextualRibbon({
  activeTab = 'home',
  onTabChange,
  onFormat,
  onDrawingAction,
}: ContextualRibbonProps) {
  const styles = useStyles();

  const renderToolbar = () => {
    switch (activeTab) {
      case 'home':
      case 'insert':
        return <FormattingToolbar onFormat={onFormat} />;
      case 'draw':
        return (
          <DrawingToolsPanel
            onToolChange={(tool) => onDrawingAction?.('tool', tool)}
            onColorChange={(color) => onDrawingAction?.('color', color)}
            onSizeChange={(size: number) => onDrawingAction?.('brushSize', size.toString())}
          />
        );
      case 'view':
        return null; // View tab doesn't have a toolbar
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <TabList
        className={styles.tabList}
        selectedValue={activeTab}
        onTabSelect={(_, data) => onTabChange?.(data.value as 'home' | 'insert' | 'draw' | 'view')}
      >
        <Tab value="home">Home</Tab>
        <Tab value="insert">Insert</Tab>
        <Tab value="draw">Draw</Tab>
        <Tab value="view">View</Tab>
      </TabList>
      <div className={styles.toolbarContainer}>
        {renderToolbar()}
      </div>
    </div>
  );
}
