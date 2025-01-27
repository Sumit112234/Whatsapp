import Whatsapp from "./pages/Whatsapp";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { getUser } from "./utils/userHandler";
import Temp from "./pages/temporaryPage";

function App() {
  const { user, setUser } = useAuth();

  async function validateUserSession() {
    try {
      const res = await getUser(); // Server-side validation of user session
      setUser(res);
    } catch (err) {
      console.error("User session validation failed:", err);
      setUser(null); // Clear user state if validation fails
    }
  }

  useEffect(() => {
    validateUserSession(); // Validate session on every page load
  }, []);

  return (
    <Router>
      <Routes>
      <Route path='/' element={user ? <Whatsapp /> : <Navigate to={"/login"} />} />
      <Route path='/temp' element={<Temp/>} />
				<Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
				<Route path='/signup' element={user ? <Navigate to='/' /> : <Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
