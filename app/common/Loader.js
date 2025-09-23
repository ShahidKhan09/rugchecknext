import React, { useState } from "react";

function Loader({ loadingText }) {
  return (
    <>
      <div className="">
        <div
          className="position-fixed w-100 mainLoader"
          style={{
            zIndex: 999999999,
            // marginTop: -200,
            height: "100%",
            marginLeft: 0,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
            top: "0px",
            left: "0px",
          }}
        >
          <div className="h-100 d-flex align-items-center justify-content-center">
            <div
              className="d-flex flex-wrap align-items-center justify-content-center"
              style={{ flexDirection: "column" }}
            >
              <svg
                width="150"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
              >
                <radialGradient
                  id="a12"
                  cx=".66"
                  fx=".66"
                  cy=".3125"
                  fy=".3125"
                  gradientTransform="scale(1.5)"
                >
                  <stop offset="0" stop-color="#1126E1"></stop>
                  <stop
                    offset=".3"
                    stop-color="#1126E1"
                    stop-opacity=".9"
                  ></stop>
                  <stop
                    offset=".6"
                    stop-color="#1126E1"
                    stop-opacity=".6"
                  ></stop>
                  <stop
                    offset=".8"
                    stop-color="#1126E1"
                    stop-opacity=".3"
                  ></stop>
                  <stop offset="1" stop-color="#1126E1" stop-opacity="0"></stop>
                </radialGradient>
                <circle
                  transform-origin="center"
                  fill="none"
                  stroke="url(#a12)"
                  stroke-width="20"
                  stroke-linecap="round"
                  stroke-dasharray="200 1000"
                  stroke-dashoffset="0"
                  cx="100"
                  cy="100"
                  r="70"
                >
                  <animateTransform
                    type="rotate"
                    attributeName="transform"
                    calcMode="spline"
                    dur="1.1"
                    values="360;0"
                    keyTimes="0;1"
                    keySplines="0 0 1 1"
                    repeatCount="indefinite"
                  ></animateTransform>
                </circle>
                <circle
                  transform-origin="center"
                  fill="none"
                  opacity=".2"
                  stroke="#1126E1"
                  stroke-width="20"
                  stroke-linecap="round"
                  cx="100"
                  cy="100"
                  r="70"
                ></circle>
              </svg>
              {loadingText && <p>{loadingText} </p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Loader;
