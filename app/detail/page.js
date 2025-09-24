"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CryptoJS from "crypto-js";

// decrypt helper
const decryptData = (cipherText, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

export default function DetailPage() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://be-git-main-shahids-projects-091bca0f.vercel.app/airdrops/byAddress?address=${address}`
        );
        const result = await res.json();

        if (result?.statusCode === 200 && result?.data) {
          const secretKey = "quecko";
          const decrypted = decryptData(result.data, secretKey);
          setTokenData(decrypted);
        }
      } catch (err) {
        console.error("Error fetching token detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  // Helper to generate article-style description
  const generateArticle = (tokenData) => {
    if (!tokenData) return "No token data available.";

    const {
      baseToken,
      platform,
      dexerInfo,
      marketCap,
      liquidity,
      priceUsd,
      priceQuote,
      volume1h,
      priceChange1h,
      priceChange5m,
      priceChange24h,
      securityScanResultList,
      poolId,
      pairContractAddress,
      createdAt,
      updatedAt,
    } = tokenData;

    return `
${baseToken?.name || "Unknown Token"} (${
      baseToken?.symbol || "N/A"
    }) is listed on the ${platform?.name || "N/A"} blockchain and traded via ${
      dexerInfo?.name || "N/A"
    } DEX.

Currently, the token price is $${
      priceUsd?.toFixed(10) || "N/A"
    }, with a market capitalization of $${
      marketCap?.toLocaleString() || "N/A"
    } and liquidity of $${
      liquidity?.toLocaleString() || "N/A"
    }. In the past hour, its volume reached $${
      volume1h?.toLocaleString() || "N/A"
    }, and the price has changed ${priceChange1h}% in the last 1 hour, ${priceChange5m}% in 5 minutes, and ${priceChange24h}% in 24 hours.

Security-wise, the token has undergone the following checks:
${
  securityScanResultList
    ?.map(
      (scan) =>
        `• ${scan.name}: ${scan.status === "g" ? "Passed ✅" : "Failed ⚠️"}`
    )
    .join("\n") || "No security data available."
}

Additional metadata:
- Pool ID: ${poolId || "N/A"}
- Pair Contract Address: ${pairContractAddress || "N/A"}
- Created At: ${createdAt ? new Date(createdAt.$date).toLocaleString() : "N/A"}
- Updated At: ${updatedAt ? new Date(updatedAt.$date).toLocaleString() : "N/A"}

The current price quote is ${priceQuote || "N/A"} USD per token.
`;
  };
  if (loading) {
    return (
      <div className="container mx-auto p-6 text-white">
        <p className="text-center text-xl">Loading token data...</p>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="container mx-auto p-6 text-white">
        <p className="text-center text-xl">No data found for this token.</p>
      </div>
    );
  }

  return (
 <div className="container">
      {/* Header */}
      <div className="card header-card">
        <div className="token-logo">
          {tokenData.baseToken?.logo ? (
            <img src={tokenData.baseToken.logo} alt={tokenData.baseToken.symbol} />
          ) : (
            <div className="logo-placeholder">
              {tokenData.baseToken?.symbol?.[0] || "?"}
            </div>
          )}
        </div>
        <div className="token-info">
          <h1>
            {tokenData.baseToken?.name}{" "}
            <span className="symbol">({tokenData.baseToken?.symbol})</span>
          </h1>
          <p className="address">
            Address: <span>{tokenData.baseToken?.address}</span>
          </p>
          <p className="platform">
            Platform: <span>{tokenData.platform?.name}</span> | DEX:{" "}
            <span>{tokenData.dexerInfo?.name}</span>
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-section">
        <h2>📊 Live Chart</h2>
        <iframe
          src={`https://dexscreener.com/solana/${address}?embed=1&theme=dark`}
          title="Dex Chart"
        ></iframe>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: "Market Cap", value: `$${tokenData.marketCap?.toLocaleString()}` },
          { label: "Liquidity", value: `$${tokenData.liquidity?.toLocaleString()}` },
          { label: "Price (USD)", value: `$${tokenData.priceUsd?.toFixed(10)}` },
          { label: "Price Quote", value: tokenData.priceQuote },
          { label: "Volume (1h)", value: `$${tokenData.volume1h?.toLocaleString()}` },
          { label: "Price Change 1h", value: `${tokenData.priceChange1h}%` },
          { label: "Price Change 5m", value: `${tokenData.priceChange5m}%` },
          { label: "Price Change 24h", value: `${tokenData.priceChange24h}%` },
        ].map((stat) => (
          <div className="stat-card" key={stat.label}>
            <h3>{stat.label}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Security Scan */}
      <div className="card">
        <h2>🔍 Security Scan Results</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Check</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tokenData.securityScanResultList?.map((scan) => (
              <tr key={scan.id}>
                <td>{scan.id}</td>
                <td>{scan.name}</td>
                <td>
                  {scan.status === "g" ? (
                    <span className="status passed">✅ Passed</span>
                  ) : (
                    <span className="status failed">⚠️ Failed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Metadata */}
      <div className="card">
        <h2>📑 Metadata</h2>
        <table>
          <tbody>
            <tr>
              <td className="label">Pool ID</td>
              <td>{tokenData.poolId}</td>
            </tr>
            <tr>
              <td className="label">Pair Contract Address</td>
              <td className="break">{tokenData.pairContractAddress}</td>
            </tr>
            <tr>
              <td className="label">Created At</td>
              <td>{new Date(tokenData.createdAt?.$date).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="label">Updated At</td>
              <td>{new Date(tokenData.updatedAt?.$date).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
