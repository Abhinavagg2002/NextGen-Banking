import Sidebar from "./Components/Sidebar";
import "./styles.css";
import "./Css/Base/base.css";
import Dashboard from "./Components/Dashboard";

export default function Dashboard2() {
  return (
    <div className="App">
      <Sidebar />
      <Dashboard />
    </div>
  );
}
