import { BrowserRouter, Routes, Route } from "react-router-dom";
import Logs from "./pages/Logs";
import RulesDashboard from "./pages/RulesDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Logs />} />
        <Route path="/rules" element={<RulesDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
