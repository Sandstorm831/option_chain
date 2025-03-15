"use client";
import { Children, createContext, useEffect, useState } from "react";

export type WorkerData = {
  data: number[][];
  underlying: number;
  status: boolean;
  transport: string;
};

const WorkerContext = createContext<WorkerData>({
  data: [],
  underlying: 22500,
  status: false,
  transport: "Undefined",
});
const broadcastChannel = new BroadcastChannel("SocketIOChannel");

export function DataActuator({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<number[][]>([]);
  const [underlying, setUnderlying] = useState<number>(22500);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [transport, setTransport] = useState("Undefined");
  useEffect(() => {
    console.log("I am running, hoorayyyyyy");
    if (typeof window !== "undefined") {
      const worker = new window.SharedWorker("/scripts/worker.js");
      broadcastChannel.addEventListener("message", (e) => {
        if ("data" in e.data) {
          console.log(e.data);
          setData(e.data.data);
          setUnderlying(e.data.underlying);
        } else {
          console.log(`status: ${e.data.status}`);
          setConnectionStatus(e.data.status);
          setTransport(e.data.transport);
        }
      });
      worker.port.start();
      worker.port.onmessage = (e) => {
        console.log(e.data);
        if ("data" in e.data) {
          console.log(data);
          setData(e.data.data);
          setUnderlying(e.data.underlying);
        } else {
          console.log(`status: ${e.data.status}`);
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
        status: connectionStatus,
        transport: transport,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
}
