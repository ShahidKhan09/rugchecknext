"use client";
import { useState } from "react";

const tokensData = [
  {
    chain: "ethereum",
    address: "0xe07...b7139",
    name: "Green Bitcoin",
    symbol: "$GBTC",
    description:
      "Bitcoin just smashed through its all-time high, lighting up the charts in unprecedented fashion. Green Bitcoin offers an eco-friendly alternative with massive potential.",
    icon: <i className="fab fa-ethereum"></i>,
    chainName: "ETHEREUM",
  },
  {
    chain: "sul",
    address: "0x084...KCRAB",
    name: "King Crab",
    symbol: "$KCRAB",
    description:
      "The King Crab comes from the cold depths of the Bering Sea. It's history dates back over 150 million years. Now it's making waves in the crypto world.",
    icon: <i className="fas fa-link"></i>,
    chainName: "SUL",
  },
  {
    chain: "solana",
    address: "GWx6f...kpump",
    name: "StableCoin",
    symbol: "$1",
    description:
      " $1 is the first decentralized stable-coin on Solana. However, it is currently de-pegged. It's simple design and mechanism makes it unique in the ecosystem.",
    icon: <i className="fas fa-bolt"></i>,
    chainName: "SOLANA",
  },
  {
    chain: "solana",
    address: "HpyZQ...WugEw",
    name: "PiggyToken",
    symbol: "$PIGGY",
    description:
      "Straight out the pigsty. PiggyToken brings a fun and community-driven approach to cryptocurrency with a focus on sustainable growth and community rewards.",
    icon: <i className="fas fa-bolt"></i>,
    chainName: "SOLANA",
  },
  {
    chain: "solana",
    address: "FTYpN...Zpump",
    name: "GambleToken",
    symbol: "$GAMBLE",
    description:
      "GAMBLE. The revolutionary token that brings transparency to online gambling. Built on Solana for fast transactions and low fees.",
    icon: <i className="fas fa-bolt"></i>,
    chainName: "SOLANA",
  },
  {
    chain: "solana",
    address: "SUy6x...KBdy",
    name: "Booche",
    symbol: "$BOOCHE",
    description:
      'Meet $BOOCHE on SOL by Matt Furie, the latest confirmed character in Matt\'s new book "Cortex Vortex". Join the adventure with this unique NFT-backed token.',
    icon: <i className="fas fa-bolt"></i>,
    chainName: "SOLANA",
  },
  {
    chain: "sil chains",
    address: "0x6c0...29886",
    name: "Balto",
    symbol: "$BALTO",
    description:
      "The preserved body of Balto, the sled dog that made the final 53-mile stretch through an Alaskan blizzard to deliver serum during the 1925 diphtheria outbreak.",
    icon: <i className="fas fa-link"></i>,
    chainName: "SIL CHAINS",
    new: true,
  },
  {
    chain: "ethereum",
    address: "0x685...2d933",
    name: "Unbelievable",
    symbol: "$UNBL",
    description:
      "Step into a world where the unbelievable is just the beginning. Join the movement that's changing everything you know about cryptocurrency and blockchain technology.",
    icon: <i className="fab fa-ethereum"></i>,
    chainName: "ETHEREUM",
  },
];

const filters = ["All", "Ethereum", "Solana", "Binance", "New", "Trending"];

export default function ExplorePage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTokens = tokensData.filter((token) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "New" && token.new) ||
      token.chain.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch =
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.address.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Explore Crypto Tokens</h1>
        <p className="page-subtitle">
          Discover trending tokens across multiple blockchains
        </p>
      </div>

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

      <div className="token-grid">
        {filteredTokens.length > 0 ? (
          filteredTokens.map((token, idx) => (
            <div key={idx} className="token-card">
              <span className="token-chain">
                {token.chain}{" "}
                {token.new && <span className="new-badge">New!</span>}
              </span>
              <div className="token-address">TOKEN ( {token.address} )</div>
              <h3 className="token-name">
                {token.name}{" "}
                <span className="token-symbol">{token.symbol}</span>
              </h3>
              <p className="token-description">{token.description}</p>
              <div className="token-details">
                <span className="chain-badge">
                  {token.icon} {token.chainName}
                </span>
                <a href="/detail" className="btn btn-outline-light">
                  View Details <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No tokens found.</p>
        )}
      </div>
    </div>
  );
}
