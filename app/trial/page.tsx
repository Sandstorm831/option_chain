"use client";
import { useState } from "react";
import { useWorker } from "../context";

export default function Page() {
  const { worker } = useWorker();
  const [inp, setInp] = useState("");
  return (
    <div>
      <input
        type="text"
        value={inp}
        onChange={(e) => setInp(e.target.value)}
        placeholder="enter something"
      />
      <button
        className="bg-black text-white text-xl hover:opacity-95"
        onClick={() => {
          worker?.port.postMessage(["tokens", inp]);
        }}
      >
        send
      </button>
    </div>
  );
}
