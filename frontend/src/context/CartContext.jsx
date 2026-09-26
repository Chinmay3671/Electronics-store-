import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('techvault_local_cart');
    return saved ? JSON.parse(saved) : { items: [], totalItems: 0, subtotal: 0 };
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const getCartTotal = useCallback(() => {
    if (!cart?.items || cart.items.length === 0) return 0;
    return cart.items.reduce((sum, item) => {
      const price = item.unitPrice ?? item.price ?? item.product?.salePrice ?? item.product?.price ?? 0;
      return sum + (Number(price) * (item.quantity || 1));
    }, 0);
  }, [cart]);

  const saveLocalCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('techvault_local_cart', JSON.stringify(newCart));
  };

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await cartApi.getCart();
      const cartData = res?.data?.data || res?.data || res;
      if (cartData && Array.isArray(cartData.items) && cartData.items.length > 0) {
        saveLocalCart(cartData);
      } else {
        // If server cart is empty but local cart has items, sync local items to server
        const saved = localStorage.getItem('techvault_local_cart');
        if (saved) {
          const localObj = JSON.parse(saved);
          if (localObj.items && localObj.items.length > 0) {
            for (const it of localObj.items) {
              const pid = it.productId || it.product?.id || it.id;
              if (pid) {
                try { await cartApi.addItem(pid, it.quantity || 1); } catch (e) {}
              }
            }
            const refreshed = await cartApi.getCart();
            const refData = refreshed?.data?.data || refreshed?.data || refreshed;
            if (refData && Array.isArray(refData.items)) {
              saveLocalCart(refData);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch cart from server:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    const prodObj = product?.product || product;
    const prodId = prodObj?.id || product;

    // Optimistic local update
    const existingIndex = cart.items.findIndex(i => (i.product?.id || i.productId) === prodId);
    let newItems = [...(cart.items || [])];

    if (existingIndex > -1) {
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + quantity
      };
    } else {
      newItems.push({
        id: Date.now(),
        productId: prodId,
        product: prodObj,
        quantity: quantity,
        unitPrice: prodObj.salePrice || prodObj.price || 0,
      });
    }

    const updatedCart = {
      ...cart,
      items: newItems,
      totalItems: newItems.reduce((acc, i) => acc + i.quantity, 0)
    };
    saveLocalCart(updatedCart);

    // Sync to backend if authenticated
    if (isAuthenticated) {
      try {
        await cartApi.addItem(prodId, quantity);
      } catch (err) {
        console.warn('Cart backend sync offline, kept locally.', err);
      }
    }
    return updatedCart;
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const newItems = cart.items.map(item => {
      if (item.id === itemId || item.productId === itemId) {
        return { ...item, quantity };
      }
      return item;
    });

    const updatedCart = {
      ...cart,
      items: newItems,
      totalItems: newItems.reduce((acc, i) => acc + i.quantity, 0)
    };
    saveLocalCart(updatedCart);

    if (isAuthenticated) {
      try {
        await cartApi.updateItem(itemId, quantity);
      } catch (err) {
        console.warn('Update quantity backend sync offline', err);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    const newItems = cart.items.filter(item => item.id !== itemId && item.productId !== itemId);
    const updatedCart = {
      ...cart,
      items: newItems,
      totalItems: newItems.reduce((acc, i) => acc + i.quantity, 0)
    };
    saveLocalCart(updatedCart);

    if (isAuthenticated) {
      try {
        await cartApi.removeItem(itemId);
      } catch (err) {
        console.warn('Remove item backend sync offline', err);
      }
    }
  };

  const clearCart = async () => {
    const emptyCart = { items: [], totalItems: 0, subtotal: 0 };
    saveLocalCart(emptyCart);

    if (isAuthenticated) {
      try {
        await cartApi.clearCart();
      } catch (err) {
        console.warn('Clear cart backend sync offline', err);
      }
    }
  };

  const itemCount = cart?.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        getCartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export default CartContext;
