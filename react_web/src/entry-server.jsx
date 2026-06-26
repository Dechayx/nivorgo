import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { MainApp } from './App.jsx';

export function render(url, context = {}) {
  const html = renderToString(
    <StaticRouter location={url} context={context}>
      <MainApp />
    </StaticRouter>
  );
  return { html };
}
