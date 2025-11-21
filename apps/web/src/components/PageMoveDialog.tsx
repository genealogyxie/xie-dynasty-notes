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
  Dropdown,
  Option,
} from '@fluentui/react-components';
import {
  ArrowMove24Regular,
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
});

interface PageMoveDialogProps {
  open: boolean;
  pageName: string;
  currentNotebook: string;
  currentSection: string;
  notebooks: Array<{ id: string; name: string }>;
  sections: Array<{ id: string; name: string; notebookId: string }>;
  onClose?: () => void;
  onMove?: (notebookId: string, sectionId: string) => void;
}

export function PageMoveDialog({
  open,
  pageName,
  currentNotebook,
  currentSection,
  notebooks,
  sections,
  onClose,
  onMove,
}: PageMoveDialogProps) {
  const styles = useStyles();
  const [selectedNotebook, setSelectedNotebook] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const availableSections = sections.filter(
    (s) => s.notebookId === selectedNotebook
  );

  const handleMove = () => {
    if (selectedNotebook && selectedSection) {
      onMove?.(selectedNotebook, selectedSection);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedNotebook('');
    setSelectedSection('');
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
          <ArrowMove24Regular style={{ marginRight: '8px' }} />
          Move Page
        </DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <div className={styles.info}>
              Moving page: <strong>{pageName}</strong>
              <br />
              From: {currentNotebook} / {currentSection}
            </div>

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
          </DialogContent>
        </DialogBody>
        <DialogActions>
          <Button appearance="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleMove}
            disabled={!selectedNotebook || !selectedSection}
          >
            Move Page
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
