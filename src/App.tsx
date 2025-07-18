import { memo } from "react";
import "./App.css";
import Spreadsheet from "./Spreadsheet";
const App = memo(function App() {
  return <>
      <h1>React Spreadsheet</h1>
      <Spreadsheet />
    </>;
});
export default App;