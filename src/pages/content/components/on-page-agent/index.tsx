import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/on-page-agent/app";

const style = document.createElement("style");

style.textContent = `
    #eye-agent {
    top:0;
    left:0;
    position:absolute;
    }

`;

document.head.append(style);

const root = document.createElement("div");
root.id = "eye-agent";

document.body.prepend(root);

createRoot(root).render(<App />);
