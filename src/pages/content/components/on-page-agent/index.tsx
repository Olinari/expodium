import { createRoot } from "react-dom/client";
import App from "@src/pages/content/components/on-page-agent/app";

const style = document.createElement("style");

style.textContent = `
    #eye-agent {
        position: fixed;
        width: 50px;
        height: 50px;
        z-index: 9999;
        background:linear-gradient(130deg, #26ff00, #30f2eb, #f65430, #ff0000);
        border-radius: 100vmax;
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: 120px 120px;
        animation: gradient 15s linear infinite;
        color: white;
        line-height: 0;
        bottom:12px;
        right:12px;
        cursor: pointer;
        font-size: 20px;
        font-weight: 200;
        box-shadow: 0 0 10px 5px linear-gradient(130deg, #26ff00, #00ffe5, #f65430, #ff0000);
      
    }

    @keyframes gradient {
        0% {
            background-position: 0% 100%;
            opacity: 0.8;
        
        }
        50% {
            background-position: 100% 50%;
            opacity: 0.9;
        }
        100% {
            background-position: 0% 100%;
            opacity: 0.8;
        }
`;

document.head.append(style);

const root = document.createElement("div");
root.id = "eye-agent";

document.body.prepend(root);

createRoot(root).render(<App />);
