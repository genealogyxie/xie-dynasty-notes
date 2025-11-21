import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Input,
  Field,
  Dropdown,
  Option,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  Share24Regular,
  Add24Regular,
  MoreVertical24Regular,
  Delete24Regular,
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
  addUser: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  addUserInput: {
    flex: 1,
  },
  usersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  userInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  userName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
  userEmail: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  roleDropdown: {
    minWidth: '120px',
  },
  emptyState: {
    padding: '24px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
  },
});

interface SharedUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
}

interface NotebookSharingSettingsProps {
  users: SharedUser[];
  onAddUser?: (email: string, role: 'editor' | 'viewer') => void;
  onUpdateRole?: (userId: string, role: 'editor' | 'viewer') => void;
  onRemoveUser?: (userId: string) => void;
}

export function NotebookSharingSettings({
  users,
  onAddUser,
  onUpdateRole,
  onRemoveUser,
}: NotebookSharingSettingsProps) {
  const styles = useStyles();
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'editor' | 'viewer'>('editor');

  const handleAddUser = () => {
    if (newUserEmail.trim()) {
      onAddUser?.(newUserEmail.trim(), newUserRole);
      setNewUserEmail('');
      setNewUserRole('editor');
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'editor':
        return 'Can Edit';
      case 'viewer':
        return 'Can View';
      default:
        return role;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Share24Regular />
        <span>Sharing Settings</span>
      </div>

      <div className={styles.addUser}>
        <Field label="Add people" className={styles.addUserInput}>
          <Input
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="Enter email address"
            type="email"
          />
        </Field>
        <Field label="Role">
          <Dropdown
            className={styles.roleDropdown}
            value={getRoleLabel(newUserRole)}
            selectedOptions={[newUserRole]}
            onOptionSelect={(_, data) => setNewUserRole(data.optionValue as 'editor' | 'viewer')}
          >
            <Option value="editor">Can Edit</Option>
            <Option value="viewer">Can View</Option>
          </Dropdown>
        </Field>
        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={handleAddUser}
          disabled={!newUserEmail.trim()}
          style={{ marginTop: '22px' }}
        >
          Add
        </Button>
      </div>

      <div className={styles.usersList}>
        {users.length === 0 ? (
          <div className={styles.emptyState}>
            No users shared with yet
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className={styles.userItem}>
              <Avatar
                name={user.name}
                image={user.avatar ? { src: user.avatar } : undefined}
                size={32}
              />
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user.name}</div>
                <div className={styles.userEmail}>{user.email}</div>
              </div>
              {user.role === 'owner' ? (
                <div style={{ padding: '0 12px', fontSize: tokens.fontSizeBase300, color: tokens.colorNeutralForeground3 }}>
                  Owner
                </div>
              ) : (
                <>
                  <Dropdown
                    className={styles.roleDropdown}
                    value={getRoleLabel(user.role)}
                    selectedOptions={[user.role]}
                    onOptionSelect={(_, data) =>
                      onUpdateRole?.(user.id, data.optionValue as 'editor' | 'viewer')
                    }
                  >
                    <Option value="editor">Can Edit</Option>
                    <Option value="viewer">Can View</Option>
                  </Dropdown>
                  <Menu>
                    <MenuTrigger disableButtonEnhancement>
                      <Button
                        appearance="subtle"
                        icon={<MoreVertical24Regular />}
                      />
                    </MenuTrigger>
                    <MenuPopover>
                      <MenuList>
                        <MenuItem
                          icon={<Delete24Regular />}
                          onClick={() => onRemoveUser?.(user.id)}
                        >
                          Remove Access
                        </MenuItem>
                      </MenuList>
                    </MenuPopover>
                  </Menu>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
