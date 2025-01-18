import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";  // Import the separated routes
import AppDashboardRoutes  from "./AppDashboardRoutes"

function App() {
  return (
    <>
      <Router>
        <AppRoutes />
        <AppDashboardRoutes />
      </Router>
    </>
  );
}

export default App;
