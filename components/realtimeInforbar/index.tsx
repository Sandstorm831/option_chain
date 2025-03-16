import { Dot } from "lucide-react";

export default function RealtimeInforbar({
  connectionStatus,
}: {
  connectionStatus: boolean;
}) {
  return (
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
  );
}
