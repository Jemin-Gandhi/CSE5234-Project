import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/Store.jsx";

export default function ShoppingCart({ isOpen, onClose }) {
    const { cart, updateQty, removeItem, cartTotal } = useStore();

    const [state, setState] = useState(cart);

    useEffect(() => {
        document.body.classList.toggle("no-scroll", isOpen);
        return () => document.body.classList.remove("no-scroll");
    }, [isOpen]);

    useEffect(() => {
        setState(cart);
    }, [cart]);

    return (
        <>
            <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={onClose} aria-hidden={!isOpen}/>
            <aside
                className={`cart-drawer ${isOpen ? "open" : ""}`}
                aria-label="Shopping cart"
                aria-hidden={!isOpen}
            >
                <div className="cart-header">
                    <h5 className="m-0">Your cart</h5>
                    <button className="btn-close" aria-label="Close cart" onClick={onClose} />
                </div>

                <div className="cart-body">
                    {cart.length === 0 ?
                        (<p className="text-muted">No items selected.</p>) :
                        (<ul className="list-group list-group-flush">
                            {cart.map((item) => (
                                item.quantity === 0 ? (<></>) : (
                                <li key={item.id} className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="me-2">
                                        <div className="fw-semibold">{item.name}</div>
                                        <div className="text-muted small">${Number(item.price).toFixed(2)}</div>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm text-center"
                                            min="0"
                                            value={item.quantity}
                                            onChange={(e) => updateQty(item.id, Math.max(0, Number(e.target.value)))}
                                            style={{ width: 60 }}
                                            aria-label={`${item.name} quantity`}
                                        />

                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeItem(item.id)}
                                            aria-label={`Remove ${item.name}`}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                                )))}
                        </ul>
                    )}
                </div>

                <div className="cart-footer">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <strong>Total</strong>
                        <strong>${Number(cartTotal).toFixed(2)}</strong>
                    </div>
                    <Link to="/purchase/viewOrder" className="btn btn-danger w-100" onClick={onClose}>
                        Review order
                    </Link>
                </div>
            </aside>
        </>
    );
}
