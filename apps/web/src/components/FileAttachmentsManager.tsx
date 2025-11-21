import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  Attach24Regular,
  Document24Regular,
  Image24Regular,
  Video24Regular,
  MusicNote224Regular,
  Delete24Regular,
  ArrowDownload24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '700px',
    width: '90vw',
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
  attachmentsList: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    marginTop: '16px',
    marginBottom: '16px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  attachmentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  attachmentIcon: {
    fontSize: '32px',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  attachmentMeta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  attachmentActions: {
    display: 'flex',
    gap: '8px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
});

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  url?: string;
}

interface FileAttachmentsManagerProps {
  open: boolean;
  onClose: () => void;
  attachments: FileAttachment[];
  onUpload?: (files: FileList) => void;
  onDelete?: (attachmentId: string) => void;
  onDownload?: (attachment: FileAttachment) => void;
}

export function FileAttachmentsManager({
  open,
  onClose,
  attachments,
  onUpload,
  onDelete,
  onDownload,
}: FileAttachmentsManagerProps) {
  const styles = useStyles();
  const [isDragging, setIsDragging] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image24Regular className={styles.attachmentIcon} style={{ color: tokens.colorPaletteGreenForeground1 }} />;
    }
    if (type.startsWith('video/')) {
      return <Video24Regular className={styles.attachmentIcon} style={{ color: tokens.colorPaletteBlueForeground2 }} />;
    }
    if (type.startsWith('audio/')) {
      return <MusicNote224Regular className={styles.attachmentIcon} style={{ color: tokens.colorPalettePurpleForeground2 }} />;
    }
    return <Document24Regular className={styles.attachmentIcon} style={{ color: tokens.colorNeutralForeground1 }} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && onUpload) {
      onUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onUpload) {
      onUpload(e.target.files);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Attach24Regular />
              File Attachments
            </div>
          </DialogTitle>

          <div
            className={styles.uploadArea}
            style={{
              backgroundColor: isDragging ? tokens.colorNeutralBackground1Hover : 'transparent',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Attach24Regular style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div style={{ fontWeight: tokens.fontWeightSemibold, marginBottom: '8px' }}>
              Drop files here or click to upload
            </div>
            <div style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 }}>
              Supports images, videos, audio, documents, and more
            </div>
            <input
              id="file-input"
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>

          {attachments.length > 0 && (
            <div className={styles.attachmentsList}>
              {attachments.map((attachment) => (
                <div key={attachment.id} className={styles.attachmentItem}>
                  {getFileIcon(attachment.type)}
                  <div className={styles.attachmentInfo}>
                    <div className={styles.attachmentName}>{attachment.name}</div>
                    <div className={styles.attachmentMeta}>
                      {formatFileSize(attachment.size)} • Uploaded by {attachment.uploadedBy} on{' '}
                      {formatDate(attachment.uploadedAt)}
                    </div>
                  </div>
                  <div className={styles.attachmentActions}>
                    <Button
                      appearance="subtle"
                      icon={<ArrowDownload24Regular />}
                      onClick={() => onDownload?.(attachment)}
                      title="Download"
                    />
                    <Button
                      appearance="subtle"
                      icon={<Delete24Regular />}
                      onClick={() => onDelete?.(attachment.id)}
                      title="Delete"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
