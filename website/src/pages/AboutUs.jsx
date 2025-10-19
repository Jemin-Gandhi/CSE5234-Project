import React from "react";

// Import images
import jeminImg from "../../public/images/jemin.jpg";
import krishnaImg from "../../public/images/krishna.jpg";
import benImg from "../../public/images/ben.jpg";
import gaigeImg from "../../public/images/gaige.jpg";
import v1 from "../../public/images/vacation1.jpg";
import v2 from "../../public/images/vacation2.jpg";
import v3 from "../../public/images/vacation3.jpg";

export default function AboutUs() {
  const sections = [
    {
      title: "Our Mission",
      text: "To make dream vacations affordable and accessible by connecting travelers with exclusive, last-minute getaway deals — while helping sellers recover the value of their unused trips.",
      img: v1,
    },
    {
      title: "Our Vision",
      text: "To become the world’s most trusted and efficient marketplace for vacation package resales — redefining how people travel, save, and explore the world.",
      img: v2,
    },
    {
      title: "Our Strategy",
      text: "We bridge the gap between unused travel plans and eager adventurers. By leveraging data-driven pricing, seamless verification, and a user-friendly digital platform, we ensure both sellers and buyers enjoy a safe, fast, and transparent experience. Our approach blends hospitality with technology — turning wasted bookings into unforgettable memories.",
      img: v3,
    },
  ];

  return (
    <div style={{ padding: "3rem 1rem", fontFamily: "Arial, sans-serif", color: "#333" }}>
      {/* Header */}
      <section style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ color: "#d32f2f", marginBottom: "1rem" }}>About Us</h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto" }}>
          At WanderNest, we make dream getaways accessible by connecting travelers to unused vacation packages at unbeatable prices.
          Whether you’re buying or selling, we turn missed trips into unforgettable adventures.
        </p>
      </section>

      {/* Alternating sections */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", marginBottom: "3rem" }}>
        {sections.map((section, index) => (
          <div
            key={section.title}
            style={{
              display: "flex",
              flexDirection: index % 2 === 0 ? "row" : "row-reverse",
              alignItems: "center",
              gap: "2rem",
              marginBottom: "3rem",
              flexWrap: "wrap"
            }}
          >
            <img
              src={section.img}
              alt={section.title}
              style={{ width: "400px", maxWidth: "100%", borderRadius: "10px" }}
            />
            <div style={{ flex: 1 }}>
              <h2 style={{ color: "#d32f2f" }}>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Executives */}
      <section style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: "#d32f2f", marginBottom: "2rem" }}>Meet Our Executives</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2rem",
            justifyItems: "center"
          }}
        >
          <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", width: "100%" }}>
            <img src={jeminImg} alt="Jemin Gandhi" style={{ width: "100%", borderRadius: "10px", marginBottom: "1rem" }} />
            <h3 style={{ color: "#d32f2f" }}>Jemin Gandhi</h3>
            <h4>Chief Executive Officer (CEO) & Co-Founder</h4>
            <p>
              Jemin is the visionary force behind our platform, leading company strategy and product direction. With a background in
              <strong> Computer Science and Business</strong>, Jemin combines technical expertise with business acumen to
              make luxury travel accessible to everyone.
            </p>
            <p><strong>Education:</strong> B.S. in Computer Science, The Ohio State University</p>
            <p><strong>Passion:</strong> Building impactful technology that bridges human experience and digital opportunity.</p>
          </div>

          <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", width: "100%" }}>
            <img src={krishnaImg} alt="Krishna Saraiya" style={{ width: "100%", borderRadius: "10px", marginBottom: "1rem" }} />
            <h3 style={{ color: "#d32f2f" }}>Krishna Saraiya</h3>
            <h4>Chief Operating Officer (COO) & Co-Founder</h4>
            <p>
              Krishna ensures every part of our operation runs seamlessly — from seller onboarding to customer experience. With expertise
              in <strong>Computer Science and operations management</strong>, he builds efficient systems that scale beautifully.
            </p>
            <p><strong>Education:</strong> B.S. in Computer Science, The Ohio State University</p>
            <p><strong>Passion:</strong> Designing systems where simplicity and trust drive every interaction.</p>
          </div>

          <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", width: "100%" }}>
            <img src={benImg} alt="Ben Horvath" style={{ width: "100%", borderRadius: "10px", marginBottom: "1rem" }} />
            <h3 style={{ color: "#d32f2f" }}>Ben Horvath</h3>
            <h4>Chief Technology Officer (CTO) & Co-Founder</h4>
            <p>
              Ben leads the technology vision behind our platform. His background in <strong>backend development, data engineering,
              and cybersecurity</strong> ensures our systems are fast, secure, and reliable for every traveler.
            </p>
            <p><strong>Education:</strong> M.S. in Computer Science & Math, The Ohio State University</p>
            <p><strong>Passion:</strong> Solving complex problems that make travel simpler and smarter.</p>
          </div>

          <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "1.5rem", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", width: "100%" }}>
            <img src={gaigeImg} alt="Gaige McMichael" style={{ width: "100%", borderRadius: "10px", marginBottom: "1rem" }} />
            <h3 style={{ color: "#d32f2f" }}>Gaige McMichael</h3>
            <h4>Chief Marketing Officer (CMO) & Co-Founder</h4>
            <p>
              Gaige drives our global marketing strategy, blending creativity with analytics. With expertise in
              <strong> digital campaigns and branding</strong>, he connects travelers to their next adventure while shaping a trusted
              brand identity.
            </p>
            <p><strong>Education:</strong> B.S. in Computer Science, The Ohio State University</p>
            <p><strong>Passion:</strong> Turning stories of last-minute trips into lifelong memories.</p>
          </div>
        </div>
      </section>

      <section style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2 style={{ color: "#d32f2f" }}>Together, We’re Redefining Travel</h2>
        <p style={{ maxWidth: "800px", margin: "1rem auto" }}>
          We’re not just a company — we’re a team of explorers, innovators, and problem-solvers determined to make travel smarter,
          fairer, and more flexible. Whether you’re selling your unused vacation or booking your next adventure, we’re here to make
          every experience a win-win.
        </p>
      </section>
    </div>
  );
}
