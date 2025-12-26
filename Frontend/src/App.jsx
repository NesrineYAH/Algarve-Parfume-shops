import "./App.scss";
import Headers from "./components/Header/Header";
import Home from "./pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import Product from "./pages/Product/Product";
import Footer from "./components/Footer/Footer";
import BlogBenefits from "./components/Blog/BlogBenefits";
import Newsletter from "./components/Newsletter/Newsletter";
// import CookieModel from "./components/CookieModel/CookieModel";
import InfoSite from "./components/InfoSite/InfoSite";
import Favorites from "./pages/Favorites/Favorites";
import PolitiqueCookies from "./pages/PolitiqueCookies/PolitiqueCookies";
import AdminAddProduct from "./pages/admin/add-product";
import AdminProductManagement from "./pages/admin/AdminProductManagement";
import AdminPromotion from "./pages/admin/AdminPromotion";
import EditProduct from "./pages/admin/EditProduct";
import FAQ from "./pages/FAQ/FAQ";
import Authentification from "./pages/Authentification/Authentification";
import MonCompte from "./pages/MonCompte/MonCompte";
import Cart from "./pages/Cart/Cart";
import AddAdresse from "./pages/addAdresse/addAdresse";
import Orders from "./pages/Orders/Orders";
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
import Confirmation from "./pages/Confirmation/Confirmation";
import ErrorPage from "./pages/ErrorPage/ErrorPage";





function App() {
  return (
    <>
      <div className="App">
        <Headers />
        
        <Routes>
          <Route path="/Home" element={<Home />} />
           <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<Product />} />{" "}
          <Route path="/admin/add-product" element={<AdminAddProduct />} />
          <Route path="/admin/AdminProductManagement" element={<AdminProductManagement />}/>{" "}
          <Route path="/admin/EditProduct/:id" element={<EditProduct />} />
          <Route path="/admin/promotions" element={<AdminPromotion />} />
          <Route path="/Favorites" element={<Favorites />} />
          <Route path="/PolitiqueCookies" element={<PolitiqueCookies />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/Authentification" element={<Authentification />} />
          <Route path="/Authentification/checkout" element={<Authentification />} />
          <Route path="/MonCompte" element={<MonCompte />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/add-adresse" element={<AddAdresse />} />
          <Route path="/Orders" element={<Orders />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
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
          <Route path="/paiement-methods" element={<PaymentMethods />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="*" element={<ErrorPage />} />

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
