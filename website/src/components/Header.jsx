import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import ShoppingCart from "./ShoppingCart.jsx";
import { useStore } from "../store/Store.jsx";

export default function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cartCount } = useStore();

    return (
        <>
            <header className="site-header sticky-top">
                <Navbar
                    rightSlot={
                        <button
                            type="button"
                            className="btn btn-outline-light position-relative cart-toggle-btn"
                            aria-label="Open shopping cart"
                            onClick={() => setIsCartOpen(true)}
                        >
                        {/* cart icon */}
                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" d="M7 4h-2v2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 11 19h9v-2h-9l1.1-2h6.55a2 2 0 0 0 1.79-1.11L22 8H6.21zM7 20a2 2 0 1 0 0 4a2 2 0 0 0 0-4m10 0a2 2 0 1 0 0 4a2 2 0 0 0 0-4"/>
                        </svg>
                        {cartCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartCount}
                            </span>
                        )}
                        </button>
                    }
                />
            </header>
            <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
