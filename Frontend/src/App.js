import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SellerSignup from "./components/SellerSignup";
import LoginPage from "./components/Login";
import Buyerhome from "./components/Buyerhome";
import SellerHome from "./components/Sellerhome";
import { UserProvider } from "./components/UserContext";
import ProductList from "./components/productlist";
import Searchlist from "./components/searchlist";
import Edit from "./components/edit";
import Categorylist from "./components/categorylist";
import EditBuyer from "./components/Editbuyer";
import Editseller from "./components/Editseller";
import Fullinfo from "./components/fullinfo";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SellerSignup />} />
            <Route path="/signup" element={<SellerSignup />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="signup/Sellerhome" element={<SellerHome />} />
            <Route path="/Sellerhome" element={<SellerHome />} />
            <Route path="/Buyerhome" element={<Buyerhome />} />
            <Route path="signup/Buyerhome" element={<Buyerhome />} />
            <Route path="/product/search" element={<Searchlist />} />
            <Route path="/product/category" element={<Categorylist />} />
            <Route
              path="signup/Sellerhome/productlist"
              element={<ProductList />}
            />
            <Route path="Sellerhome/productlist/edit/:id" element={<Edit />} />
            <Route path="Sellerhome/productlist" element={<ProductList />} />
            <Route path="Buyerhome/EditBuyer" element={<EditBuyer />} />
            <Route path="Sellerhome/Editseller" element={<Editseller />} />
            <Route path="product/search/fullinfo" element={<Fullinfo />} />
            <Route path="product/category/fullinfo" element={<Fullinfo />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
