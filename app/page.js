// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const [token, setToken] = useState("");
//   const router = useRouter();

//   const handleAnalyze = () => {
//     if (!token.trim()) {
//       alert("Please enter a token address");
//       return;
//     }

//     // Redirect to dashboard
//     router.push("/dashboard");
//   };

//   return (
//     <>
//       {!showDashboard ? (
//         <section className="search-section">
//           <h1 className="search-title">Analyze Any Token</h1>
//           <p className="search-subtitle">
//             Enter a token address to check its security, liquidity, and market
//             data
//           </p>
//           <div className="search-box">
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Enter token address (e.g., 4k3Dyjzvzp8e...)"
//               value={token}
//               onChange={(e) => setToken(e.target.value)}
//             />
//             <button className="search-btn" onClick={handleAnalyze}>
//               <i className="fas fa-search"></i> Analyze Token
//             </button>
//           </div>
//         </section>
//       ) : (
//         <section className="dashboard">
//           <div className="token-header">
//             <div className="token-info">
//               <h1>Charlie Cartman</h1>
//               <p>Professional Risk Analysis Dashboard</p>
//             </div>
//             <div className="price-info">
//               <div className="price">$0.01505856192</div>
//               <div className="risk-score">16 / 100</div>
//             </div>
//           </div>
//         </section>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [token, setToken] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [price, setPrice] = useState(0.01505856192);
  const [flash, setFlash] = useState("");

  const handleAnalyze = () => {
    // if (!token.trim()) {
    //   alert("Please enter a token address");
    //   return;
    // }
    setShowDashboard(true);
    // window.scrollTo(0, 0);
  };

  // pulse + random price updates
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      const priceEl = document.querySelector(".price");
      if (priceEl) {
        priceEl.classList.toggle("pulse");
      }
    }, 4000);

    const priceInterval = setInterval(() => {
      setPrice((prev) => {
        const change = (Math.random() - 0.5) * 0.0005;
        const newPrice = prev + change;
        setFlash(change > 0 ? "up" : "down");
        setTimeout(() => setFlash(""), 1000);
        return newPrice;
      });
    }, 10000);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(priceInterval);
    };
  }, []);

  return (
    <div className="container">
      {/* Search Section */}
      {!showDashboard && (
        <section className="search-section">
          <h1 className="search-title">Analyze Any Token</h1>
          <p className="search-subtitle">
            Enter a token address to check its security, liquidity, and market
            data
          </p>

          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Enter token address (e.g., 4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button className="search-btn" onClick={handleAnalyze}>
              <i className="fas fa-search"></i> Analyze Token
            </button>
          </div>

          <div className="domain-notice">
            <i className="fas fa-info-circle"></i> Token domains are now
            available - <a href="#">Claim Now!</a>
          </div>
        </section>
      )}

      {/* Dashboard Section */}
      {showDashboard && (
        <section className="dashboard">
          <div className="token-header">
            <div className="token-info">
              <h1>Charlie Cartman</h1>
              <p>Professional Risk Analysis Dashboard</p>
            </div>
            <div className="price-info">
              <div
                className={`price ${
                  flash === "up"
                    ? "positive"
                    : flash === "down"
                    ? "negative"
                    : ""
                }`}
              >
                ${price.toFixed(11)}
              </div>
              <div className="risk-score">16 / 100</div>
            </div>
          </div>

          <div className="dashboard-grid">
            {/* Risk Analysis */}
            <div className="card risk-analysis">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-analytics"></i> Risk Analysis
                </h2>
              </div>
              <div className="risk-score-large">16/100</div>
              <div className="risk-status">Good</div>
              <div className="risk-details">
                <div className="risk-item">
                  <i className="fas fa-info-circle"></i> Low amount of LP
                  Providers
                </div>
                <div className="risk-item">
                  <i className="fas fa-user-check"></i> Lauren Insights [MID]
                </div>
              </div>
            </div>

            {/* Token Overview */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-coins"></i> Token Overview
                </h2>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-box"></i> Supply
                  </div>
                  <div className="info-value">1B</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-user"></i> Creator
                  </div>
                  <div className="info-value">Unknown</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-wallet"></i> Creator Balance
                  </div>
                  <div className="info-value">SOLD</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-globe"></i> Market Cap
                  </div>
                  <div className="info-value">$68M</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-users"></i> Holders
                  </div>
                  <div className="info-value">8,091</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-key"></i> Mint Authority
                  </div>
                  <div className="info-value">-</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-lock"></i> LP Locked
                  </div>
                  <div className="info-value">100%</div>
                </div>
              </div>
            </div>

            {/* Community Sentiment */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-comments"></i> Community Sentiment
                </h2>
              </div>
              <div className="sentiment-container">
                <span className="insight-tag">Insider Networks [BETA]</span>
                <div className="no-insight">
                  <i
                    className="fas fa-search"
                    style={{ fontSize: "32px", marginBottom: "15px" }}
                  ></i>
                  <p>NO INSIGHT NETWORKS DETECTED</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Holders + Markets */}
          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-trophy"></i> Top Holders
                </h2>
              </div>
              <table className="holders-table">
                <thead>
                  <tr>
                    <th>Account</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="account-address">
                        <i className="fas fa-wallet"></i> 1pt...0%
                      </div>
                    </td>
                    <td>10H</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="account-address">
                        <i className="fas fa-wallet"></i> 2pt...0%
                      </div>
                    </td>
                    <td>10H</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-store"></i> Markets
                </h2>
              </div>
              <table className="markets-table">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Pair</th>
                    <th>LP Mint</th>
                    <th>Liquidity</th>
                    <th>LP Locked</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="account-address">
                        <i className="fas fa-wallet"></i> 1pt...0%
                      </div>
                    </td>
                    <td>Charlie / SOL</td>
                    <td>Infinium</td>
                    <td>$521K</td>
                    <td>
                      <span className="status-badge status-good">100%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="account-address">
                        <i className="fas fa-wallet"></i> 2pt...0%
                      </div>
                    </td>
                    <td>Charlie / SOL</td>
                    <td>$0.0000022</td>
                    <td>$0.0000066</td>
                    <td>
                      <span className="status-badge status-bad">0.00%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Custom Domain + Chartlist + Login */}
          <div className="dashboard-grid">
            <div className="card custom-domain">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-globe"></i> Custom Domain
                </h2>
              </div>
              <p className="domain-text">
                Claim a custom domain for this token for users to use across the
                ecosystem.
              </p>
              <button className="claim-btn">Claim Domain</button>
            </div>

            <div className="card chartlist-token">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-list"></i> Chartlist Token
                </h2>
              </div>
              <div className="token-badge">CLAIM</div>
            </div>

            <div className="card login-section">
              <div className="card-header">
                <h2 className="card-title">
                  <i className="fas fa-user"></i> Login
                </h2>
              </div>
              <button className="login-btn">Connect Wallet</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
