import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Checkbox,
  Field,
  Input,
} from '@fluentui/react-components';
import {
  Filter24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  dateRange: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },
});

interface SearchFiltersProps {
  onApplyFilters?: (filters: SearchFilterOptions) => void;
  onClearFilters?: () => void;
}

export interface SearchFilterOptions {
  notebooks: string[];
  contentTypes: string[];
  authors: string[];
  dateRange: {
    from?: string;
    to?: string;
  };
}

export function SearchFilters({ onApplyFilters, onClearFilters }: SearchFiltersProps) {
  const styles = useStyles();
  const [selectedNotebooks, setSelectedNotebooks] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const notebooks = ['Personal', 'Work', 'Projects', 'Archive'];
  const contentTypes = ['Pages', 'Images', 'PDFs', 'Audio', 'Tables'];
  const authors = ['Me', 'John Doe', 'Jane Smith', 'Team'];

  const handleNotebookToggle = (notebook: string) => {
    setSelectedNotebooks((prev) =>
      prev.includes(notebook)
        ? prev.filter((n) => n !== notebook)
        : [...prev, notebook]
    );
  };

  const handleContentTypeToggle = (type: string) => {
    setSelectedContentTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleAuthorToggle = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    );
  };

  const handleApply = () => {
    onApplyFilters?.({
      notebooks: selectedNotebooks,
      contentTypes: selectedContentTypes,
      authors: selectedAuthors,
      dateRange: {
        from: dateFrom || undefined,
        to: dateTo || undefined,
      },
    });
  };

  const handleClear = () => {
    setSelectedNotebooks([]);
    setSelectedContentTypes([]);
    setSelectedAuthors([]);
    setDateFrom('');
    setDateTo('');
    onClearFilters?.();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Filter24Regular />
          <span>Search Filters</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Notebooks</div>
        <div className={styles.checkboxGroup}>
          {notebooks.map((notebook) => (
            <Checkbox
              key={notebook}
              label={notebook}
              checked={selectedNotebooks.includes(notebook)}
              onChange={() => handleNotebookToggle(notebook)}
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Content Type</div>
        <div className={styles.checkboxGroup}>
          {contentTypes.map((type) => (
            <Checkbox
              key={type}
              label={type}
              checked={selectedContentTypes.includes(type)}
              onChange={() => handleContentTypeToggle(type)}
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Author</div>
        <div className={styles.checkboxGroup}>
          {authors.map((author) => (
            <Checkbox
              key={author}
              label={author}
              checked={selectedAuthors.includes(author)}
              onChange={() => handleAuthorToggle(author)}
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Date Range</div>
        <div className={styles.dateRange}>
          <Field label="From">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </Field>
          <Field label="To">
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          appearance="subtle"
          icon={<Dismiss24Regular />}
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button
          appearance="primary"
          onClick={handleApply}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
