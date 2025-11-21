import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  Textarea,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { NoteAdd24Regular, Save24Regular, Dismiss24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '600px',
    width: '90vw',
    minHeight: '400px',
  },
  textArea: {
    marginTop: '16px',
    marginBottom: '16px',
    minHeight: '300px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
  },
  quickNotesList: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    marginTop: '16px',
    marginBottom: '16px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  quickNoteCard: {
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  quickNotePreview: {
    fontSize: tokens.fontSizeBase300,
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  quickNoteMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  floatingButton: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    zIndex: 1000,
  },
});

interface QuickNote {
  id: string;
  content: string;
  timestamp: Date;
}

interface QuickNotesProps {
  open: boolean;
  onClose: () => void;
  onSave?: (content: string) => void;
  existingNotes?: QuickNote[];
}

export function QuickNotes({ open, onClose, onSave, existingNotes = [] }: QuickNotesProps) {
  const styles = useStyles();
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'new' | 'list'>('new');

  const handleSave = () => {
    if (content.trim() && onSave) {
      onSave(content.trim());
      setContent('');
    }
    onClose();
  };

  const handleSelectNote = (note: QuickNote) => {
    setContent(note.content);
    setMode('new');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <NoteAdd24Regular />
                Quick Notes
              </div>
              <Button
                appearance="subtle"
                size="small"
                onClick={() => setMode(mode === 'new' ? 'list' : 'new')}
              >
                {mode === 'new' ? 'View All' : 'New Note'}
              </Button>
            </div>
          </DialogTitle>

          {mode === 'new' ? (
            <>
              <Textarea
                className={styles.textArea}
                placeholder="Type your quick note here..."
                value={content}
                onChange={(_, data) => setContent(data.value)}
                resize="vertical"
              />

              <div className={styles.actions}>
                <Button
                  appearance="secondary"
                  icon={<Dismiss24Regular />}
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  appearance="primary"
                  icon={<Save24Regular />}
                  onClick={handleSave}
                  disabled={!content.trim()}
                >
                  Save Note
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.quickNotesList}>
                {existingNotes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: tokens.colorNeutralForeground3 }}>
                    <NoteAdd24Regular style={{ fontSize: '48px', marginBottom: '16px' }} />
                    <div>No quick notes yet</div>
                    <div style={{ fontSize: tokens.fontSizeBase200, marginTop: '8px' }}>
                      Create your first quick note to get started
                    </div>
                  </div>
                ) : (
                  existingNotes.map((note) => (
                    <div
                      key={note.id}
                      className={styles.quickNoteCard}
                      onClick={() => handleSelectNote(note)}
                    >
                      <div className={styles.quickNotePreview}>{note.content}</div>
                      <div className={styles.quickNoteMeta}>{formatTime(note.timestamp)}</div>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.actions}>
                <Button appearance="secondary" onClick={onClose}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

export function QuickNotesFloatingButton({ onClick }: { onClick: () => void }) {
  const styles = useStyles();
  
  return (
    <Button
      appearance="primary"
      icon={<NoteAdd24Regular style={{ fontSize: '24px' }} />}
      className={styles.floatingButton}
      onClick={onClick}
      title="Quick Note"
    />
  );
}
