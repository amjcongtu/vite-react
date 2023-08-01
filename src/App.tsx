import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import NotFound from "./components/notfound";
import { lazy } from "react";

const Test = lazy(() => import("./components/Header"));
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
function WrapperApp() {
  return (
    <>
      <HashRouter>
        <App />
      </HashRouter>
    </>
  );
}
export default WrapperApp;
