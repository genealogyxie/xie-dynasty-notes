import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
} from '@fluentui/react-components';
import {
  Notebook24Regular,
  Folder24Regular,
  Document24Regular,
  ChevronRight24Regular,
  ChevronDown24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    overflowY: 'auto',
  },
  treeItem: {
    cursor: 'pointer',
  },
  itemLayout: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  itemName: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

interface Page {
  id: string;
  name: string;
}

interface Section {
  id: string;
  name: string;
  pages: Page[];
}

interface Notebook {
  id: string;
  name: string;
  color: string;
  sections: Section[];
}

interface PageHierarchyTreeProps {
  notebooks: Notebook[];
  selectedPageId?: string;
  onSelectPage?: (pageId: string) => void;
  onSelectSection?: (sectionId: string) => void;
  onSelectNotebook?: (notebookId: string) => void;
}

export function PageHierarchyTree({
  notebooks,
  selectedPageId,
  onSelectPage,
  onSelectSection,
  onSelectNotebook,
}: PageHierarchyTreeProps) {
  const styles = useStyles();
  const [expandedNotebooks, setExpandedNotebooks] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleNotebook = (notebookId: string) => {
    const newExpanded = new Set(expandedNotebooks);
    if (newExpanded.has(notebookId)) {
      newExpanded.delete(notebookId);
    } else {
      newExpanded.add(notebookId);
    }
    setExpandedNotebooks(newExpanded);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className={styles.container}>
      {notebooks.map((notebook) => (
        <div key={notebook.id}>
          <div
            className={styles.treeItem}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
          >
            <Button
              appearance="subtle"
              size="small"
              icon={expandedNotebooks.has(notebook.id) ? <ChevronDown24Regular /> : <ChevronRight24Regular />}
              onClick={() => toggleNotebook(notebook.id)}
              style={{ minWidth: '24px', padding: '4px' }}
            />
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, cursor: 'pointer' }}
              onClick={() => onSelectNotebook?.(notebook.id)}
            >
              <Notebook24Regular style={{ color: notebook.color }} />
              <span className={styles.itemName}>{notebook.name}</span>
            </div>
          </div>

          {expandedNotebooks.has(notebook.id) && (
            <div style={{ paddingLeft: '24px' }}>
              {notebook.sections.map((section) => (
                <div key={section.id}>
                  <div
                    className={styles.treeItem}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
                  >
                    <Button
                      appearance="subtle"
                      size="small"
                      icon={expandedSections.has(section.id) ? <ChevronDown24Regular /> : <ChevronRight24Regular />}
                      onClick={() => toggleSection(section.id)}
                      style={{ minWidth: '24px', padding: '4px' }}
                    />
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, cursor: 'pointer' }}
                      onClick={() => onSelectSection?.(section.id)}
                    >
                      <Folder24Regular />
                      <span className={styles.itemName}>{section.name}</span>
                    </div>
                  </div>

                  {expandedSections.has(section.id) && (
                    <div style={{ paddingLeft: '24px' }}>
                      {section.pages.map((page) => (
                        <div
                          key={page.id}
                          className={styles.treeItem}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '4px 8px 4px 32px',
                            backgroundColor: selectedPageId === page.id ? tokens.colorBrandBackground2 : 'transparent',
                          }}
                          onClick={() => onSelectPage?.(page.id)}
                        >
                          <Document24Regular />
                          <span className={styles.itemName}>{page.name}</span>
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
  );
}
