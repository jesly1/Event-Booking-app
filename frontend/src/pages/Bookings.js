import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import './Bookings.css';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);
  
  // Get the logged-in user's ID from context
  const userId = authContext.userId;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const graphqlQuery = {
      query: `
        query {
          bookings {
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
      
      // Filter bookings for the logged-in user
      const userBookings = responseData.data.bookings.filter(
        booking => booking.user._id === userId
      );

      setBookings(userBookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBookingHandler = async (bookingId) => {
    const graphqlQuery = {
      query: `
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
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
      if (responseData.data.cancelBooking) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== bookingId)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bookings-container">
      <h2>Your Bookings</h2>
      {loading ? (
        <Spinner />
      ) : (
        <ul className="bookings-list">
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <li key={booking._id} className="booking-item">
                <h3>{booking.event.title}</h3>
                <p>{booking.event.description}</p>
                <p>Date: {new Date(booking.event.date).toLocaleDateString()}</p>
                <p className="price">Price: ${booking.event.Price}</p>
                <p>Booked by: {booking.user.email}</p>
                {/* Delete button */}
                <button className='btn' onClick={() => deleteBookingHandler(booking._id)}>
                  Delete Booking
                </button>
              </li>
            ))
          ) : (
            <p>No bookings found.</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default Bookings;
