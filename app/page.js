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
import axios from 'axios';
import CryptoJS from "crypto-js";
import { TokenListProvider } from "@solana/spl-token-registry";

const SOL_SVG = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 80' preserveAspectRatio='xMidYMid meet'>
  <defs>
    <linearGradient id='grad' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#00FFA3'/>
      <stop offset='1' stop-color='#DC1FFF'/>
    </linearGradient>
  </defs>
  <g>
    <rect x='0' y='0'   width='160' height='20' rx='4' fill='url(#grad)'/>
    <rect x='0' y='30'  width='160' height='20' rx='4' fill='url(#grad)' opacity='0.95'/>
    <rect x='0' y='60'  width='160' height='20' rx='4' fill='url(#grad)' opacity='0.9'/>
  </g>
</svg>
`;
const SOL_DATA_URI = "data:image/svg+xml;utf8," + encodeURIComponent(SOL_SVG);


export default function HomePage() {
  const [token, setToken] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [price, setPrice] = useState(0.01505856192);
  const [flash, setFlash] = useState("");
  const [report, setReport] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  console.log("report here is", report)
  // const CryptoJS = require("crypto-js");
  const secretKey = "quecko";

  const handleAnalyze = async () => {
    if (token) {
      const trimmedToken = token.trim();

      if (trimmedToken) {
        console.log("token here is out", token)

        try {
          console.log("token here is in", token)

          // Call API with token address
          const res = await axios.get(
            `https://be-git-main-shahids-projects-091bca0f.vercel.app/airdrops/solanaReport`,
            {
              params: { address: trimmedToken },
            }

          );
          if (res) {
            const decrypted = decryptData(res?.data?.data);
            setReport(decrypted);
            setShowDashboard(true);
          }



          // window.scrollTo(0, 0);
        } catch (err) {
          console.error("Error fetching report:", err);
          alert("Failed to fetch report. Try again!");
        }
      }

    }
  };

  const decryptData = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
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

  // Helper function (place this above your component or inside it)
  const formatSupply = (supply, decimals) => {
    if (!supply || !decimals) return "";
    const value = supply / Math.pow(10, decimals);
    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "/B";
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(2).replace(/\.00$/, "") + "/M";
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(2).replace(/\.00$/, "") + "/K";
    } else {
      return value.toFixed(2).replace(/\.00$/, "");
    }
  };

  const formatMarketCap = (supply, decimals, creatorBalance, price) => {
    if (!supply || !price) return "-";

    // Convert raw supply & creator balance to human-readable numbers
    const totalSupply = supply / Math.pow(10, decimals || 0);
    const creatorHoldings = (creatorBalance || 0) / Math.pow(10, decimals || 0);

    // Circulating supply
    const circulatingSupply = totalSupply - creatorHoldings;

    // Market Cap
    const marketCap = circulatingSupply * price;

    // Format with K, M, B
    if (marketCap >= 1e9) {
      return (marketCap / 1e9).toFixed(2) + "/B";
    } else if (marketCap >= 1e6) {
      return (marketCap / 1e6).toFixed(2) + "/M";
    } else if (marketCap >= 1e3) {
      return (marketCap / 1e3).toFixed(2) + "/K";
    } else {
      return marketCap.toFixed(2);
    }
  };

  const formatLpLockedPercentage = (lpLocked, lpTotalSupply) => {
    if (!lpLocked || !lpTotalSupply || lpTotalSupply === 0) return "-";

    let lpLockedPct = (lpLocked / lpTotalSupply) * 100;

    // If it's exactly 100% or very close, cap it at 99.99
    if (lpLockedPct >= 100) {
      lpLockedPct = 99.99;
    }

    return lpLockedPct.toFixed(2) + "%";
  };

  // Format helper with decimals support
  const formatTokenAmount = (amount, decimals) => {
    if (!amount) return "";

    // convert raw amount using decimals
    const value = Number(amount) / Math.pow(10, decimals);

    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
      return value.toFixed(2).replace(/\.00$/, ""); // keep 2 decimals for small numbers
    }
  };

  // Helper to format numbers into K, M, B
  const formatUiAmount = (amount) => {
    if (!amount) return "—";

    const value = Number(amount);

    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
      return value.toFixed(2).replace(/\.00$/, "");
    }
  };

  const [tokenList, setTokenList] = useState([]);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokens = await new TokenListProvider().resolve();
        const list = tokens.filterByClusterSlug("mainnet-beta").getList();
        setTokenList(list);
      } catch (err) {
        console.error("Failed to load token list:", err);
      }
    };

    loadTokens();
  }, []);

  const getTokenInfo = (mint) => {
    if (!mint) return { symbol: "", logoURI: "" };

    if (mint.startsWith("11111")) return { symbol: "-", logoURI: "" };
    if (mint === "So11111111111111111111111111111111111111112")
      return {
        symbol: "SOL",
        logoURI: SOL_DATA_URI,
      };

    if (tokenList.length > 0) {
      const tokenInfo = tokenList.find((t) => t.address === mint);
      if (tokenInfo) return { symbol: tokenInfo.symbol, logoURI: tokenInfo.logoURI };
    }

    // fallback → short address
    return {
      symbol: mint.slice(0, 4) + "..." + mint.slice(-4),
      logoURI: "",
    };
  };

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
            <div className="mainheaderimg">
              <div className="imagefilemeta">
                <img src={report?.fileMeta?.image}></img>
              </div>
              <div className="token-info">
                <h1>{report?.tokenMeta?.name} {`(${report?.fileMeta?.symbol})`}</h1>
                <p>Professional Risk Analysis Dashboard</p>
              </div>
            </div>
            <div className="price-info">
              <div
                className={`price ${flash === "up"
                  ? "positive"
                  : flash === "down"
                    ? "negative"
                    : ""
                  }`}
              >
                ${report?.price.toFixed(11)}
              </div>
              <div className="risk-score">{report?.score_normalised} / 100</div>
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
              <div className="risk-score-large">{report?.score_normalised}/100</div>
              <div
                className={
                  report?.score_normalised < 30
                    ? "risk-status"
                    : report?.score_normalised < 60
                      ? "risk-status warn"
                      : "risk-status danger"
                }
              >
                {report?.score_normalised < 30
                  ? "Good"
                  : report?.score_normalised < 60
                    ? "Warn"
                    : "Danger"}
              </div>
              <div className="risk-details">
                {report?.risks?.map((risk, index) => (
                  <div key={index} className={risk?.level === "danger" ? "risk-item dangers" : risk?.level === "warn" ? "risk-item warns" : "risk-item green"}>
                    <span className="risk-name">{risk?.name}</span>

                    <div
                      className="risk-info"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <i className="fas fa-info-circle"></i>

                      {hoveredIndex === index && (
                        <div className="risk-tooltip">{risk?.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

           
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
                  <div className="info-value"> {formatSupply(report?.token?.supply, report?.token?.decimals)}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-user"></i> Creator
                  </div>
                  <div className="info-value">  {report?.creator
                    ? `${report.creator.slice(0, 6)}...${report.creator.slice(-6)}`
                    : ""}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-wallet"></i> Creator Balance
                  </div>
                  <div className="info-value">{report?.creatorBalance === 0 ? "SOLD" : report?.creatorBalance}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-globe"></i> Market Cap
                  </div>
                  <div className="info-value">
                    ${formatMarketCap(
                      report?.token?.supply,
                      report?.token?.decimals,
                      report?.creatorBalance,
                      report?.price
                    )}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-users"></i> Holders
                  </div>
                  <div className="info-value">{report?.totalHolders}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-key"></i> Mint Authority
                  </div>
                  <div className="info-value">{report?.token?.mintAuthority || "-"}</div>
                </div>
                {report?.markets && (
                  <div className="info-item">
                    <div className="info-label">
                      <i className="fas fa-lock"></i> LP Locked
                    </div>
                    <div className="info-value">
                      {
                        formatLpLockedPercentage(
                          report?.markets[0]?.lp?.lpLocked,
                          report?.markets[0]?.lp?.lpTotalSupply
                        )
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card-row">
              {/* Community Sentiment */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-comments"></i> Community Sentiment
                  </h2>
                </div>
              </div>

              {/* Insider Value */}
              <div className="card dsfdsgdfgdfg">
                <div className="card-header">
                  <h2 className="card-title">
                    <i className="fas fa-user-secret"></i> Insider Networks [BETA]
                  </h2>
                </div>
                {
                  report?.insiderNetworks ?
                    (
                      <table className="holders-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>Accs</th>
                            <th>Tokens</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report?.insiderNetworks?.map((insider, index) => (
                            <tr>
                              <td>
                                {insider?.id}
                              </td>
                              <td>{insider?.type === "transfer" ? "XFER" : insider?.type}</td>
                              <td>{insider?.size}</td>
                              <td>{formatTokenAmount(insider?.tokenAmount, report?.token?.decimals)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                    :
                    (
                      <div className="sentiment-container">
                        <div className="no-insight">
                          <i
                            className="fas fa-search"
                            style={{ fontSize: "32px", marginBottom: "15px" }}
                          ></i>
                          <p>NO INSIGHT NETWORKS DETECTED</p>
                        </div>
                      </div>
                    )
                }
              </div>
              <div className="card dsfdsgdfgdfg">
                <div className="card-header dsffsdfsdfds">
                  <h2 className="card-title">
                    <i className="fas fa-trophy"></i> Top 20 Holders
                  </h2>
                  {/* <h2>3.58%</h2> */}
                </div>
                <table className="holders-table">
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Amount</th>
                      <th>percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report?.topHolders?.slice(0, 20).map((holder, index) => (
                      <tr key={index}>
                        <td>
                          <div className="account-address">
                            <i className="fas fa-wallet"></i>{" "}
                            {holder?.address?.slice(0, 4)}...{holder?.address?.slice(-4)}
                          </div>
                        </td>
                        <td>{holder?.uiAmount ? formatUiAmount(holder.uiAmount) : "—"}</td>
                        <td>{holder?.pct ? holder?.pct?.toFixed(2) + "%" : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Holders + Markets */}
          <div className="dashboard-grid">
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
                  {report?.markets?.map((market, index) => {
                    // const tokenA = getTokenInfo(market?.mintA);
                    const tokenB = getTokenInfo(market?.mintB);
                    return (
                      <tr key={index}>
                        <td>
                          <div className="account-address">
                            <i className="fas fa-wallet"></i>   {market?.pubkey?.slice(0, 4)}...{market?.pubkey?.slice(-4)}
                          </div>
                        </td>
                        <td>{report?.fileMeta?.symbol} / {tokenB?.symbol}</td>
                        <td>
                          {market?.mintLP?.startsWith("11111")
                            ? "-"
                            : market?.mintLP
                              ? `${market.mintLP.slice(0, 10)}...${market.mintLP.slice(-10)}`
                              : ""}
                        </td>
                        <td>
                          <div className="solliquidty">
                            <div className="leftside">
                              <img src={tokenB.logoURI} alt={tokenB.symbol}></img>
                              {tokenB.symbol}
                            </div>
                            <div className="rightside">
                              <img src={report?.fileMeta?.image}></img>
                               {report?.fileMeta?.symbol}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="status-badge status-good">100%</span>
                        </td>
                      </tr>
                    )
                  })}


                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
