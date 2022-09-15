import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import React from 'react';

import DemoScreen from 'demoScreen/DemoScreen';
import TitleWidget from 'titleWidget/TitleWidget';

function AppRoutes() {
  return (
    <BrowserRouter basename='/obs-web-widgets'>
      <Routes>
        <Route path="demo" element={<DemoScreen />} />
        <Route path="title" element={<TitleWidget />} />
        <Route path="*" element={<Navigate to="/demo" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;