import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createHashRouter,
  RouterProvider,
  useLoaderData,
} from "react-router-dom";
import data from './data.js';
import { rootLoader } from './routes/root.jsx';
import Root from "./routes/root.jsx";
import ErrorPage from "./routes/error-page.jsx";
import Info from "./routes/info.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);