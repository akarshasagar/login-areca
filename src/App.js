import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Components/Homepage/Homepage";
import Login from "./Components/Homepage/Login";
import Dashboard from "./Components/DashboardComponent/Dashboard";

function App() {
  return (
    <div >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;