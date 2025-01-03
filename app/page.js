"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    date: "",
    time: "",
    guests: 1,
  });

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const BACKEND_URL = "https://restaurant-booking-backend-cnci.onrender.com";


  // Fetch bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(BACKEND_URL);
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email before submission
    if (!validateEmail(formData.contact)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/bookings", formData);
      setMessage("Booking successful!");
      setFormData({ name: "", contact: "", date: "", time: "", guests: 1 });
      fetchBookings();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error booking slot.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      setMessage("Booking deleted successfully!");
      fetchBookings();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting booking.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Restaurant Table Booking</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mb-6"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Contact (Email)"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            min="1"
            max="20"
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Book Table
        </button>
      </form>

      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      <h2 className="text-xl font-semibold mb-4">Bookings</h2>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking._id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <div>
              <p className="font-medium">
                {booking.name} - {booking.date} at {booking.time}
              </p>
              <p className="text-sm text-gray-600">
                {booking.guests} guests | {booking.contact}
              </p>
            </div>
            <button
              onClick={() => handleDelete(booking._id)}
              className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
