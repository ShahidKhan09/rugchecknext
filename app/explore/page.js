"use client";

import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const filters = ["Solana"];
const PAGE_SIZE = 100; // tokens per page

// decryption helper
const decryptData = (cipherText, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

export default function ExplorePage() {
  const [tokensData, setTokensData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://be-git-main-shahids-projects-091bca0f.vercel.app/airdrops/list?limit=${PAGE_SIZE}&offset=${page}&orderField=createdAt&orderDirection=1`
        );
        const result = await res.json();

        if (result?.data?.success && result.data?.data) {
          const secretKey = "quecko";
          const decrypted = decryptData(result.data.data, secretKey);

          setTokensData(decrypted.items || []);
          setTotalPages(decrypted.pages || 1);
        }
      } catch (err) {
        console.error("Error fetching tokens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [page]);

  // filter & search logic
  const filteredTokens = tokensData.filter((token) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "New" && token.new) ||
      token.platform?.name?.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch =
      token.baseToken?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.baseToken?.symbol
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      token.baseToken?.address
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const SkeletonCard = () => {
    return (
      <div className="token-card skeleton-card">
        <div className="skeleton skeleton-badge w-24 h-4 mb-3"></div>
        <div className="skeleton skeleton-text w-40 h-4 mb-3"></div>
        <div className="skeleton skeleton-text w-32 h-6 mb-2"></div>
        <div className="skeleton skeleton-text w-28 h-4 mb-3"></div>
        <div className="skeleton skeleton-btn w-28 h-8"></div>
      </div>
    );
  };

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000); // reset after 2s
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Explore Crypto Tokens</h1>
        <p className="page-subtitle">
          Discover trending tokens across multiple blockchains
        </p>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="search-icon">
          <i className="fas fa-search"></i>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-chips">
        {filters.map((chip) => (
          <div
            key={chip}
            className={`filter-chip ${activeFilter === chip ? "active" : ""}`}
            onClick={() => setActiveFilter(chip)}
          >
            {chip}
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="token-grid">
          {[...Array(50)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : filteredTokens.length > 0 ? (
        <>
          <div className="token-grid">
            {filteredTokens.map((token, idx) => (
              <div key={idx} className="token-card">
                <span className="token-chain">
                  {token.platform?.name}{" "}
                  {token.new && <span className="new-badge">New!</span>}
                </span>

                <div className="token-address">
                  Contract Address (
                  {token.baseToken?.address
                    ? `${token.baseToken.address.slice(
                        0,
                        9
                      )}...${token.baseToken.address.slice(-9)}`
                    : "N/A"}
                  )
                  {token.baseToken?.address && (
                    <button
                      className="copy-btn"
                      title="Copy Address"
                      onClick={() => handleCopy(token.baseToken.address)}
                    >
                      📋
                    </button>
                  )}
                  {copiedAddress === token.baseToken?.address && (
                    <span className="copy-success"> Address copied!</span>
                  )}
                </div>

                <h3 className="token-name">
                  {token.baseToken?.name}{" "}
                  <span className="token-symbol">
                    {token.baseToken?.symbol}
                  </span>
                </h3>
                <p className="token-description">
                  Market Cap:{" "}
                  {token.marketCap
                    ? token.marketCap.toLocaleString()
                    : "Unknown"}
                </p>
                <div className="token-details">
                  <span className="chain-badge">
                    <i className="fas fa-bolt"></i> {token.platform?.name}
                  </span>
                  <a
                    href={`/detail?address=${token.baseToken?.address}`}
                    className="btn btn-outline-light"
                  >
                    View Details <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              ‹ Prev
            </button>

            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next ›
            </button>
          </div>
        </>
      ) : (
        <p>No tokens found.</p>
      )}
    </div>
  );
}
