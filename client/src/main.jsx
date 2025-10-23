import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AuthUserContextProvider from "./context/AuthUserContext.jsx";
import PageLoadingContextProvider from "./context/PageLoadingContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter basename="/">
    <AuthUserContextProvider>
      <PageLoadingContextProvider>
        <App />
      </PageLoadingContextProvider>
    </AuthUserContextProvider>
  </BrowserRouter>
  // </StrictMode>
);
