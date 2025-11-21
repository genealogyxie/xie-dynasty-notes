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
  Notebook24Regular,
  ChevronDown24Regular,
  Add24Regular,
  Settings24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  trigger: {
    minWidth: '200px',
    justifyContent: 'space-between',
  },
  notebookItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  notebookColor: {
    width: '16px',
    height: '16px',
    borderRadius: tokens.borderRadiusCircular,
    flexShrink: 0,
  },
  notebookName: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

interface Notebook {
  id: string;
  name: string;
  color: string;
}

interface NotebookSelectorProps {
  notebooks: Notebook[];
  selectedNotebookId?: string;
  onSelectNotebook?: (notebookId: string) => void;
  onCreateNotebook?: () => void;
  onManageNotebooks?: () => void;
}

export function NotebookSelector({
  notebooks,
  selectedNotebookId,
  onSelectNotebook,
  onCreateNotebook,
  onManageNotebooks,
}: NotebookSelectorProps) {
  const styles = useStyles();
  const selectedNotebook = notebooks.find((n) => n.id === selectedNotebookId);

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          icon={<Notebook24Regular />}
          iconPosition="before"
          className={styles.trigger}
        >
          <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedNotebook?.name || 'Select Notebook'}
          </span>
          <ChevronDown24Regular />
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {notebooks.map((notebook) => (
            <MenuItem
              key={notebook.id}
              onClick={() => onSelectNotebook?.(notebook.id)}
            >
              <div className={styles.notebookItem}>
                <div
                  className={styles.notebookColor}
                  style={{ backgroundColor: notebook.color }}
                />
                <span className={styles.notebookName}>{notebook.name}</span>
              </div>
            </MenuItem>
          ))}
          <MenuDivider />
          <MenuItem
            icon={<Add24Regular />}
            onClick={onCreateNotebook}
          >
            Create New Notebook
          </MenuItem>
          <MenuItem
            icon={<Settings24Regular />}
            onClick={onManageNotebooks}
          >
            Manage Notebooks
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
