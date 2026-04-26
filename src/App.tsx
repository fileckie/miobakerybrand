import { useState } from "react";
import BrandPage from "./pages/BrandPage";
import AdminWorkshop from "./pages/AdminWorkshop";

function App() {
  const [route, setRoute] = useState(window.location.pathname);

  window.addEventListener("popstate", () => setRoute(window.location.pathname));

  const go = (path: string) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  return (
    <div className="min-h-screen bg-ash text-kiln">
      {route === "/admin" ? (
        <AdminWorkshop />
      ) : (
        <BrandPage go={go} />
      )}
    </div>
  );
}

export default App;
