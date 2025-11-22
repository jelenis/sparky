import type { JSX } from "react";
import React, { useState } from "react";
import { getWireSize, voltageDropFromK } from "../utils/voltageCalc";
import { useSearchParams } from "react-router-dom";
import Card from "../components/Card";

export default function VoltageDrop(): JSX.Element {
  const [searchParams, setParams] = useSearchParams();

  const ampStr = searchParams.get("amps") ?? "";
  const voltStr = searchParams.get("volts") ?? "";
  const lengthStr = searchParams.get("length") ?? "";
  const phaseStr = searchParams.get("phase") ?? "1";
  const wiringMethodStr = searchParams.get("wiring_method") ?? "raceway";
  const materialStr = searchParams.get("material") ?? "copper";

  let result: JSX.Element | null = null;


  const amps = ampStr.trim() ? Number(ampStr) : NaN;
  const volts = voltStr.trim() ? Number(voltStr) : NaN;
  const length = lengthStr.trim() ? Number(lengthStr) : NaN;
  const phase = phaseStr.trim() === "3" ? 3 : 1;
  const wiringMethod = wiringMethodStr === "cable" ? "cable" : "raceway";

  let voltageOutput: string = "";
  let wireSizeOutput: string = "";
  function isComputable(): boolean {
    return !isNaN(amps) && !isNaN(volts) && !isNaN(length);
  }
  const computable = isComputable();
  if (computable) {

    const res = getWireSize(5, volts, amps, length, phaseStr == "1" ? 1 : 3, wiringMethod, "copper");
    if (res) {
      const { size, kFactor } = res;
      console.log("wireSize", size);
      console.log("voltageDropFromK", voltageDropFromK(kFactor, amps, length, phase));
      voltageOutput = voltageDropFromK(kFactor, amps, length, phase).toFixed(2) + " V";
      wireSizeOutput = size;

      result = (<div>
        <p>Voltage Drop: {voltageOutput}</p>
        <p>Wire Size: {wireSizeOutput}</p>
      </div>
      );
    }
  }

  function updateSearchParams(param: string, value: string) {

    const params = new URLSearchParams(searchParams);
    params.set(param, value);

    setParams(params);
  }

  return (
    <main className="grid  lg:grid-cols-2 md:grid-cols-1 gap-4 p-8 shadow  lg:justify-items-center ">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Voltage Drop Calculator</h1>
        <div className="flex gap-10 justify-between flex-wrap">
          <div >
            <div className="pb-10">
              <label className="block mb-1 font-medium" htmlFor="current">Current (Amps):</label>
              <input className="w-full bg-[#343434] p-2 border rounded max-w-[25em]" autoComplete="off" name="current" value={ampStr} onChange={e => updateSearchParams("amps", e.target.value)} />
            </div>
            <div className="pb-10">
              <label className="block mb-1 font-medium" htmlFor="volts">Voltage (Volts):</label>
              <input className="w-full p-2 border rounded max-w-[25em]" autoComplete="off" name="volts" value={voltStr} onChange={e => updateSearchParams("volts", e.target.value)} />
            </div>
            <div className="pb-10">
              <label className="block mb-1 font-medium" htmlFor="length">Length (m):</label>
              <input className="w-full p-2 border rounded max-w-[25em]" name="length" autoComplete="off" value={lengthStr} onChange={e => updateSearchParams("length", e.target.value)} />
            </div>
          </div> 
          <div>
            <div className="pb-10"> 
              <label className="block mb-1 font-medium" htmlFor="phase">Phase:</label>
              <input className="w-full bg-[#343434] p-2 border rounded max-w-[25em]" autoComplete="off" name="phase" value={phaseStr} onChange={e => updateSearchParams("phase", e.target.value == "3" ? "3" : "1")} />
            </div>
            <div className="pb-10">
              <label className="block mb-1 font-medium" htmlFor="material">Material:</label>
              <input className="w-full p-2 border rounded max-w-[25em]" autoComplete="off" name="material" value={materialStr} onChange={e => updateSearchParams("material", e.target.value)} />
            </div>
                        <div className="pb-10">
              <label className="block mb-1 font-medium" htmlFor="wiring_method">Wiring Method:</label>
              <input className="w-full p-2 border rounded max-w-[25em]" autoComplete="off" name="wiring_method" value={wiringMethodStr} onChange={e => updateSearchParams("wiring_method", e.target.value)} />
            </div>
          </div>

        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold mb-4">Results</h2>
        {result}
      </Card>


    </main>
  )
}     