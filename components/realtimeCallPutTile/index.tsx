export default function RealtimeCallPutTile({
  callPut,
  obj,
  text_colr,
  subscribeByIdx,
  index,
  theSubscriber,
}: {
  callPut: string;
  obj: number[];
  text_colr: string;
  subscribeByIdx: (row: number, col: number) => void;
  index: number;
  theSubscriber: string;
}) {
  const price_ind = callPut === "C" ? 1 : 3;
  const change_ind = callPut === "C" ? 0 : 4;
  const sub_ind = callPut === "C" ? 0 : 1;
  return (
    <div className="w-full h-[50px] flex justify-between bg-white rounded-lg my-1 px-2 font-mono">
      <div className="h-full flex flex-col justify-center font-bold">
        <div className="flex justify-center">{`${obj[2].toString()}${callPut}`}</div>
      </div>
      <div className={`${text_colr} h-full flex flex-col justify-center`}>
        <div className="flex justify-center">{`${obj[price_ind]}`}</div>
        <div className="text-sm flex justify-center">{` ${obj[change_ind]} %`}</div>
      </div>
      <div
        className="px-2 w-[120px] h-full rounded-lg bg-blue-800 text-white flex flex-col justify-center hover:opacity-95 cursor-pointer font-bold"
        onClick={() => subscribeByIdx(index, sub_ind)}
      >
        <div className="w-full flex justify-center">
          {theSubscriber === "subscribed" ? "Unsubscribe" : "Subscribe"}
        </div>
      </div>
    </div>
  );
}
// subscribers[index][0] => theSubscriber
