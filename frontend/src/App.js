import React, { useState } from 'react';

function App() {
  const [form, setForm] = useState({ nome: '', cognome: '', email: '', eta: '' });
  const [did, setDid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (data.success) {
        setDid(data.did);
      } else {
        setError(data.error || 'Errore nella registrazione.');
      }
    } catch (err) {
      setError('Errore di connessione con il server.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Crea il tuo ID sicuro</h2>
      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" onChange={handleChange} required /><br /><br />
        <input name="cognome" placeholder="Cognome" onChange={handleChange} required /><br /><br />
        <input name="email" placeholder="Email desiderata" onChange={handleChange} required /><br /><br />
        <input name="eta" placeholder="Età" type="number" onChange={handleChange} required /><br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Creazione in corso...' : 'Crea Identità'}
        </button>
      </form>
      {did && <div style={{ marginTop: '2rem', color: 'green' }}><strong>DID creato:</strong><br />{did}</div>}
      {error && <div style={{ marginTop: '2rem', color: 'red' }}><strong>Errore:</strong><br />{error}</div>}
    </div>
  );
}

export default App;