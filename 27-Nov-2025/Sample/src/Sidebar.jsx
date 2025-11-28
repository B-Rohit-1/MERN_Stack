function Sidebar({ setPage }) {
  return (
    <aside
      style={{
        width: "200px",
        background: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px"
      }}
    >
      <h2>Navigate</h2>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li><button onClick={() => setPage("home")}>Home</button></li>
        <li><button onClick={() => setPage("about")}>About</button></li>
        <li><button onClick={() => setPage("contact")}>Contact</button></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
