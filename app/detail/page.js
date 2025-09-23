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

// helper for rendering object recursively
const renderObject = (obj) => {
  return Object.entries(obj).map(([key, value]) => {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return (
        <tr key={key}>
          <td>{key}</td>
          <td>
            <table className="nested-table">
              <tbody>{renderObject(value)}</tbody>
            </table>
          </td>
        </tr>
      );
    } else if (Array.isArray(value)) {
      return (
        <tr key={key}>
          <td>{key}</td>
          <td>
            {value.map((item, idx) =>
              typeof item === "object" ? (
                <table key={idx} className="nested-table">
                  <tbody>{renderObject(item)}</tbody>
                </table>
              ) : (
                <div key={idx}>{item.toString()}</div>
              )
            )}
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={key}>
          <td>{key}</td>
          <td>{value?.toString()}</td>
        </tr>
      );
    }
  });
};

export default function DetailPage() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch token data from API
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
        } else {
          console.error("Unexpected API response:", result);
        }
      } catch (err) {
        console.error("Error fetching token detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  if (loading) {
    return (
      <div className="container">
        <p>Loading token data...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {/* DexScreener Chart (always render with query param address) */}
      <div className="chart-section">
        <h2 className="chart-title">Live Chart</h2>
        <iframe
          src={`https://dexscreener.com/solana/${address}?embed=1&theme=dark`}
          style={{
            width: "100%",
            height: "750px",
            border: "none",
            borderRadius: "12px",
          }}
        ></iframe>
      </div>
      {/* Header */}
      {tokenData ? (
        <div className="token-header">
          <h1 className="token-title">
            {tokenData.baseToken?.name}{" "}
            <span className="token-price">{tokenData.baseToken?.symbol}</span>
          </h1>
          <div className="chart-info">
            <span>Address: {tokenData.baseToken?.address}</span>
          </div>
        </div>
      ) : (
        <p>No data found for this token.</p>
      )}

      {/* Token Info */}
      {tokenData && (
        <div className="card">
          <h2 className="card-title">All Token Data</h2>
          <table className="info-table">
            <tbody>{renderObject(tokenData)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
