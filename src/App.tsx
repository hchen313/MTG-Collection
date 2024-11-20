import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard'
import { Cards } from './components/Cards'
import { Inventory } from './components/Inventory'


const App: React.FC = () => {
  return (
      <Router>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/cards" element={<PrivateRoute><Cards /></PrivateRoute>} />
              <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
      </Router>
  );
};

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
      return <Navigate to="/login" />;
  }

  return children;
};

export default App;
