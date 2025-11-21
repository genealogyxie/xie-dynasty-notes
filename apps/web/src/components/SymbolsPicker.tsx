import { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  Button,
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
  symbolsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
    gap: '8px',
    marginTop: '16px',
    marginBottom: '16px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  symbolButton: {
    padding: '12px',
    fontSize: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
});

interface SymbolsPickerProps {
  open: boolean;
  onClose: () => void;
  onSelectSymbol?: (symbol: string) => void;
}

const symbolCategories = {
  common: ['©', '®', '™', '°', '±', '×', '÷', '≈', '≠', '≤', '≥', '∞', '√', 'π', 'Σ', 'Ω', 'α', 'β', 'γ', 'δ'],
  arrows: ['←', '→', '↑', '↓', '↔', '↕', '⇐', '⇒', '⇑', '⇓', '⇔', '⇕', '➔', '➜', '➝', '➞', '➟', '➠', '➡', '➢'],
  currency: ['$', '€', '£', '¥', '₹', '₽', '₩', '₪', '₦', '₨', '฿', '₡', '₵', '₴', '₸', '₺', '₼', '₾', '₿'],
  math: ['∀', '∂', '∃', '∅', '∇', '∈', '∉', '∋', '∏', '∑', '−', '∓', '∗', '∘', '∙', '√', '∛', '∜', '∝', '∞'],
  greek: ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ'],
  punctuation: ['…', '•', '·', '‣', '⁃', '‧', '∙', '◦', '⦾', '⦿', '—', '–', '‐', '‑', '‒', '―', '‖', '‗', '\'', '\"'],
};

export function SymbolsPicker({ open, onClose, onSelectSymbol }: SymbolsPickerProps) {
  const styles = useStyles();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof symbolCategories>('common');

  const handleSelectSymbol = (symbol: string) => {
    if (onSelectSymbol) {
      onSelectSymbol(symbol);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>Insert Symbol</DialogTitle>

          <TabList
            selectedValue={selectedCategory}
            onTabSelect={(_, data) => setSelectedCategory(data.value as keyof typeof symbolCategories)}
          >
            <Tab value="common">Common</Tab>
            <Tab value="arrows">Arrows</Tab>
            <Tab value="currency">Currency</Tab>
            <Tab value="math">Math</Tab>
            <Tab value="greek">Greek</Tab>
            <Tab value="punctuation">Punctuation</Tab>
          </TabList>

          <div className={styles.symbolsGrid}>
            {symbolCategories[selectedCategory].map((symbol, index) => (
              <div
                key={index}
                className={styles.symbolButton}
                onClick={() => handleSelectSymbol(symbol)}
                title={symbol}
              >
                {symbol}
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
