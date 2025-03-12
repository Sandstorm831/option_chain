import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-center h-screen w-screen">
      <div className="w-full flex justify-center">
        <Link href="/options-chain" className="bg-black rounded-lg p-3 text-white text-xl w-max hover:opacity-80 transition duration-100">Go to Options-Chain</Link>
      </div>
    </div>
  );
}
