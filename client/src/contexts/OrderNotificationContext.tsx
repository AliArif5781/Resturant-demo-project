import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@shared/schema";

interface OrderNotificationContextType {
  pendingOrderCount: number;
  newOrdersCount: number;
  markOrdersSeen: () => void;
  isAdmin: boolean;
}

const OrderNotificationContext = createContext<OrderNotificationContextType | null>(null);

export function OrderNotificationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, getUserRole } = useAuth();
  const { toast } = useToast();
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const seenOrderIdsRef = useRef<Set<string>>(new Set());
  const pendingOrderIdsRef = useRef<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (currentUser) {
        const role = await getUserRole(currentUser.uid);
        setIsAdmin(role === "admin");
      } else {
        setIsAdmin(false);
      }
    };
    checkAdminRole();
  }, [currentUser, getUserRole]);

  const playNotificationSound = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.3) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      
      playTone(880, now, 0.25, 0.25);
      playTone(1100, now + 0.25, 0.25, 0.25);
      playTone(880, now + 0.5, 0.25, 0.25);
      playTone(1100, now + 0.75, 0.25, 0.25);
      
      playTone(880, now + 1.2, 0.25, 0.25);
      playTone(1100, now + 1.45, 0.25, 0.25);
      playTone(880, now + 1.7, 0.25, 0.25);
      playTone(1100, now + 1.95, 0.25, 0.25);
      
      playTone(1320, now + 2.4, 0.4, 0.3);
      
    } catch (error) {
      console.error("Failed to play notification sound:", error);
    }
  }, []);

  const showNewOrderToast = useCallback((orderCount: number) => {
    toast({
      title: "New Order Received!",
      description: orderCount === 1 
        ? "A new order has been placed and is waiting for your attention."
        : `${orderCount} new orders have been placed.`,
      duration: 5000,
    });
  }, [toast]);

  const fetchOrders = useCallback(async () => {
    if (!isAdmin || !currentUser) return;

    try {
      const response = await fetch("/api/orders?limit=100", {
        headers: {
          "x-firebase-uid": currentUser.uid,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const orders: Order[] = data.orders || [];
        
        const pendingOrders = orders.filter((order) => order.status === "pending");
        const pendingIds = pendingOrders.map((order) => order.id);
        const newPendingCount = pendingOrders.length;
        
        const unseenOrders = pendingOrders.filter((order) => !seenOrderIdsRef.current.has(order.id));
        const newUnseenCount = unseenOrders.length;
        
        if (!isFirstLoadRef.current && newUnseenCount > 0) {
          const previousIds = new Set(pendingOrderIdsRef.current);
          const trulyNewOrders = unseenOrders.filter((order) => !previousIds.has(order.id));
          if (trulyNewOrders.length > 0) {
            playNotificationSound();
            showNewOrderToast(trulyNewOrders.length);
          }
        }
        
        if (isFirstLoadRef.current) {
          pendingIds.forEach((id) => seenOrderIdsRef.current.add(id));
          setNewOrdersCount(0);
        } else {
          setNewOrdersCount(newUnseenCount);
        }
        
        isFirstLoadRef.current = false;
        pendingOrderIdsRef.current = pendingIds;
        setPendingOrderCount(newPendingCount);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }, [isAdmin, currentUser, playNotificationSound, showNewOrderToast]);

  useEffect(() => {
    if (isAdmin && currentUser) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, currentUser, fetchOrders]);

  const markOrdersSeen = useCallback(() => {
    pendingOrderIdsRef.current.forEach((id) => seenOrderIdsRef.current.add(id));
    setNewOrdersCount(0);
  }, []);

  return (
    <OrderNotificationContext.Provider
      value={{
        pendingOrderCount,
        newOrdersCount,
        markOrdersSeen,
        isAdmin,
      }}
    >
      {children}
    </OrderNotificationContext.Provider>
  );
}

export function useOrderNotifications() {
  const context = useContext(OrderNotificationContext);
  if (!context) {
    throw new Error("useOrderNotifications must be used within an OrderNotificationProvider");
  }
  return context;
}
