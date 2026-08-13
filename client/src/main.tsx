import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// @ts-ignore: CSS side-effect import is resolved by the bundler.
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
