import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import { getAllProducts } from "../data/products";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
    const [catalog, setCatalog] = useState([])
    const [loading, setLoading] = useState(true);

    const [cart, setCart] = useState([]);

    // Load products from inventory service
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await getAllProducts();
                setCatalog(products);
                // Initialize cart with all products having quantity 0
                setCart(products.map(i => ({'id': i.id, 'name': i.name, 'price': i.price, 'quantity': 0})));
            } catch (error) {
                console.error('Error loading products:', error);
                setCatalog([]);
                setCart([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

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
    const clearCart = () => {
        setCart(catalog.map(i => ({'id': i.id, 'name': i.name, 'price': i.price, 'quantity': 0})))
    }

    const updateAvailableTickets = () => {
        setCatalog(prev => {
            return prev.map(product => {
                const cartItem = cart.find(item => item.id === product.id);
                if (cartItem && cartItem.quantity > 0) {
                    return {
                        ...product,
                        availableTickets: product.availableTickets - cartItem.quantity
                    };
                }
                return product;
            });
        });
    };

    const cartCount = useMemo(() => cart.reduce((s, l) => s + l.quantity, 0), [cart])
    const cartTotal = useMemo(() => cart.reduce((s, l) => s + l.quantity * l.price, 0), [cart])

    const value = {
        catalog, cart, loading,
        addToCart, updateQty, getQty, clearCart, updateAvailableTickets,
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