import {init} from 'init/init';
import AppRoutes from 'init/AppRoutes';

import '@fontsource/allerta-stencil';
import '@fontsource/alumni-sans';

import 'the-new-css-reset/css/reset.css';
import React from "react";
import {createRoot} from "react-dom/client";

init().then(() => { // If initStore() starts taking a noticeable amount of time, create a loading view.
  const container = document.getElementById('root') as Element;
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AppRoutes />
    </React.StrictMode>
  );
});