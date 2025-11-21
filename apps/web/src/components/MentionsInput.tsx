import { useState, useRef } from 'react';
import {
  makeStyles,
  tokens,
  Popover,
  PopoverSurface,
  Avatar,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
    fontFamily: tokens.fontFamilyBase,
    ':focus': {
      outline: 'none',
    },
  },
  suggestionsList: {
    padding: '8px',
    minWidth: '250px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  suggestionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusSmall,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
  },
  userEmail: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  mention: {
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
    padding: '2px 4px',
    borderRadius: tokens.borderRadiusSmall,
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface User {
  id: string;
  name: string;
  email: string;
}

interface MentionsInputProps {
  users: User[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MentionsInput({ users, value, onChange, placeholder }: MentionsInputProps) {
  const styles = useStyles();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    
    onChange(newValue);
    setCursorPosition(cursorPos);

    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtSymbol + 1);
      if (!textAfterAt.includes(' ')) {
        setMentionQuery(textAfterAt);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectUser = (user: User) => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    const textAfterCursor = value.substring(cursorPosition);
    
    const newValue = 
      value.substring(0, lastAtSymbol) + 
      `@${user.name} ` + 
      textAfterCursor;
    
    onChange(newValue);
    setShowSuggestions(false);
    
    if (inputRef.current) {
      const newCursorPos = lastAtSymbol + user.name.length + 2;
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={styles.container}>
      <Popover open={showSuggestions && filteredUsers.length > 0}>
        <textarea
          ref={inputRef}
          className={styles.input}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          rows={3}
        />
        <PopoverSurface>
          <div className={styles.suggestionsList}>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={styles.suggestionItem}
                onClick={() => handleSelectUser(user)}
              >
                <Avatar
                  name={user.name}
                  initials={getInitials(user.name)}
                  size={32}
                />
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userEmail}>{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </PopoverSurface>
      </Popover>
    </div>
  );
}

export function MentionTag({ userName }: { userName: string }) {
  const styles = useStyles();
  return <span className={styles.mention}>@{userName}</span>;
}
