import "./App.scss";
import Headers from "./components/Header/Header.jsx";
import  Home  from "./pages/Home/Home.jsx";
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register/Register.jsx';
import Login from './pages/Login/Login.jsx';

function App() {

  return (
    <>
      <div className="App">
             <Headers />
        <h1>Parfume-Algarve-shop</h1>
        <h2>Welcome to Parfume Algarve shop</h2>
<Home />
    {/* <Caroussel /> */}
    
 
      <Routes>
             <Route path="/" element={<Home />} />
         <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
      </Routes>

      </div>
    </>
  );
}

export default App;
 /*
 <Route path="/register" element={<Register />} />
<Route path="/login" element={<Login />} />
        */ 