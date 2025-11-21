import {
  makeStyles,
  tokens,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  TextBold24Regular,
  TextItalic24Regular,
  TextUnderline24Regular,
  TextStrikethrough24Regular,
  TextAlignLeft24Regular,
  TextAlignCenter24Regular,
  TextAlignRight24Regular,
  TextBulletList24Regular,
  TextNumberListLtr24Regular,
  TextIndentIncrease24Regular,
  TextIndentDecrease24Regular,
  Link24Regular,
  Image24Regular,
  Table24Regular,
  Code24Regular,
  ChevronDown24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  toolbar: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: '8px',
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  buttonGroup: {
    display: 'flex',
    gap: '2px',
  },
});

interface FormattingToolbarProps {
  onFormat?: (format: string, value?: string) => void;
}

export function FormattingToolbar({ onFormat }: FormattingToolbarProps) {
  const styles = useStyles();

  const headingOptions = [
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
    { label: 'Heading 4', value: 'h4' },
    { label: 'Heading 5', value: 'h5' },
    { label: 'Heading 6', value: 'h6' },
    { label: 'Normal', value: 'p' },
  ];

  const fontSizeOptions = [
    { label: '8pt', value: '8' },
    { label: '10pt', value: '10' },
    { label: '12pt', value: '12' },
    { label: '14pt', value: '14' },
    { label: '16pt', value: '16' },
    { label: '18pt', value: '18' },
    { label: '24pt', value: '24' },
    { label: '36pt', value: '36' },
  ];

  return (
    <Toolbar className={styles.toolbar}>
      {/* Heading dropdown */}
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <ToolbarButton appearance="subtle">
            Heading <ChevronDown24Regular />
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {headingOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => onFormat?.('heading', option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>

      {/* Font size dropdown */}
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <ToolbarButton appearance="subtle">
            Size <ChevronDown24Regular />
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {fontSizeOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => onFormat?.('fontSize', option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>

      <ToolbarDivider />

      {/* Text formatting */}
      <div className={styles.buttonGroup}>
        <ToolbarButton
          appearance="subtle"
          icon={<TextBold24Regular />}
          onClick={() => onFormat?.('bold')}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          appearance="subtle"
          icon={<TextItalic24Regular />}
          onClick={() => onFormat?.('italic')}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          appearance="subtle"
          icon={<TextUnderline24Regular />}
          onClick={() => onFormat?.('underline')}
          title="Underline (Ctrl+U)"
        />
        <ToolbarButton
          appearance="subtle"
          icon={<TextStrikethrough24Regular />}
          onClick={() => onFormat?.('strikethrough')}
          title="Strikethrough"
        />
      </div>

      <ToolbarDivider />

      {/* Alignment */}
      <div className={styles.buttonGroup}>
        <ToolbarButton
          appearance="subtle"
          icon={<TextAlignLeft24Regular />}
          onClick={() => onFormat?.('align', 'left')}
          title="Align Left"
        />
        <ToolbarButton
          appearance="subtle"
          icon={<TextAlignCenter24Regular />}
          onClick={() => onFormat?.('align', 'center')}
          title="Align Center"
        />
        <ToolbarButton
          appearance="subtle"
          icon={<TextAlignRight24Regular />}
          onClick={() => onFormat?.('align', 'right')}
          title="Align Right"
        />
      </div>

      <ToolbarDivider />

      {/* Lists */}
      <div className={styles.buttonGroup}>
        <ToolbarButton
          appearance="subtle"
          icon={<TextBulletList24Regular />}
          onClick={() => onFormat?.('bulletList')}
          title="Bullet List"
        />
        <ToolbarButton
          appearance="subtle"
          icon={<TextNumberListLtr24Regular />}
          onClick={() => onFormat?.('orderedList')}
          title="Numbered List"
        />
      </div>

      <ToolbarDivider />

      {/* Indentation */}
      <div className={styles.buttonGroup}>
        <ToolbarButton
          appearance="subtle"
          icon={<TextIndentDecrease24Regular />}
          onClick={() => onFormat?.('outdent')}
          title="Decrease Indent"
        />
        <ToolbarButton
          appearance="subtle"
          icon={<TextIndentIncrease24Regular />}
          onClick={() => onFormat?.('indent')}
          title="Increase Indent"
        />
      </div>

      <ToolbarDivider />

      {/* Insert */}
      <div className={styles.buttonGroup}>
        <ToolbarButton
          appearance="subtle"
          icon={<Link24Regular />}
          onClick={() => onFormat?.('link')}
          title="Insert Link (Ctrl+K)"
        />
        <ToolbarButton
          appearance="subtle"
          icon={<Image24Regular />}
          onClick={() => onFormat?.('image')}
          title="Insert Image"
        />
        <ToolbarButton
          appearance="subtle"
          icon={<Table24Regular />}
          onClick={() => onFormat?.('table')}
          title="Insert Table"
        />
        <ToolbarButton
          appearance="subtle"
          icon={<Code24Regular />}
          onClick={() => onFormat?.('code')}
          title="Insert Code Block"
        />
      </div>
    </Toolbar>
  );
}
