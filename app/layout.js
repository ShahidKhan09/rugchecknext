import "./globals.css";

export const metadata = {
  title: "RugCheck",
  description: "Token analysis dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-container">
            <a
              href="/explore"
              className="logo"
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              RugCheck
            </a>{" "}
            <div className="nav-links">
              <a href="/" className="nav-link">
                Home
              </a>
              <a href="/explore" className="nav-link">
                Explore
              </a>
              <a href="/explore" className="nav-link">
                About Us
              </a>
              {/* <a href="/dashboard" className="nav-link">Dashboard</a> */}
            </div>
          </div>
        </nav>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
