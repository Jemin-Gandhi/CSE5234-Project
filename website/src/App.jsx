import './App.css';
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Purchase from './pages/purchase.jsx';
import PaymentEntry from './pages/paymentEntry.jsx';
import ShippingEntry from './pages/shippingEntry.jsx';
import ViewOrder from './pages/viewOrder.jsx';
import ViewConfirmation from './pages/viewConfirmation.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Header from './components/Header.jsx';
import { StoreProvider } from "./store/Store.jsx";
import Footer from './components/Footer.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Home from './pages/Home.jsx';

export default function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <StoreProvider>
        <Header />
        <main className="content flex-grow-1">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/purchase' element={<Purchase />} />
            <Route path='/purchase/paymentEntry' element={<PaymentEntry />} />
            <Route path='/purchase/shippingEntry' element={<ShippingEntry />} />
            <Route path='/purchase/viewOrder' element={<ViewOrder />} />
            <Route path='/purchase/viewConfirmation' element={<ViewConfirmation />} />
            <Route path='/contact' element={<ContactUs />} />
            <Route path='/about' element={<AboutUs />} />
            <Route path='*' element={<Navigate replace to="/" />} />
          </Routes>
        </main>
        <Footer />
      </StoreProvider>
    </div>
  );
}
