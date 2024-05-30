import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/items')
      .then(response => response.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div className="App">
      <h1>Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}: {item.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

