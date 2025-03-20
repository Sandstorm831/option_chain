"use client";
import React, { useEffect, useRef } from "react";
// import { socket } from "../socket";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Grid,
  GridCellProps,
} from "react-virtualized";
import { useWorker } from "../context";
import Infobar from "@/components/infobar";
import OptionsTableHeader from "@/components/optionsTableHeader";
import OptionTableDataCell from "@/components/optionsTablsDataCells";
export type dataObject = {
  data: number[][];
  underlying: number;
};

export default function Home() {
  const { data, transport, connectionStatus, underlying, worker } = useWorker();

  useEffect(() => {
    if (worker) {
      worker.port.postMessage(["optionchain", "N"]);
    }

    return () => {
      if (worker) {
        worker.port.postMessage(["release", "N"]);
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
