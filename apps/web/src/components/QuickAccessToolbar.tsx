import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  Save24Regular,
  Print24Regular,
  ArrowUndo24Regular,
  ArrowRedo24Regular,
  Share24Regular,
  MoreHorizontal24Regular,
  Mail24Regular,
  Copy24Regular,
  Star24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  button: {
    minWidth: '32px',
  },
  favoriteButton: {
    color: tokens.colorPaletteYellowForeground2,
  },
});

interface QuickAccessToolbarProps {
  onAction?: (action: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isFavorite?: boolean;
}

export function QuickAccessToolbar({
  onAction,
  canUndo = false,
  canRedo = false,
  isFavorite = false,
}: QuickAccessToolbarProps) {
  const styles = useStyles();
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavoriteToggle = () => {
    setFavorite(!favorite);
    onAction?.('favorite');
  };

  return (
    <div className={styles.toolbar}>
      <Button
        appearance="subtle"
        size="small"
        icon={<Save24Regular />}
        className={styles.button}
        onClick={() => onAction?.('save')}
        title="Save (Ctrl+S)"
      />
      <Button
        appearance="subtle"
        size="small"
        icon={<ArrowUndo24Regular />}
        className={styles.button}
        onClick={() => onAction?.('undo')}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      />
      <Button
        appearance="subtle"
        size="small"
        icon={<ArrowRedo24Regular />}
        className={styles.button}
        onClick={() => onAction?.('redo')}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      />
      <Button
        appearance="subtle"
        size="small"
        icon={<Star24Regular />}
        className={`${styles.button} ${favorite ? styles.favoriteButton : ''}`}
        onClick={handleFavoriteToggle}
        title="Add to Favorites"
      />
      <Button
        appearance="subtle"
        size="small"
        icon={<Share24Regular />}
        className={styles.button}
        onClick={() => onAction?.('share')}
        title="Share"
      />
      <Button
        appearance="subtle"
        size="small"
        icon={<Print24Regular />}
        className={styles.button}
        onClick={() => onAction?.('print')}
        title="Print (Ctrl+P)"
      />

      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            size="small"
            icon={<MoreHorizontal24Regular />}
            className={styles.button}
            title="More Actions"
          />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem
              icon={<Mail24Regular />}
              onClick={() => onAction?.('email')}
            >
              Email Page
            </MenuItem>
            <MenuItem
              icon={<Copy24Regular />}
              onClick={() => onAction?.('copy')}
            >
              Copy Link
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
}
