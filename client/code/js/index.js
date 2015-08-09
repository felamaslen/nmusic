import React from 'react';
import DishSearch from './components/DishSearch';

if (process.env.NODE_ENV !== 'test') {
  React.render(
    <DishSearch/>,
    document.body
  );
}
