import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Card from "../components/Card";
import Results from "../components/Results";
import Map from "../components/Map.tsx";

export default function VoltageDrop(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [enabled, setEnabled] =  useState<boolean>(false);
  const ampStr = searchParams.get("amps") ?? "";
  const voltStr = searchParams.get("volts") ?? "";
  const lengthStr = searchParams.get("length") ?? "";
  const phaseStr = searchParams.get("phase") ?? "1";
  const wiringMethodStr = searchParams.get("wiring_method") ?? "raceway";
  const materialStr = searchParams.get("material") ?? "copper";
  const percentageDropStr = searchParams.get("percentage_drop") ?? "";



  // sanitize inputs, if invalid set to NaN
  const amps = ampStr.trim() ? Number(ampStr) : NaN;
  const volts = voltStr.trim() ? Number(voltStr) : NaN;
  const length = lengthStr.trim() ? Number(lengthStr) : NaN;
  const percentageDrop = percentageDropStr.trim() ? Number(percentageDropStr) : NaN;

  // set typed enums / values
  const phase = phaseStr.trim() === "3" ? 3 : 1;
  const wiringMethod = wiringMethodStr === "cable" ? "cable" : "raceway";
  const material = materialStr === "aluminum" ? "aluminum" : "copper";

  // set defaults if not present when the cmoponent mounts
  useEffect(() => {
    return; // disable auto defaults for now
    isNaN(volts) && updateSearchParams("volts", "120");
    isNaN(amps) && updateSearchParams("amps", "20");
    isNaN(length) && updateSearchParams("length", "100");
    isNaN(percentageDrop) && updateSearchParams("percentage_drop", "5");
  }, []);

  
  function updateSearchParams(param: string, value: string) {
  
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (value === "") 
          next.delete(param);
        else
          next.set(param, value);
        return next;
      });
  }


  return (
    <main className="grid xl:grid-cols-2 lg:grid-cols-1 gap-4 p-8 lg:justify-items-center max-w-[1500px] mx-auto">
      <Card className="">
        <div className="max-w-[600px] ">
          <h3 className="text-2xl font-bold mb-4 text-neutral-content ">Voltage Drop Calculator</h3>
          <div className="divider mb-10"></div>
          <div className="flex gap-10  flex-wrap justify-left">
            <div >
              <h4 className="pb-2">Supply Voltage</h4>
              <label className=" number input mb-1 font-medium w-full p-2 border rounded max-w-[25em]" >
                <input className="w-full" autoComplete="off" name="volts" value={voltStr}
                  placeholder="600"
                  onChange={e => updateSearchParams("volts", e.target.value)} />
                <span className="label">Volts</span>
              </label>
            </div>
            <div>

              <h4 className="pb-2">Load Current</h4>
              <label className=" number input mb-1 font-medium w-full p-2 border rounded max-w-[25em]" >
                <input className="w-full"autoComplete="off" name="current" value={ampStr}
                  placeholder="20"
                  onChange={e => updateSearchParams("amps", e.target.value)} />
                  <span className="label">Amps</span>
              </label>


            </div>
            <div>
              <h4 className="pb-2">Length</h4>
              <label className=" number input mb-1 font-medium w-full p-2 border rounded max-w-[25em]" >
                <input className="w-full" disabled={enabled} autoComplete="off" name="length" value={lengthStr}
                  placeholder="100"
                  onChange={e => {
                    setSearchParams(prev => {
                      const next = new URLSearchParams(prev);
                      next.delete("path");
                      next.set("length", e.target.value);
                      return next;
                    });
                  }} />
                <span className="label">Meters</span>
              </label>


            </div>

            <div >

              <h4 className="pb-2">Voltage Drop</h4>
              <label className=" number input mb-1 font-medium w-full p-2 border rounded max-w-[25em]" >
                <input className="w-full" autoComplete="off" name="percentage-drop"
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
                <option className="hover:bg-input" value="copper">Copper</option>
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
        onToggle={() => setEnabled(x => !x)} 
        enabled={enabled}
      />
      
      <Results 
        inputs={{
          amps,
          volts,
          length,
          percentageDrop,
          phase,
          wiringMethod,
          material
      }}
      />
    </main>
  )
}     