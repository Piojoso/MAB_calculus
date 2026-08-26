import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { MabCalculus } from "./modules/home/view/MabCalculus";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MabCalculus />
  </StrictMode>,
);
