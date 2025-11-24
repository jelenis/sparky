import type { JSX } from "react";
import { useState } from "react";
import { getWireSize, voltageDropFromK } from "../utils/voltageCalc";
import { useSearchParams } from "react-router-dom";
import Card from "../components/Card";

import Map from "../components/Map.tsx";

export default function VoltageDrop(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [enabled, setEnabled] =  useState<boolean>(true);
  const ampStr = searchParams.get("amps") ?? "";
  const voltStr = searchParams.get("volts") ?? "";
  const lengthStr = searchParams.get("length") ?? "";
  const phaseStr = searchParams.get("phase") ?? "1";
  const wiringMethodStr = searchParams.get("wiring_method") ?? "raceway";
  const materialStr = searchParams.get("material") ?? "copper";
  const percentageDropStr = searchParams.get("percentage_drop") ?? "5";

  let result: JSX.Element | null = null;


  // sanitize inputs
  const amps = ampStr.trim() ? Number(ampStr) : NaN;
  const volts = voltStr.trim() ? Number(voltStr) : NaN;
  const length = lengthStr.trim() ? Number(lengthStr) : NaN;
  const phase = phaseStr.trim() === "3" ? 3 : 1;
  const wiringMethod = wiringMethodStr === "cable" ? "cable" : "raceway";
  const material = materialStr === "aluminum" ? "aluminum" : "copper";
  const percentageDrop = percentageDropStr.trim() ? Number(percentageDropStr) : NaN;

  let voltageOutput: number = 0;
  let wireSizeOutput: string = "";
  function isComputable(): boolean {
    return !isNaN(amps) && !isNaN(volts) && !isNaN(length) && length > 0 && percentageDrop > 0;
  }
  const computable = isComputable();

  // only render the result if all inputs are valid
  // TODO: improve user feedback for invalid inputs
  // and implment with zod schema
  if (computable) {

    const res = getWireSize(percentageDrop, volts, amps, length, phaseStr == "1" ? 1 : 3, wiringMethod, material);
    if (res) {
      const { size, kFactor } = res;
      console.log("wireSize", size);
      console.log("voltageDropFromK", voltageDropFromK(kFactor, amps, length, phase));
      voltageOutput = voltageDropFromK(kFactor, amps, length, phase);
      wireSizeOutput = size;

      result = (<div>
        <p>Voltage Drop: {`${voltageOutput.toFixed(2)} V ${(voltageOutput / volts * 100).toFixed(2)} %`}</p>
        <p>Wire Size: {wireSizeOutput}</p>
      </div>
      );
    }
  }

  function updateSearchParams(param: string, value: string) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set(param, value);
      return next;
    });
  }


  return (
    <main className="grid xl:grid-cols-2 lg:grid-cols-1 gap-4 p-8 shadow lg:justify-items-center max-w-[1500px] mx-auto">
    
      <Card className="">
        <div className="max-w-[650px] ">

          <h3 className="text-2xl font-bold mb-4 ">Voltage Drop Calculator</h3>
          <div className="divider mb-10"></div>
          <div className="flex gap-10  flex-wrap justify-left">
            <div >
              <h4 className="pb-2">Supply Voltage</h4>
              <label className=" number input mb-1 font-medium w-full p-2 border rounded max-w-[25em]" >
                <input className="" autoComplete="off" name="volts" value={voltStr}
                  placeholder="600"
                  onChange={e => updateSearchParams("volts", e.target.value)} />
                <span className="label">Volts</span>
              </label>
            </div>
            <div>

              <h4 className="pb-2">Load Current</h4>
              <label className=" number input mb-1 font-medium w-full p-2 border rounded max-w-[25em]" >
                <input className="" autoComplete="off" name="current" value={ampStr}
                  placeholder="20"
                  onChange={e => updateSearchParams("amps", e.target.value)} />
                  <span className="label">Amps</span>
              </label>


            </div>
            <div>
              <h4 className="pb-2">Length</h4>
              <label className=" number input mb-1 font-medium w-full p-2 border rounded max-w-[25em]" >
                <input disabled={enabled} autoComplete="off" name="length" value={lengthStr}
                  placeholder="100"
                  onChange={e => updateSearchParams("length", e.target.value)} />
                <span className="label">Meters</span>
              </label>


            </div>

            <div >

              <h4 className="pb-2">Voltage Drop</h4>
              <label className=" number input mb-1 font-medium w-full p-2 border rounded max-w-[25em]" >
                <input className="" autoComplete="off" name="percentage-drop"
                  placeholder="5"
                  value={percentageDropStr} onChange={e => updateSearchParams("percentage_drop", e.target.value)} />
               
                <span className="label">%</span>
              </label>


            </div>



            <div >
              <label className="block mb-1 font-medium" htmlFor="phase">Phase:</label>
              <select id="phase" defaultValue={phaseStr}
                className={"select  select-ghost focus:border-0 hover:border-0 bg-input min-w-[100px] "}
                onChange={(e) => updateSearchParams("phase", e.target.value)}>
                <option className="hover:bg-input" value="1">1</option>
                <option className="hover:bg-input" value="3">3</option>
              </select>
            </div>
            <div >
              <label className="block mb-1 font-medium" htmlFor="material">Material:</label>
              <select id="material" defaultValue={materialStr}
                className={"select  select-ghost focus:border-0 hover:border-0 bg-input min-w-[140px] "}
                onChange={(e) => updateSearchParams("material", e.target.value)}>
                <option className="hover:bg-input" value="raceway">Raceway</option>
                <option className="hover:bg-input" value="aluminum">Aluminum</option>
              </select>
            </div>
            <div >
              <label className="block mb-1 font-medium" htmlFor="wiring-method">Wiring Method:</label>
              <select id="wiring-method" defaultValue={wiringMethodStr}
                className={"select  select-ghost focus:border-0 hover:border-0 bg-input min-w-[140px] "}
                onChange={(e) => updateSearchParams("wiring_method", e.target.value)}>
                <option className="hover:bg-input" value="raceway">Raceway</option>
                <option className="hover:bg-input" value="cable">Cable</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
      <Map 
        onChange={(distance: number) => {
          updateSearchParams("length", distance.toFixed(2));
        }} 
        onToggle={() => setEnabled(x => !x)} 
        enabled={enabled}
      />
      <Card className="">
        <h3 className="text-xl font-bold mb-4">Results</h3>
        {result}
      </Card>


    </main>
  )
}     