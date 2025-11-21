import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Document24Regular, TaskListLtr24Regular, Calendar24Regular, Notebook24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '600px',
    width: '90vw',
  },
  templatesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
    marginTop: '16px',
    marginBottom: '24px',
  },
  templateCard: {
    padding: '20px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    textAlign: 'center',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  templateIcon: {
    fontSize: '48px',
    marginBottom: '8px',
  },
  templateName: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  templateDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
});

interface Template {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  content: string;
}

interface PageTemplatesProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate?: (template: Template) => void;
}

const templates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Page',
    description: 'Start with an empty page',
    icon: <Document24Regular />,
    content: '',
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Template for meeting notes',
    icon: <Notebook24Regular />,
    content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** 

## Agenda
- 

## Discussion
- 

## Action Items
- [ ] 

## Next Steps
- `,
  },
  {
    id: 'todo',
    name: 'To-Do List',
    description: 'Task list template',
    icon: <TaskListLtr24Regular />,
    content: `# To-Do List

**Date:** ${new Date().toLocaleDateString()}

## Today
- [ ] 
- [ ] 
- [ ] 

## This Week
- [ ] 
- [ ] 

## Backlog
- [ ] `,
  },
  {
    id: 'daily',
    name: 'Daily Notes',
    description: 'Daily journal template',
    icon: <Calendar24Regular />,
    content: `# Daily Notes - ${new Date().toLocaleDateString()}

## Goals for Today
- 

## Notes
- 

## Accomplishments
- 

## Tomorrow
- `,
  },
];

export function PageTemplates({ open, onClose, onSelectTemplate }: PageTemplatesProps) {
  const styles = useStyles();

  const handleSelectTemplate = (template: Template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>Choose a Template</DialogTitle>

          <div className={styles.templatesGrid}>
            {templates.map((template) => (
              <div
                key={template.id}
                className={styles.templateCard}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className={styles.templateIcon}>{template.icon}</div>
                <div className={styles.templateName}>{template.name}</div>
                <div className={styles.templateDescription}>{template.description}</div>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
