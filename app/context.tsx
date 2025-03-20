"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export type tokenVal = {
  token: string;
  val: number;
};

type yesterDataType = {
  yesterPriceN: number;
  yesterPriceS: number;
  yesterOptionPrice: {
    N: number[][];
    S: number[][];
  };
};

export const yesterPriceData: yesterDataType = {
  yesterPriceN: 0,
  yesterPriceS: 0,
  yesterOptionPrice: { N: [], S: [] },
};

export type WorkerData = {
  data: number[][];
  underlying: number;
  connectionStatus: boolean;
  transport: string;
  worker: SharedWorker | null;
  updates: tokenVal[];
  setData: Dispatch<SetStateAction<number[][]>> | null;
  setUnderlying: Dispatch<SetStateAction<number>> | null;
};

const WorkerContext = createContext<WorkerData>({
  data: [],
  underlying: 22500,
  connectionStatus: false,
  transport: "Undefined",
  worker: null,
  updates: [],
  setData: null,
  setUnderlying: null,
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
  const [updates, setUpdates] = useState<tokenVal[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const worker = new window.SharedWorker("/scripts/worker.js");
      worker.port.start();
      setSharedWorker(worker);
      broadcastChannel.addEventListener("message", (e) => {
        if ("data" in e.data) {
          setData(e.data.data);
          setUnderlying(e.data.underlying);
        } else if ("status" in e.data) {
          setConnectionStatus(e.data.status);
          setTransport(e.data.transport);
        } else if ("yesterPriceN" in e.data) {
          yesterPriceData.yesterPriceN = e.data.yesterPriceN;
          yesterPriceData.yesterPriceS = e.data.yesterPriceS;
          yesterPriceData.yesterOptionPrice = e.data.yesterOptionPrice;
        } else if ("updates" in e.data) {
          setUpdates(e.data.updates);
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
        updates: updates,
        setData: setData,
        setUnderlying: setUnderlying,
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
