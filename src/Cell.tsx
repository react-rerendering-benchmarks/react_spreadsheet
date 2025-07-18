import { memo } from "react";
interface CellProps {
  value: string;
  displayValue: string;
  updateValue: (newValue: string, row: number, col: number) => void;
  selectCell: (row: number, col: number) => void;
  isSelected: boolean;
  row: number;
  col: number;
}
const Cell = memo(function Cell({
  value,
  displayValue,
  updateValue,
  selectCell,
  isSelected,
  row,
  col
}: CellProps) {
  function handleClick(): void {
    selectCell(row, col);
    console.log("clicked", row, col);
  }
  return <div onClick={handleClick} className="cell">
      {isSelected ? <input type="text" value={value} onChange={e => updateValue(e.target.value, row, col)} autoFocus /> : <p>{displayValue}</p>}
    </div>;
});
export default Cell;