export default function OptionTableDataCell({
  text_colr,
  bg_colr,
  cellData,
}: {
  text_colr: string;
  bg_colr: string;
  cellData: number;
}) {
  return (
    <div
      className={`flex justify-center w-full xl:text-md max-xl:text-sm font-mono ${text_colr} ${bg_colr} border border-[#e3e3e3]`}
    >
      <div className="flex flex-col justify-center">{cellData}</div>
    </div>
  );
}
