import { useEffect, useState } from "react";

function RulesDashboard() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/rules`)
      .then(res => res.json())
      .then(data => {
        setRules(data);
        setLoading(false);
      })
      .catch(() => {
        setRules([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Rules Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : rules.length === 0 ? (
        <p>No rules found.</p>
      ) : (
        <table className="table-auto border w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Platform</th>
              <th className="p-2 border">Triggers</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Response</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr key={rule._id}>
                <td className="p-2 border">{rule.platform}</td>
                <td className="p-2 border">{rule.trigger.join(", ")}</td>
                <td className="p-2 border">{rule.responseType}</td>
                <td className="p-2 border">
                  {rule.responseType === "text"
                    ? rule.responseText
                    : rule.responseType === "ai"
                    ? rule.aiInstruction
                    : rule.csvSource}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RulesDashboard;
