import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <p style={styles.text}>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" style={styles.link}>Go back home</Link>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "50px" },
  heading: { fontSize: "60px", color: "#ff4d4d" },
  text: { fontSize: "20px", marginBottom: "20px" },
  link: { textDecoration: "none", color: "#007bff", fontWeight: "bold", fontSize: "18px" },
};

export default NotFound;
