import { HashRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import NotFound from "./components/notfound";
import { Suspense, lazy } from "react";
import { useEagerConnect } from "./hooks/useEagerConnect";

const Test = lazy(() => import("./components/Header"));
function App() {
  useEagerConnect();

  return (
    <>
      <Suspense>
        <Routes>
          <Route path="/" element={<Test />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
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
