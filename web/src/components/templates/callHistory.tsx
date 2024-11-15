import { memo } from "react";

function CallHistoryTemplate() {
  return (
    <section className="absolute inline-flex flex-col w-full py-2 transition-allS">
      <div className="flex justify-center font-semibold text-lg opacity-20 pt-10">
        No Calls found
      </div>
    </section>
  );
}

export default memo(CallHistoryTemplate);
