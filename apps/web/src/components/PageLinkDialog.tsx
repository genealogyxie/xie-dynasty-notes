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
  Input,
  Field,
  Switch,
} from '@fluentui/react-components';
import {
  Link24Regular,
  Dismiss24Regular,
  Copy24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '500px',
  },
  linkDisplay: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  linkInput: {
    flex: 1,
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
  },
  optionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: tokens.fontSizeBase300,
  },
  success: {
    padding: '8px 12px',
    backgroundColor: tokens.colorPaletteGreenBackground2,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
  },
});

interface PageLinkDialogProps {
  open: boolean;
  pageName: string;
  pageUrl: string;
  onClose?: () => void;
}

export function PageLinkDialog({
  open,
  pageName,
  pageUrl,
  onClose,
}: PageLinkDialogProps) {
  const styles = useStyles();
  const [includeTimestamp, setIncludeTimestamp] = useState(false);
  const [includeSection, setIncludeSection] = useState(true);
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    let link = pageUrl;
    
    if (includeTimestamp) {
      const timestamp = new Date().toISOString();
      link += `?t=${timestamp}`;
    }
    
    if (includeSection) {
      link += includeTimestamp ? '&section=true' : '?section=true';
    }
    
    return link;
  };

  const handleCopy = async () => {
    const link = generateLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClose = () => {
    setCopied(false);
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
          <Link24Regular style={{ marginRight: '8px' }} />
          Get Link to Page
        </DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <Field label="Page">
              <Input value={pageName} readOnly />
            </Field>

            <div className={styles.linkDisplay}>
              <Field label="Link" className={styles.linkInput}>
                <Input value={generateLink()} readOnly />
              </Field>
              <Button
                appearance="primary"
                icon={<Copy24Regular />}
                onClick={handleCopy}
              >
                Copy
              </Button>
            </div>

            {copied && (
              <div className={styles.success}>
                ✓ Link copied to clipboard!
              </div>
            )}

            <div className={styles.options}>
              <div className={styles.optionRow}>
                <span className={styles.optionLabel}>Include timestamp</span>
                <Switch
                  checked={includeTimestamp}
                  onChange={(_, data) => setIncludeTimestamp(data.checked)}
                />
              </div>
              <div className={styles.optionRow}>
                <span className={styles.optionLabel}>Include section context</span>
                <Switch
                  checked={includeSection}
                  onChange={(_, data) => setIncludeSection(data.checked)}
                />
              </div>
            </div>
          </DialogContent>
        </DialogBody>
        <DialogActions>
          <Button appearance="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
