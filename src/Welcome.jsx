
import React from "react";
import { Pill, ShieldCheck, Activity, ArrowRight, Package, HeartPulse } from "lucide-react";
import "./Welcome.css";

function Welcome({ onGetStarted }) {
  return (
    <div className="welcome-page">

      <nav className="welcome-nav">
        <div className="welcome-brand">
          <div className="welcome-logo">
            <Pill size={27} />
          </div>
          <div>
            <h2>PharmaCare</h2>
            <span>PHARMACY MANAGEMENT SYSTEM</span>
          </div>
        </div>

        <button className="nav-login" onClick={onGetStarted}>
          Admin Login <ArrowRight size={17} />
        </button>
      </nav>

      <main className="welcome-hero">

        <div className="hero-content">
          <span className="hero-tag">
            <Activity size={15} /> SMART PHARMACY MANAGEMENT
          </span>

          <h1>
            Manage Your Pharmacy
            <span> Smarter & Better.</span>
          </h1>

          <p>
            Simplify medicine management, track inventory,
            manage sales and monitor your pharmacy operations
            with one powerful management system.
          </p>

          <button
            className="get-started-btn"
            onClick={onGetStarted}
          >
            Get Started <ArrowRight size={19} />
          </button>

          <div className="welcome-trust">
            <ShieldCheck size={19} />
            <span>Smart · Simple · Efficient</span>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="illustration-circle">
            <div className="medicine-box">
              <div className="medicine-cross">+</div>
              <h2>PHARMA</h2>
              <span>CARE</span>
            </div>

            <div className="floating-icon icon-one">
              <Pill size={27} />
            </div>

            <div className="floating-icon icon-two">
              <HeartPulse size={27} />
            </div>

            <div className="floating-icon icon-three">
              <Package size={27} />
            </div>
          </div>
        </div>

      </main>

      <section className="welcome-features">
        <div className="feature-box">
          <Package size={25} />
          <h3>Inventory Management</h3>
          <p>Monitor your medicine stock easily.</p>
        </div>

        <div className="feature-box">
          <Activity size={25} />
          <h3>Sales Tracking</h3>
          <p>Manage and track daily transactions.</p>
        </div>

        <div className="feature-box">
          <ShieldCheck size={25} />
          <h3>Secure Management</h3>
          <p>Organize pharmacy operations efficiently.</p>
        </div>
      </section>

      <footer className="welcome-footer">
        © 2026 PharmaCare. All Rights Reserved.
      </footer>

    </div>
  );
}

export default Welcome;
