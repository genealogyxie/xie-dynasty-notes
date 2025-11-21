import {
  makeStyles,
  tokens,
  Card,
  Button,
} from '@fluentui/react-components';
import {
  Dismiss24Regular,
  ArrowMaximize24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  container: {
    width: '80%',
    maxWidth: '1200px',
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusLarge,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  content: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  previewContent: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '32px',
    borderRadius: tokens.borderRadiusMedium,
    minHeight: '100%',
    boxShadow: tokens.shadow8,
  },
});

interface PagePreviewProps {
  pageTitle: string;
  pageContent: string;
  onClose?: () => void;
  onOpenFull?: () => void;
}

export function PagePreview({
  pageTitle,
  pageContent,
  onClose,
  onOpenFull,
}: PagePreviewProps) {
  const styles = useStyles();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <Card className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>{pageTitle}</div>
          <div className={styles.actions}>
            <Button
              appearance="subtle"
              icon={<ArrowMaximize24Regular />}
              onClick={onOpenFull}
              title="Open Full Page"
            />
            <Button
              appearance="subtle"
              icon={<Dismiss24Regular />}
              onClick={onClose}
              title="Close Preview"
            />
          </div>
        </div>
        <div className={styles.content}>
          <div
            className={styles.previewContent}
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />
        </div>
      </Card>
    </div>
  );
}
