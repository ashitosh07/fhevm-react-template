import { FHECounterDemo } from "./_components/FHECounterDemo";
import { FHECounterUniversalDemo } from "./_components/FHECounterUniversalDemo";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center sm:items-start w-full px-3 md:px-0">
      {/* New Universal SDK Demo */}
      <FHECounterUniversalDemo />
      
      {/* Original Demo for Comparison */}
      <div className="divider">Legacy Implementation (for comparison)</div>
      <FHECounterDemo />
    </div>
  );
}
