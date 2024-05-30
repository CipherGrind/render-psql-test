import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, ListGroup, ListGroupItem, Form, Button, Modal } from 'react-bootstrap';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetch('/api/items')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, quantity }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(newItem => {
      setItems([...items, newItem]);
      setName('');
      setDescription('');
      setQuantity(1);
    })
    .catch(error => console.error('Error adding item:', error));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/items/${editingItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editingItem.name, description: editingItem.description, quantity: editingItem.quantity }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(updatedItem => {
        setItems(items.map(item => (item.id === updatedItem.id ? updatedItem : item)));
        setEditingItem(null);
      })
      .catch(error => console.error('Error updating item:', error));
  };

  const handleDelete = (id) => {
    fetch(`/api/items/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setItems(items.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  const handleEditChange = (e) => {
    setEditingItem({ ...editingItem, [e.target.name]: e.target.value });
  };

  return (
    <Container className="p-1 mb-5 rounded">
      <h3 className="my-4">Submit a new Inventory Item:</h3>
      <Form onSubmit={handleSubmit} className="bg-dark p-3 rounded col-lg-8">
        <Form.Group controlId="formItemName" className="p-2 px-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formItemDescription" className="p-2 px-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formItemQuantity" className="p-2 px-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="success" type="submit" className="m-3">
          Add Item
        </Button>
      </Form>
      <h2 className="my-4">Current Inventory Items:</h2>
      <ListGroup className="mt-4 flex-row flex-wrap">
        {items.map(item => (
          <ListGroupItem key={item.id} className="itembox m-1 p-3 rounded row d-flex flex-wrap">  {/* Ensure each item has a unique key */}
            <h5>{item.name}</h5>
            <p>{item.description}</p>
            <p>Quantity: {item.quantity}</p>
            <div className="container d-flex align-items-end">
              <Button variant="primary" className="m-1" onClick={() => setEditingItem(item)}>Edit</Button>
              <Button variant="danger" className="m-1" onClick={() => handleDelete(item.id)}>Delete</Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
      <Modal show={!!editingItem} onHide={() => setEditingItem(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="formEditItemName" className="p-2 px-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editingItem?.name || ''}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEditItemDescription" className="p-2 px-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={editingItem?.description || ''}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEditItemQuantity" className="p-2 px-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={editingItem?.quantity || ''}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="m-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default App;
