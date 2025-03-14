"use client";

import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { dataObject } from "../options-chain/page";
import { Dot } from "lucide-react";

export default function Page() {
  const [subscribers, setSubscribers] = useState(() => {
    const x = [];
    for (let i = 0; i < 75; i++) x.push(["unsubscribed", "unsubscribed"]);
    return x;
  });
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [data, setData] = useState<number[][]>();

  function subscribeByIdx(row: number, col: number) {
    const temp = subscribers;
    if (temp[row][col] === "subscribed") {
      temp[row][col] = "unsubscribed";
    } else {
      temp[row][col] = "subscribed";
    }
    setSubscribers(temp);
  }

  useEffect(() => {
    if (socket.connected) {
      setConnectionStatus(true);
    }
    socket.on("disconnect", (reason, details) => {
      setConnectionStatus(false);
      socket.io.engine.on("upgrade", (transport) => {});
    });
    socket.on("connect", () => {
      setConnectionStatus(true);
      socket.io.engine.on("upgrade", (transport) => {});
    });
    socket.on("data", (data: dataObject) => {
      setData(data.data);
    });
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen p-5">
      <div className="w-full h-12 flex justify-center bg-blue-800 rounded-lg">
        <div className="flex flex-col h-full justify-center text-white text-3xl font-mono">
          Realtime Inspector
        </div>
      </div>
      <div className="w-full h-16 flex rounded-lg justify-between">
        <div className="w-[500px] bg-gray-100 flex justify-between px-5 mt-1">
          <div className="w-48 text-2xl h-full flex flex-col justify-center">
            Options
          </div>
        </div>
        <div className="w-48 flex justify-end px-5 mt-1">
          <div>
            <Dot
              className={`${socket.connected ? "text-green-500" : "text-red-800"}`}
              size={62}
            />
          </div>
          <div className="w-48 text-2xl h-full flex flex-col justify-center">
            {socket.connected ? "Live" : "Disconnected"}
          </div>
        </div>
      </div>
      <div className="w-full h-full flex rounded-lg">
        <div className="w-[500px] h-full overflow-scroll px-1 bg-gray-100 grid grid-flow-row auto-row-[30px] grid-cols-1 z-10">
          {data && data.length
            ? data.map((obj, idx) => {
                let text_colr_C, text_colr_P;
                if (obj[0] > 0) {
                  text_colr_C = "text-[#007a00]";
                } else {
                  text_colr_C = "text-[#d02724]";
                }
                if (obj[4] > 0) {
                  text_colr_P = "text-[#007a00]";
                } else {
                  text_colr_P = "text-[#d02724]";
                }
                return (
                  <React.Fragment key={idx}>
                    <div className="w-full h-[50px] flex justify-between bg-white rounded-lg my-1 px-2">
                      <div className="h-full flex flex-col justify-center font-bold">
                        <div className="flex justify-center">{`${obj[2].toString()}C`}</div>
                      </div>
                      <div
                        className={`${text_colr_C} h-full flex flex-col justify-center`}
                      >
                        <div className="flex justify-center">{`${obj[1]}`}</div>
                        <div className="text-sm flex justify-center">{` ${obj[0]} %`}</div>
                      </div>
                      <div
                        className="px-2 w-[120px] h-full rounded-lg bg-blue-800 text-white flex flex-col justify-center hover:opacity-95 cursor-pointer font-bold"
                        onClick={() => subscribeByIdx(idx, 0)}
                      >
                        <div className="w-full flex justify-center">
                          {subscribers[idx][0] === "subscribed"
                            ? "Unsubscribe"
                            : "Subscribe"}
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-[50px] flex justify-between bg-white rounded-lg my-1 px-2">
                      <div className="h-full flex flex-col justify-center font-bold">
                        <div className="flex justify-center">{`${obj[2].toString()}P`}</div>
                      </div>
                      <div
                        className={`${text_colr_P} h-full flex flex-col justify-center`}
                      >
                        <div className="flex justify-center">{`${obj[3]}`}</div>
                        <div className="text-sm flex justify-center">{` ${obj[4]} %`}</div>
                      </div>
                      <div
                        className="px-2 w-[120px] h-full rounded-lg bg-blue-800 text-white flex flex-col justify-center hover:opacity-95 cursor-pointer font-bold"
                        onClick={() => subscribeByIdx(idx, 1)}
                      >
                        <div className="w-full flex justify-center">
                          {subscribers[idx][1] === "subscribed"
                            ? "Unsubscribe"
                            : "Subscribe"}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            : null}
        </div>
        <div className="flex grow px-5">
          <div className="grid grid-cols-4 grid-flow-row auto-rows-[150px] overflow-scroll mb-5 gap-1 w-full">
            {subscribers && subscribers.length
              ? subscribers.map((obj, idx) => {
                  let text_colr_C, text_colr_P;
                  if (data && data[idx][0] > 0) {
                    text_colr_C = "text-[#007a00]";
                  } else if (data) {
                    text_colr_C = "text-[#d02724]";
                  }
                  if (data && data[idx][4] > 0) {
                    text_colr_P = "text-[#007a00]";
                  } else if (data) {
                    text_colr_P = "text-[#d02724]";
                  }
                  return (
                    <React.Fragment key={idx}>
                      {obj[0] === "subscribed" ? (
                        <div className="flex flex-col p-2 bg-gray-50 rounded-lg h-full justify-center">
                          <div className="flex justify-center font-bold text-xl">
                            {data ? `${data[idx][2]}C` : null}
                          </div>
                          <div className="flex justify-center text-sm">
                            {data ? `Option Type : Call` : null}
                          </div>
                          <div className="flex justify-center text-sm">
                            {data ? `Option Strike : ${data[idx][2]}` : null}
                          </div>
                          <div className="flex justify-center text-sm whitespace-pre-wrap">
                            <div>Option Price : </div>
                            <div className={`text-sm ${text_colr_C}`}>
                              {data ? data[idx][1] : null}
                            </div>
                          </div>
                          <div className="flex justify-center text-sm whitespace-pre-wrap">
                            <div>Price Change : </div>
                            <div className={`text-sm ${text_colr_C}`}>
                              {data ? data[idx][0] : null}%
                            </div>
                          </div>
                          <div
                            className="w-full flex justify-center text-white font-bold bg-blue-800 rounded-lg mt-2 cursor-pointer"
                            onClick={() => subscribeByIdx(idx, 0)}
                          >
                            Unsubscribe
                          </div>
                        </div>
                      ) : null}
                      {obj[1] === "subscribed" ? (
                        <div className="flex flex-col p-2 bg-gray-50 rounded-lg h-full justify-center">
                          <div className="flex justify-center font-bold text-xl">
                            {data ? `${data[idx][2]}P` : null}
                          </div>
                          <div className="flex justify-center text-sm">
                            {data ? `Option Type : Put` : null}
                          </div>
                          <div className="flex justify-center text-sm">
                            {data ? `Option Strike : ${data[idx][2]}` : null}
                          </div>
                          <div className="flex justify-center text-sm whitespace-pre-wrap">
                            <div>Option Price : </div>
                            <div className={`text-sm ${text_colr_P}`}>
                              {data ? data[idx][3] : null}
                            </div>
                          </div>
                          <div className="flex justify-center text-sm whitespace-pre-wrap">
                            <div>Price Change : </div>
                            <div className={`text-sm ${text_colr_P}`}>
                              {data ? data[idx][4] : null}%
                            </div>
                          </div>
                          <div
                            className="w-full flex justify-center text-white font-bold bg-blue-800 rounded-lg mt-2 cursor-pointer"
                            onClick={() => subscribeByIdx(idx, 1)}
                          >
                            Unsubscribe
                          </div>
                        </div>
                      ) : null}
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
