import { useEffect, useState } from "react";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/logs`)
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => {
        setLogs([]);
        setLoading(false);
      });
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.userMessage.toLowerCase().includes(search.toLowerCase()) ||
      log.chatGPTReply.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Conversation Logs</h1>

      <input
        type="text"
        placeholder="Search messages..."
        className="mb-4 p-2 border rounded w-full md:w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredLogs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">User Message</th>
                <th className="p-2 border">ChatGPT Reply</th>
                <th className="p-2 border">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id}>
                  <td className="p-2 border">{log.userMessage}</td>
                  <td className="p-2 border">{log.chatGPTReply}</td>
                  <td className="p-2 border">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Logs;
