import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  Input,
  makeStyles,
  tokens,
  Dropdown,
  Option,
  Switch,
} from '@fluentui/react-components';
import { Copy24Regular, Link24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '500px',
    width: '90vw',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '12px',
  },
  linkContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  linkInput: {
    flex: 1,
  },
  permissionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    marginBottom: '8px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontWeight: tokens.fontWeightSemibold,
  },
  userEmail: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '24px',
  },
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
});

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  pageTitle?: string;
  shareLink?: string;
  onGenerateLink?: (permission: 'view' | 'edit') => void;
  onInviteUser?: (email: string, permission: 'view' | 'edit') => void;
}

export function ShareDialog({
  open,
  onClose,
  pageTitle = 'Untitled Page',
  shareLink,
  onGenerateLink,
  onInviteUser,
}: ShareDialogProps) {
  const styles = useStyles();
  const [inviteEmail, setInviteEmail] = useState('');
  const [linkPermission, setLinkPermission] = useState<'view' | 'edit'>('view');
  const [invitePermission, setInvitePermission] = useState<'view' | 'edit'>('view');
  const [linkExpiration, setLinkExpiration] = useState(false);
  const [expirationDays, setExpirationDays] = useState('7');

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
    }
  };

  const handleGenerateLink = () => {
    if (onGenerateLink) {
      onGenerateLink(linkPermission);
    }
  };

  const handleInviteUser = () => {
    if (inviteEmail && onInviteUser) {
      onInviteUser(inviteEmail, invitePermission);
      setInviteEmail('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>Share "{pageTitle}"</DialogTitle>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Share via link</div>
            <div className={styles.linkContainer}>
              <Input
                className={styles.linkInput}
                value={shareLink || 'No link generated'}
                readOnly
                contentBefore={<Link24Regular />}
              />
              <Button
                appearance="secondary"
                icon={<Copy24Regular />}
                onClick={handleCopyLink}
                disabled={!shareLink}
              >
                Copy
              </Button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <Dropdown
                placeholder="Select permission"
                value={linkPermission}
                onOptionSelect={(_, data) => setLinkPermission(data.optionValue as 'view' | 'edit')}
                style={{ flex: 1 }}
              >
                <Option value="view">Can view</Option>
                <Option value="edit">Can edit</Option>
              </Dropdown>
              <Button appearance="primary" onClick={handleGenerateLink}>
                Generate Link
              </Button>
            </div>
            <div className={styles.settingRow}>
              <span>Link expires</span>
              <Switch
                checked={linkExpiration}
                onChange={(_, data) => setLinkExpiration(data.checked)}
              />
            </div>
            {linkExpiration && (
              <Input
                type="number"
                value={expirationDays}
                onChange={(_, data) => setExpirationDays(data.value)}
                contentAfter="days"
                style={{ marginBottom: '12px' }}
              />
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Invite people</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <Input
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(_, data) => setInviteEmail(data.value)}
                style={{ flex: 1 }}
              />
              <Dropdown
                placeholder="Permission"
                value={invitePermission}
                onOptionSelect={(_, data) => setInvitePermission(data.optionValue as 'view' | 'edit')}
                style={{ width: '120px' }}
              >
                <Option value="view">Can view</Option>
                <Option value="edit">Can edit</Option>
              </Dropdown>
              <Button
                appearance="primary"
                onClick={handleInviteUser}
                disabled={!inviteEmail}
              >
                Invite
              </Button>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>People with access</div>
            <div className={styles.permissionRow}>
              <div className={styles.userInfo}>
                <div className={styles.userName}>You</div>
                <div className={styles.userEmail}>Owner</div>
              </div>
              <span>Full access</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Done
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
