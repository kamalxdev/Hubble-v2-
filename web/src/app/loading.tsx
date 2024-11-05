import {
    ProgressCircleRing,
    ProgressCircleRoot,
  } from "@/components/ui/progress-circle";

export default function Loading() {
  return (
    <div className="bg-slate-900 text-white w-full h-screen flex flex-col gap-3 items-center justify-center text-2xl">
        <ProgressCircleRoot
                value={null}
                size="sm"
                className="w-full flex justify-center items-center"
              >
                <ProgressCircleRing cap="round" />
              </ProgressCircleRoot>
      Loading...
    </div>
  );
}
