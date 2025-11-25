import Card from "./Card";
import { getWireSize, voltageDropFromK } from "../utils/voltageCalc";

interface ComputeProps {
  amps: number;
  volts: number;
  length: number;
  percentageDrop: number;
  phase: 1 | 3;
  wiringMethod: "raceway" | "cable";
  material: "copper" | "aluminum";
}

export default function Results({ inputs }: { inputs: ComputeProps }) {
  const { amps, volts, length, percentageDrop, phase, wiringMethod, material } = inputs;

  function isComputable(): boolean {
    return [amps, volts, length, percentageDrop].every(isValidPositiveNumber);
  }

  function isValidPositiveNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && value > 0;
  }

  const computable = isComputable();

  let voltageOutput: number = 0;
  let wireSizeOutput: string = "";
  let calculationResult: "success" | "no-data" | "invalid-inputs" = "invalid-inputs";

  if (computable) {
    const res = getWireSize(percentageDrop, volts, amps, length, phase, wiringMethod, material);
    if (res) {
      const { size, kFactor } = res;
      voltageOutput = voltageDropFromK(kFactor, amps, length, phase);
      wireSizeOutput = size;
      calculationResult = "success";
    } else {
      calculationResult = "no-data";
    }
  }

  const displayContent = () => {
    if (calculationResult === "success") {
      return (
        <div className="flex justify-center ">
          <div className="stats mr-4">
            <div className="stat place-items-center">
              <div className="stat-title">Wire Size</div>
              <div className="stat-value">{wireSizeOutput}</div>
              <div className="stat-desc">&nbsp;</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">Voltage Drop</div>
              <div className="stat-value">{`${voltageOutput.toFixed(2)} V`}</div>
              <div className="stat-desc">{`${(voltageOutput / volts * 100).toFixed(2)} %`}</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">Voltage at Load</div>
              <div className="stat-value text-success">{`${(volts - voltageOutput).toFixed(2)} V`}</div>
              <div className="stat-desc">&nbsp;</div>
            </div>
          </div>
        </div>
      );
    }
    
    if (calculationResult === "no-data") {
      return (
        <div className="self-start">
          <h3 className="text-error mb-4">Voltage drop too large</h3>
          <p className="text-sm">No suitable wire exists.</p>
        </div>
      );
    }
    
    // invalid inputs
    return null
  };

  return (
    <Card className="col-span-full results-card xl:max-w-none ">
      <h3 className="text-2xl font-bold text-center">Results</h3>
      <div className="divider mb-8"></div>
      {displayContent()}
    </Card>
  );
}