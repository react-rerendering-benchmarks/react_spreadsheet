import { useCallback, useState } from "react";
import Cell from "./Cell";

type CellLocation = { row: number; col: number };

function Spreadsheet() {
  // TODO decide on the data structure for the sheet
  const [cellValues, setCellValues] = useState<Record<string, string>>({});
  const [sheet, setSheet] = useState<string[][]>(() =>
    new Array(100).fill(new Array(100).fill(""))
  );
  const [selectedCell, setSelectedCell] = useState<CellLocation | null>(null);

  // TODO expand the sheet to 10000x10000 (buttons to go farther)
  // TODO add cell update, calculate displayValue and calculateColumnName

  function translateColumnIndexToName(index: number): string {
    let name = "";
    while (index >= 0) {
      name = String.fromCharCode((index % 26) + 65) + name;
      index = Math.floor(index / 26) - 1;
    }
    return name;
  }

  function translateColumnNameToIndex(name: string): number {
    let index = 0;
    for (let i = 0; i < name.length; i++) {
      index = index * 26 + name.charCodeAt(i) - 65;
    }
    return index;
  }

  // TODO edge case: loop in formula
  function parseCellValue(value: string): string {
    if (!value.startsWith("=")) return value;
    const matches = value.match(/([A-Z]+\d+)/g); // cell names
    const operations = value.split(/[A-Z]+\d+/g); // everything else
    console.log({ matches, operations });
    if (matches === null || operations[operations.length - 1] !== "")
      return "Incorrect formula!";
    let result = 0;
    matches.forEach((val, index) => {
      // TODO add proper order of operations
      const [col, row] = val.match(/([A-Z]+)(\d+)/)!.slice(1);
      const cellValue =
        cellValues[`${parseInt(row) - 1},${translateColumnNameToIndex(col)}`];
      if (cellValue === undefined) return "Incorrect formula!";
      if (index === 0) {
        result = parseFloat(parseCellValue(cellValue));
      } else {
        switch (operations[index]) {
          case "+":
            result += parseFloat(cellValue);
            break;
          case "-":
            result -= parseFloat(cellValue);
            break;
          case "*":
            result *= parseFloat(cellValue);
            break;
          case "/":
            result /= parseFloat(cellValue);
            break;
          default:
            return "Incorrect formula!";
        }
      }
    });
    return result.toString();
  }

  function updateValue(newValue: string, row: number, col: number): void {
    setCellValues((oldCellValues) => {
      const newCellValues = { ...oldCellValues };
      newCellValues[`${row},${col}`] = newValue;
      return newCellValues;
    });
  }

  function selectCell(row: number, col: number): void {
    setSelectedCell({ row, col });
  }

  return (
    <div className="spreadsheet-wrapper">
      <div className="spreadsheet">
        <div className="row header">
          <div className="cell header" key={-1}></div>
          {sheet[0].map((col, j) => (
            <div className="cell header" key={j}>
              {translateColumnIndexToName(j)}
            </div>
          ))}
        </div>
        {sheet.map((row, i) => (
          <div key={i} className="row">
            <div className="cell header" key={-1}>
              {i + 1}
            </div>
            {row.map((cell, j) => (
              <Cell
                key={j}
                value={cellValues[`${i},${j}`] || ""}
                displayValue={parseCellValue(cellValues[`${i},${j}`] || "")}
                updateValue={updateValue}
                selectCell={selectCell}
                isSelected={selectedCell?.row === i && selectedCell?.col === j}
                row={i}
                col={j}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Spreadsheet;
