import "./App.scss";
import Headers from "./components/Header/Header";
import  Home  from "./pages/Home/Home";
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Product from './pages/Product/Product';
import Footer from "./components/Footer/Footer";
// import Blog from './components/Blog/Blog';

function App() {

  return (
    <>
      <div className="App">
             <Headers />
        <h1>Parfume-Algarve-shop</h1>
        <h2>Welcome to Parfume Algarve shop</h2>
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/register" element={<Register />} />
         <Route path="/login" element={<Login />} />
         <Route path="/product/:id" element={<Product />} /> {/* Remarque : :id */}
      </Routes>
     

      </div>
           <Footer />
    </>
  );
}

export default App;
 /*
 <Route path="/register" element={<Register />} />
<Route path="/login" element={<Login />} />
        */ 