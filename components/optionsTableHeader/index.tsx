import React from "react";

export default function OptionsTableHeader() {
  return (
    <div className="w-full flex-none font-mono">
      <div className="flex">
        <OtherCells>
          <InnerWorkd word="Calls" />
        </OtherCells>
        <LastCell>
          <InnerWorkd word="Puts" />
        </LastCell>
      </div>
      <div className="flex border-t-2 border-white">
        <OtherCells>
          <InnerWorkd word="Change" />
        </OtherCells>
        <OtherCells>
          <InnerWorkd word="Price" />
        </OtherCells>
        <OtherCells>
          <InnerWorkd word="Strike" />
        </OtherCells>
        <OtherCells>
          <InnerWorkd word="Price" />
        </OtherCells>
        <LastCell>
          <InnerWorkd word="Change" />
        </LastCell>
      </div>
    </div>
  );
}

function OtherCells({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full xl:border-r-2 max-xl:border-r border-white bg-blue-800 text-white h-max">
      {children}
    </div>
  );
}

function LastCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full bg-blue-800 text-white h-max">{children}</div>
  );
}

function InnerWorkd({ word }: { word: string }) {
  return (
    <div className="flex justify-center w-full xl:text-xl max-xl:text-sm">
      {word}
    </div>
  );
}
