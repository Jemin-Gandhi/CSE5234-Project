import React from "react";
import { Link } from "react-router-dom";
import PRODUCTS from "../data/products";

export default function Home() {
    const highlights = [
        {
            title: "Verified Getaways",
            description: "Every package is vetted by our travel specialists so you can book unused trips with total confidence.",
        },
        {
            title: "Luxury for Less",
            description: "Unlock premium resorts, cruises, and tours at prices up to 60% off the original booking value.",
        },
        {
            title: "Seamless Checkout",
            description: "Reserve in minutes with secure payment, saved traveler details, and instant confirmation emails.",
        },
    ];

    const featuredTrips = PRODUCTS.slice(0, 3);

    return (
        <div className="home-page text-start">
            <section className="home-hero text-white d-flex align-items-center">
                <div className="home-hero-overlay" aria-hidden="true" />
                <div className="container position-relative py-5">
                    <div className="home-hero-panel p-4 p-lg-5 shadow-lg">
                        <span className="badge bg-danger-subtle text-danger fw-semibold mb-3">Limited-Time Getaways</span>
                        <h1 className="display-4 fw-bold mb-3">
                            Turn Unused Vacations into Your Next Adventure
                        </h1>
                        <p className="lead mb-4 col-lg-10 col-xl-8">
                            Discover exclusive, last-minute packages from fellow travelers. WanderNest makes it effortless to
                            save big on bucket-list trips while helping sellers recoup their plans.
                        </p>
                        <div className="d-flex flex-wrap gap-3">
                            <Link to="/purchase" className="btn btn-light btn-lg px-4 shadow-sm">
                                Browse Getaways
                            </Link>
                            <a href="#how-it-works" className="btn btn-outline-light btn-lg px-4">
                                See How It Works
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="container py-5">
                <div className="row g-4 align-items-stretch">
                    <div className="col-12 col-lg-4">
                        <div className="home-intro card border-0 h-100 shadow-sm">
                            <div className="card-body p-4">
                                <h2 className="h3 text-danger fw-bold mb-3">A Marketplace Built for Travelers</h2>
                                <p className="mb-0">
                                    WanderNest matches time-sensitive vacation packages with eager explorers. Browse curated listings,
                                    review every itinerary detail, and check real-time availability before you book.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-8">
                        <div className="row g-4">
                            {highlights.map((item) => (
                                <div className="col-12 col-md-4" key={item.title}>
                                    <div className="home-highlight h-100 p-4 rounded-4">
                                        <h3 className="h5 text-danger fw-bold mb-2">{item.title}</h3>
                                        <p className="mb-0 text-muted">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-featured py-5">
                <div className="container">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
                        <div>
                            <h2 className="h2 fw-bold text-danger mb-2">Featured Escapes</h2>
                            <p className="text-muted mb-0">
                                Handpicked packages ready for immediate departure. Secure your spot before they disappear.
                            </p>
                        </div>
                        <Link to="/purchase" className="btn btn-danger px-4">
                            View All Packages
                        </Link>
                    </div>
                    <div className="row g-4">
                        {featuredTrips.map((trip) => (
                            <div className="col-12 col-md-6 col-lg-4" key={trip.id}>
                                <div className="card h-100 shadow-sm border-0 overflow-hidden">
                                    <img
                                        src={trip.images[0]}
                                        alt={trip.name}
                                        className="home-featured-img"
                                    />
                                    <div className="card-body">
                                        <span className="badge bg-danger-subtle text-danger mb-2">{trip.location}</span>
                                        <h3 className="h5 fw-semibold">{trip.name}</h3>
                                        <p className="text-muted mb-2">{trip.duration}</p>
                                        <p className="fw-bold text-danger mb-3">${trip.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} per traveler</p>
                                        <Link to="/purchase" className="btn btn-outline-danger w-100">
                                            Reserve Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="home-testimonial py-5">
                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-12 col-lg-6">
                            <h2 className="h2 fw-bold text-danger mb-3">Trusted by Travelers Everywhere</h2>
                            <p className="lead text-muted">
                                “We booked the Maui retreat just two weeks before departure and saved over $1,200. The process was
                                seamless, and the WanderNest team guided us from purchase to check-in.”
                            </p>
                            <p className="fw-semibold mb-0">— Priya &amp; Alex, Seattle</p>
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow-sm">
                                <img
                                    src="/images/vacation5/alaska-cruise-ship.jpg"
                                    alt="Guests enjoying a luxury cruise at sunset"
                                    className="w-100 h-100 object-fit-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}