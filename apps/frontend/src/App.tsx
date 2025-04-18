import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const ComparisonPage = lazy(() => import("./components/pages/ComparisonPage"));

const WeatherReportsPage = lazy(
  () => import("./components/pages/WeatherReportPage")
);

const Homepage = lazy(() => import("./components/pages/Homepage"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/history" element={<WeatherReportsPage />} />
        <Route
          path="/compare/:reportId1/:reportId2"
          element={<ComparisonPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
