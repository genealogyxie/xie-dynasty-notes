import {
  makeStyles,
  tokens,
  Button,
  Badge,
} from '@fluentui/react-components';
import {
  CheckboxChecked24Regular,
  Delete24Regular,
  ArrowMove24Regular,
  Copy24Regular,
  Tag24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow8,
  },
  selectedCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginLeft: 'auto',
  },
});

interface BulkOperationsPanelProps {
  selectedCount: number;
  onMove?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  onAddTags?: () => void;
  onClearSelection?: () => void;
}

export function BulkOperationsPanel({
  selectedCount,
  onMove,
  onCopy,
  onDelete,
  onAddTags,
  onClearSelection,
}: BulkOperationsPanelProps) {
  const styles = useStyles();

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.selectedCount}>
        <CheckboxChecked24Regular />
        <span>{selectedCount} selected</span>
        <Badge appearance="filled" color="brand">
          {selectedCount}
        </Badge>
      </div>

      <div className={styles.actions}>
        <Button
          appearance="subtle"
          icon={<ArrowMove24Regular />}
          onClick={onMove}
        >
          Move
        </Button>
        <Button
          appearance="subtle"
          icon={<Copy24Regular />}
          onClick={onCopy}
        >
          Copy
        </Button>
        <Button
          appearance="subtle"
          icon={<Tag24Regular />}
          onClick={onAddTags}
        >
          Add Tags
        </Button>
        <Button
          appearance="subtle"
          icon={<Delete24Regular />}
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button
          appearance="subtle"
          icon={<Dismiss24Regular />}
          onClick={onClearSelection}
          title="Clear selection"
        />
      </div>
    </div>
  );
}
