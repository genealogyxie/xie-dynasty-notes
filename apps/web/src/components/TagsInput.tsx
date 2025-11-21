import { useState, KeyboardEvent } from 'react';
import {
  makeStyles,
  tokens,
  Tag,
  TagGroup,
  Input,
} from '@fluentui/react-components';
import { Dismiss12Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '8px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    minHeight: '40px',
  },
  input: {
    flex: 1,
  },
});

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagsInput({ tags, onTagsChange, placeholder = 'Add tags...' }: TagsInputProps) {
  const styles = useStyles();
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={styles.container}>
      <div className={styles.tagsContainer}>
        <TagGroup>
          {tags.map((tag) => (
            <Tag
              key={tag}
              dismissible
              dismissIcon={{ children: <Dismiss12Regular /> }}
              value={tag}
              onClick={() => handleRemoveTag(tag)}
            >
              {tag}
            </Tag>
          ))}
        </TagGroup>
      </div>
      <Input
        className={styles.input}
        value={inputValue}
        onChange={(_, data) => setInputValue(data.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}
