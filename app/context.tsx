"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { uid } from "uid";

export const uident = uid(12);

export type tokenVal = {
  token: string;
  val: number;
};
const initialStrikeN = 18000;
const initialStrikeS = 68000;
type yesterDataType = {
  yesterPriceN: number;
  yesterPriceS: number;
  yesterOptionPrice: {
    N: number[][];
    S: number[][];
  };
};

function getIndexfromToken(token: string) {
  let index;
  const num = Number(token.slice(0, token.length - 1));
  const sym = token[token.length - 1];
  const subIndex = sym === "C" ? 0 : 1;
  // const percInd = sym === "C" ? 0 : 4;
  // const yesterIndex = sym === "C" ? 0 : 1;
  if (num < 30000) {
    index = (num - initialStrikeN) / 100;
  } else {
    index = 75 + (num - initialStrikeS) / 100;
  }
  return [index, subIndex];
}

export const yesterPriceData: yesterDataType = {
  yesterPriceN: 0,
  yesterPriceS: 0,
  yesterOptionPrice: { N: [], S: [] },
};

export const strikes: number[] = [];

export type WorkerData = {
  data: number[][];
  realtimedata: number[][][];
  underlying: number;
  connectionStatus: boolean;
  transport: string;
  worker: SharedWorker | null;
  updates: tokenVal[];
  setData: Dispatch<SetStateAction<number[][]>> | null;
  setUnderlying: Dispatch<SetStateAction<number>> | null;
  trigger: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>> | null;
  setRealtimeData: Dispatch<SetStateAction<number[][][]>> | null;
};

const WorkerContext = createContext<WorkerData>({
  data: [],
  realtimedata: [],
  underlying: 22500,
  connectionStatus: false,
  transport: "Undefined",
  worker: null,
  updates: [],
  setData: null,
  setUnderlying: null,
  trigger: false,
  setTrigger: null,
  setRealtimeData: null,
});

export const useWorker = () => {
  return useContext(WorkerContext);
};

const broadcastChannel = new BroadcastChannel("SocketIOChannel");

function fillStrikes() {
  strikes.length = 0;
  for (let i = 0; i < yesterPriceData.yesterOptionPrice.N.length; i++) {
    strikes.push(yesterPriceData.yesterOptionPrice.N[i][2]);
  }
  for (let i = 0; i < yesterPriceData.yesterOptionPrice.N.length; i++) {
    strikes.push(yesterPriceData.yesterOptionPrice.S[i][2]);
  }
  console.log("logging strikes");
  console.log(strikes);
}

export function DataActuator({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<number[][]>([]);
  const [underlying, setUnderlying] = useState<number>(22500);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [transport, setTransport] = useState("Undefined");
  const [sharedWorker, setSharedWorker] = useState<SharedWorker | null>(null);
  const [updates, setUpdates] = useState<tokenVal[]>([]);
  const [realtimeData, setRealtimeData] = useState<number[][][]>(() => {
    const x = [];
    for (let i = 0; i < 150; i++) x.push([[], []]);
    return x;
  });
  const [trigger, setTrigger] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const worker = new window.SharedWorker("/scripts/worker.js");
      worker.port.start();
      setSharedWorker(worker);
      broadcastChannel.addEventListener("message", (e) => {
        if ("data" in e.data && e.data.id === uident) {
          setData(e.data.data);
          setUnderlying(e.data.underlying);
        } else if ("status" in e.data) {
          setConnectionStatus(e.data.status);
          setTransport(e.data.transport);
        } else if ("yesterPriceN" in e.data) {
          yesterPriceData.yesterPriceN = e.data.yesterPriceN;
          yesterPriceData.yesterPriceS = e.data.yesterPriceS;
          yesterPriceData.yesterOptionPrice = e.data.yesterOptionPrice;
          fillStrikes();
        } else if ("requestagain" in e.data) {
          setTimeout(() => {
            worker.port.postMessage("yesterdata");
          }, 1000);
        } else if ("tokenval" in e.data) {
          console.log("hey, tokenval");
          const temp = realtimeData;
          const [index, subIndex] = getIndexfromToken(e.data.token);
          temp[index][subIndex] = [e.data.tokenval, e.data.tokenChg];
          setRealtimeData(temp);
          setTrigger((x) => !x);
          console.log(temp[index][subIndex]);
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
        realtimedata: realtimeData,
        underlying: underlying,
        connectionStatus: connectionStatus,
        transport: transport,
        worker: sharedWorker,
        updates: updates,
        setData: setData,
        setUnderlying: setUnderlying,
        trigger: trigger,
        setTrigger: setTrigger,
        setRealtimeData: setRealtimeData,
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
