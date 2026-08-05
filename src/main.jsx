import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ElektaTerminal from "./ElektaTerminal.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ElektaTerminal />
  </StrictMode>
);
