import { useAuth } from "./store/authStore";
import { Login } from "./components/Login";
import { Dashboard } from "./components/dashboard/Dashboard";

export default function App() {
  const token = useAuth((s) => s.token);
  return token ? <Dashboard /> : <Login />;
}
