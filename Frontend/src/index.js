import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import Modal from "react-modal";
import { BrowserRouter } from "react-router-dom";
Modal.setAppElement("#root");

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>
);