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
  Dropdown,
  Option,
} from '@fluentui/react-components';
import {
  TableAdd24Regular,
  TableDeleteRow24Regular,
  TableDeleteColumn24Regular,
  TableInsertRow24Regular,
  TableInsertColumn24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  dialogSurface: {
    maxWidth: '800px',
    width: '90vw',
  },
  toolbar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '16px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  cell: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: '8px',
    minWidth: '100px',
  },
  headerCell: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: '8px',
    minWidth: '100px',
    backgroundColor: tokens.colorNeutralBackground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  cellInput: {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    ':focus': {
      outline: 'none',
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  dimensionInputs: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '16px',
  },
});

interface TableEditorProps {
  open: boolean;
  onClose: () => void;
  onInsert?: (tableHtml: string) => void;
  initialRows?: number;
  initialCols?: number;
}

export function TableEditor({
  open,
  onClose,
  onInsert,
  initialRows = 3,
  initialCols = 3,
}: TableEditorProps) {
  const styles = useStyles();
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [hasHeader, setHasHeader] = useState(true);
  const [cellData, setCellData] = useState<string[][]>(
    Array(initialRows).fill(null).map(() => Array(initialCols).fill(''))
  );
  const [borderStyle, setBorderStyle] = useState<'solid' | 'dashed' | 'none'>('solid');

  const updateDimensions = (newRows: number, newCols: number) => {
    const newData = Array(newRows).fill(null).map((_, rowIdx) =>
      Array(newCols).fill(null).map((_, colIdx) =>
        cellData[rowIdx]?.[colIdx] || ''
      )
    );
    setCellData(newData);
    setRows(newRows);
    setCols(newCols);
  };

  const updateCell = (rowIdx: number, colIdx: number, value: string) => {
    const newData = [...cellData];
    newData[rowIdx][colIdx] = value;
    setCellData(newData);
  };

  const insertRow = (afterIdx: number) => {
    const newData = [...cellData];
    newData.splice(afterIdx + 1, 0, Array(cols).fill(''));
    setCellData(newData);
    setRows(rows + 1);
  };

  const deleteRow = (rowIdx: number) => {
    if (rows <= 1) return;
    const newData = cellData.filter((_, idx) => idx !== rowIdx);
    setCellData(newData);
    setRows(rows - 1);
  };

  const insertColumn = (afterIdx: number) => {
    const newData = cellData.map(row => {
      const newRow = [...row];
      newRow.splice(afterIdx + 1, 0, '');
      return newRow;
    });
    setCellData(newData);
    setCols(cols + 1);
  };

  const deleteColumn = (colIdx: number) => {
    if (cols <= 1) return;
    const newData = cellData.map(row => row.filter((_, idx) => idx !== colIdx));
    setCellData(newData);
    setCols(cols - 1);
  };

  const generateTableHtml = () => {
    let html = `<table style="border-collapse: collapse; width: 100%;">`;
    
    cellData.forEach((row, rowIdx) => {
      html += '<tr>';
      row.forEach((cell) => {
        const isHeader = hasHeader && rowIdx === 0;
        const tag = isHeader ? 'th' : 'td';
        const borderStyleCss = borderStyle === 'none' ? 'none' : `1px ${borderStyle} #ccc`;
        const bgColor = isHeader ? '#f0f0f0' : 'transparent';
        html += `<${tag} style="border: ${borderStyleCss}; padding: 8px; background-color: ${bgColor};">${cell || '&nbsp;'}</${tag}>`;
      });
      html += '</tr>';
    });
    
    html += '</table>';
    return html;
  };

  const handleInsert = () => {
    if (onInsert) {
      onInsert(generateTableHtml());
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle>Insert Table</DialogTitle>

          <div className={styles.dimensionInputs}>
            <span>Rows:</span>
            <Input
              type="number"
              value={rows.toString()}
              onChange={(_, data) => {
                const newRows = parseInt(data.value) || 1;
                updateDimensions(newRows, cols);
              }}
              style={{ width: '80px' }}
            />
            <span>Columns:</span>
            <Input
              type="number"
              value={cols.toString()}
              onChange={(_, data) => {
                const newCols = parseInt(data.value) || 1;
                updateDimensions(rows, newCols);
              }}
              style={{ width: '80px' }}
            />
            <Dropdown
              placeholder="Border style"
              value={borderStyle}
              onOptionSelect={(_, data) => setBorderStyle(data.optionValue as 'solid' | 'dashed' | 'none')}
              style={{ width: '120px' }}
            >
              <Option value="solid">Solid</Option>
              <Option value="dashed">Dashed</Option>
              <Option value="none">No border</Option>
            </Dropdown>
            <Button
              appearance="subtle"
              onClick={() => setHasHeader(!hasHeader)}
            >
              {hasHeader ? 'Remove Header' : 'Add Header'}
            </Button>
          </div>

          <div className={styles.toolbar}>
            <Button
              appearance="subtle"
              icon={<TableInsertRow24Regular />}
              size="small"
              onClick={() => insertRow(rows - 1)}
            >
              Add Row
            </Button>
            <Button
              appearance="subtle"
              icon={<TableInsertColumn24Regular />}
              size="small"
              onClick={() => insertColumn(cols - 1)}
            >
              Add Column
            </Button>
            <Button
              appearance="subtle"
              icon={<TableDeleteRow24Regular />}
              size="small"
              onClick={() => deleteRow(rows - 1)}
              disabled={rows <= 1}
            >
              Delete Row
            </Button>
            <Button
              appearance="subtle"
              icon={<TableDeleteColumn24Regular />}
              size="small"
              onClick={() => deleteColumn(cols - 1)}
              disabled={cols <= 1}
            >
              Delete Column
            </Button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <tbody>
                {cellData.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, colIdx) => (
                      <td
                        key={colIdx}
                        className={hasHeader && rowIdx === 0 ? styles.headerCell : styles.cell}
                      >
                        <input
                          className={styles.cellInput}
                          value={cell}
                          onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                          placeholder={hasHeader && rowIdx === 0 ? 'Header' : 'Cell'}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.actions}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button appearance="primary" icon={<TableAdd24Regular />} onClick={handleInsert}>
              Insert Table
            </Button>
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
