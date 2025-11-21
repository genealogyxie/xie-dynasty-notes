import { useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Textarea,
  Field,
  Dropdown,
  Option,
} from '@fluentui/react-components';
import {
  Save24Regular,
  Dismiss24Regular,
  DocumentAdd24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  textarea: {
    minHeight: '200px',
  },
});

interface QuickNoteCaptureDialogProps {
  open: boolean;
  onClose?: () => void;
  onSave?: (note: { title: string; content: string; notebook: string; section: string }) => void;
  notebooks?: Array<{ id: string; name: string }>;
  sections?: Array<{ id: string; name: string }>;
}

export function QuickNoteCaptureDialog({
  open,
  onClose,
  onSave,
  notebooks = [],
  sections = [],
}: QuickNoteCaptureDialogProps) {
  const styles = useStyles();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNotebook, setSelectedNotebook] = useState(notebooks[0]?.id || '');
  const [selectedSection, setSelectedSection] = useState(sections[0]?.id || '');

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave?.({
        title: title.trim(),
        content: content.trim(),
        notebook: selectedNotebook,
        section: selectedSection,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setSelectedNotebook(notebooks[0]?.id || '');
    setSelectedSection(sections[0]?.id || '');
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
          <DocumentAdd24Regular style={{ marginRight: '8px' }} />
          Quick Note Capture
        </DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <Field label="Title" required>
              <Textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                rows={1}
              />
            </Field>

            <Field label="Content" required>
              <Textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter note content..."
              />
            </Field>

            {notebooks.length > 0 && (
              <Field label="Notebook">
                <Dropdown
                  value={notebooks.find((n) => n.id === selectedNotebook)?.name}
                  selectedOptions={[selectedNotebook]}
                  onOptionSelect={(_, data) => setSelectedNotebook(data.optionValue as string)}
                >
                  {notebooks.map((notebook) => (
                    <Option key={notebook.id} value={notebook.id}>
                      {notebook.name}
                    </Option>
                  ))}
                </Dropdown>
              </Field>
            )}

            {sections.length > 0 && (
              <Field label="Section">
                <Dropdown
                  value={sections.find((s) => s.id === selectedSection)?.name}
                  selectedOptions={[selectedSection]}
                  onOptionSelect={(_, data) => setSelectedSection(data.optionValue as string)}
                >
                  {sections.map((section) => (
                    <Option key={section.id} value={section.id}>
                      {section.name}
                    </Option>
                  ))}
                </Dropdown>
              </Field>
            )}
          </DialogContent>
        </DialogBody>
        <DialogActions>
          <Button appearance="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            icon={<Save24Regular />}
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
          >
            Save Note
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
