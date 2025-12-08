import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import type { Order } from "@shared/schema";

interface OrderNotificationContextType {
  pendingOrderCount: number;
  newOrdersCount: number;
  markOrdersSeen: () => void;
  isAdmin: boolean;
}

const OrderNotificationContext = createContext<OrderNotificationContextType | null>(null);

const NOTIFICATION_SOUND_URL = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdXaBhYqJhYN+fn18fH1/goaJiYWFg4F9fHx9f4GEh4mJh4WDgX59fH1+gIOGiImHhYOBfn19fn+Bg4aHiIaEgoB+fX19f4GDhoeHhoSCgH9+fX5/gYOFh4eGhIOBf359fn+BgoSGh4aFhIKAf35+f4CBg4WGhoWEg4F/fn5+f4CCg4WGhoWEgoB/fn5+f4CBg4WGhoWEgoB/fn5/f4CBg4WGhoWEgoB/fn5/f4CBg4WGhoWEgoGAf35/f4CBg4WGhoWEgoGAf35/f4CBg4SFhoWEg4GAf35/f4CBg4SFhoWEg4GAf35/f4CBg4SFhoWEg4GAf39/f4CBg4SFhYSEg4GAf39/f4CBg4SFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoSFhYSDgoGAf39/f4CBgoOEhYSDgoGAf39/f4CBgoOEhYSDgoGAf39/f4CBgoOEhYSDgoGAf39/f4CBgoOEhYSDgoGAf39/f4CBgoOEhYSDgoGAf39/gICBgoOEhYSDgoGAf39/gICBgoOEhYSDgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISCgoGAf39/gICBgoOEhISDgoGAf39/gICBgoOEhISDgoGAf39/gICBgoOEhISDgoGAf39/gICBgoOEhISDgoGAf39/gICBgoOEhISDgoGAf39/gICBgoOEhISDgoGAf39/gICBgoOEhISDgoGAf39/gICBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoOEhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhISDgoGAf35/f4CBgoODhIOCgoGAf35/f4CBgoODhIOCgoGAf35/f4CBgoODg4OCgoGAf35/f4CBgoODg4OCgoGAf35/f4CBgoODg4OCgoGAf35/f4CBgoODg4OCgoGAf35/f4CBgoODg4OCgoGAf35/f4CBgoODg4OCgoGAf35/f4A=";

export function OrderNotificationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, getUserRole } = useAuth();
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const seenOrderIdsRef = useRef<Set<string>>(new Set());
  const pendingOrderIdsRef = useRef<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  const playNotificationSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
      audioRef.current.volume = 0.5;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);

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
  }, [isAdmin, currentUser, playNotificationSound]);

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
