import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Textarea,
  Avatar,
} from '@fluentui/react-components';
import { Comment24Regular, Send24Regular, Checkmark24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    width: '320px',
    height: '100%',
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: tokens.fontWeightSemibold,
  },
  commentsList: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
  },
  comment: {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  commentAuthor: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase300,
  },
  commentTime: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  commentText: {
    fontSize: tokens.fontSizeBase300,
    lineHeight: '1.5',
  },
  commentActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  resolved: {
    opacity: 0.6,
  },
  newCommentContainer: {
    padding: '16px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  newCommentActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  emptyState: {
    padding: '40px 16px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
});

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  resolved: boolean;
}

interface CommentsPanelProps {
  comments?: Comment[];
  onAddComment?: (text: string) => void;
  onResolveComment?: (commentId: string) => void;
}

export function CommentsPanel({ 
  comments = [], 
  onAddComment, 
  onResolveComment,
}: CommentsPanelProps) {
  const styles = useStyles();
  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = () => {
    if (newCommentText.trim() && onAddComment) {
      onAddComment(newCommentText.trim());
      setNewCommentText('');
    }
  };

  const handleResolve = (commentId: string) => {
    if (onResolveComment) {
      onResolveComment(commentId);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
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
      <div className={styles.header}>
        <Comment24Regular />
        Comments ({comments.length})
      </div>

      <div className={styles.commentsList}>
        {comments.length === 0 ? (
          <div className={styles.emptyState}>
            <Comment24Regular style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>No comments yet</div>
            <div style={{ fontSize: tokens.fontSizeBase200, marginTop: '8px' }}>
              Add a comment to start a discussion
            </div>
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`${styles.comment} ${comment.resolved ? styles.resolved : ''}`}
            >
              <div className={styles.commentHeader}>
                <Avatar
                  name={comment.author}
                  initials={getInitials(comment.author)}
                  size={24}
                />
                <div>
                  <div className={styles.commentAuthor}>{comment.author}</div>
                  <div className={styles.commentTime}>{formatTime(comment.timestamp)}</div>
                </div>
              </div>
              <div className={styles.commentText}>{comment.text}</div>
              {!comment.resolved && (
                <div className={styles.commentActions}>
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<Checkmark24Regular />}
                    onClick={() => handleResolve(comment.id)}
                  >
                    Resolve
                  </Button>
                </div>
              )}
              {comment.resolved && (
                <div style={{ marginTop: '8px', fontSize: tokens.fontSizeBase200, color: tokens.colorPaletteGreenForeground1 }}>
                  ✓ Resolved
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className={styles.newCommentContainer}>
        <Textarea
          placeholder="Add a comment..."
          value={newCommentText}
          onChange={(_, data) => setNewCommentText(data.value)}
          resize="vertical"
        />
        <div className={styles.newCommentActions}>
          <Button
            appearance="primary"
            icon={<Send24Regular />}
            onClick={handleAddComment}
            disabled={!newCommentText.trim()}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
