import React from "react";
import "./App.scss";
import Headers from "./components/Header/Header";
import Home from "./pages/Home/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import Product from "./pages/Product/Product";
import RetourProduit from "./pages/Product/RetourProduit";  
import Footer from "./components/Footer/Footer";
import BlogBenefits from "./components/Blog/BlogBenefits";
import Newsletter from "./components/Newsletter/Newsletter";
// import CookieModel from "./components/CookieModel/CookieModel";
import InfoSite from "./components/InfoSite/InfoSite";
import Favorites from "./pages/Favorites/Favorites";
import PolitiqueCookies from "./pages/PolitiqueCookies/PolitiqueCookies";

import AdminAddProduct from "./pages/admin/add-product";  
import AdminProductMng from "./pages/admin/AdminProductMng";   
import AdminPromotion from "./pages/admin/AdminPromotion";   
import AdminOrders from "./pages/admin/AdminOrders";        
import EditProduct from "./pages/admin/EditProduct";        
import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminRoute from "./helpers/AdminRoute";

import FAQ from "./pages/FAQ/FAQ";
import Authentification from "./pages/Authentification/Authentification";
import MonCompte from "./pages/MonCompte/MonCompte";
import Cart from "./pages/Cart/Cart";
import AddAdresse from "./pages/addAdresse/addAdresse";
import Orders from "./pages/Orders/Orders";
import TrackOrder from "./pages/Orders/TrackOrder";
import Delivery from "./pages/Delivery/Delivery";
import Checkout from "./pages/Checkout/Checkout";
import Payment from "./pages/Payment/Payment";
import Success from "./pages/Payment/Success";
import ForgotPassword from "./pages/pagePassword/ForgotPassword";
import ResetPassword from "./pages/pagePassword/ResetPassword";
import Contact from "./pages/Contact/Contact";
import Review from "./pages/Review/Review";
import Notifications from "./pages/Notifications/Notifications";
import MentionsLegales from "./pages/PageSite/MentionsLegales";
import CGV from "./pages/PageSite/CGV";
import PolitiqueConfidentialite from "./pages/PageSite/PolitiqueConfidentialite";
import SecuriteProduits from "./pages/PageSite/SecuriteProduits";
import AvisClients from "./pages/AvisClients/AvisClients";
import SiteMap from "./pages/PageSite/SiteMap";
import PaymentMethods from "./pages/Payment/PaymentMethods";
import PaymentCancelled from "./pages/Payment/PaymentCancelled";
import Confirmation from "./pages/Confirmation/Confirmation";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import QrCodePage from "./pages/App/QrCodePage"
import QuiSommesNous from "./pages/PageSite/QuisommeNous";



function App() {
  
  return (
    <>
      <div className="App">
        <Headers />
        
        <Routes>
    <Route path="/" element={<Navigate to="/Home" />} />  
       <Route path="/Home" element={<Home />} /> 
           <Route path="*" element={<ErrorPage />} />
           <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<Product />} />{" "}

        {/*Route admin imbriquées*/}
      <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
>
  <Route path="add-product" element={<AdminAddProduct />} />
  <Route path="products" element={<AdminProductMng />} />
  <Route path="promotions" element={<AdminPromotion />} />
  <Route path="orders" element={<AdminOrders />} />
</Route>

       
          <Route path="/Favorites" element={<Favorites />} />
          <Route path="/PolitiqueCookies" element={<PolitiqueCookies />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/Authentification" element={<Authentification />} />
          <Route path="/Authentification/checkout" element={<Authentification />} />
          <Route path="/MonCompte" element={<MonCompte />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/add-adresse" element={<AddAdresse />} />
          <Route path="/Orders" element={<Orders />} />
          <Route path="/tracking/:orderId" element={<TrackOrder />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/:orderId" element={<Payment />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          <Route path="/success" element={<Success />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/review/:id" element={<Review />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/cgv" element={<CGV />} />
         <Route path="/mentions-legales" element={<MentionsLegales />} />
         <Route path="/PolitiqueConfidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/securite-produits" element={<SecuriteProduits />} />
          <Route path="/avis-clients" element={<AvisClients />} />
          <Route path="/sitemap" element={<SiteMap />} />
          <Route path="/paymentMethods" element={<PaymentMethods />} />
          <Route path="/confirmation" element={<Confirmation />} />
         <Route path="/QrCodePage" element={<QrCodePage />} />
        <Route path="/QuiSommesNous" element={<QuiSommesNous />} />
        <Route path="/retour-produit" element={<RetourProduit />} />

        </Routes>

        <BlogBenefits />
        <Newsletter />
       {/* <CookieModel /> */} 
        <InfoSite />
      </div>
      <Footer />

    </>
  );
}

export default App;
