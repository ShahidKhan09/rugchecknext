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
    <div className="container mx-auto p-6 text-white">
      <div className="bg-gray-900 rounded-xl p-6 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          {tokenData.baseToken?.name}{" "}
          <span className="text-gray-400">({tokenData.baseToken?.symbol})</span>
        </h1>
        <p className="text-gray-300 mb-1 break-all">
          Address: {tokenData.baseToken?.address}
        </p>
        <p className="text-gray-300">
          Platform: {tokenData.platform?.name} | DEX:{" "}
          {tokenData.dexerInfo?.name}
        </p>
      </div>
      {/* DexScreener Chart */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Live Chart</h2>
        <iframe
          src={`https://dexscreener.com/solana/${address}?embed=1&theme=dark`}
          style={{
            width: "100%",
            height: "600px",
            border: "none",
            borderRadius: "12px",
          }}
        ></iframe>
      </div>
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg whitespace-pre-wrap">
        {generateArticle(tokenData)}
      </div>

      {/* Header Card */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Market Cap",
            value: `$${tokenData.marketCap?.toLocaleString()}`,
          },
          {
            label: "Liquidity",
            value: `$${tokenData.liquidity?.toLocaleString()}`,
          },
          {
            label: "Price (USD)",
            value: `$${tokenData.priceUsd?.toFixed(10)}`,
          },
          { label: "Price Quote", value: tokenData.priceQuote },
          {
            label: "Volume (1h)",
            value: `$${tokenData.volume1h?.toLocaleString()}`,
          },
          { label: "Price Change 1h", value: `${tokenData.priceChange1h}%` },
          { label: "Price Change 5m", value: `${tokenData.priceChange5m}%` },
          { label: "Price Change 24h", value: `${tokenData.priceChange24h}%` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-800 rounded-lg p-4 shadow-md flex flex-col items-center justify-center"
          >
            <h3 className="text-gray-400 text-sm">{stat.label}</h3>
            <p className="text-xl font-semibold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Security Scan Table */}
      <div className="mb-8 overflow-x-auto bg-gray-900 rounded-xl p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Security Scan Results</h2>
        <table className="min-w-full border-collapse border border-gray-700 text-left">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2 border-b border-gray-700">ID</th>
              <th className="px-4 py-2 border-b border-gray-700">Check</th>
              <th className="px-4 py-2 border-b border-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {tokenData.securityScanResultList?.map((scan) => (
              <tr key={scan.id} className="hover:bg-gray-700">
                <td className="px-4 py-2 border-b border-gray-700">
                  {scan.id}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {scan.name}
                </td>
                <td className="px-4 py-2 border-b border-gray-700">
                  {scan.status === "g" ? (
                    <span className="text-green-400 font-semibold">
                      Passed ✅
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold">
                      Failed ⚠️
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Metadata Table */}
      <div className="overflow-x-auto bg-gray-900 rounded-xl p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Metadata</h2>
        <table className="min-w-full border-collapse border border-gray-700 text-left">
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 font-semibold">Pool ID</td>
              <td className="px-4 py-2">{tokenData.poolId}</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 font-semibold">Pair Contract Address</td>
              <td className="px-4 py-2 break-all">
                {tokenData.pairContractAddress}
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="px-4 py-2 font-semibold">Created At</td>
              <td className="px-4 py-2">
                {new Date(tokenData.createdAt?.$date).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Updated At</td>
              <td className="px-4 py-2">
                {new Date(tokenData.updatedAt?.$date).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
