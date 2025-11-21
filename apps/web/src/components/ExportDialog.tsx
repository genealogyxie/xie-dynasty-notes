import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  Radio,
  RadioGroup,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ArrowDownload24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '500px',
    width: '90vw',
  },
  formatGroup: {
    marginTop: '16px',
    marginBottom: '24px',
  },
  formatOption: {
    marginBottom: '12px',
  },
  formatLabel: {
    fontWeight: tokens.fontWeightSemibold,
  },
  formatDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '24px',
  },
});

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  pageTitle?: string;
  pageContent?: string;
}

export function ExportDialog({ open, onClose, pageTitle = 'Untitled', pageContent = '' }: ExportDialogProps) {
  const styles = useStyles();
  const [selectedFormat, setSelectedFormat] = useState('markdown');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      let content = '';
      let filename = '';
      let mimeType = '';

      switch (selectedFormat) {
        case 'markdown':
          content = `# ${pageTitle}\n\n${pageContent}`;
          filename = `${pageTitle}.md`;
          mimeType = 'text/markdown';
          break;
        case 'html':
          content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${pageTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #333; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <h1>${pageTitle}</h1>
  <div>${pageContent}</div>
</body>
</html>`;
          filename = `${pageTitle}.html`;
          mimeType = 'text/html';
          break;
        case 'txt':
          content = `${pageTitle}\n${'='.repeat(pageTitle.length)}\n\n${pageContent}`;
          filename = `${pageTitle}.txt`;
          mimeType = 'text/plain';
          break;
        case 'json':
          content = JSON.stringify({
            title: pageTitle,
            content: pageContent,
            exportedAt: new Date().toISOString(),
          }, null, 2);
          filename = `${pageTitle}.json`;
          mimeType = 'application/json';
          break;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => {
        setExporting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowDownload24Regular />
              Export Page
            </div>
          </DialogTitle>

          <div className={styles.formatGroup}>
            <div style={{ marginBottom: '12px', fontWeight: tokens.fontWeightSemibold }}>
              Select export format:
            </div>
            <RadioGroup value={selectedFormat} onChange={(_, data) => setSelectedFormat(data.value)}>
              <div className={styles.formatOption}>
                <Radio value="markdown" label="Markdown (.md)" />
                <div className={styles.formatDescription}>
                  Plain text format with formatting syntax, compatible with most note apps
                </div>
              </div>
              <div className={styles.formatOption}>
                <Radio value="html" label="HTML (.html)" />
                <div className={styles.formatDescription}>
                  Web page format, can be opened in any browser
                </div>
              </div>
              <div className={styles.formatOption}>
                <Radio value="txt" label="Plain Text (.txt)" />
                <div className={styles.formatDescription}>
                  Simple text file without formatting
                </div>
              </div>
              <div className={styles.formatOption}>
                <Radio value="json" label="JSON (.json)" />
                <div className={styles.formatDescription}>
                  Structured data format for programmatic access
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose} disabled={exporting}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
