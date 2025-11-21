import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Field,
  Input,
  Dropdown,
  Option,
  Checkbox,
} from '@fluentui/react-components';
import {
  Copy24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '400px',
  },
  info: {
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
});

interface PageCopyDialogProps {
  open: boolean;
  pageName: string;
  currentNotebook: string;
  currentSection: string;
  notebooks: Array<{ id: string; name: string }>;
  sections: Array<{ id: string; name: string; notebookId: string }>;
  onClose?: () => void;
  onCopy?: (
    notebookId: string,
    sectionId: string,
    newName: string,
    options: { includeAttachments: boolean; includeSubpages: boolean }
  ) => void;
}

export function PageCopyDialog({
  open,
  pageName,
  currentNotebook,
  currentSection,
  notebooks,
  sections,
  onClose,
  onCopy,
}: PageCopyDialogProps) {
  const styles = useStyles();
  const [newName, setNewName] = useState(`${pageName} (Copy)`);
  const [selectedNotebook, setSelectedNotebook] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [includeSubpages, setIncludeSubpages] = useState(true);

  const availableSections = sections.filter(
    (s) => s.notebookId === selectedNotebook
  );

  const handleCopy = () => {
    if (selectedNotebook && selectedSection && newName.trim()) {
      onCopy?.(selectedNotebook, selectedSection, newName.trim(), {
        includeAttachments,
        includeSubpages,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setNewName(`${pageName} (Copy)`);
    setSelectedNotebook('');
    setSelectedSection('');
    setIncludeAttachments(true);
    setIncludeSubpages(true);
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && handleClose()}>
      <DialogSurface>
        <DialogTitle
          action={
            <Button
              appearance="subtle"
              icon={<Dismiss24Regular />}
              onClick={handleClose}
            />
          }
        >
          <Copy24Regular style={{ marginRight: '8px' }} />
          Copy Page
        </DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <div className={styles.info}>
              Copying page: <strong>{pageName}</strong>
              <br />
              From: {currentNotebook} / {currentSection}
            </div>

            <Field label="New Page Name" required>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new page name"
              />
            </Field>

            <Field label="Destination Notebook" required>
              <Dropdown
                placeholder="Select notebook"
                value={notebooks.find((n) => n.id === selectedNotebook)?.name}
                selectedOptions={selectedNotebook ? [selectedNotebook] : []}
                onOptionSelect={(_, data) => {
                  setSelectedNotebook(data.optionValue as string);
                  setSelectedSection('');
                }}
              >
                {notebooks.map((notebook) => (
                  <Option key={notebook.id} value={notebook.id}>
                    {notebook.name}
                  </Option>
                ))}
              </Dropdown>
            </Field>

            <Field label="Destination Section" required>
              <Dropdown
                placeholder="Select section"
                value={sections.find((s) => s.id === selectedSection)?.name}
                selectedOptions={selectedSection ? [selectedSection] : []}
                onOptionSelect={(_, data) => setSelectedSection(data.optionValue as string)}
                disabled={!selectedNotebook || availableSections.length === 0}
              >
                {availableSections.map((section) => (
                  <Option key={section.id} value={section.id}>
                    {section.name}
                  </Option>
                ))}
              </Dropdown>
            </Field>

            <div className={styles.options}>
              <Checkbox
                label="Include attachments"
                checked={includeAttachments}
                onChange={(_, data) => setIncludeAttachments(data.checked as boolean)}
              />
              <Checkbox
                label="Include subpages"
                checked={includeSubpages}
                onChange={(_, data) => setIncludeSubpages(data.checked as boolean)}
              />
            </div>
          </DialogContent>
        </DialogBody>
        <DialogActions>
          <Button appearance="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleCopy}
            disabled={!selectedNotebook || !selectedSection || !newName.trim()}
          >
            Copy Page
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
