import "./App.scss";
import Headers from "./components/Header/Header";
import  Home  from "./pages/Home/Home";
import { Routes, Route } from 'react-router-dom';
import Product from './pages/Product/Product';
import Footer from "./components/Footer/Footer";
 import BlogBenefits from './components/Blog/BlogBenefits';
import  Newsletter from './components/Newsletter/Newsletter';
import  CookieModel from './components/CookieModel/CookieModel';
import Favorites from "./pages/Favorites/Favorites";
import PolitiqueCookies from  "./pages/PolitiqueCookies/PolitiqueCookies";
import AdminAddProduct from "./pages/admin/add-product";
import Confientilaite from "./pages/CONFI/Confidentialite";
import "./App.scss";
import Authentification from "./pages/Authentification/Authentification";
import Profil from "./pages/Profil/Profil";

function App() {

  return (
    <>
      <div className="App">
             <Headers />
        <h1 id="title">Parfume-Algarve-shop</h1>
     
        <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/product/:id" element={<Product />} /> {/* Remarque : :id */}
         <Route path="/admin/add-product" element={<AdminAddProduct />} />
         <Route path="/Favorites" element={<Favorites />} />
         <Route path="/PolitiqueCookies" element={<PolitiqueCookies />} />
         <Route path="/Confientilaite" element={<Confientilaite />} />
         <Route path="/Authentification" element={<Authentification />} />
         <Route path="/Profil" element={<Profil />} />

      </Routes>
     
      <BlogBenefits />
         <Newsletter />
         <CookieModel />
  

      </div>
           <Footer />
    </>
  );
}

export default App;
