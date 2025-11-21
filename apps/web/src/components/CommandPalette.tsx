import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '600px',
    width: '90vw',
  },
  input: {
    width: '100%',
  },
  resultsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '400px',
    overflowY: 'auto',
  },
  resultItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusMedium,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  resultItemSelected: {
    backgroundColor: tokens.colorNeutralBackground1Selected,
  },
  resultTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  resultPath: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
});

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { pages, notebooks, sections, setCurrentPage } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNotebooks = notebooks.filter((notebook) =>
    notebook.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(query.toLowerCase())
  );

  const allResults = [
    ...filteredPages.map((p) => ({ type: 'page', item: p })),
    ...filteredNotebooks.map((n) => ({ type: 'notebook', item: n })),
    ...filteredSections.map((s) => ({ type: 'section', item: s })),
  ];

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && allResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(allResults[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (result: any) => {
    if (result.type === 'page') {
      setCurrentPage(result.item);
      navigate('/');
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Search24Regular />
            <Input
              className={styles.input}
              placeholder="Search pages, notebooks, sections..."
              value={query}
              onChange={(_, data) => setQuery(data.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <ul className={styles.resultsList}>
            {allResults.map((result, index) => (
              <li
                key={`${result.type}-${result.item.id}`}
                className={`${styles.resultItem} ${
                  index === selectedIndex ? styles.resultItemSelected : ''
                }`}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className={styles.resultTitle}>
                  {result.type === 'page' && (result.item as any).title}
                  {result.type === 'notebook' && (result.item as any).name}
                  {result.type === 'section' && (result.item as any).name}
                </div>
                <div className={styles.resultPath}>
                  {result.type === 'page' && 'Page'}
                  {result.type === 'notebook' && 'Notebook'}
                  {result.type === 'section' && 'Section'}
                </div>
              </li>
            ))}
            {allResults.length === 0 && query && (
              <li className={styles.resultItem}>No results found</li>
            )}
          </ul>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
