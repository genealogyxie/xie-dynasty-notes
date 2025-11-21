import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Keyboard24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '700px',
    width: '90vw',
  },
  shortcutsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
    marginTop: '16px',
    marginBottom: '16px',
  },
  category: {
    marginBottom: '16px',
  },
  categoryTitle: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
    marginBottom: '12px',
    color: tokens.colorBrandForeground1,
  },
  shortcutsList: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px',
  },
  shortcutRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
  },
  shortcutName: {
    fontSize: tokens.fontSizeBase300,
  },
  shortcutKeys: {
    display: 'flex',
    gap: '4px',
  },
  key: {
    padding: '4px 8px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: tokens.fontSizeBase200,
    fontFamily: 'monospace',
    fontWeight: tokens.fontWeightSemibold,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
});

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: 'Navigation',
    items: [
      { name: 'Command Palette', keys: ['Ctrl', 'K'] },
      { name: 'Global Search', keys: ['Ctrl', 'Shift', 'F'] },
      { name: 'Go to Home', keys: ['Ctrl', 'H'] },
      { name: 'Switch Workspace', keys: ['Ctrl', 'W'] },
    ],
  },
  {
    category: 'Editing',
    items: [
      { name: 'Bold', keys: ['Ctrl', 'B'] },
      { name: 'Italic', keys: ['Ctrl', 'I'] },
      { name: 'Underline', keys: ['Ctrl', 'U'] },
      { name: 'Strikethrough', keys: ['Ctrl', 'Shift', 'X'] },
      { name: 'Insert Link', keys: ['Ctrl', 'K'] },
      { name: 'Insert Code Block', keys: ['Ctrl', 'Shift', 'C'] },
      { name: 'Undo', keys: ['Ctrl', 'Z'] },
      { name: 'Redo', keys: ['Ctrl', 'Y'] },
    ],
  },
  {
    category: 'Formatting',
    items: [
      { name: 'Heading 1', keys: ['Ctrl', 'Alt', '1'] },
      { name: 'Heading 2', keys: ['Ctrl', 'Alt', '2'] },
      { name: 'Heading 3', keys: ['Ctrl', 'Alt', '3'] },
      { name: 'Bullet List', keys: ['Ctrl', 'Shift', '8'] },
      { name: 'Numbered List', keys: ['Ctrl', 'Shift', '7'] },
      { name: 'Blockquote', keys: ['Ctrl', 'Shift', 'B'] },
    ],
  },
  {
    category: 'Page Management',
    items: [
      { name: 'New Page', keys: ['Ctrl', 'N'] },
      { name: 'Save Page', keys: ['Ctrl', 'S'] },
      { name: 'Delete Page', keys: ['Ctrl', 'D'] },
      { name: 'Version History', keys: ['Ctrl', 'Shift', 'H'] },
      { name: 'Export Page', keys: ['Ctrl', 'E'] },
      { name: 'Import Content', keys: ['Ctrl', 'Shift', 'I'] },
    ],
  },
  {
    category: 'View',
    items: [
      { name: 'Toggle Sidebar', keys: ['Ctrl', '\\'] },
      { name: 'Toggle Theme', keys: ['Ctrl', 'Shift', 'T'] },
      { name: 'Zoom In', keys: ['Ctrl', '+'] },
      { name: 'Zoom Out', keys: ['Ctrl', '-'] },
      { name: 'Reset Zoom', keys: ['Ctrl', '0'] },
    ],
  },
  {
    category: 'Special Features',
    items: [
      { name: 'Insert Table', keys: ['Ctrl', 'Shift', 'T'] },
      { name: 'Insert Math Equation', keys: ['Ctrl', 'Shift', 'M'] },
      { name: 'Insert Symbol', keys: ['Ctrl', 'Shift', 'S'] },
      { name: 'Record Audio', keys: ['Ctrl', 'Shift', 'A'] },
      { name: 'Embed Content', keys: ['Ctrl', 'Shift', 'E'] },
    ],
  },
];

export function KeyboardShortcutsHelp({ open, onClose }: KeyboardShortcutsHelpProps) {
  const styles = useStyles();

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Keyboard24Regular />
              Keyboard Shortcuts
            </div>
          </DialogTitle>

          <div className={styles.shortcutsGrid}>
            {shortcuts.map((category, idx) => (
              <div key={idx} className={styles.category}>
                <div className={styles.categoryTitle}>{category.category}</div>
                <div className={styles.shortcutsList}>
                  {category.items.map((shortcut, itemIdx) => (
                    <div key={itemIdx} className={styles.shortcutRow}>
                      <span className={styles.shortcutName}>{shortcut.name}</span>
                      <div className={styles.shortcutKeys}>
                        {shortcut.keys.map((key, keyIdx) => (
                          <span key={keyIdx}>
                            <span className={styles.key}>{key}</span>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span style={{ margin: '0 4px' }}>+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
