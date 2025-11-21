import { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  tokens,
  Button,
} from '@fluentui/react-components';
import {
  TextBold24Regular,
  TextItalic24Regular,
  TextUnderline24Regular,
  TextStrikethrough24Regular,
  Link24Regular,
  Highlight24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  toolbar: {
    position: 'fixed',
    display: 'flex',
    gap: '4px',
    padding: '8px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow16,
    zIndex: 1000,
  },
  button: {
    minWidth: '32px',
  },
});

interface SelectionToolbarProps {
  onFormat?: (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'link' | 'highlight') => void;
}

export function SelectionToolbar({ onFormat }: SelectionToolbarProps) {
  const styles = useStyles();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const toolbarHeight = 48;
      const top = rect.top + window.scrollY - toolbarHeight - 8;
      const left = rect.left + window.scrollX + (rect.width / 2);

      setPosition({ top, left });
      setVisible(true);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={toolbarRef}
      className={styles.toolbar}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <Button
        appearance="subtle"
        size="small"
        icon={<TextBold24Regular />}
        className={styles.button}
        onClick={() => onFormat?.('bold')}
        title="Bold"
      />
      <Button
        appearance="subtle"
        size="small"
        icon={<TextItalic24Regular />}
        className={styles.button}
        onClick={() => onFormat?.('italic')}
        title="Italic"
      />
      <Button
        appearance="subtle"
        size="small"
        icon={<TextUnderline24Regular />}
        className={styles.button}
        onClick={() => onFormat?.('underline')}
        title="Underline"
      />
      <Button
        appearance="subtle"
        size="small"
        icon={<TextStrikethrough24Regular />}
        className={styles.button}
        onClick={() => onFormat?.('strikethrough')}
        title="Strikethrough"
      />
      <Button
        appearance="subtle"
        size="small"
        icon={<Link24Regular />}
        className={styles.button}
        onClick={() => onFormat?.('link')}
        title="Insert Link"
      />
      <Button
        appearance="subtle"
        size="small"
        icon={<Highlight24Regular />}
        className={styles.button}
        onClick={() => onFormat?.('highlight')}
        title="Highlight"
      />
    </div>
  );
}
