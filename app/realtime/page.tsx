"use client";
const initialStrikeN = 18000;
const initialStrikeS = 68000;
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
// import { socket } from "../socket";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps,
} from "react-virtualized";
import { strikes, tokenVal, useWorker, yesterPriceData } from "../context";
import RealtimeInforbar from "@/components/realtimeInforbar";
import RealtimeConnectAndOptionBar from "@/components/realtimeConnectbar";
import RealtimeCallPutTileTwo from "@/components/realtimeCallPutTile2";
import SubscribedCallPutTile2 from "@/components/subscribedCallPutTile2";

function calculatePercentageChange(val: number, anchor: number) {
  return Number((((val - anchor) / anchor) * 100).toFixed(2));
}

function getTokenFromCoorindates(row: number, col: number) {
  let token: string;
  if (row < 75) {
    token = `${initialStrikeN + row * 100}${col === 0 ? "C" : "P"}`;
  } else {
    token = `${initialStrikeS + (row - 75) * 100}${col === 0 ? "C" : "P"}`;
  }
  return token;
}

let intval: NodeJS.Timeout | null = null;

function getCoordinatesFromToken(token: string) {
  const num = Number(token.slice(0, token.length - 1));
  const sym = token[token.length - 1];
  let subindex, index;
  subindex = sym === "C" ? 0 : 1;
  if (num < 30000) {
    index = (num - initialStrikeN) / 100;
  } else {
    index = (num - initialStrikeS) / 100;
    index += 75;
  }
  return [index, subindex];
}

function useUpdate(
  updates: tokenVal[],
  realtimedata: number[][][],
  subscribers: string[][],
  setRealtimeData: Dispatch<SetStateAction<number[][][]>> | null,
) {
  useEffect(() => {
    const temp = realtimedata;
    for (let i = 0; i < updates.length; i++) {
      if (updates[i].token.length === 1) continue;
      else {
        const token = updates[i].token;
        const [index, subindex] = getCoordinatesFromToken(token);
        console.log(subscribers.length, index);
        if (subscribers[index][subindex] === "subscribed") {
          const percChange = calculatePercentageChange(
            updates[i].val,
            index >= 75
              ? yesterPriceData.yesterOptionPrice.S[index - 75][subindex]
              : yesterPriceData.yesterOptionPrice.N[index][subindex],
          );
          temp[index][subindex] = [updates[i].val, percChange];
        }
      }
    }
    if (setRealtimeData) setRealtimeData(temp);
  }, [updates]);
}

export default function Page() {
  const [subscribers, setSubscribers] = useState(() => {
    const x = [];
    for (let i = 0; i < 150; i++) x.push(["unsubscribed", "unsubscribed"]);
    return x;
  });
  const {
    setRealtimeData,
    updates,
    connectionStatus,
    worker,
    realtimedata,
    setTrigger,
  } = useWorker();
  // const [trigger, setTrigger] = useState<boolean>(false);
  const cache = useRef(
    new CellMeasurerCache({
      fixedHeight: true,
      defaultWidth: 500,
    }),
  );

  useUpdate(updates, realtimedata, subscribers, setRealtimeData);

  function rowRenderer({ key, index, style, parent }: ListRowProps) {
    const obj = strikes ? strikes[index] : null;
    if (!obj) return <div key={key} style={style}></div>;
    let text_colr_C, text_colr_P;
    // if (obj[0] > 0) {
    //   text_colr_C = "text-[#007a00]";
    // } else {
    //   text_colr_C = "text-[#d02724]";
    // }
    // if (obj[4] > 0) {
    //   text_colr_P = "text-[#007a00]";
    // } else {
    //   text_colr_P = "text-[#d02724]";
    // }
    return (
      <CellMeasurer
        key={key}
        cache={cache.current}
        parent={parent}
        rowIndex={index}
        columnIndex={0}
      >
        <div style={style}>
          <RealtimeCallPutTileTwo
            callPut="C"
            strike={obj}
            subscribeByIdx={subscribeByIdx}
            index={index}
            theSubscriber={subscribers[index][0]}
          />
          <RealtimeCallPutTileTwo
            callPut="P"
            strike={obj}
            subscribeByIdx={subscribeByIdx}
            index={index}
            theSubscriber={subscribers[index][1]}
          />
        </div>
      </CellMeasurer>
    );
  }

  function subscribeByIdx(row: number, col: number) {
    if (intval) clearInterval(intval);
    const temp = subscribers;
    const token = getTokenFromCoorindates(row, col);
    if (temp[row][col] === "subscribed") {
      temp[row][col] = "unsubscribed";
      worker?.port.postMessage(["release", token]);
    } else {
      temp[row][col] = "subscribed";
      worker?.port.postMessage(["realtime", token]);
    }
    setSubscribers(temp);
    if (setTrigger) setTrigger((x) => !x);
  }

  return (
    <div className="flex flex-col h-screen w-screen p-5">
      <RealtimeInforbar connectionStatus={connectionStatus} />
      <RealtimeConnectAndOptionBar
        worker={worker}
        connectionStatus={connectionStatus}
      />
      <div className="w-full h-full flex max-2xl:flex-col rounded-lg">
        <div className="2xl:w-[500px] max-2xl:w-full xl:h-full max-2xl:h-[500px] overflow-scroll px-1 bg-gray-100 pb-1 flex-none">
          {strikes && strikes.length ? (
            <AutoSizer>
              {({ width, height }) => (
                <List
                  width={width}
                  height={height}
                  rowHeight={108}
                  deferredMeasurementCache={cache.current}
                  rowCount={strikes.length}
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
                  if (
                    realtimedata[idx][0].length > 1 &&
                    realtimedata[idx][0][1] > 0
                  ) {
                    text_colr_C = "text-[#007a00]";
                  } else if (realtimedata[idx][0].length > 1) {
                    text_colr_C = "text-[#d02724]";
                  }
                  if (
                    realtimedata[idx][1].length > 1 &&
                    realtimedata[idx][1][1] > 0
                  ) {
                    text_colr_P = "text-[#007a00]";
                  } else if (realtimedata[idx][1].length > 0) {
                    text_colr_P = "text-[#d02724]";
                  }
                  // const realtimedataIdxCall = realtimedata[idx][0];
                  // const realtimedataIdxPut = realtimedata[idx][1];
                  // if (realtimedataIdxCall.length > 0) {
                  //   console.log(`call : ${realtimedataIdxCall}`);
                  //   console.log(idx, 0);
                  // }
                  // if (realtimedataIdxPut.length > 0) {
                  //   console.log(`call : ${realtimedataIdxPut}`);
                  //   console.log(idx, 1);
                  // }
                  return (
                    <React.Fragment key={idx}>
                      {obj[0] === "subscribed" ? (
                        <SubscribedCallPutTile2
                          strike={strikes[idx]}
                          callPut="C"
                          dataIdx={realtimedata[idx][0]}
                          text_colr={text_colr_C}
                          subscribeByIdx={subscribeByIdx}
                          idx={idx}
                        />
                      ) : null}
                      {obj[1] === "subscribed" ? (
                        <SubscribedCallPutTile2
                          strike={strikes[idx]}
                          callPut="P"
                          dataIdx={realtimedata[idx][1]}
                          text_colr={text_colr_P}
                          subscribeByIdx={subscribeByIdx}
                          idx={idx}
                        />
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
