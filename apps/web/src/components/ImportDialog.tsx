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
import { ArrowUpload24Regular } from '@fluentui/react-icons';

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
  formatDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  uploadArea: {
    border: `2px dashed ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '32px',
    textAlign: 'center',
    marginTop: '16px',
    marginBottom: '16px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '24px',
  },
});

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport?: (content: string, format: string) => void;
}

export function ImportDialog({ open, onClose, onImport }: ImportDialogProps) {
  const styles = useStyles();
  const [selectedFormat, setSelectedFormat] = useState('markdown');
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      alert('Please select a file to import');
      return;
    }

    setImporting(true);

    try {
      const content = await selectedFile.text();
      
      let processedContent = content;
      
      switch (selectedFormat) {
        case 'markdown':
          processedContent = content;
          break;
        case 'html':
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          processedContent = doc.body.textContent || '';
          break;
        case 'txt':
          processedContent = content;
          break;
        case 'json':
          try {
            const parsed = JSON.parse(content);
            processedContent = parsed.content || parsed.text || JSON.stringify(parsed, null, 2);
          } catch (e) {
            processedContent = content;
          }
          break;
      }

      if (onImport) {
        onImport(processedContent, selectedFormat);
      }

      setTimeout(() => {
        setImporting(false);
        setSelectedFile(null);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import file. Please check the file format and try again.');
      setImporting(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpload24Regular />
              Import Content
            </div>
          </DialogTitle>

          <div className={styles.formatGroup}>
            <div style={{ marginBottom: '12px', fontWeight: tokens.fontWeightSemibold }}>
              Select import format:
            </div>
            <RadioGroup value={selectedFormat} onChange={(_, data) => setSelectedFormat(data.value)}>
              <div className={styles.formatOption}>
                <Radio value="markdown" label="Markdown (.md)" />
                <div className={styles.formatDescription}>
                  Import from Markdown files with formatting syntax
                </div>
              </div>
              <div className={styles.formatOption}>
                <Radio value="html" label="HTML (.html)" />
                <div className={styles.formatDescription}>
                  Import from HTML files (text content will be extracted)
                </div>
              </div>
              <div className={styles.formatOption}>
                <Radio value="txt" label="Plain Text (.txt)" />
                <div className={styles.formatDescription}>
                  Import from plain text files
                </div>
              </div>
              <div className={styles.formatOption}>
                <Radio value="json" label="JSON (.json)" />
                <div className={styles.formatDescription}>
                  Import from JSON files (structured data)
                </div>
              </div>
            </RadioGroup>
          </div>

          <div
            className={styles.uploadArea}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".md,.html,.txt,.json"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            {selectedFile ? (
              <div>
                <div style={{ fontWeight: tokens.fontWeightSemibold, marginBottom: '8px' }}>
                  Selected file:
                </div>
                <div>{selectedFile.name}</div>
                <div style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3, marginTop: '4px' }}>
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                <div style={{ fontWeight: tokens.fontWeightSemibold, marginBottom: '4px' }}>
                  Drop a file here or click to browse
                </div>
                <div style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 }}>
                  Supports .md, .html, .txt, .json files
                </div>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose} disabled={importing}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleImport} disabled={importing || !selectedFile}>
              {importing ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
