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
  Textarea,
  Field,
  Checkbox,
} from '@fluentui/react-components';
import {
  Mail24Regular,
  Dismiss24Regular,
  Send24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '500px',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
});

interface PageEmailDialogProps {
  open: boolean;
  pageName: string;
  onClose?: () => void;
  onSend?: (to: string, subject: string, message: string, options: {
    includeAttachments: boolean;
    includeLink: boolean;
    sendAsHTML: boolean;
  }) => void;
}

export function PageEmailDialog({
  open,
  pageName,
  onClose,
  onSend,
}: PageEmailDialogProps) {
  const styles = useStyles();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState(`Shared page: ${pageName}`);
  const [message, setMessage] = useState('');
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [includeLink, setIncludeLink] = useState(true);
  const [sendAsHTML, setSendAsHTML] = useState(true);

  const handleSend = () => {
    if (to.trim() && subject.trim()) {
      onSend?.(to.trim(), subject.trim(), message.trim(), {
        includeAttachments,
        includeLink,
        sendAsHTML,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setTo('');
    setSubject(`Shared page: ${pageName}`);
    setMessage('');
    setIncludeAttachments(true);
    setIncludeLink(true);
    setSendAsHTML(true);
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
          <Mail24Regular style={{ marginRight: '8px' }} />
          Email Page
        </DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <Field label="To" required>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                type="email"
              />
            </Field>

            <Field label="Subject" required>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
              />
            </Field>

            <Field label="Message">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message (optional)"
                rows={4}
              />
            </Field>

            <div className={styles.options}>
              <Checkbox
                label="Include attachments"
                checked={includeAttachments}
                onChange={(_, data) => setIncludeAttachments(data.checked as boolean)}
              />
              <Checkbox
                label="Include link to page"
                checked={includeLink}
                onChange={(_, data) => setIncludeLink(data.checked as boolean)}
              />
              <Checkbox
                label="Send as HTML"
                checked={sendAsHTML}
                onChange={(_, data) => setSendAsHTML(data.checked as boolean)}
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
            icon={<Send24Regular />}
            onClick={handleSend}
            disabled={!to.trim() || !subject.trim()}
          >
            Send Email
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
