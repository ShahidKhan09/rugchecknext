"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DetailPage() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Generate sample price data
    let value = 0.000045;
    const data = [];
    for (let i = 0; i < 24; i++) {
      value += (Math.random() - 0.5) * 0.000002;
      data.push(value);
    }

    setChartData({
      labels: [
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ],
      datasets: [
        {
          label: "RYAN Price",
          data,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#6366f1",
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    });
  }, []);

  return (
    <div className="container">
      {/* Navigation */}

      {/* Header */}
      <div className="token-header">
        <h1 className="token-title">
          RYAN <span className="token-price">$0.000046</span>
        </h1>
        <div className="chart-info">
          <span>RYAN © / WENIB</span>
          <span>•</span>
          <span>BSC &gt; PancakeSwap v2</span>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-section">
        <div className="chart-header">
          <h2 className="chart-title">Price Chart</h2>
          <div className="token-tabs">
            <div className="tab active">1D</div>
            <div className="tab">1W</div>
            <div className="tab">1M</div>
            <div className="tab">3M</div>
          </div>
        </div>
        <div className="chart-container">
          {chartData && (
            <Line
              data={chartData}
              options={{
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    ticks: {
                      callback: (value) => `$${value.toFixed(6)}`,
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="info-grid">
        {/* Description */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">The Original not $B</h2>
          </div>
          <p className="token-description">
            Meet Ryan. Looks like a lion, roars like a soft kitten. The original
            lion token, $RYAN was created in 2024.
          </p>
          <div className="token-tabs">
            <div className="tab active">Info</div>
            <div className="tab">Chart+Tons</div>
            <div className="tab">Chart</div>
            <div className="tab">Tons</div>
          </div>
          <p>
            <em>Trocked by</em>
          </p>
        </div>

        {/* Token Info */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-info-circle"></i> Token Information
            </h2>
          </div>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="info-label">Market Cap</td>
                <td>$46,168.00</td>
              </tr>
              <tr>
                <td className="info-label">FDV</td>
                <td>$46,168.00</td>
              </tr>
              <tr>
                <td className="info-label">24h Volume</td>
                <td>$1.04</td>
              </tr>
              <tr>
                <td className="info-label">Liquidity</td>
                <td>$31,485.35</td>
              </tr>
              <tr>
                <td className="info-label">Total Tons</td>
                <td>4</td>
              </tr>
              <tr>
                <td className="info-label">Created</td>
                <td>May 22, 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="info-grid">
        {/* Price Stats */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-chart-line"></i> Price Stats
            </h2>
          </div>
          <table className="info-table">
            <tbody>
              <tr>
                <td className="info-label">24h High</td>
                <td>$0.000047</td>
              </tr>
              <tr>
                <td className="info-label">24h Low</td>
                <td>$0.000046</td>
              </tr>
              <tr>
                <td className="info-label">All-Time High</td>
                <td>$0.000047</td>
              </tr>
              <tr>
                <td className="info-label">All-Time Low</td>
                <td>$0.000023</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Trading Pairs */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-exchange-alt"></i> Trading Pairs
            </h2>
          </div>

          <div className="trading-pair">
            <div className="pair-info">
              <div className="pair-icon">P</div>
              <div className="pair-details">
                <div className="pair-name">RYAN/BNB</div>
                <div className="pair-protocol">pancakeswap</div>
              </div>
            </div>
            <div className="pair-price">
              <div className="price-value">$0.000046</div>
              <div className="price-change">-0.87%</div>
            </div>
            <button className="trade-btn">Trade</button>
          </div>

          <div className="trading-pair">
            <div className="pair-info">
              <div className="pair-icon">P</div>
              <div className="pair-details">
                <div className="pair-name">RYAN/WENIB</div>
                <div className="pair-protocol">pancakeswap</div>
              </div>
            </div>
            <div className="pair-price">
              <div className="price-value">$0.000045</div>
              <div className="price-change">-3.59%</div>
            </div>
            <button className="trade-btn">Trade</button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-link"></i> Links
          </h2>
        </div>
        <div className="links-grid">
          <div className="link-item">
            <i className="fas fa-globe"></i> <span>Website</span>
          </div>
          <div className="link-item">
            <i className="fab fa-twitter"></i> <span>Twitter</span>
          </div>
          <div className="link-item">
            <i className="fab fa-telegram"></i> <span>Telegram</span>
          </div>
          <div className="link-item">
            <i className="fab fa-discord"></i> <span>Discord</span>
          </div>
        </div>
      </div>
    </div>
  );
}
