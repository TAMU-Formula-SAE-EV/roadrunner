import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './dashboard/Dashboard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DataProvider from './data-provider/DataProvider';


function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DataProvider>
          <Dashboard />
      </DataProvider>
    </DndProvider>
  );
}

export default App;
