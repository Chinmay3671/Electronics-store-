import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../api/cartApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('techvault_local_wishlist');
    return saved ? JSON.parse(saved) : { items: [], totalItems: 0 };
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const saveLocalWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('techvault_local_wishlist', JSON.stringify(newWishlist));
  };

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await wishlistApi.getWishlist();
      const data = res?.data || res;
      if (data) {
        const items = data.items || data.products || [];
        saveLocalWishlist({ items, totalItems: items.length });
      }
    } catch (err) {
      console.warn('Failed to fetch wishlist from server:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const getItems = () => wishlist?.items || wishlist?.products || [];

  const isInWishlist = (productId) => {
    return getItems().some((item) => (item.id === productId || item.product?.id === productId || item.productId === productId));
  };

  const toggleWishlist = async (product) => {
    const prodObj = product?.product || product;
    const prodId = prodObj?.id || product;
    const items = getItems();
    const inList = isInWishlist(prodId);

    let updatedItems;
    if (inList) {
      updatedItems = items.filter(i => (i.id !== prodId && i.product?.id !== prodId && i.productId !== prodId));
      addToast('Removed item from your wishlist', 'info');
    } else {
      updatedItems = [...items, { id: prodId, product: prodObj, productId: prodId }];
      addToast('Saved item to your wishlist!', 'success');
    }

    const newWishlist = { items: updatedItems, totalItems: updatedItems.length };
    saveLocalWishlist(newWishlist);

    if (isAuthenticated) {
      try {
        if (inList) {
          await wishlistApi.removeItem(prodId);
        } else {
          await wishlistApi.addItem(prodId);
        }
      } catch (err) {
        console.warn('Wishlist server sync offline', err);
      }
    }
  };

  const addToWishlist = async (product) => {
    if (!isInWishlist(product?.id || product)) {
      await toggleWishlist(product);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      const items = getItems().filter(i => (i.id !== productId && i.product?.id !== productId && i.productId !== productId));
      const newWishlist = { items, totalItems: items.length };
      saveLocalWishlist(newWishlist);

      if (isAuthenticated) {
        try {
          await wishlistApi.removeItem(productId);
        } catch (err) {
          console.warn('Wishlist remove server sync offline', err);
        }
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        itemCount: getItems().length,
        loading,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export default WishlistContext;
