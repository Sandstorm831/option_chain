"use client";
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
  Grid,
  GridCellProps,
} from "react-virtualized";
import { tokenVal, useWorker, yesterPriceData } from "../context";
import Infobar from "@/components/infobar";
import OptionsTableHeader from "@/components/optionsTableHeader";
import OptionTableDataCell from "@/components/optionsTablsDataCells";
export type dataObject = {
  data: number[][];
  underlying: number;
};
const initialStrikeN = 18000;
const initialStrikeS = 68000;

function getIndexfromToken(token: string) {
  let index, subIndex, percInd, yesterIndex;
  const num = Number(token.slice(0, token.length - 1));
  const sym = token[token.length - 1];
  subIndex = sym === "C" ? 1 : 3;
  percInd = sym === "C" ? 0 : 4;
  yesterIndex = sym === "C" ? 0 : 1;
  if (num < 30000) {
    index = (num - initialStrikeN) / 100;
  } else {
    index = (num - initialStrikeS) / 100;
  }
  return [index, subIndex, percInd, yesterIndex];
}

function calculatePercentageChange(val: number, anchor: number) {
  return Number((((val - anchor) / anchor) * 100).toFixed(2));
}

function useUpdates(
  data: number[][],
  setData: Dispatch<SetStateAction<number[][]>> | null,
  setUnderlying: Dispatch<SetStateAction<number>> | null,
  updates: tokenVal[],
  subscribed: string,
) {
  useEffect(() => {
    const temp = data;
    for (let i = 0; i < updates.length; i++) {
      if (updates[i].token === subscribed) {
        if (setUnderlying) setUnderlying(updates[i].val);
      } else {
        if (temp.length < 75) break;
        const [index, priceIndex, changeIndex, yesterIndex] = getIndexfromToken(
          updates[i].token,
        );
        // console.log(temp.length, index, updates[i].token);
        temp[index][priceIndex] = updates[i].val;
        temp[index][changeIndex] = calculatePercentageChange(
          updates[i].val,
          subscribed === "N"
            ? yesterPriceData.yesterOptionPrice.N[index][yesterIndex]
            : yesterPriceData.yesterOptionPrice.S[index][yesterIndex],
        );
      }
    }
    if (setData) setData(temp);
  }, [updates]);
}

export default function Home() {
  const {
    data,
    setData,
    transport,
    connectionStatus,
    underlying,
    worker,
    updates,
    setUnderlying,
  } = useWorker();
  const [subscribed, setSubscribed] = useState("N");

  useUpdates(data, setData, setUnderlying, updates, subscribed);

  useEffect(() => {
    if (worker) {
      worker.port.postMessage(["optionchain", subscribed]);
    }

    return () => {
      if (worker) {
        worker.port.postMessage(["release", subscribed]);
      }
    };
  }, []);

  const cache = useRef(
    new CellMeasurerCache({
      fixedHeight: true,
      defaultWidth: 370,
    }),
  );
  function cellRenderer({
    columnIndex,
    key,
    rowIndex,
    style,
    parent,
  }: GridCellProps) {
    const stk = data[rowIndex];
    let text_colr;
    let bg_colr;
    if (columnIndex < 2) {
      if (stk[2] <= underlying) {
        bg_colr = "bg-[#f1eed9]";
      } else {
        bg_colr = "bg-white";
      }
    } else if (columnIndex > 2) {
      if (stk[2] >= underlying) {
        bg_colr = "bg-[#f1eed9]";
      } else {
        bg_colr = "bg-white";
      }
    } else {
      bg_colr = "bg-white";
    }
    if (columnIndex < 2) {
      if (stk[0] >= 0) {
        text_colr = "text-[#007a00]";
      } else {
        text_colr = "text-[#d02724]";
      }
    } else if (columnIndex > 2) {
      if (stk[4] >= 0) {
        text_colr = "text-[#007a00]";
      } else {
        text_colr = "text-[#d02724]";
      }
    } else {
      text_colr = "text-blue-800";
    }
    return (
      <CellMeasurer
        key={key}
        cache={cache.current}
        parent={parent}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
      >
        <div className="flex w-full" style={style}>
          <OptionTableDataCell
            text_colr={text_colr}
            bg_colr={bg_colr}
            cellData={data[rowIndex][columnIndex]}
          />
        </div>
      </CellMeasurer>
    );
  }

  return (
    <div className="flex flex-col justify-center h-screen w-screen p-5">
      <Infobar
        underlying={underlying}
        connectionStatus={connectionStatus}
        transport={transport}
      />
      <select className="flex justify-center text-xl bg-blue-800 mt-2 mb-1 text-white px-2 rounded-lg">
        <option
          onClick={() => {
            if (subscribed !== "N") {
              worker?.port.postMessage(["release", "S"]);
              worker?.port.postMessage(["optionchain", "N"]);
              if (setData) setData([]);
              setSubscribed("N");
            }
          }}
          value={"N"}
        >
          Nifty
        </option>
        <option
          onClick={() => {
            if (subscribed !== "S") {
              worker?.port.postMessage(["release", "N"]);
              worker?.port.postMessage(["optionchain", "S"]);
              if (setData) setData([]);
              setSubscribed("S");
            }
          }}
          value={"S"}
        >
          Sensex
        </option>
      </select>
      <div className="flex flex-col grow w-full mt-5 bg-gray-200 rounded-lg overflow-scroll">
        <OptionsTableHeader />
        <div className="flex flex-col grow overflow-scroll">
          {data && data.length ? (
            <AutoSizer>
              {({ width, height }) => (
                <Grid
                  width={width}
                  height={height}
                  rowHeight={30}
                  deferredMeasurementCache={cache.current}
                  rowCount={data.length}
                  columnCount={5}
                  columnWidth={width / 5}
                  cellRenderer={cellRenderer}
                />
              )}
            </AutoSizer>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/*
<div className="grid grid-cols-5 grid-rows-[repeat(75,30px)]">
</div>
*/

/*
data.map((stk, idx) => {
    return (
      <React.Fragment key={idx}>
        {stk && stk.length
          ? stk.map((val, tidx) => {
              let text_colr;
              let bg_colr;
              if (tidx < 2) {
                if (stk[2] <= underlying) {
                  bg_colr = "bg-[#f1eed9]";
                } else {
                  bg_colr = "bg-white";
                }
              } else if (tidx > 2) {
                if (stk[2] >= underlying) {
                  bg_colr = "bg-[#f1eed9]";
                } else {
                  bg_colr = "bg-white";
                }
              } else {
                bg_colr = "bg-white";
              }
              if (tidx < 2) {
                if (stk[0] >= 0) {
                  text_colr = "text-[#007a00]";
                } else {
                  text_colr = "text-[#d02724]";
                }
              } else if (tidx > 2) {
                if (stk[4] >= 0) {
                  text_colr = "text-[#007a00]";
                } else {
                  text_colr = "text-[#d02724]";
                }
              } else {
                text_colr = "text-blue-800";
              }
              return (
                <div key={tidx} className="flex w-full">
                  <div
                    className={`flex justify-center w-full text-md font-mono ${text_colr} ${bg_colr} border border-[#e3e3e3]`}
                  >
                    {val}
                  </div>
                </div>
              );
            })
          : null}
      </React.Fragment>
    );
  })
*/
