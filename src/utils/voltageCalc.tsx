
import wireConstants ,{  correctionFactors } from "./wire.constants";


type phaseType = 1 | 3;
type voltageType = number
type percentage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

function generateK(
    voltageDrop: number,
    current: number,  
    length: number, 
    phase:  phaseType = 1,
    
    ): number {
    
    const f = phase === 1 ? 2 : 1.73;

    return (voltageDrop*1000)/(f*current*length);
}

export function getWireSize(
    percentDrop: percentage, 
    voltage: voltageType, 

    current: number, 
    length: number, 
    phase: phaseType = 1, 
    method: "cable" | "raceway" = "raceway",
    material: "copper" | "aluminum" = "copper",
): {size: string, kFactor: number} | null {

    const maxKFactor = generateK(voltage*percentDrop/100, current, length, phase)*correctionFactors["T90"];

    const kvalues  = Object.entries(wireConstants[material][method]);
    const sortedKValues = kvalues.sort((a,b) => b[1] - a[1]);
    console.log("sortedKValues", sortedKValues);
    const wiresize = sortedKValues.find(([_, k]) => k <= maxKFactor);
    console.log("kFactor", maxKFactor, wiresize);

    return wiresize ? {size: wiresize[0], kFactor: wiresize[1]} : null;

}

export function voltageDropFromK(kFactor: number, current: number, length: number, phase: phaseType = 1): number {
    const f = phase === 1 ? 2 : 1.732;
    return (kFactor*f*current*length)/(1000);
}