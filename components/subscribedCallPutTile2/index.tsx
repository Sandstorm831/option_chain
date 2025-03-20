export default function SubscribedCallPutTile2({
  callPut,
  strike,
  dataIdx,
  text_colr,
  subscribeByIdx,
  idx,
}: {
  callPut: string;
  strike: number;
  dataIdx: number[];
  text_colr: string | undefined;
  subscribeByIdx: (row: number, col: number) => void;
  idx: number;
}) {
  const price_ind = callPut === "C" ? 1 : 3;
  const change_ind = callPut === "C" ? 0 : 4;
  const opt_type = callPut === "C" ? "Call" : "Put";
  const sub_ind = callPut === "C" ? 0 : 1;
  return (
    <div className="flex flex-col p-2 bg-gray-50 rounded-lg h-full justify-center mt-2 font-mono">
      <div className="flex justify-center font-bold text-xl">
        {`${strike}${callPut}`}
      </div>
      <div className="flex justify-center text-sm">
        {`Option Type : ${opt_type}`}
      </div>
      <div className="flex justify-center text-sm">
        {`Option Strike : ${strike}`}
      </div>
      <div className="flex justify-center text-sm whitespace-pre-wrap">
        <div>Option Price : </div>
        <div className={`text-sm ${text_colr}`}>
          {dataIdx ? dataIdx[0] : null}
        </div>
      </div>
      <div className="flex justify-center text-sm whitespace-pre-wrap">
        <div>Price Change : </div>
        <div className={`text-sm ${text_colr}`}>
          {dataIdx ? dataIdx[1] : null}%
        </div>
      </div>
      <div
        className="w-full flex justify-center text-white font-bold bg-blue-800 rounded-lg mt-2 cursor-pointer"
        onClick={() => subscribeByIdx(idx, sub_ind)}
      >
        Unsubscribe
      </div>
    </div>
  );
}

// data[idx] => dataIdx
