// The one Context in this app — isPro is read from several distant screens
// (Log's cap check, Settings' unlock/restore UI, Paywall), same shape of
// justification ExpiryTrack used for its single ThemeProvider. Wraps
// expo-iap's useIAP hook; entitlement is derived from the store (no backend,
// no receipt validation server) and mirrored into AsyncStorage so the UI has
// an instant answer on next launch without waiting on a store connection.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorCode, useIAP } from 'expo-iap';

import { PRODUCT_ID_UNLOCK, STORAGE_KEYS } from './constants';
import type { Entitlement } from '../types';

type UnlockProduct = { id: string; title: string; displayPrice: string };

type EntitlementContextValue = {
  isPro: boolean;
  isLoading: boolean;
  purchaseInFlight: boolean;
  unlockProduct: UnlockProduct | undefined;
  connected: boolean;
  purchaseUnlock: () => Promise<void>;
  restorePurchases: () => Promise<void>;
};

const EntitlementContext = createContext<EntitlementContextValue | undefined>(undefined);

async function readEntitlement(): Promise<Entitlement> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.entitlement);
    if (raw) return JSON.parse(raw) as Entitlement;
  } catch {
    // fall through to default
  }
  return { isPro: false };
}

async function writeEntitlement(entitlement: Entitlement): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.entitlement, JSON.stringify(entitlement));
}

export function EntitlementProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseInFlight, setPurchaseInFlight] = useState(false);

  // Hydrate from local storage first so the UI has an instant answer;
  // reconciled against the live store below once connected.
  useEffect(() => {
    let cancelled = false;
    readEntitlement().then((entitlement) => {
      if (!cancelled) {
        setIsPro(entitlement.isPro);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const grantEntitlement = useCallback(async (productId: string) => {
    const entitlement: Entitlement = {
      isPro: true,
      productId,
      purchasedAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
    };
    await writeEntitlement(entitlement);
    setIsPro(true);
  }, []);

  const {
    connected,
    products,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    getAvailablePurchases,
    availablePurchases,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      await finishTransaction({ purchase, isConsumable: false });
      await grantEntitlement(purchase.productId);
      setPurchaseInFlight(false);
    },
    onPurchaseError: (error) => {
      setPurchaseInFlight(false);
      if (error.code !== ErrorCode.UserCancelled) {
        console.warn('Purchase failed:', error.message);
      }
    },
  });

  useEffect(() => {
    if (!connected) return;
    fetchProducts({ skus: [PRODUCT_ID_UNLOCK], type: 'in-app' });
  }, [connected, fetchProducts]);

  // Reconcile after a restore (or a cross-install re-check): if the store
  // reports the unlock as already owned, grant it locally without a new charge.
  // Routed through an awaited async IIFE (not a bare synchronous call) so the
  // eventual setIsPro update happens after a microtask, not directly in the
  // effect body.
  useEffect(() => {
    const owned = availablePurchases.find((p) => p.productId === PRODUCT_ID_UNLOCK);
    if (!owned) return;
    let cancelled = false;
    (async () => {
      await finishTransaction({ purchase: owned, isConsumable: false }).catch(() => {});
      if (!cancelled) await grantEntitlement(owned.productId);
    })();
    return () => {
      cancelled = true;
    };
  }, [availablePurchases, finishTransaction, grantEntitlement]);

  const purchaseUnlock = useCallback(async () => {
    setPurchaseInFlight(true);
    try {
      await requestPurchase({
        request: {
          apple: { sku: PRODUCT_ID_UNLOCK },
          google: { skus: [PRODUCT_ID_UNLOCK] },
        },
        type: 'in-app',
      });
    } catch {
      setPurchaseInFlight(false);
    }
  }, [requestPurchase]);

  const restorePurchases = useCallback(async () => {
    if (!connected) return;
    await getAvailablePurchases();
  }, [connected, getAvailablePurchases]);

  const unlockProduct = useMemo<UnlockProduct | undefined>(
    () => products.find((p) => p.id === PRODUCT_ID_UNLOCK),
    [products]
  );

  const value = useMemo<EntitlementContextValue>(
    () => ({
      isPro,
      isLoading,
      purchaseInFlight,
      unlockProduct,
      connected,
      purchaseUnlock,
      restorePurchases,
    }),
    [isPro, isLoading, purchaseInFlight, unlockProduct, connected, purchaseUnlock, restorePurchases]
  );

  return <EntitlementContext.Provider value={value}>{children}</EntitlementContext.Provider>;
}

export function useEntitlement(): EntitlementContextValue {
  const ctx = useContext(EntitlementContext);
  if (!ctx) throw new Error('useEntitlement must be used within EntitlementProvider');
  return ctx;
}
