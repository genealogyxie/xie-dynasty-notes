import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
  Textarea,
  makeStyles,
  tokens,
  Tab,
  TabList,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '700px',
    width: '90vw',
  },
  previewContainer: {
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    marginTop: '16px',
    marginBottom: '16px',
    minHeight: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  latexInput: {
    fontFamily: 'monospace',
    marginBottom: '16px',
  },
  examplesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
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
    marginBottom: '8px',
    fontSize: tokens.fontSizeBase300,
  },
  exampleLatex: {
    fontFamily: 'monospace',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
});

interface MathEquationProps {
  open: boolean;
  onClose: () => void;
  onInsert?: (latex: string) => void;
  initialValue?: string;
}

const examples = [
  { title: 'Quadratic Formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
  { title: 'Pythagorean Theorem', latex: 'a^2 + b^2 = c^2' },
  { title: 'Integral', latex: '\\int_{a}^{b} f(x) dx' },
  { title: 'Summation', latex: '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}' },
  { title: 'Matrix', latex: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}' },
  { title: 'Limit', latex: '\\lim_{x \\to \\infty} f(x) = L' },
  { title: 'Derivative', latex: '\\frac{d}{dx}f(x) = f\'(x)' },
  { title: 'Greek Letters', latex: '\\alpha, \\beta, \\gamma, \\delta, \\theta' },
];

export function MathEquation({ open, onClose, onInsert, initialValue = '' }: MathEquationProps) {
  const styles = useStyles();
  const [latex, setLatex] = useState(initialValue);
  const [selectedTab, setSelectedTab] = useState<'editor' | 'examples'>('editor');

  const handleInsert = () => {
    if (latex.trim() && onInsert) {
      onInsert(latex.trim());
    }
    onClose();
  };

  const handleSelectExample = (exampleLatex: string) => {
    setLatex(exampleLatex);
    setSelectedTab('editor');
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>Insert Math Equation (LaTeX)</DialogTitle>

          <TabList
            selectedValue={selectedTab}
            onTabSelect={(_, data) => setSelectedTab(data.value as 'editor' | 'examples')}
          >
            <Tab value="editor">Editor</Tab>
            <Tab value="examples">Examples</Tab>
          </TabList>

          {selectedTab === 'editor' ? (
            <>
              <Textarea
                className={styles.latexInput}
                placeholder="Enter LaTeX equation (e.g., x^2 + y^2 = r^2)"
                value={latex}
                onChange={(_, data) => setLatex(data.value)}
                rows={4}
                style={{ marginTop: '16px' }}
              />

              <div className={styles.previewContainer}>
                {latex ? (
                  <div style={{ fontFamily: 'serif' }}>
                    Preview: {latex}
                    <div style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3, marginTop: '8px' }}>
                      (LaTeX rendering requires MathJax or KaTeX library)
                    </div>
                  </div>
                ) : (
                  <div style={{ color: tokens.colorNeutralForeground3 }}>
                    Enter LaTeX to see preview
                  </div>
                )}
              </div>

              <div style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 }}>
                <strong>Common symbols:</strong> ^{'{}'} (superscript), _{'{}'} (subscript), \frac{'{}'}{'{}'} (fraction),
                \sqrt{'{}'} (square root), \sum (sum), \int (integral)
              </div>
            </>
          ) : (
            <div className={styles.examplesGrid}>
              {examples.map((example, index) => (
                <div
                  key={index}
                  className={styles.exampleCard}
                  onClick={() => handleSelectExample(example.latex)}
                >
                  <div className={styles.exampleTitle}>{example.title}</div>
                  <div className={styles.exampleLatex}>{example.latex}</div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={handleInsert} disabled={!latex.trim()}>
              Insert
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
