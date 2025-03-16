export default function RealtimeConnectAndOptionBar({
  connectionStatus,
  worker,
}: {
  connectionStatus: boolean;
  worker: SharedWorker | null;
}) {
  return (
    <div className="w-full xl:h-16 max-xl:h-24 flex justify-between bg-gray-100 mt-2 px-3">
      <div className="w-[500px] bg-gray-100 flex justify-between">
        <div className="w-full xl:text-2xl max-xl:text-md h-full flex flex-col justify-center font-mono">
          Options
        </div>
      </div>
      <div
        className="w-max flex justify-between px-5 my-1 rounded-lg bg-white hover:cursor-pointer shadow-sm hover:shadow-md transition duration-100 font-mono"
        onClick={() => {
          if (connectionStatus && worker) {
            worker.port.postMessage("disconnect");
          } else if (worker) {
            worker.port.postMessage("reconnect");
          }
        }}
      >
        <div className="w-full xl:text-2xl max-xl:text-sm h-full flex flex-col justify-center">
          {connectionStatus ? "disconnect server" : "connect to server"}
        </div>
      </div>
    </div>
  );
}
