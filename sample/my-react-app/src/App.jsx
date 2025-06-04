import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


  useEffect(() => {
    axios.get(`${API_URL}/getAll`)  // 🔁 Change port if needed
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Error connecting to backend');
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Vite + React + Backend</h1>
      {message && <p style={{ color: 'green' }}>✅ Message: {message}</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
    </div>
  );
}

export default App;
