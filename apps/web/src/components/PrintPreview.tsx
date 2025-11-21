import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  makeStyles,
  tokens,
  Dropdown,
  Option,
  Switch,
} from '@fluentui/react-components';
import { Print24Regular, ZoomIn24Regular, ZoomOut24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '900px',
    width: '90vw',
    height: '90vh',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  previewContainer: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '24px',
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    justifyContent: 'center',
  },
  previewPage: {
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow16,
    padding: '48px',
    minHeight: '800px',
    maxWidth: '800px',
    width: '100%',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '16px',
  },
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
});

interface PrintPreviewProps {
  open: boolean;
  onClose: () => void;
  content: string;
  pageTitle?: string;
  onPrint?: (settings: PrintSettings) => void;
}

interface PrintSettings {
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  includeHeader: boolean;
  includeFooter: boolean;
  includePageNumbers: boolean;
  zoom: number;
}

export function PrintPreview({ open, onClose, content, pageTitle = 'Untitled Page', onPrint }: PrintPreviewProps) {
  const styles = useStyles();
  const [settings, setSettings] = useState<PrintSettings>({
    pageSize: 'A4',
    orientation: 'portrait',
    includeHeader: true,
    includeFooter: true,
    includePageNumbers: true,
    zoom: 100,
  });

  const handlePrint = () => {
    if (onPrint) {
      onPrint(settings);
    }
    window.print();
  };

  const handleZoomIn = () => {
    setSettings({ ...settings, zoom: Math.min(settings.zoom + 10, 200) });
  };

  const handleZoomOut = () => {
    setSettings({ ...settings, zoom: Math.max(settings.zoom - 10, 50) });
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Print24Regular />
              Print Preview
            </div>
          </DialogTitle>

          <div className={styles.toolbar}>
            <Dropdown
              placeholder="Page size"
              value={settings.pageSize}
              onOptionSelect={(_, data) =>
                setSettings({ ...settings, pageSize: data.optionValue as PrintSettings['pageSize'] })
              }
              style={{ minWidth: '120px' }}
            >
              <Option value="A4">A4</Option>
              <Option value="Letter">Letter</Option>
              <Option value="Legal">Legal</Option>
            </Dropdown>

            <Dropdown
              placeholder="Orientation"
              value={settings.orientation}
              onOptionSelect={(_, data) =>
                setSettings({ ...settings, orientation: data.optionValue as PrintSettings['orientation'] })
              }
              style={{ minWidth: '120px' }}
            >
              <Option value="portrait">Portrait</Option>
              <Option value="landscape">Landscape</Option>
            </Dropdown>

            <div className={styles.settingRow}>
              <Switch
                checked={settings.includeHeader}
                onChange={(_, data) => setSettings({ ...settings, includeHeader: data.checked })}
              />
              <span>Header</span>
            </div>

            <div className={styles.settingRow}>
              <Switch
                checked={settings.includeFooter}
                onChange={(_, data) => setSettings({ ...settings, includeFooter: data.checked })}
              />
              <span>Footer</span>
            </div>

            <div className={styles.settingRow}>
              <Switch
                checked={settings.includePageNumbers}
                onChange={(_, data) => setSettings({ ...settings, includePageNumbers: data.checked })}
              />
              <span>Page #</span>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Button appearance="subtle" icon={<ZoomOut24Regular />} onClick={handleZoomOut} />
              <span>{settings.zoom}%</span>
              <Button appearance="subtle" icon={<ZoomIn24Regular />} onClick={handleZoomIn} />
            </div>
          </div>

          <div className={styles.previewContainer}>
            <div
              className={styles.previewPage}
              style={{
                transform: `scale(${settings.zoom / 100})`,
                transformOrigin: 'top center',
              }}
            >
              {settings.includeHeader && (
                <div
                  style={{
                    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
                    paddingBottom: '12px',
                    marginBottom: '24px',
                  }}
                >
                  <h1 style={{ margin: 0, fontSize: tokens.fontSizeBase600 }}>{pageTitle}</h1>
                  <div style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 }}>
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              )}

              <div dangerouslySetInnerHTML={{ __html: content }} />

              {settings.includeFooter && (
                <div
                  style={{
                    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
                    paddingTop: '12px',
                    marginTop: '24px',
                    fontSize: tokens.fontSizeBase200,
                    color: tokens.colorNeutralForeground3,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Xie Dynasty Notes</span>
                  {settings.includePageNumbers && <span>Page 1</span>}
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button appearance="primary" icon={<Print24Regular />} onClick={handlePrint}>
              Print
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
