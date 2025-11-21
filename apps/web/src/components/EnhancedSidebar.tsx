import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Input,
} from '@fluentui/react-components';
import {
  Notebook24Regular,
  Notebook24Filled,
  Document24Regular,
  Document24Filled,
  Folder24Regular,
  Folder24Filled,
  ChevronRight24Regular,
  ChevronDown24Regular,
  Add24Regular,
  Search24Regular,
  bundleIcon,
} from '@fluentui/react-icons';

const NotebookIcon = bundleIcon(Notebook24Filled, Notebook24Regular);
const DocumentIcon = bundleIcon(Document24Filled, Document24Regular);
const FolderIcon = bundleIcon(Folder24Filled, Folder24Regular);

const useStyles = makeStyles({
  container: {
    width: '280px',
    height: '100%',
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  searchBox: {
    marginBottom: '12px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  treeContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px',
  },
  treeItem: {
    paddingLeft: '8px',
  },
  notebookItem: {
    fontWeight: tokens.fontWeightSemibold,
  },
  sectionItem: {
    paddingLeft: '24px',
  },
  pageItem: {
    paddingLeft: '48px',
  },
  colorIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '8px',
  },
});

interface Page {
  id: number;
  title: string;
}

interface Section {
  id: number;
  name: string;
  pages: Page[];
}

interface Notebook {
  id: number;
  name: string;
  color?: string;
  sections: Section[];
}

interface EnhancedSidebarProps {
  notebooks: Notebook[];
  onSelectPage?: (notebookId: number, sectionId: number, pageId: number) => void;
  onAddNotebook?: () => void;
  onAddSection?: (notebookId: number) => void;
  onAddPage?: (notebookId: number, sectionId: number) => void;
}

export function EnhancedSidebar({
  notebooks,
  onSelectPage,
  onAddNotebook,
  onAddSection,
  onAddPage,
}: EnhancedSidebarProps) {
  const styles = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNotebooks, setExpandedNotebooks] = useState<Set<number>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const toggleNotebook = (notebookId: number) => {
    const newExpanded = new Set(expandedNotebooks);
    if (newExpanded.has(notebookId)) {
      newExpanded.delete(notebookId);
    } else {
      newExpanded.add(notebookId);
    }
    setExpandedNotebooks(newExpanded);
  };

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const filteredNotebooks = notebooks.map(notebook => ({
    ...notebook,
    sections: notebook.sections.map(section => ({
      ...section,
      pages: section.pages.filter(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter(section =>
      section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.pages.length > 0
    ),
  })).filter(notebook =>
    notebook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notebook.sections.length > 0
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Input
          className={styles.searchBox}
          placeholder="Search notebooks..."
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value)}
          contentBefore={<Search24Regular />}
        />
        <div className={styles.actions}>
          <Button
            appearance="primary"
            icon={<Add24Regular />}
            onClick={onAddNotebook}
            size="small"
          >
            New Notebook
          </Button>
        </div>
      </div>

      <div className={styles.treeContainer}>
        {filteredNotebooks.map((notebook) => (
          <div key={notebook.id} style={{ marginBottom: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                cursor: 'pointer',
                borderRadius: tokens.borderRadiusSmall,
              }}
              onClick={() => toggleNotebook(notebook.id)}
            >
              {expandedNotebooks.has(notebook.id) ? (
                <ChevronDown24Regular />
              ) : (
                <ChevronRight24Regular />
              )}
              {notebook.color && (
                <div
                  className={styles.colorIndicator}
                  style={{ backgroundColor: notebook.color }}
                />
              )}
              <NotebookIcon style={{ marginRight: '8px' }} />
              <span className={styles.notebookItem}>{notebook.name}</span>
              <Button
                appearance="subtle"
                icon={<Add24Regular />}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddSection) onAddSection(notebook.id);
                }}
                style={{ marginLeft: 'auto' }}
              />
            </div>

            {expandedNotebooks.has(notebook.id) && (
              <div style={{ paddingLeft: '24px' }}>
                {notebook.sections.map((section) => (
                  <div key={section.id} style={{ marginBottom: '4px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '6px',
                        cursor: 'pointer',
                        borderRadius: tokens.borderRadiusSmall,
                      }}
                      onClick={() => toggleSection(section.id)}
                    >
                      {expandedSections.has(section.id) ? (
                        <ChevronDown24Regular />
                      ) : (
                        <ChevronRight24Regular />
                      )}
                      <FolderIcon style={{ marginRight: '8px' }} />
                      <span>{section.name}</span>
                      <Button
                        appearance="subtle"
                        icon={<Add24Regular />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAddPage) onAddPage(notebook.id, section.id);
                        }}
                        style={{ marginLeft: 'auto' }}
                      />
                    </div>

                    {expandedSections.has(section.id) && (
                      <div style={{ paddingLeft: '24px' }}>
                        {section.pages.map((page) => (
                          <div
                            key={page.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '6px',
                              cursor: 'pointer',
                              borderRadius: tokens.borderRadiusSmall,
                            }}
                            onClick={() => {
                              if (onSelectPage) {
                                onSelectPage(notebook.id, section.id, page.id);
                              }
                            }}
                          >
                            <DocumentIcon style={{ marginRight: '8px' }} />
                            <span>{page.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
