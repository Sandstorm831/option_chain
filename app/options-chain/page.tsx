"use client";
import React, { useRef } from "react";
// import { socket } from "../socket";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Grid,
  GridCellProps,
} from "react-virtualized";
import { useWorker } from "../context";
export type dataObject = {
  data: number[][];
  underlying: number;
};

export default function Home() {
  const { data, transport, connectionStatus, underlying } = useWorker();

  const cache = useRef(
    new CellMeasurerCache({
      fixedHeight: true,
      defaultWidth: 370,
    }),
  );
  function cellRenderer({
    isScrolling,
    isVisible,
    columnIndex,
    key,
    rowIndex,
    style,
    parent,
  }: GridCellProps) {
    const stk = data[rowIndex];
    const idx = key;
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
          <div
            className={`flex justify-center w-full xl:text-md max-xl:text-sm font-mono ${text_colr} ${bg_colr} border border-[#e3e3e3]`}
          >
            <div className="flex flex-col justify-center">
              {data[rowIndex][columnIndex]}
            </div>
          </div>
        </div>
      </CellMeasurer>
    );
  }

  return (
    <div className="flex flex-col justify-center h-screen w-screen p-5">
      <div className="w-full h-24 flex justify-center bg-blue-800 rounded-lg">
        <div className="flex flex-col h-full justify-center text-white xl:text-3xl max-xl:px-3 font-mono">
          Underlying : {underlying} | Connection Status :{" "}
          {connectionStatus ? "Live" : "Disconnected"} | Transport_Method :{" "}
          {transport}
        </div>
      </div>
      <div className="flex flex-col grow w-full mt-5 bg-gray-200 rounded-lg overflow-scroll">
        <div className="w-full flex-none font-mono">
          <div className="flex">
            <div className="flex w-full bg-blue-800 xl:border-r-2 max-xl:border-r border-white text-white h-max">
              <div className="flex justify-center w-full xl:text-xl max-xl:text-sm">
                Calls
              </div>
            </div>
            <div className="flex w-full bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full xl:text-xl max-xl:text-sm">
                Puts
              </div>
            </div>
          </div>
          <div className="flex border-t-2 border-white">
            <div className="flex w-full xl:border-r-2 max-xl:border-r border-white bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full xl:text-xl max-xl:text-sm">
                Change
              </div>
            </div>
            <div className="flex w-full xl:border-r-2 max-xl:border-r border-white bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full xl:text-xl max-xl:text-sm">
                Price
              </div>
            </div>
            <div className="flex w-full xl:border-r-2 max-xl:border-r border-white bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full xl:text-xl max-xl:text-sm">
                Strike
              </div>
            </div>
            <div className="flex w-full xl:border-r-2 max-xl:border-r border-white bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full xl:text-xl max-xl:text-sm">
                Price
              </div>
            </div>
            <div className="flex w-full bg-blue-800 text-white h-max">
              <div className="flex justify-center w-full xl:text-xl max-xl:text-sm">
                Change
              </div>
            </div>
          </div>
        </div>
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
