import "./App.css";
import Home from "./pages/Home";
import Recommendations from "./pages/Recommendations";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/recommendations" element={<Recommendations />}></Route>
      <Route path="/about" element={<Recommendations />}></Route>
    </Routes>
  );
}

export default App;
