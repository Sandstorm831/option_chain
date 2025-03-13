"use client";
import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { removeAllListeners } from "node:process";

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [transportName, setTransportName] = useState("");
  useEffect(() => {
    if (socket.connected) {
      setConnectionStatus(true);
      setTransportName(socket.io.engine.transport.name);
    }
    socket.on("connect", () => {
      setConnectionStatus(true);
      setTransportName(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        setTransportName(transport.name);
      });
    });
    socket.on("data", (data: number[][]) => {
      setData(data);
    });
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  const [data, setData] = useState([
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
  ]);
  const [underlying, setUnderlying] = useState<number>(0);
  return (
    <div className="flex flex-col justify-center h-screen w-screen p-5">
      <div className="w-full h-36 flex justify-center bg-blue-800 rounded-lg">
        <div className="flex flex-col h-full justify-center text-white text-3xl font-mono">
          Underlying : {underlying} | Live Status :{" "}
          {connectionStatus ? "Live" : "Disconnected"} | Transport_Method :{" "}
          {transportName}
        </div>
      </div>
      <div className="flex flex-col grow w-full mt-5 bg-gray-200 rounded-lg overflow-scroll">
        <div className="w-full flex-none">
          <div className="flex">
            <div className="flex w-full bg-blue-800 border-r-2 border-white text-white h-max">
              <div className="flex justify-center w-full text-xl">Calls</div>
            </div>
            <div className="flex w-full bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full text-xl">Puts</div>
            </div>
          </div>
          <div className="flex border-t-2 border-white">
            <div className="flex w-full border-r-2 border-white bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full text-xl">Change</div>
            </div>
            <div className="flex w-full border-r-2 border-white bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full text-xl">Price</div>
            </div>
            <div className="flex w-full border-r-2 border-white bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full text-xl">Strike</div>
            </div>
            <div className="flex w-full border-r-2 border-white bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full text-xl">Price</div>
            </div>
            <div className="flex w-full bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full text-xl">Change</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col grow overflow-scroll">
          <div className="grid grid-cols-5 grid-rows-[repeat(75,30px)]">
            {data && data.length
              ? data.map((stk, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      {stk && stk.length
                        ? stk.map((val, tidx) => (
                            <div key={tidx} className="flex w-full">
                              <div className="flex justify-center w-full text-md font-mono">
                                {val}
                              </div>
                            </div>
                          ))
                        : null}
                    </React.Fragment>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
