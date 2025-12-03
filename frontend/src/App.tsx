import "./App.css";
import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import PageTransitions from "./components/PageTransition";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();

  return (
   <>
     <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransitions>
              <Home />
            </PageTransitions>
          }
        />
        <Route
          path="/get-started"
          element={
            <PageTransitions>
              <GetStarted />
            </PageTransitions>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransitions>
              {/* <About /> */}
            </PageTransitions>
          }
        />
      </Routes>
    </AnimatePresence>
    <Footer />
   </>
  );
}

export default App;
