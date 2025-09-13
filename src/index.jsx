import "./bootstrapApi";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // ✅ Import Tailwind CSS
import AOS from 'aos';
import 'aos/dist/aos.css';


AOS.init();


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
