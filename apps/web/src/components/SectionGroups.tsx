import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Input,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogActions,
} from '@fluentui/react-components';
import {
  FolderOpen24Regular,
  FolderOpen24Filled,
  Add24Regular,
  bundleIcon,
} from '@fluentui/react-icons';

const FolderIcon = bundleIcon(FolderOpen24Filled, FolderOpen24Regular);

const useStyles = makeStyles({
  container: {
    padding: '16px',
  },
  groupCard: {
    padding: '16px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: '12px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  groupHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  groupName: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
  },
  sectionsList: {
    paddingLeft: '36px',
  },
  sectionItem: {
    padding: '8px',
    borderRadius: tokens.borderRadiusSmall,
    marginBottom: '4px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  addButton: {
    marginTop: '16px',
  },
  dialogSurface: {
    maxWidth: '400px',
  },
});

interface Section {
  id: number;
  name: string;
}

interface SectionGroup {
  id: number;
  name: string;
  sections: Section[];
}

interface SectionGroupsProps {
  groups: SectionGroup[];
  onSelectSection?: (groupId: number, sectionId: number) => void;
  onAddGroup?: (name: string) => void;
  onAddSection?: (groupId: number, name: string) => void;
}

export function SectionGroups({
  groups,
  onSelectSection,
  onAddGroup,
  onAddSection,
}: SectionGroupsProps) {
  const styles = useStyles();
  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
  const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');

  const handleAddGroup = () => {
    if (newGroupName.trim() && onAddGroup) {
      onAddGroup(newGroupName.trim());
      setNewGroupName('');
      setAddGroupDialogOpen(false);
    }
  };

  const handleAddSection = () => {
    if (newSectionName.trim() && selectedGroupId !== null && onAddSection) {
      onAddSection(selectedGroupId, newSectionName.trim());
      setNewSectionName('');
      setAddSectionDialogOpen(false);
    }
  };

  const openAddSectionDialog = (groupId: number) => {
    setSelectedGroupId(groupId);
    setAddSectionDialogOpen(true);
  };

  return (
    <div className={styles.container}>
      {groups.map((group) => (
        <div key={group.id} className={styles.groupCard}>
          <div className={styles.groupHeader}>
            <FolderIcon />
            <span className={styles.groupName}>{group.name}</span>
            <Button
              appearance="subtle"
              icon={<Add24Regular />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openAddSectionDialog(group.id);
              }}
              style={{ marginLeft: 'auto' }}
            >
              Add Section
            </Button>
          </div>
          <div className={styles.sectionsList}>
            {group.sections.map((section) => (
              <div
                key={section.id}
                className={styles.sectionItem}
                onClick={() => {
                  if (onSelectSection) {
                    onSelectSection(group.id, section.id);
                  }
                }}
              >
                {section.name}
              </div>
            ))}
            {group.sections.length === 0 && (
              <div style={{ color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200 }}>
                No sections yet
              </div>
            )}
          </div>
        </div>
      ))}

      <Button
        appearance="primary"
        icon={<Add24Regular />}
        onClick={() => setAddGroupDialogOpen(true)}
        className={styles.addButton}
      >
        New Section Group
      </Button>

      <Dialog open={addGroupDialogOpen} onOpenChange={(_, data) => setAddGroupDialogOpen(data.open)}>
        <DialogSurface className={styles.dialogSurface}>
          <DialogBody>
            <DialogTitle>Create Section Group</DialogTitle>
            <Input
              placeholder="Section group name"
              value={newGroupName}
              onChange={(_, data) => setNewGroupName(data.value)}
            />
            <DialogActions>
              <Button appearance="secondary" onClick={() => setAddGroupDialogOpen(false)}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={handleAddGroup}>
                Create
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Dialog open={addSectionDialogOpen} onOpenChange={(_, data) => setAddSectionDialogOpen(data.open)}>
        <DialogSurface className={styles.dialogSurface}>
          <DialogBody>
            <DialogTitle>Add Section</DialogTitle>
            <Input
              placeholder="Section name"
              value={newSectionName}
              onChange={(_, data) => setNewSectionName(data.value)}
            />
            <DialogActions>
              <Button appearance="secondary" onClick={() => setAddSectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={handleAddSection}>
                Add
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}
