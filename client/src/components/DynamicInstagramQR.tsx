import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ArrowUpRight, Check, Copy } from "lucide-react";

export default function DynamicInstagramQR() {
  const [linkedinQrUrl, setLinkedinQrUrl] = useState<string>("");
  const [githubQrUrl, setGithubQrUrl] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    // Generate high-res QR codes with Level 'H' (30% error correction for center logo)
    QRCode.toDataURL("https://www.linkedin.com/in/sabareesh-m-3b488840b", {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 400,
      color: {
        dark: "#0a0b12",
        light: "#ffffff",
      },
    }).then(setLinkedinQrUrl).catch(console.error);

    QRCode.toDataURL("https://github.com/saba1207B", {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 400,
      color: {
        dark: "#0a0b12",
        light: "#ffffff",
      },
    }).then(setGithubQrUrl).catch(console.error);
  }, []);

  const handleCopy = (e: React.MouseEvent, url: string, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2200);
  };

  return (
    <div className="instagram-qr-showcase" aria-label="Connect via Dynamic QR Codes">
      <div className="qr-showcase-header">
        <div className="qr-eyebrow">
          <span className="qr-pulse-dot" />
          <span>DYNAMIC QR • SCAN OR TAP</span>
        </div>
        <h3 className="qr-showcase-title">
          Connect &amp; <span>Collaborate.</span>
        </h3>
        <p className="qr-showcase-subtitle">
          Point your phone camera to scan or touch any card to jump directly to the profile.
        </p>
      </div>

      <div className="qr-cards-grid">
        {/* =================================================================
            1. LINKEDIN INSTAGRAM-STYLE DYNAMIC QR CARD
            ================================================================= */}
        <a
          href="https://www.linkedin.com/in/sabareesh-m-3b488840b"
          target="_blank"
          rel="noreferrer"
          className="instagram-qr-card qr-card-linkedin"
          data-cursor="LinkedIn ↗"
          aria-label="LinkedIn profile QR card - I am open to freelancing on this type website creation"
        >
          {/* Holographic / Gradient Aura Glow */}
          <div className="qr-card-glow linkedin-glow" aria-hidden="true" />

          {/* Instagram Gradient Border Wrapper */}
          <div className="qr-card-inner">
            {/* Top Header Tag */}
            <div className="qr-card-topbar">
              <span className="qr-brand-badge linkedin-badge">
                <svg className="brand-mini-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <circle cx="7.5" cy="7.2" r="1.65" fill="currentColor" />
                  <rect x="6.1" y="10.2" width="2.8" height="8.4" rx="0.3" fill="currentColor" />
                  <path
                    d="M18.15 18.6v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.14h-2.8v8.4h2.8v-4.93c0-.77.62-1.4 1.4-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.74z"
                    fill="currentColor"
                  />
                </svg>
                LINKEDIN NAMETAG
              </span>
              <span className="qr-handle-pill">@sabareesh-m</span>
            </div>

            {/* LinkedIn Slogan Requirement */}
            <div className="qr-slogan-box linkedin-slogan-box">
              <span className="slogan-tag">OPEN TO WORK</span>
              <p className="qr-slogan-text">
                &ldquo;Iam open to freelancing on this type website creation&rdquo;
              </p>
            </div>

            {/* Instagram-style Viewfinder Container */}
            <div className="qr-matrix-container">
              {/* Instagram Scanner Corner Viewfinder Brackets */}
              <span className="viewfinder-bracket bracket-tl" aria-hidden="true" />
              <span className="viewfinder-bracket bracket-tr" aria-hidden="true" />
              <span className="viewfinder-bracket bracket-bl" aria-hidden="true" />
              <span className="viewfinder-bracket bracket-br" aria-hidden="true" />

              {/* Dynamic Animated Laser Scanning Beam */}
              <div className="qr-scanner-beam linkedin-beam" aria-hidden="true" />

              {/* QR Code Canvas/Image */}
              {linkedinQrUrl ? (
                <img
                  src={linkedinQrUrl}
                  alt="LinkedIn QR Code to connect with Sabareesh"
                  className="qr-code-image"
                />
              ) : (
                <div className="qr-skeleton" />
              )}

              {/* Centered Brand Emblem / Icon */}
              <div className="qr-center-emblem linkedin-emblem" aria-label="LinkedIn logo in QR center">
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                  {/* LinkedIn 'i' dot */}
                  <circle cx="7.5" cy="7.2" r="1.65" fill="#ffffff" />
                  {/* LinkedIn 'i' stem */}
                  <rect x="6.1" y="10.2" width="2.8" height="8.4" rx="0.3" fill="#ffffff" />
                  {/* LinkedIn 'n' body */}
                  <path
                    d="M18.15 18.6v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.14h-2.8v8.4h2.8v-4.93c0-.77.62-1.4 1.4-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.74z"
                    fill="#ffffff"
                  />
                </svg>
              </div>
            </div>

            {/* Interactive Bottom Bar */}
            <div className="qr-card-bottombar">
              <span className="qr-action-hint">
                <span>TOUCH TO CONNECT</span>
                <ArrowUpRight size={15} />
              </span>
              <button
                className="qr-copy-btn"
                onClick={(e) => handleCopy(e, "https://www.linkedin.com/in/sabareesh-m-3b488840b", "linkedin")}
                title="Copy LinkedIn profile link"
                aria-label="Copy LinkedIn profile link"
              >
                {copiedLink === "linkedin" ? <Check size={13} color="#27c93f" /> : <Copy size={13} />}
                <span>{copiedLink === "linkedin" ? "COPIED" : "COPY"}</span>
              </button>
            </div>
          </div>
        </a>

        {/* =================================================================
            2. GITHUB INSTAGRAM-STYLE DYNAMIC QR CARD
            ================================================================= */}
        <a
          href="https://github.com/saba1207B"
          target="_blank"
          rel="noreferrer"
          className="instagram-qr-card qr-card-github"
          data-cursor="GitHub ↗"
          aria-label="GitHub profile QR card - Explore my creation"
        >
          {/* Holographic / Gradient Aura Glow */}
          <div className="qr-card-glow github-glow" aria-hidden="true" />

          {/* Instagram Gradient Border Wrapper */}
          <div className="qr-card-inner">
            {/* Top Header Tag */}
            <div className="qr-card-topbar">
              <span className="qr-brand-badge github-badge">
                <svg className="brand-mini-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GITHUB NAMETAG
              </span>
              <span className="qr-handle-pill">@saba1207B</span>
            </div>

            {/* GitHub Slogan Requirement */}
            <div className="qr-slogan-box github-slogan-box">
              <span className="slogan-tag">CODE &amp; BUILDS</span>
              <p className="qr-slogan-text">
                &ldquo;Explore my creation&rdquo;
              </p>
            </div>

            {/* Instagram-style Viewfinder Container */}
            <div className="qr-matrix-container">
              {/* Instagram Scanner Corner Viewfinder Brackets */}
              <span className="viewfinder-bracket bracket-tl" aria-hidden="true" />
              <span className="viewfinder-bracket bracket-tr" aria-hidden="true" />
              <span className="viewfinder-bracket bracket-bl" aria-hidden="true" />
              <span className="viewfinder-bracket bracket-br" aria-hidden="true" />

              {/* Dynamic Animated Laser Scanning Beam */}
              <div className="qr-scanner-beam github-beam" aria-hidden="true" />

              {/* QR Code Canvas/Image */}
              {githubQrUrl ? (
                <img
                  src={githubQrUrl}
                  alt="GitHub QR Code to explore Sabareesh's repositories"
                  className="qr-code-image"
                />
              ) : (
                <div className="qr-skeleton" />
              )}

              {/* Centered Brand Emblem / Icon */}
              <div className="qr-center-emblem github-emblem" aria-label="GitHub logo in QR center">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </div>
            </div>

            {/* Interactive Bottom Bar */}
            <div className="qr-card-bottombar">
              <span className="qr-action-hint">
                <span>TOUCH TO EXPLORE</span>
                <ArrowUpRight size={15} />
              </span>
              <button
                className="qr-copy-btn"
                onClick={(e) => handleCopy(e, "https://github.com/saba1207B", "github")}
                title="Copy GitHub profile link"
                aria-label="Copy GitHub profile link"
              >
                {copiedLink === "github" ? <Check size={13} color="#27c93f" /> : <Copy size={13} />}
                <span>{copiedLink === "github" ? "COPIED" : "COPY"}</span>
              </button>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
