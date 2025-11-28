import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Card from "../components/Card";
import Results from "../components/Results";
import Map from "../components/Map.tsx";
import Input from "../components/Input.tsx";
import Select from "../components/Select.tsx";
import clsx from "clsx";

const DEFAULT_MAP_ENABLED = true;

export default function VoltageDrop(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapEnabled, setMapEnabled] = useState<boolean>(DEFAULT_MAP_ENABLED);
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
    <main className="grid xl:grid-cols-2  justify-items-center lg:grid-cols-1 gap-4 p-8 lg:justify-items-center max-w-[1500px] mx-auto">
      <Card className="">
        <div className="max-w-[600px] ">
          <h3 className="text-2xl font-bold mb-4 text-neutral-content ">Voltage Drop Calculator</h3>
          <div className="divider mb-10"></div>

          {/***********  Input parameters and selection boxes **********/}
            <div className="flex gap-10  flex-wrap justify-left">

            <Input
              heading="Supply Voltage"
              label="Volts"
              name="volts"
              value={voltStr}
              placeholder="600"
              hint="Voltage must be greater than 0"
              onChange={e => updateSearchParams("volts", e.target.value)} />

            <Input
              heading="Load Current"
              label="Amps"
              name="current"
              value={ampStr}
              placeholder="20"
              hint="Current must be greater than 0"
              onChange={e => updateSearchParams("amps", e.target.value)} />

            <Input
              heading="Length"
              label="Meters"
              name="length"
              value={lengthStr}
              disabled={mapEnabled}
              placeholder="100"
              hint={!mapEnabled ? "Length must be greater than 0" : ""}
              onChange={e => {
              setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                next.delete("path");
                next.set("length", e.target.value);
                return next;
              });
              }} />

            <Input
              heading="Voltage Drop"
              label="%"
              name="percentage-drop"
              value={percentageDropStr}
              placeholder="5"
              hint="Percentage must be greater than 0"
              onChange={e => updateSearchParams("percentage_drop", e.target.value)} />

            <Select
              heading="Phase"
              name="phase"
              value={phaseStr}
              options={[
              { value: "1", label: "1" },
              { value: "3", label: "3" }
              ]}
              onChange={(e) => updateSearchParams("phase", e.target.value)}
              className="min-w-[120px]"
            />
            
            <Select
              heading="Material"
              name="material"
              value={materialStr}
              options={[
              { value: "copper", label: "Copper" },
              { value: "aluminum", label: "Aluminum" }
              ]}
              onChange={(e) => updateSearchParams("material", e.target.value)}
              className="min-w-[140px]"
            />
            
            <Select
              heading="Wiring Method"
              name="wiring-method"
              value={wiringMethodStr}
              options={[
              { value: "raceway", label: "Raceway" },
              { value: "cable", label: "Cable" }
              ]}
              onChange={(e) => updateSearchParams("wiring_method", e.target.value)}
              className="min-w-[140px]"
            />
            </div>
        </div>
      </Card>
      <Map
        onToggle={() => setMapEnabled(x => !x)}
        enabled={mapEnabled}
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