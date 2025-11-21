import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import { Link24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  popoverSurface: {
    padding: '16px',
    minWidth: '300px',
  },
  suggestionsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: '200px',
    overflowY: 'auto',
  },
  suggestionItem: {
    padding: '8px',
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusSmall,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  wikiLink: {
    color: tokens.colorBrandForeground1,
    textDecoration: 'none',
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline',
    },
  },
});

interface Page {
  id: number;
  title: string;
}

interface WikiLinkInputProps {
  pages: Page[];
  onCreateLink?: (pageId: number, pageTitle: string) => void;
}

export function WikiLinkInput({ pages, onCreateLink }: WikiLinkInputProps) {
  const styles = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPage = (page: Page) => {
    if (onCreateLink) {
      onCreateLink(page.id, page.title);
    }
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <Popover open={isOpen} onOpenChange={(_, data) => setIsOpen(data.open)}>
        <PopoverTrigger disableButtonEnhancement>
          <Button appearance="subtle" icon={<Link24Regular />}>
            Link to Page
          </Button>
        </PopoverTrigger>
        <PopoverSurface className={styles.popoverSurface}>
          <div style={{ marginBottom: '12px', fontWeight: tokens.fontWeightSemibold }}>
            Link to another page
          </div>
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(_, data) => setSearchQuery(data.value)}
            style={{ marginBottom: '12px' }}
          />
          {filteredPages.length > 0 ? (
            <ul className={styles.suggestionsList}>
              {filteredPages.map((page) => (
                <li
                  key={page.id}
                  className={styles.suggestionItem}
                  onClick={() => handleSelectPage(page)}
                >
                  {page.title}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ padding: '16px', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>
              {searchQuery ? 'No pages found' : 'Start typing to search pages'}
            </div>
          )}
        </PopoverSurface>
      </Popover>
    </div>
  );
}

export function WikiLink({ pageTitle, onNavigate }: { pageTitle: string; onNavigate?: () => void }) {
  const styles = useStyles();
  
  return (
    <span className={styles.wikiLink} onClick={onNavigate}>
      [[{pageTitle}]]
    </span>
  );
}
