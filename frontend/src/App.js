import { useEffect, useState } from "react";
const API = "https://your-backend.onrender.com";

function App() {
  const [emails, setEmails] = useState([]);
  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
    sendAt: "",
  });

  const loadEmails = async () => {
    const res = await fetch(`${API}/emails`);
    const data = await res.json();
    setEmails(data);
  };

  useEffect(() => {
    loadEmails();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    await fetch(`${API}/emails/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Email scheduled");
    setForm({ to: "", subject: "", body: "", sendAt: "" });
    loadEmails();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📧 Email Scheduler</h2>

      <form onSubmit={submit}>
        <input
          placeholder="To"
          value={form.to}
          onChange={(e) => setForm({ ...form, to: e.target.value })}
        /><br/>

        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        /><br/>

        <textarea
          placeholder="Body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        /><br/>

        <input
          type="datetime-local"
          value={form.sendAt}
          onChange={(e) => setForm({ ...form, sendAt: e.target.value })}
        /><br/>

        <button>Schedule Email</button>
      </form>

      <hr/>

      <h3>📜 Emails</h3>
      <ul>
        {emails.map((e) => (
          <li key={e.id}>
            <b>{e.subject}</b> → {e.to}  
            <br/>
            Status: <b>{e.status}</b>
          </li>
        ))}
      </ul>

      <hr/>
      <a href="http://localhost:4000/admin/queues" target="_blank">
        🔥 Open Bull Dashboard
      </a>
    </div>
  );
}

export default App;
