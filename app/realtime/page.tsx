"use client";

import React, { useEffect, useRef, useState } from "react";
// import { socket } from "../socket";
import { dataObject } from "../options-chain/page";
import { Dot } from "lucide-react";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps,
} from "react-virtualized";
import { useWorker } from "../context";

export default function Page() {
  const [subscribers, setSubscribers] = useState(() => {
    const x = [];
    for (let i = 0; i < 75; i++) x.push(["unsubscribed", "unsubscribed"]);
    return x;
  });
  const { data, connectionStatus, worker } = useWorker();
  const cache = useRef(
    new CellMeasurerCache({
      fixedHeight: true,
      defaultWidth: 500,
    }),
  );
  function rowRenderer({ key, index, style, parent }: ListRowProps) {
    const obj = data ? data[index] : null;
    if (!obj) return <div key={key} style={style}></div>;
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
      <CellMeasurer
        key={key}
        cache={cache.current}
        parent={parent}
        rowIndex={index}
        columnIndex={0}
      >
        <div style={style}>
          <div className="w-full h-[50px] flex justify-between bg-white rounded-lg my-1 px-2 font-mono">
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
              onClick={() => subscribeByIdx(index, 0)}
            >
              <div className="w-full flex justify-center">
                {subscribers[index][0] === "subscribed"
                  ? "Unsubscribe"
                  : "Subscribe"}
              </div>
            </div>
          </div>

          <div className="w-full h-[50px] flex justify-between bg-white rounded-lg my-1 px-2 font-mono">
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
              onClick={() => subscribeByIdx(index, 1)}
            >
              <div className="w-full flex justify-center">
                {subscribers[index][1] === "subscribed"
                  ? "Unsubscribe"
                  : "Subscribe"}
              </div>
            </div>
          </div>
        </div>
      </CellMeasurer>
    );
  }

  function subscribeByIdx(row: number, col: number) {
    const temp = subscribers;
    if (temp[row][col] === "subscribed") {
      temp[row][col] = "unsubscribed";
    } else {
      temp[row][col] = "subscribed";
    }
    setSubscribers(temp);
  }

  return (
    <div className="flex flex-col h-screen w-screen p-5">
      <div className="w-full h-16 flex justify-between px-3 bg-blue-800 rounded-lg">
        <div className="flex flex-col h-full justify-center text-white xl:text-3xl max-xl:text-lg font-mono">
          Realtime Inspector
        </div>
        <div className="w-48 flex justify-end">
          <div>
            <Dot
              className={`${connectionStatus ? "text-green-600" : "text-red-800"}`}
              size={62}
            />
          </div>
          <div className="xl:text-2xl max-xl:text-sm text-white h-full flex flex-col justify-center font-mono">
            {connectionStatus ? "live" : "disconnected"}
          </div>
        </div>
      </div>
      <div className="w-full xl:h-16 max-xl:h-24 flex justify-between bg-gray-100 mt-2 px-3">
        <div className="w-[500px] bg-gray-100 flex justify-between">
          <div className="w-full xl:text-2xl max-xl:text-md h-full flex flex-col justify-center font-mono">
            Options
          </div>
        </div>
        <div
          className="w-max flex justify-between px-5 my-1 rounded-lg bg-white hover:cursor-pointer shadow-sm hover:shadow-md transition duration-100 font-mono"
          onClick={() => {
            if (connectionStatus && worker) {
              worker.port.postMessage("disconnect");
            } else if (worker) {
              worker.port.postMessage("reconnect");
            }
          }}
        >
          <div className="w-full xl:text-2xl max-xl:text-sm h-full flex flex-col justify-center">
            {connectionStatus ? "disconnect server" : "connect to server"}
          </div>
        </div>
      </div>
      <div className="w-full h-full flex max-2xl:flex-col rounded-lg">
        <div className="2xl:w-[500px] max-2xl:w-full xl:h-full max-2xl:h-[500px] overflow-scroll px-1 bg-gray-100 pb-1 flex-none">
          {data && data.length && data[0].length ? (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  width={width}
                  height={height}
                  rowHeight={108}
                  deferredMeasurementCache={cache.current}
                  rowCount={data.length}
                  rowRenderer={rowRenderer}
                />
              )}
            </AutoSizer>
          ) : null}
        </div>
        <div className="flex 2xl:grow 2xl:px-5">
          <div className="grid xl:grid-cols-[repeat(4,minmax(250,1fr))] md:max-xl:grid-cols-[repeat(2,minmax(250,1fr))] max-md:grid-cols-[repeat(1,minmax(250,1fr))] grid-flow-row auto-rows-[150px] overflow-scroll mb-5 gap-1 w-full">
            {subscribers && subscribers.length
              ? subscribers.map((obj, idx) => {
                  let text_colr_C, text_colr_P;
                  if (data && data[idx] && data[idx][0] > 0) {
                    text_colr_C = "text-[#007a00]";
                  } else if (data) {
                    text_colr_C = "text-[#d02724]";
                  }
                  if (data && data[idx] && data[idx][4] > 0) {
                    text_colr_P = "text-[#007a00]";
                  } else if (data) {
                    text_colr_P = "text-[#d02724]";
                  }
                  return (
                    <React.Fragment key={idx}>
                      {obj[0] === "subscribed" ? (
                        <div className="flex flex-col p-2 bg-gray-50 rounded-lg h-full justify-center mt-2 font-mono">
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
                        <div className="flex flex-col p-2 bg-gray-50 rounded-lg h-full justify-center mt-2 font-mono">
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

/*
data.map((obj, idx) => {
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
*/
