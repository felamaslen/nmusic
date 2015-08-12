import React from 'react';
import App from './components/App';

if (process.env.NODE_ENV !== 'test') {
  React.render(
    <App/>,
    document.body
  );
}
