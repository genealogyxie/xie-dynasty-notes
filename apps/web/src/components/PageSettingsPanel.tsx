import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Switch,
  Field,
  Dropdown,
  Option,
  Button,
} from '@fluentui/react-components';
import {
  Settings24Regular,
  Save24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
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
  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  settingLabel: {
    fontSize: tokens.fontSizeBase300,
  },
  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
    paddingTop: '8px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface PageSettings {
  showLineNumbers: boolean;
  spellCheck: boolean;
  autoSave: boolean;
  pageWidth: 'narrow' | 'medium' | 'wide' | 'full';
  fontSize: 'small' | 'medium' | 'large';
  lineHeight: 'compact' | 'normal' | 'relaxed';
}

interface PageSettingsPanelProps {
  settings?: PageSettings;
  onSave?: (settings: PageSettings) => void;
}

const defaultSettings: PageSettings = {
  showLineNumbers: false,
  spellCheck: true,
  autoSave: true,
  pageWidth: 'medium',
  fontSize: 'medium',
  lineHeight: 'normal',
};

export function PageSettingsPanel({ settings = defaultSettings, onSave }: PageSettingsPanelProps) {
  const styles = useStyles();
  const [currentSettings, setCurrentSettings] = useState<PageSettings>(settings);

  const handleToggle = (key: keyof PageSettings, value: boolean) => {
    setCurrentSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleDropdownChange = (key: keyof PageSettings, value: string) => {
    setCurrentSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave?.(currentSettings);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Settings24Regular />
        <span>Page Settings</span>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Editor</div>
        
        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Show Line Numbers</span>
          <Switch
            checked={currentSettings.showLineNumbers}
            onChange={(_, data) => handleToggle('showLineNumbers', data.checked)}
          />
        </div>

        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Spell Check</span>
          <Switch
            checked={currentSettings.spellCheck}
            onChange={(_, data) => handleToggle('spellCheck', data.checked)}
          />
        </div>

        <div className={styles.settingRow}>
          <span className={styles.settingLabel}>Auto Save</span>
          <Switch
            checked={currentSettings.autoSave}
            onChange={(_, data) => handleToggle('autoSave', data.checked)}
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Layout</div>
        
        <Field label="Page Width">
          <Dropdown
            value={currentSettings.pageWidth}
            selectedOptions={[currentSettings.pageWidth]}
            onOptionSelect={(_, data) => handleDropdownChange('pageWidth', data.optionValue as string)}
          >
            <Option value="narrow">Narrow</Option>
            <Option value="medium">Medium</Option>
            <Option value="wide">Wide</Option>
            <Option value="full">Full Width</Option>
          </Dropdown>
        </Field>

        <Field label="Font Size">
          <Dropdown
            value={currentSettings.fontSize}
            selectedOptions={[currentSettings.fontSize]}
            onOptionSelect={(_, data) => handleDropdownChange('fontSize', data.optionValue as string)}
          >
            <Option value="small">Small</Option>
            <Option value="medium">Medium</Option>
            <Option value="large">Large</Option>
          </Dropdown>
        </Field>

        <Field label="Line Height">
          <Dropdown
            value={currentSettings.lineHeight}
            selectedOptions={[currentSettings.lineHeight]}
            onOptionSelect={(_, data) => handleDropdownChange('lineHeight', data.optionValue as string)}
          >
            <Option value="compact">Compact</Option>
            <Option value="normal">Normal</Option>
            <Option value="relaxed">Relaxed</Option>
          </Dropdown>
        </Field>
      </div>

      <div className={styles.actions}>
        <Button
          appearance="primary"
          icon={<Save24Regular />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
