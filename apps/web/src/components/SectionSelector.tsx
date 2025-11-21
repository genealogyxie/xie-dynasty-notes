import {
  makeStyles,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@fluentui/react-components';
import {
  Folder24Regular,
  ChevronDown24Regular,
  Add24Regular,
  FolderOpen24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  trigger: {
    minWidth: '180px',
    justifyContent: 'space-between',
  },
  sectionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionName: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  sectionGroup: {
    paddingLeft: '24px',
  },
});

interface Section {
  id: string;
  name: string;
  groupId?: string;
}

interface SectionGroup {
  id: string;
  name: string;
  sections: Section[];
}

interface SectionSelectorProps {
  sections: Section[];
  sectionGroups?: SectionGroup[];
  selectedSectionId?: string;
  onSelectSection?: (sectionId: string) => void;
  onCreateSection?: () => void;
}

export function SectionSelector({
  sections,
  sectionGroups = [],
  selectedSectionId,
  onSelectSection,
  onCreateSection,
}: SectionSelectorProps) {
  const styles = useStyles();
  
  const allSections = [...sections];
  sectionGroups.forEach((group) => {
    allSections.push(...group.sections);
  });
  
  const selectedSection = allSections.find((s) => s.id === selectedSectionId);

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          icon={<Folder24Regular />}
          iconPosition="before"
          className={styles.trigger}
        >
          <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedSection?.name || 'Select Section'}
          </span>
          <ChevronDown24Regular />
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {sections.filter((s) => !s.groupId).map((section) => (
            <MenuItem
              key={section.id}
              icon={<Folder24Regular />}
              onClick={() => onSelectSection?.(section.id)}
            >
              <span className={styles.sectionName}>{section.name}</span>
            </MenuItem>
          ))}
          
          {sectionGroups.map((group) => (
            <div key={group.id}>
              <MenuItem icon={<FolderOpen24Regular />}>
                <span className={styles.sectionName}>{group.name}</span>
              </MenuItem>
              {group.sections.map((section) => (
                <MenuItem
                  key={section.id}
                  icon={<Folder24Regular />}
                  onClick={() => onSelectSection?.(section.id)}
                  className={styles.sectionGroup}
                >
                  <span className={styles.sectionName}>{section.name}</span>
                </MenuItem>
              ))}
            </div>
          ))}
          
          <MenuDivider />
          <MenuItem
            icon={<Add24Regular />}
            onClick={onCreateSection}
          >
            Create New Section
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
