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
  Tab,
  TabList,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '600px',
    width: '90vw',
  },
  inputContainer: {
    marginTop: '16px',
    marginBottom: '16px',
  },
  previewContainer: {
    width: '100%',
    height: '300px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    marginTop: '16px',
    marginBottom: '16px',
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  examplesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    marginTop: '16px',
    marginBottom: '16px',
  },
  exampleCard: {
    padding: '12px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  exampleTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '4px',
  },
  exampleUrl: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    wordBreak: 'break-all',
  },
});

interface EmbedContentProps {
  open: boolean;
  onClose: () => void;
  onInsert?: (url: string, type: 'iframe' | 'video' | 'audio') => void;
}

const examples = [
  { title: 'YouTube Video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', type: 'iframe' as const },
  { title: 'Google Maps', url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316e5a1c5b%3A0x6c5c5c5c5c5c5c5c!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus', type: 'iframe' as const },
  { title: 'Spotify Playlist', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M', type: 'iframe' as const },
  { title: 'Twitter Tweet', url: 'https://platform.twitter.com/embed/Tweet.html?id=1234567890', type: 'iframe' as const },
];

export function EmbedContent({ open, onClose, onInsert }: EmbedContentProps) {
  const styles = useStyles();
  const [url, setUrl] = useState('');
  const [embedType, setEmbedType] = useState<'iframe' | 'video' | 'audio'>('iframe');
  const [selectedTab, setSelectedTab] = useState<'url' | 'examples'>('url');

  const handleInsert = () => {
    if (url.trim() && onInsert) {
      onInsert(url.trim(), embedType);
    }
    setUrl('');
    onClose();
  };

  const handleSelectExample = (exampleUrl: string, type: 'iframe' | 'video' | 'audio') => {
    setUrl(exampleUrl);
    setEmbedType(type);
    setSelectedTab('url');
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>Embed Web Content</DialogTitle>

          <TabList
            selectedValue={selectedTab}
            onTabSelect={(_, data) => setSelectedTab(data.value as 'url' | 'examples')}
          >
            <Tab value="url">URL</Tab>
            <Tab value="examples">Examples</Tab>
          </TabList>

          {selectedTab === 'url' ? (
            <>
              <div className={styles.inputContainer}>
                <Input
                  placeholder="Enter URL (e.g., https://www.youtube.com/embed/...)"
                  value={url}
                  onChange={(_, data) => setUrl(data.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {url && isValidUrl(url) && (
                <div className={styles.previewContainer}>
                  <iframe
                    className={styles.iframe}
                    src={url}
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              )}

              <div style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 }}>
                <strong>Supported:</strong> YouTube embeds, Google Maps, Spotify, Twitter, and any embeddable iframe content.
                Make sure to use the embed URL (not the regular page URL).
              </div>
            </>
          ) : (
            <div className={styles.examplesGrid}>
              {examples.map((example, index) => (
                <div
                  key={index}
                  className={styles.exampleCard}
                  onClick={() => handleSelectExample(example.url, example.type)}
                >
                  <div className={styles.exampleTitle}>{example.title}</div>
                  <div className={styles.exampleUrl}>{example.url}</div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleInsert} disabled={!url.trim() || !isValidUrl(url)}>
              Insert
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
