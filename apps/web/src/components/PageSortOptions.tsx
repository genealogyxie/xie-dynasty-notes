import {
  makeStyles,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Button,
} from '@fluentui/react-components';
import {
  ArrowSort24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  trigger: {
    minWidth: '120px',
  },
});

export type SortField = 'title' | 'modified' | 'created' | 'author';
export type SortOrder = 'asc' | 'desc';

interface PageSortOptionsProps {
  sortField?: SortField;
  sortOrder?: SortOrder;
  onSortChange?: (field: SortField, order: SortOrder) => void;
}

export function PageSortOptions({
  sortField = 'modified',
  sortOrder = 'desc',
  onSortChange,
}: PageSortOptionsProps) {
  const styles = useStyles();

  const handleFieldChange = (field: SortField) => {
    onSortChange?.(field, sortOrder);
  };

  const handleOrderChange = (order: SortOrder) => {
    onSortChange?.(sortField, order);
  };

  const getSortLabel = () => {
    const fieldLabels: Record<SortField, string> = {
      title: 'Title',
      modified: 'Modified',
      created: 'Created',
      author: 'Author',
    };
    const orderLabel = sortOrder === 'asc' ? '↑' : '↓';
    return `${fieldLabels[sortField]} ${orderLabel}`;
  };

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          icon={<ArrowSort24Regular />}
          className={styles.trigger}
        >
          {getSortLabel()}
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuGroup>
            <MenuItem disabled>Sort by</MenuItem>
            <MenuItem onClick={() => handleFieldChange('title')}>
              {sortField === 'title' ? '✓ ' : ''}Title
            </MenuItem>
            <MenuItem onClick={() => handleFieldChange('modified')}>
              {sortField === 'modified' ? '✓ ' : ''}Date Modified
            </MenuItem>
            <MenuItem onClick={() => handleFieldChange('created')}>
              {sortField === 'created' ? '✓ ' : ''}Date Created
            </MenuItem>
            <MenuItem onClick={() => handleFieldChange('author')}>
              {sortField === 'author' ? '✓ ' : ''}Author
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup>
            <MenuItem disabled>Order</MenuItem>
            <MenuItem onClick={() => handleOrderChange('asc')}>
              {sortOrder === 'asc' ? '✓ ' : ''}Ascending
            </MenuItem>
            <MenuItem onClick={() => handleOrderChange('desc')}>
              {sortOrder === 'desc' ? '✓ ' : ''}Descending
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
