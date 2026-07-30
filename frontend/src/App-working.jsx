import { useEffect, useState } from "react";

function App() {
  const [jds, setJds] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [lob, setLob] = useState("");

  const [designation, setDesignation] = useState("");

  const [band, setBand] = useState("");

  const loadJDs = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/jd");

      const data = await response.json();

      setJds(data.jds || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadJDs();
  }, []);

  const saveJD = async () => {
    try {
      await fetch(
        "http://localhost:4000/api/jd",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            wizardData: {
              basic: {
                lob,

                designation,

                band,
              },
            },
          }),
        },
      );

      setShowForm(false);

      setLob("");

      setDesignation("");

      setBand("");

      loadJDs();
    } catch (error) {
      console.error(error);
    }
  };

  if (showForm) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Create JD</h1>

        <br />

        <input
          placeholder="LOB"
          value={lob}
          onChange={(e) => setLob(e.target.value)}
        />

        <br />

        <br />

        <input
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />

        <br />

        <br />

        <input
          placeholder="Band"
          value={band}
          onChange={(e) => setBand(e.target.value)}
        />

        <br />

        <br />

        <button onClick={saveJD}>Save JD</button>

        <button
          onClick={() => setShowForm(false)}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <div
        style={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          marginBottom: "20px",
        }}
      >
        <div>
          <h1>JAE JD Creator</h1>

          <h3>Total JDs : {jds.length}</h3>
        </div>

        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "10px 20px",

            background: "#8B0000",

            color: "white",

            border: "none",

            cursor: "pointer",
          }}
        >
          + Create New JD
        </button>
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Designation</th>

            <th>LOB</th>

            <th>Status</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {jds.map((jd) => (
            <tr key={jd.id}>
              <td>{jd.designation}</td>

              <td>{jd.lob}</td>

              <td>{jd.status}</td>

              <td>
                <button onClick={() => alert(jd.id)}>Open</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
