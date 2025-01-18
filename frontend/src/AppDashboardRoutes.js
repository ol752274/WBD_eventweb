import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainAdmin from './components/AdminDashboard/mainAdmin.jsx';
import MainUser from './components/UserDashboard/mainUser.jsx';
import ManageEmpRegistrations from './components/AdminDashboard/ManageEmpRegistrations.jsx';
import ManageEmployees from './components/AdminDashboard/ManageEmployees.jsx';
import ManageUsers from './components/UserDashboard/ManageUsers.jsx';
import MainEmployee from './components/EmployeeDashboard/mainEmployee.jsx';
import EmployeeProfile from './components/EmployeeDashboard/EmployeeProfile.jsx';
import ManageBookings from './components/AdminDashboard/manageBookings.jsx'
import ManageMyBookings from './components/EmployeeDashboard/ManageMyBookings.jsx';
import Statistics from './components/AdminDashboard/Statistics.jsx';
import ManageLogs from './components/AdminDashboard/manageLogs.jsx'

const AppDashboardRoutes = () => {
  return (
    <Routes>
      {/* Main Admin Dashboard Layout with nested routes */}
      <Route path="/mainAdmin" element={<MainAdmin />}>
        <Route path="ManageEmpRegistrations" element={<ManageEmpRegistrations />} />
        <Route path="ManageEmployees" element={<ManageEmployees />} />
        <Route path="ManageUsers" element ={<ManageUsers/>}/>
        <Route path="ManageBookings" element={<ManageBookings/>}/>
        <Route path="/mainAdmin/Statistics" element={<Statistics/>}/>
        <Route path="viewlogs" element={<ManageLogs/>}/>
      </Route>

      {/* Main Admin Dashboard Layout with nested routes */}
      <Route path="/mainEmployee" element={<MainEmployee/> }>
        <Route path="EmpProfile" element={<EmployeeProfile/>} />
        <Route path="ManageMyBookings" element={<ManageMyBookings/>}       />
      </Route>
      
      {/* Main User Dashboard */}
      <Route path='/mainUser' element = {<MainUser/>}   />
    </Routes>
  );
};

export default AppDashboardRoutes;
