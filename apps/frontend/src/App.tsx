import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import { CookiesProvider } from "react-cookie";

const ComparisonPage = lazy(() => import("./components/pages/ComparisonPage"));

const WeatherReportsPage = lazy(
  () => import("./components/pages/WeatherReportPage")
);

const Homepage = lazy(() => import("./components/pages/Homepage"));

function App() {
  return (
    <CookiesProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/history" element={<WeatherReportsPage />} />
            <Route
              path="/compare/:reportId1/:reportId2"
              element={<ComparisonPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default App;
