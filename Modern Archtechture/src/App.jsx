import { Routes, Route, Navigate } from "react-router-dom";
import CursorEffect from "./components/CursorEffect.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Schedule from "./pages/Schedule.jsx";
import FindSpecialist from "./pages/FindSpecialist.jsx";
import FindSite from "./pages/FindSite.jsx";
import Chat from "./pages/Chat.jsx";
import Materials from "./pages/Materials.jsx";
import Contractors from "./pages/Contractors.jsx";
import NewProject from "./pages/NewProject.jsx";
import Billing from "./pages/Billing.jsx";
import Settings from "./pages/Settings.jsx";
import Documents from "./pages/Documents.jsx";
import Timeline from "./pages/TimeLIne.jsx";

export default function App() {
  return (
    <>
      <CursorEffect />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/find-specialist" element={<FindSpecialist />} />
        <Route path="/find-site" element={<FindSite />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/contractors" element={<Contractors />} />
        <Route path="/my-projects" element={<NewProject />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/document" element={<Documents />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
