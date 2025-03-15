"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { DataActuator } from "./context";
const broadcastChannel = new BroadcastChannel("SocketIOChannel");

export default function Home() {
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
  return (
    <DataActuator>
      <div className="flex flex-col justify-center h-screen w-screen">
        <div className="w-full flex justify-center">
          <div className="flex flex-col w-max">
            <Link
              href="/options-chain"
              className="bg-black rounded-lg p-3 text-white text-xl w-full justify-center flex hover:opacity-80 transition duration-100 m-5"
            >
              Go to Options-Chain
            </Link>
            <Link
              href="/realtime"
              className="bg-black rounded-lg p-3 text-white text-xl w-full justify-center flex hover:opacity-80 transition duration-100 m-5"
            >
              Go to Inspector
            </Link>
          </div>
        </div>
      </div>
    </DataActuator>
  );
}
