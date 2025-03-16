"use client";
import Link from "next/link";

export default function Home() {
  return (
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
  );
}
