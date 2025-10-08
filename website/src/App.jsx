import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Purchase from './components/purchase.jsx';
import PaymentEntry from './components/paymentEntry.jsx';
import ShippingEntry from './components/shippingEntry.jsx';
import ViewOrder from './components/viewOrder.jsx';
import ViewConfirmation from './components/viewConfirmation.jsx';
import Navbar from './components/Navbar.jsx';

export default function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <main className="content">
          <Routes>
            <Route path='/purchase' element={<Purchase />} />
            <Route path="/" element={<Navigate replace to="/purchase" />} />
            <Route path='/purchase/paymentEntry' element={<PaymentEntry />} />
            <Route path='/purchase/shippingEntry' element={<ShippingEntry />} />
            <Route path='/purchase/viewOrder' element={<ViewOrder />} />
            <Route path='/purchase/viewConfirmation' element={<ViewConfirmation />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}
