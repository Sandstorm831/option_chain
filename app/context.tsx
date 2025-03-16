"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type WorkerData = {
  data: number[][];
  underlying: number;
  connectionStatus: boolean;
  transport: string;
  worker: SharedWorker | null;
};

const WorkerContext = createContext<WorkerData>({
  data: [],
  underlying: 22500,
  connectionStatus: false,
  transport: "Undefined",
  worker: null,
});

export const useWorker = () => {
  return useContext(WorkerContext);
};

const broadcastChannel = new BroadcastChannel("SocketIOChannel");

export function DataActuator({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<number[][]>([]);
  const [underlying, setUnderlying] = useState<number>(22500);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [transport, setTransport] = useState("Undefined");
  const [sharedWorker, setSharedWorker] = useState<SharedWorker | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const worker = new window.SharedWorker("/scripts/worker.js");
      worker.port.start();
      setSharedWorker(worker);
      broadcastChannel.addEventListener("message", (e) => {
        if ("data" in e.data) {
          setData(e.data.data);
          setUnderlying(e.data.underlying);
        } else {
          setConnectionStatus(e.data.status);
          setTransport(e.data.transport);
        }
      });
      worker.port.onmessage = (e) => {
        if ("data" in e.data) {
          setData(e.data.data);
          setUnderlying(e.data.underlying);
        } else {
          setConnectionStatus(e.data.status);
          setTransport(e.data.transport);
        }
      };
    }
  }, []);
  return (
    <WorkerContext.Provider
      value={{
        data: data,
        underlying: underlying,
        connectionStatus: connectionStatus,
        transport: transport,
        worker: sharedWorker,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
}
/*
useEffect(() => {
  if (typeof window !== "undefined") {
    const worker = new window.SharedWorker("/scripts/worker.js");
    broadcastChannel.addEventListener("message", (event) => {
      console.log(event.data);
    });
    worker.port.start();
    worker.port.onmessage = (e) => {
      console.log(e.data);
    };
  }
}, []);
*/
