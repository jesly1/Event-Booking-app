import React, { useState, useEffect, useContext } from 'react';
import './Events.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';

function Events() {
  const [show, setShow] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); 

  const authContext = useContext(AuthContext); 

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleDetailClose = () => setShowDetailModal(false);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const graphqlQuery = {
      query: `
        query {
          events {
            _id
            title
            description
            Price
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        body: JSON.stringify(graphqlQuery),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();
      setEvents(responseData.data.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); 
    }
  };

  const handleSubmit = async () => {
    const graphqlQuery = {
      query: `
        mutation {
          createEvent(eventInput: {
            title: "${title}",
            description: "${description}",
            Price: ${price},
            date: "${date}"
          }) {
            _id
            title
            description
            Price
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };

    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        body: JSON.stringify(graphqlQuery),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authContext.token
        }
      });

      const responseData = await response.json();
      setEvents(prevEvents => [...prevEvents, responseData.data.createEvent]);
      setTitle('');
      setDescription('');
      setPrice(0);
      setDate('');
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleBookEvent = async () => {
    if (!selectedEvent) return;

    const graphqlQuery = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent._id}") {
            _id
            event {
              title
              description
              Price
              date
            }
            user {
              _id
              email
            }
            createdAt
            updatedAt
          }
        }
      `
    };

    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        body: JSON.stringify(graphqlQuery),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authContext.token
        }
      });
      const responseData = await response.json();
      console.log('Booking successful:', responseData.data.bookEvent);
      // Optionally, you can add additional logic here, like showing a success message
    } catch (err) {
      console.error(err);
    }
    handleDetailClose()
  };
  return (
    <div className='events-control'>
      <p>Share your own Events!</p>
      {authContext.token && (
        <button className='btn' onClick={handleShow}>
          Create Event
        </button>
      )}

      {loading ? (
        <Spinner /> 
      ) : (
        <ul className='events__list'>
          {events.map(event => (
            <li key={event._id} className='events__list-items'>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>Price: ${event.Price}</p>
              <p>Created by: {event.creator._id === authContext.userId ? "This event was created by you" : event.creator.email}</p>
              {event.creator._id !== authContext.userId && (
                <Button onClick={() => handleViewDetails(event)}>View Details</Button>
              )}
            </li>
          ))}
        </ul>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventTitle">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEventDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter event description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEventPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter event price"
                value={price}
                onChange={(e) => setPrice(+e.target.value)} // convert to number
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailModal} onHide={handleDetailClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent ? selectedEvent.title : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
              <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
              <p><strong>Price:</strong> ${selectedEvent.Price}</p>
              <p><strong>Created by:</strong> {selectedEvent.creator.email}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDetailClose}>
            Close
          </Button>
          {authContext.token && (
            <Button variant="primary" onClick={handleBookEvent}>
              Book Event
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Events;
