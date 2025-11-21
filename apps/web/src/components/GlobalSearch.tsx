import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Search24Regular } from '@fluentui/react-icons';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  Input,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '700px',
    width: '90vw',
  },
  input: {
    width: '100%',
  },
  resultsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '500px',
    overflowY: 'auto',
  },
  resultItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusMedium,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  resultTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  resultSnippet: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginBottom: '4px',
  },
  resultPath: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  highlight: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface SearchResult {
  id: number;
  type: 'page' | 'notebook' | 'section';
  title: string;
  snippet: string;
  path: string;
  score: number;
}

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { pages, notebooks, sections, setCurrentPage } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    pages.forEach((page) => {
      const titleMatch = page.title.toLowerCase().includes(lowerQuery);
      if (titleMatch) {
        const section = sections.find((s) => s.id === page.section_id);
        const notebook = section ? notebooks.find((n) => n.id === section.notebook_id) : null;
        
        searchResults.push({
          id: page.id,
          type: 'page',
          title: page.title,
          snippet: `Page content matches "${query}"`,
          path: `${notebook?.name || 'Unknown'} > ${section?.name || 'Unknown'} > ${page.title}`,
          score: titleMatch ? 10 : 5,
        });
      }
    });

    notebooks.forEach((notebook) => {
      if (notebook.name.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: notebook.id,
          type: 'notebook',
          title: notebook.name,
          snippet: 'Notebook',
          path: notebook.name,
          score: 8,
        });
      }
    });

    sections.forEach((section) => {
      if (section.name.toLowerCase().includes(lowerQuery)) {
        const notebook = notebooks.find((n) => n.id === section.notebook_id);
        searchResults.push({
          id: section.id,
          type: 'section',
          title: section.name,
          snippet: 'Section',
          path: `${notebook?.name || 'Unknown'} > ${section.name}`,
          score: 7,
        });
      }
    });

    searchResults.sort((a, b) => b.score - a.score);
    setResults(searchResults.slice(0, 50));
    setSelectedIndex(0);
  }, [query, pages, notebooks, sections]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (result: SearchResult) => {
    if (result.type === 'page') {
      const page = pages.find((p) => p.id === result.id);
      if (page) {
        setCurrentPage(page);
        navigate('/');
      }
    }
    onClose();
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className={styles.highlight}>{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Search24Regular />
            <Input
              className={styles.input}
              placeholder="Search everything..."
              value={query}
              onChange={(_, data) => setQuery(data.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          
          {query && (
            <div style={{ marginBottom: '8px', fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
              {results.length} results found
            </div>
          )}

          <ul className={styles.resultsList}>
            {results.map((result, index) => (
              <li
                key={`${result.type}-${result.id}`}
                className={styles.resultItem}
                style={{
                  backgroundColor: index === selectedIndex ? tokens.colorNeutralBackground1Selected : undefined,
                }}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className={styles.resultTitle}>
                  {highlightText(result.title, query)}
                </div>
                <div className={styles.resultSnippet}>
                  {result.snippet}
                </div>
                <div className={styles.resultPath}>
                  {result.path}
                </div>
              </li>
            ))}
            {results.length === 0 && query && (
              <li className={styles.resultItem}>
                No results found for "{query}"
              </li>
            )}
          </ul>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
