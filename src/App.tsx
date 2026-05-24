import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useStore } from "./store/useStore";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import AdminProducts from "./pages/AdminProducts";
import { Footer, Navbar } from "./components";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/product"
              element={
                <ProtectedRoute>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
