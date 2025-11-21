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
  Field,
  Dropdown,
  Option,
  Checkbox,
  Radio,
  RadioGroup,
} from '@fluentui/react-components';
import {
  Print24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '450px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
  },
});

interface PagePrintSettingsDialogProps {
  open: boolean;
  onClose?: () => void;
  onPrint?: (settings: PrintSettings) => void;
}

export interface PrintSettings {
  pageSize: 'letter' | 'a4' | 'legal';
  orientation: 'portrait' | 'landscape';
  margins: 'normal' | 'narrow' | 'wide';
  includeHeader: boolean;
  includeFooter: boolean;
  includePageNumbers: boolean;
  includeDate: boolean;
  colorMode: 'color' | 'grayscale';
}

const defaultSettings: PrintSettings = {
  pageSize: 'letter',
  orientation: 'portrait',
  margins: 'normal',
  includeHeader: true,
  includeFooter: true,
  includePageNumbers: true,
  includeDate: true,
  colorMode: 'color',
};

export function PagePrintSettingsDialog({
  open,
  onClose,
  onPrint,
}: PagePrintSettingsDialogProps) {
  const styles = useStyles();
  const [settings, setSettings] = useState<PrintSettings>(defaultSettings);

  const handlePrint = () => {
    onPrint?.(settings);
    handleClose();
  };

  const handleClose = () => {
    setSettings(defaultSettings);
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
          <Print24Regular style={{ marginRight: '8px' }} />
          Print Settings
        </DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Page Setup</div>
              
              <Field label="Page Size">
                <Dropdown
                  value={settings.pageSize}
                  selectedOptions={[settings.pageSize]}
                  onOptionSelect={(_, data) =>
                    setSettings({ ...settings, pageSize: data.optionValue as any })
                  }
                >
                  <Option value="letter">Letter (8.5" x 11")</Option>
                  <Option value="a4">A4 (210mm x 297mm)</Option>
                  <Option value="legal">Legal (8.5" x 14")</Option>
                </Dropdown>
              </Field>

              <Field label="Orientation">
                <RadioGroup
                  value={settings.orientation}
                  onChange={(_, data) =>
                    setSettings({ ...settings, orientation: data.value as any })
                  }
                >
                  <Radio value="portrait" label="Portrait" />
                  <Radio value="landscape" label="Landscape" />
                </RadioGroup>
              </Field>

              <Field label="Margins">
                <Dropdown
                  value={settings.margins}
                  selectedOptions={[settings.margins]}
                  onOptionSelect={(_, data) =>
                    setSettings({ ...settings, margins: data.optionValue as any })
                  }
                >
                  <Option value="normal">Normal (1")</Option>
                  <Option value="narrow">Narrow (0.5")</Option>
                  <Option value="wide">Wide (1.5")</Option>
                </Dropdown>
              </Field>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Headers & Footers</div>
              
              <Checkbox
                label="Include header"
                checked={settings.includeHeader}
                onChange={(_, data) =>
                  setSettings({ ...settings, includeHeader: data.checked as boolean })
                }
              />
              <Checkbox
                label="Include footer"
                checked={settings.includeFooter}
                onChange={(_, data) =>
                  setSettings({ ...settings, includeFooter: data.checked as boolean })
                }
              />
              <Checkbox
                label="Include page numbers"
                checked={settings.includePageNumbers}
                onChange={(_, data) =>
                  setSettings({ ...settings, includePageNumbers: data.checked as boolean })
                }
              />
              <Checkbox
                label="Include date"
                checked={settings.includeDate}
                onChange={(_, data) =>
                  setSettings({ ...settings, includeDate: data.checked as boolean })
                }
              />
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Color</div>
              
              <Field label="Color Mode">
                <RadioGroup
                  value={settings.colorMode}
                  onChange={(_, data) =>
                    setSettings({ ...settings, colorMode: data.value as any })
                  }
                >
                  <Radio value="color" label="Color" />
                  <Radio value="grayscale" label="Grayscale" />
                </RadioGroup>
              </Field>
            </div>
          </DialogContent>
        </DialogBody>
        <DialogActions>
          <Button appearance="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            icon={<Print24Regular />}
            onClick={handlePrint}
          >
            Print
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
