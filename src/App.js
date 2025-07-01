import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import FormattedLogLine from './FormattedLogLine';
import './App.css';

function App() {
  const [logs, setLogs] = useState('');
  const [keyword, setKeyword] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [serverIp, setServerIp] = useState('');
  const [currentIp, setCurrentIp] = useState('');

  const fetchLogs = (ip = currentIp) => {
    if (!ip) return;
    axios.get(`http://localhost:3001/logs?ip=${ip}`)
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  };


  const fetchLogsCallback = useCallback(
    (ip = currentIp) => {
      if (!ip) return;
      axios.get(`http://localhost:3001/logs?ip=${ip}`)
        .then(res => setLogs(res.data))
        .catch(err => console.error(err));
    },
    [currentIp]
  );

  useEffect(() => {
    if (!autoRefresh || !currentIp) return;
    const interval = setInterval(() => fetchLogsCallback(), 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, currentIp, fetchLogsCallback]);

  const lines = logs
    .split('\n')
    .filter(line => line.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <div className="App">
      <h1>Visualizador de Logs</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="IP do servidor SSH"
          value={serverIp}
          onChange={(e) => setServerIp(e.target.value)}
        />
        <button onClick={() => {
          setCurrentIp(serverIp);
          fetchLogs(serverIp);
        }}>
          Conectar
        </button>
        <input
          type="text"
          placeholder="Filtrar palavra-chave..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={() => setAutoRefresh(!autoRefresh)}
          />
          Atualização automática
        </label>
      </div>

      <div className="log-box">
        {lines.map((line, index) => (
          <FormattedLogLine key={index} line={line} />
        ))}
      </div>
    </div>
  );
}

export default App;
