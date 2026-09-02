"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type CurrencyContextType = {
  currency: string;
  rates: Record<string, number>;
  formatPrice: (priceInUSD: number | string) => string;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  rates: {},
  formatPrice: (price) => `$${price}`,
  isLoading: true,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch preferred currency from user profile
  useEffect(() => {
    const fetchProfileCurrency = async () => {
      if (session?.user && (session.user as any).role !== 'admin') {
        try {
          const res = await fetch('/api/user/profile');
          if (res.ok) {
            const data = await res.json();
            if (data.preferredCurrency) {
              setCurrency(data.preferredCurrency);
            }
          }
        } catch (error) {
          console.error("Failed to fetch preferred currency", error);
        }
      }
    };

    if (status === 'authenticated') {
      fetchProfileCurrency();
    } else if (status === 'unauthenticated') {
      setCurrency('USD');
    }
  }, [session, status]);

  // 2. Fetch exchange rates (Base: USD)
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (res.ok) {
          const data = await res.json();
          setRates(data.rates);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rates", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  // 3. Helper to format and convert price
  const formatPrice = (priceInUSD: number | string): string => {
    const numPrice = typeof priceInUSD === 'string' ? parseFloat(priceInUSD.replace(/[^0-9.]/g, '')) : priceInUSD;
    
    if (isNaN(numPrice)) return `$0`; // Fallback
    
    let convertedPrice = numPrice;
    
    if (currency !== 'USD' && rates[currency]) {
      convertedPrice = numPrice * rates[currency];
    }
    
    // Format based on currency
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0, // No cents for cleaner UI
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currency, rates, formatPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};
