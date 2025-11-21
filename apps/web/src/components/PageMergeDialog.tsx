import { useState } from 'react';
import {
  makeStyles,
  tokens,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Field,
  Dropdown,
  Option,
  Radio,
  RadioGroup,
} from '@fluentui/react-components';
import {
  ArrowMove24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '400px',
  },
  info: {
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase300,
  },
  warning: {
    padding: '12px',
    backgroundColor: tokens.colorPaletteYellowBackground2,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
  },
});

interface PageMergeDialogProps {
  open: boolean;
  sourcePage: { id: string; name: string };
  pages: Array<{ id: string; name: string }>;
  onClose?: () => void;
  onMerge?: (targetPageId: string, mergeMode: 'append' | 'prepend' | 'replace') => void;
}

export function PageMergeDialog({
  open,
  sourcePage,
  pages,
  onClose,
  onMerge,
}: PageMergeDialogProps) {
  const styles = useStyles();
  const [targetPageId, setTargetPageId] = useState('');
  const [mergeMode, setMergeMode] = useState<'append' | 'prepend' | 'replace'>('append');

  const availablePages = pages.filter((p) => p.id !== sourcePage.id);

  const handleMerge = () => {
    if (targetPageId) {
      onMerge?.(targetPageId, mergeMode);
      handleClose();
    }
  };

  const handleClose = () => {
    setTargetPageId('');
    setMergeMode('append');
    onClose?.();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && handleClose()}>
      <DialogSurface>
        <DialogTitle
          action={
            <Button
              appearance="subtle"
              icon={<Dismiss24Regular />}
              onClick={handleClose}
            />
          }
        >
          <ArrowMove24Regular style={{ marginRight: '8px' }} />
          Merge Pages
        </DialogTitle>
        <DialogBody>
          <DialogContent className={styles.content}>
            <div className={styles.info}>
              Merging page: <strong>{sourcePage.name}</strong>
            </div>

            <Field label="Target Page" required>
              <Dropdown
                placeholder="Select target page"
                value={pages.find((p) => p.id === targetPageId)?.name}
                selectedOptions={targetPageId ? [targetPageId] : []}
                onOptionSelect={(_, data) => setTargetPageId(data.optionValue as string)}
              >
                {availablePages.map((page) => (
                  <Option key={page.id} value={page.id}>
                    {page.name}
                  </Option>
                ))}
              </Dropdown>
            </Field>

            <Field label="Merge Mode">
              <RadioGroup
                value={mergeMode}
                onChange={(_, data) => setMergeMode(data.value as 'append' | 'prepend' | 'replace')}
              >
                <Radio
                  value="append"
                  label="Append to end"
                />
                <Radio
                  value="prepend"
                  label="Prepend to beginning"
                />
                <Radio
                  value="replace"
                  label="Replace target content"
                />
              </RadioGroup>
            </Field>

            <div className={styles.warning}>
              ⚠️ Warning: This action cannot be undone. The source page will be deleted after merging.
            </div>
          </DialogContent>
        </DialogBody>
        <DialogActions>
          <Button appearance="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleMerge}
            disabled={!targetPageId}
          >
            Merge Pages
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
