export default function Infobar({
  underlying,
  connectionStatus,
  transport,
}: {
  underlying: number;
  connectionStatus: boolean;
  transport: string;
}) {
  return (
    <div className="w-full h-24 flex justify-center bg-blue-800 rounded-lg">
      <div className="flex flex-col h-full justify-center text-white xl:text-3xl max-xl:px-3 max-xl:text-md font-mono">
        Underlying : {underlying} | Connection Status :{" "}
        {connectionStatus ? "Live" : "Disconnected"} | Transport_Method :{" "}
        {transport}
      </div>
    </div>
  );
}
