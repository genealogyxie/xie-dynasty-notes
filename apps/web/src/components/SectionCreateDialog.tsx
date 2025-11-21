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
  Input,
  Field,
  Dropdown,
  Option,
} from '@fluentui/react-components';
import {
  Folder24Regular,
  Dismiss24Regular,
  Add24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '400px',
  },
});

interface SectionCreateDialogProps {
  open: boolean;
  notebooks: Array<{ id: string; name: string }>;
  sectionGroups?: Array<{ id: string; name: string; notebookId: string }>;
  defaultNotebookId?: string;
  onClose?: () => void;
  onCreate?: (name: string, notebookId: string, sectionGroupId?: string) => void;
}

export function SectionCreateDialog({
  open,
  notebooks,
  sectionGroups = [],
  defaultNotebookId,
  onClose,
  onCreate,
}: SectionCreateDialogProps) {
  const styles = useStyles();
  const [name, setName] = useState('');
  const [selectedNotebook, setSelectedNotebook] = useState(defaultNotebookId || notebooks[0]?.id || '');
  const [selectedSectionGroup, setSelectedSectionGroup] = useState<string>('');

  const availableSectionGroups = sectionGroups.filter(
    (sg) => sg.notebookId === selectedNotebook
  );

  const handleCreate = () => {
    if (name.trim() && selectedNotebook) {
      onCreate?.(name.trim(), selectedNotebook, selectedSectionGroup || undefined);
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setSelectedNotebook(defaultNotebookId || notebooks[0]?.id || '');
    setSelectedSectionGroup('');
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
          <Folder24Regular style={{ marginRight: '8px' }} />
          Create New Section
        </DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <Field label="Section Name" required>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter section name"
                autoFocus
              />
            </Field>

            <Field label="Notebook" required>
              <Dropdown
                placeholder="Select notebook"
                value={notebooks.find((n) => n.id === selectedNotebook)?.name}
                selectedOptions={selectedNotebook ? [selectedNotebook] : []}
                onOptionSelect={(_, data) => {
                  setSelectedNotebook(data.optionValue as string);
                  setSelectedSectionGroup('');
                }}
              >
                {notebooks.map((notebook) => (
                  <Option key={notebook.id} value={notebook.id}>
                    {notebook.name}
                  </Option>
                ))}
              </Dropdown>
            </Field>

            {availableSectionGroups.length > 0 && (
              <Field label="Section Group (Optional)">
                <Dropdown
                  placeholder="None (root level)"
                  value={
                    selectedSectionGroup
                      ? sectionGroups.find((sg) => sg.id === selectedSectionGroup)?.name
                      : 'None (root level)'
                  }
                  selectedOptions={selectedSectionGroup ? [selectedSectionGroup] : []}
                  onOptionSelect={(_, data) => setSelectedSectionGroup(data.optionValue as string)}
                >
                  <Option value="">None (root level)</Option>
                  {availableSectionGroups.map((group) => (
                    <Option key={group.id} value={group.id}>
                      {group.name}
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
            icon={<Add24Regular />}
            onClick={handleCreate}
            disabled={!name.trim() || !selectedNotebook}
          >
            Create Section
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
