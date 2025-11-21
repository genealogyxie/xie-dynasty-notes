import { useState, useEffect } from 'react';
import {
  makeStyles,
  Button,
  MessageBar,
  MessageBarBody,
  MessageBarActions,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  banner: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    maxWidth: '400px',
    zIndex: 1000,
  },
});

interface PasteDetection {
  type: 'url' | 'email' | 'phone' | 'date' | 'code' | 'table' | 'list';
  content: string;
  suggestion: string;
}

interface SmartPasteProps {
  onAcceptSuggestion?: (detection: PasteDetection) => void;
}

export function SmartPaste({ onAcceptSuggestion }: SmartPasteProps) {
  const styles = useStyles();
  const [detection, setDetection] = useState<PasteDetection | null>(null);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text/plain');
      if (!text) return;

      const detected = detectPasteType(text);
      if (detected) {
        setDetection(detected);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const detectPasteType = (text: string): PasteDetection | null => {
    const trimmed = text.trim();

    const urlRegex = /^https?:\/\/.+/i;
    if (urlRegex.test(trimmed)) {
      return {
        type: 'url',
        content: trimmed,
        suggestion: 'Convert to clickable link?',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(trimmed)) {
      return {
        type: 'email',
        content: trimmed,
        suggestion: 'Convert to mailto link?',
      };
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (phoneRegex.test(trimmed)) {
      return {
        type: 'phone',
        content: trimmed,
        suggestion: 'Format as phone number?',
      };
    }

    const dateRegex = /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/;
    if (dateRegex.test(trimmed)) {
      return {
        type: 'date',
        content: trimmed,
        suggestion: 'Format as date?',
      };
    }

    const codeRegex = /^[\s\S]*[{}\[\]();][\s\S]*$/;
    const hasMultipleLines = trimmed.split('\n').length > 2;
    if (hasMultipleLines && codeRegex.test(trimmed)) {
      return {
        type: 'code',
        content: trimmed,
        suggestion: 'Format as code block?',
      };
    }

    const lines = trimmed.split('\n');
    if (lines.length > 1) {
      const firstLineCells = lines[0].split(/[\t,]/).length;
      const isTable = lines.every(line => line.split(/[\t,]/).length === firstLineCells);
      if (isTable && firstLineCells > 1) {
        return {
          type: 'table',
          content: trimmed,
          suggestion: 'Convert to table?',
        };
      }
    }

    const listRegex = /^[\-\*\d]+[\.\)]\s/;
    if (lines.length > 1 && lines.every(line => listRegex.test(line))) {
      return {
        type: 'list',
        content: trimmed,
        suggestion: 'Format as list?',
      };
    }

    return null;
  };

  const handleAccept = () => {
    if (detection && onAcceptSuggestion) {
      onAcceptSuggestion(detection);
    }
    setDetection(null);
  };

  const handleDismiss = () => {
    setDetection(null);
  };

  if (!detection) return null;

  return (
    <MessageBar
      className={styles.banner}
      intent="info"
    >
      <MessageBarBody>
        <strong>Smart Paste:</strong> {detection.suggestion}
      </MessageBarBody>
      <MessageBarActions>
        <Button appearance="primary" size="small" onClick={handleAccept}>
          Accept
        </Button>
        <Button
          appearance="subtle"
          size="small"
          icon={<Dismiss24Regular />}
          onClick={handleDismiss}
        />
      </MessageBarActions>
    </MessageBar>
  );
}
