import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import Products from "../data/products";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
    const [catalog] = useState(Products)

    const [cart, setCart] = useState(
        Products.map(i => ({'id': i.id, 'price': i.price, 'quantity': 0}))
    );

    useEffect(() => {
        sessionStorage.setItem('items', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (id, qty=1) => {
        setCart(prev => {
            const found = prev.find(l => l.id === id)
            const item = catalog.find(i => i.id === id)
            if (!item)
                return prev
            if (found)
                return prev.map(l => l.id === id ? { ...l, quantity: l.quantity + qty } : l)
            return [...prev, { id: item.id, name: item.name, price: item.price, quantity: qty }]
        })
    }

    const getQty = () => {
        let qty = Array(cart.length).fill(0);
        for (let i = 0; i < cart.length; i++)
            qty[i] = cart[i].quantity;
        return qty;
    }
    const updateQty = (id, qty) => setCart(prev => prev.map(l => l.id === id ? { ...l, quantity: qty } : l))
    const removeItem = (id) => setCart(prev => prev.filter(l => l.id !== id))
    const clearCart = () => setCart([])

    const cartCount = useMemo(() => cart.reduce((s, l) => s + l.quantity, 0), [cart])
    const cartTotal = useMemo(() => cart.reduce((s, l) => s + l.quantity * l.price, 0), [cart])

    const value = {
        catalog, cart,
        addToCart, updateQty, getQty, removeItem, clearCart,
        cartCount, cartTotal,
    }

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
    const ctx = useContext(StoreContext)
    if (!ctx)
        throw new Error('useStore must be used within StoreProvider')
    return ctx
}