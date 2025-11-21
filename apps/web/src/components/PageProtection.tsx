import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  Input,
  Switch,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { LockClosed24Regular, LockOpen24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '500px',
    width: '90vw',
  },
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    marginTop: '16px',
    marginBottom: '16px',
  },
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  settingDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  passwordInput: {
    marginTop: '12px',
    marginBottom: '12px',
  },
  warningBox: {
    padding: '12px',
    backgroundColor: tokens.colorPaletteYellowBackground2,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: '16px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
});

interface PageProtectionProps {
  open: boolean;
  onClose: () => void;
  isProtected?: boolean;
  onProtectionChange?: (settings: {
    isProtected: boolean;
    requirePassword: boolean;
    password?: string;
    preventEditing: boolean;
    preventDeleting: boolean;
    allowedUsers?: string[];
  }) => void;
}

export function PageProtection({
  open,
  onClose,
  isProtected = false,
  onProtectionChange,
}: PageProtectionProps) {
  const styles = useStyles();
  const [protectionEnabled, setProtectionEnabled] = useState(isProtected);
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preventEditing, setPreventEditing] = useState(false);
  const [preventDeleting, setPreventDeleting] = useState(false);

  const handleSave = () => {
    if (requirePassword && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (onProtectionChange) {
      onProtectionChange({
        isProtected: protectionEnabled,
        requirePassword,
        password: requirePassword ? password : undefined,
        preventEditing,
        preventDeleting,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {protectionEnabled ? <LockClosed24Regular /> : <LockOpen24Regular />}
              Page Protection
            </div>
          </DialogTitle>

          {protectionEnabled && (
            <div className={styles.warningBox}>
              <strong>Warning:</strong> Protecting this page will restrict access and modifications.
              Make sure you remember your password if you enable password protection.
            </div>
          )}

          <div className={styles.settingsGrid}>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <div className={styles.settingTitle}>Enable Protection</div>
                <div className={styles.settingDescription}>
                  Restrict access and modifications to this page
                </div>
              </div>
              <Switch
                checked={protectionEnabled}
                onChange={(_, data) => setProtectionEnabled(data.checked)}
              />
            </div>

            {protectionEnabled && (
              <>
                <div className={styles.settingRow}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingTitle}>Require Password</div>
                    <div className={styles.settingDescription}>
                      Users must enter a password to view this page
                    </div>
                  </div>
                  <Switch
                    checked={requirePassword}
                    onChange={(_, data) => setRequirePassword(data.checked)}
                  />
                </div>

                {requirePassword && (
                  <>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(_, data) => setPassword(data.value)}
                      className={styles.passwordInput}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(_, data) => setConfirmPassword(data.value)}
                      className={styles.passwordInput}
                    />
                  </>
                )}

                <div className={styles.settingRow}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingTitle}>Prevent Editing</div>
                    <div className={styles.settingDescription}>
                      Make this page read-only for all users except owner
                    </div>
                  </div>
                  <Switch
                    checked={preventEditing}
                    onChange={(_, data) => setPreventEditing(data.checked)}
                  />
                </div>

                <div className={styles.settingRow}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingTitle}>Prevent Deleting</div>
                    <div className={styles.settingDescription}>
                      Prevent this page from being deleted
                    </div>
                  </div>
                  <Switch
                    checked={preventDeleting}
                    onChange={(_, data) => setPreventDeleting(data.checked)}
                  />
                </div>
              </>
            )}
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleSave}>
              Save Protection Settings
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
