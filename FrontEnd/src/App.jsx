import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./Pages/Login/login";
import HomePage from "./Pages/Home/home";
import CompilerLogsPage from "./Pages/Home/CompilerLogs";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage check={true} />} />
      <Route path="/" element={<LoginPage check={false} />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/compiler-logs" element={<CompilerLogsPage />} />
    </Routes>
  );
}

export default App;
