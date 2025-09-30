"use client"

import { useState, memo, useCallback, useEffect, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSnf, componentProps } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Blend, Milk, SlidersHorizontal, Combine, Bot, Calculator, Settings, ChevronsUp, Target, Droplets, Info, Weight, Thermometer, ShieldAlert } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type CalculatorType = 'fat-snf-clr-ts' | 'fat-blending' | 'fat-snf-adjustment' | 'reconstituted-milk' | 'recombined-milk' | 'clr-blending' | 'custom-calculator' | 'milk-blending' | 'clr-increase' | 'fat-clr-maintainer' | 'two-milk-blending-target' | 'clr-correction' | 'kg-fat-snf' | 'fat-reduction-clr-maintain' | 'two-component-standardization';

const calculatorsInfo = {
    'fat-snf-clr-ts': { title: "Fat, SNF, CLR & TS", icon: Calculator, component: FatSnfClrTsCalc },
    'milk-blending': { title: "Milk Blending", icon: Blend, component: MilkBlendingCalc },
    'two-milk-blending-target': { title: "Two-Milk Blending (to Target)", icon: Target, component: TwoMilkBlendingToTargetCalc },
    'fat-reduction-clr-maintain': { title: "Fat & CLR Corrector", icon: ShieldAlert, component: FatReductionClrMaintainCalc },
    'two-component-standardization': { title: "Automated Standardization", icon: Combine, component: TwoComponentStandardizationCalc },
    'custom-calculator': { title: 'Custom Calculator', icon: Settings, component: CustomStandardizationCalc },
    'clr-increase': { title: 'CLR Increase (by SMP)', icon: ChevronsUp, component: ClrIncreaseCalc },
    'fat-clr-maintainer': { title: 'Fat & CLR Maintainer', icon: Target, component: FatClrMaintainerCalc },
    'fat-blending': { title: "Fat Blending (Pearson)", icon: Blend, component: FatBlendingCalc },
    'fat-snf-adjustment': { title: "Fat & SNF Adjustment", icon: SlidersHorizontal, component: FatSnfAdjustmentCalc },
    'reconstituted-milk': { title: "Reconstituted Milk", icon: Milk, component: ReconstitutedMilkCalc },
    'recombined-milk': { title: "Recombined Milk", icon: Combine, component: RecombinedMilkCalc },
    'clr-blending': { title: "CLR Blending (Pearson)", icon: Bot, component: ClrBlendingCalc },
    'clr-correction': { title: "CLR Correction", icon: Thermometer, component: ClrCorrectionCalc },
    'kg-fat-snf': { title: "Kg Fat & SNF", icon: Weight, component: KgFatSnfCalc },
};

export function StandardizationIIModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void; }) {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType | null>(null);

  const handleBack = useCallback(() => setActiveCalculator(null), []);

  const ActiveCalculatorComponent = activeCalculator ? calculatorsInfo[activeCalculator].component : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            setIsOpen(false);
            setActiveCalculator(null);
        } else {
            setIsOpen(true);
        }
    }}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 sm:p-6">
        {activeCalculator && ActiveCalculatorComponent ? (
          <>
            <DialogHeader className="flex-row items-center space-x-4 pr-6 shrink-0 p-4 sm:p-0">
              <Button variant="ghost" size="icon" onClick={handleBack} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <DialogTitle className="text-xl font-bold font-headline">{calculatorsInfo[activeCalculator].title}</DialogTitle>
                <DialogDescription>Calculate specific dairy parameters.</DialogDescription>
              </div>
            </DialogHeader>
            <ScrollArea className="h-full mt-4 pr-4">
              <div className="p-4 sm:p-0">
                <ActiveCalculatorComponent />
              </div>
            </ScrollArea>
          </>
        ) : (
          <>
            <DialogHeader className="p-4 sm:p-0">
              <DialogTitle className="text-3xl font-bold text-center font-headline">Advanced Standardization</DialogTitle>
              <DialogDescription className="text-center">Advanced calculators for precise dairy processing.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 mt-4 pr-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {Object.entries(calculatorsInfo).map(([key, { title, icon: Icon }]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCalculator(key as CalculatorType)}
                    className="flex flex-col items-center justify-center p-6 bg-card hover:bg-primary/10 rounded-xl shadow-sm border text-center aspect-square transition-all duration-200"
                  >
                    <Icon className="w-12 h-12 text-primary mb-3" />
                    <span className="font-semibold font-headline text-card-foreground">{title}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}


const CalculatorCard = ({ title, children, description }: { title: string; children: React.ReactNode; description?: string }) => (
    <div className="bg-card p-4 rounded-xl shadow-sm border mt-4">
        <h3 className="text-xl font-bold text-primary mb-2 font-headline">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        {children}
    </div>
);

const MemoizedInputField = memo(function InputField({ label, value, name, setter, unit, placeholder, inputClassName, type = "number", step = "any" }: { label: string, value: string, name: string, setter: (name: string, value: string) => void, unit?: string, placeholder?: string, inputClassName?: string, type?: string, step?: string }) {
    const [internalValue, setInternalValue] = useState(value);

    // Update internal state when props change, but not if the element has focus
    useEffect(() => {
      if (value !== internalValue && document.activeElement?.getAttribute('name') !== name) {
          setInternalValue(value);
      }
    }, [value, name, internalValue]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInternalValue(e.target.value);
        setter(e.target.name, e.target.value); // Update parent state on change
    };
    
    return (
        <div>
            <Label htmlFor={name}>{label}</Label>
            <div className="flex items-center">
                <Input 
                    type={type} 
                    name={name} 
                    id={name} 
                    value={internalValue} 
                    onChange={handleChange}
                    className={cn(unit ? "rounded-r-none" : "", inputClassName || '')}
                    placeholder={placeholder} 
                    step={step}
                />
                {unit && <span className="p-2 bg-muted border border-l-0 rounded-r-md text-sm">{unit}</span>}
            </div>
        </div>
    );
});

const snfFormulas: Record<string, { name: string; formulaText: string; calc: (clr: number, fat: number, c?: number) => number; inverse: (snf: number, fat: number, c?: number) => number }> = {
    'isi': { name: 'ISI / BIS (Official)', formulaText: 'SNF % = (CLR/4) + (0.25 * Fat) + 0.44', calc: (clr, fat) => (clr / 4) + (0.25 * fat) + 0.44, inverse: (snf, fat) => (snf - (0.25 * fat) - 0.44) * 4 },
    'richmond': { name: 'Richmond’s Formula', formulaText: 'SNF % = (CLR/4) + (0.21 * Fat) + 0.36', calc: (clr, fat) => (clr / 4) + (0.21 * fat) + 0.36, inverse: (snf, fat) => (snf - (0.21 * fat) - 0.36) * 4 },
    'costume_formula': { name: 'costume Formula', formulaText: 'SNF % = (CLR/4) + (0.21 * Fat) + 0.29', calc: (clr, fat) => (clr / 4) + (0.21 * fat) + 0.29, inverse: (snf, fat) => (snf - (0.21 * fat) - 0.29) * 4 },
    'cooperative1': { name: 'Modified ISI 1st / Cooperative', formulaText: 'SNF % = (CLR/4) + (0.25 * Fat) + 0.14', calc: (clr, fat) => (clr / 4) + (0.25 * fat) + 0.14, inverse: (snf, fat) => (snf - (0.25 * fat) - 0.14) * 4 },
    'cooperative': { name: 'Modified ISI 2nd/ Cooperative', formulaText: 'SNF % = (CLR/4) + (0.21 * Fat) + 0.14', calc: (clr, fat) => (clr / 4) + (0.25 * fat) + 0.14, inverse: (snf, fat) => (snf - (0.25 * fat) - 0.14) * 4 },
    'dairy_union': { name: 'Simplified Dairy Union', formulaText: 'SNF % = (CLR/4) + (Fat/5) + 0.44', calc: (clr, fat) => (clr / 4) + (fat / 5) + 0.44, inverse: (snf, fat) => (snf - (fat/5) - 0.44) * 4 },
    'punjab_haryana': { name: 'Punjab / Haryana Variation', formulaText: 'SNF % = (CLR/4) + (0.22 * Fat) + 0.36', calc: (clr, fat) => (clr / 4) + (0.22 * fat) + 0.36, inverse: (snf, fat) => (snf - (0.22 * fat) - 0.36) * 4 },
    'andhra': { name: 'Andhra Pradesh Practice', formulaText: 'SNF % = (CLR/4) + (0.21 * Fat) + 0.35', calc: (clr, fat) => (clr / 4) + (0.21 * fat) + 0.35, inverse: (snf, fat) => (snf - (0.21 * fat) - 0.35) * 4 },
    'karnataka_tamil': { name: 'Karnataka / Tamil Nadu Practice', formulaText: 'SNF % = (CLR/4) + (0.25 * Fat) + 0.20', calc: (clr, fat) => (clr / 4) + (0.25 * fat) + 0.20, inverse: (snf, fat) => (snf - (0.25 * fat) - 0.20) * 4 },
    'general': { name: 'General Shortcut (Variable C)', formulaText: 'SNF % = (CLR/4) + (0.25 * Fat) + C', calc: (clr, fat, c = 0.72) => (clr / 4) + (0.25 * fat) + c, inverse: (snf, fat, c = 0.72) => (snf - (0.25 * fat) - c) * 4 },
};

function FatSnfClrTsCalc() {
    const [inputs, setInputs] = useState({
        fat: '4.5',
        clr: '28.0',
        snf: '8.94',
    });
    const [result, setResult] = useState<{ snf: string, clr: string, ts: string } | null>(null);
    const [formula, setFormula] = useState('isi');
    const [basis, setBasis] = useState<'fat_clr' | 'fat_snf'>('fat_clr');

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({ ...prev, [name]: value }));
    }, []);

    const calculate = useCallback(() => {
        const fat = parseFloat(inputs.fat);
        const clr = parseFloat(inputs.clr);
        const snf = parseFloat(inputs.snf);
        
        let newSnf = NaN, newTs = NaN, newClr = NaN;
        
        const selectedFormula = snfFormulas[formula] || snfFormulas['isi'];

        if (basis === 'fat_clr') {
            if (!isNaN(fat) && !isNaN(clr)) {
                newSnf = selectedFormula.calc(clr, fat);
                newTs = newSnf + fat;
                newClr = clr;
            }
        } else if (basis === 'fat_snf') {
            if (!isNaN(fat) && !isNaN(snf)) {
                newClr = selectedFormula.inverse(snf, fat);
                newTs = snf + fat;
                newSnf = snf;
            }
        }

        setResult({
            snf: !isNaN(newSnf) ? newSnf.toFixed(2) : '...',
            ts: !isNaN(newTs) ? newTs.toFixed(2) : '...',
            clr: !isNaN(newClr) ? newClr.toFixed(2) : '...'
        });

    }, [inputs, basis, formula]);
    
    return (
        <CalculatorCard title="Fat, SNF, CLR & TS Calculator" description="Enter any two values to calculate the others. You can also select different industry-standard formulas for SNF calculation.">
            <div className="mb-4 space-y-4">
                <div>
                    <Label>Select SNF Formula</Label>
                    <Select value={formula} onValueChange={setFormula}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {Object.entries(snfFormulas).map(([key, {name, formulaText}]) => (
                                <SelectItem key={key} value={key}>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{name}</span>
                                        <span className="text-xs text-muted-foreground">{formulaText}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <Label>Calculate based on:</Label>
                    <Select value={basis} onValueChange={(val: 'fat_clr' | 'fat_snf') => setBasis(val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fat_clr">FAT and CLR</SelectItem>
                            <SelectItem value="fat_snf">FAT and SNF</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <MemoizedInputField label="Fat %" value={inputs.fat} name="fat" setter={handleInputChange} />
                {basis === 'fat_clr' ? (
                    <MemoizedInputField label="CLR" value={inputs.clr} name="clr" setter={handleInputChange} />
                ) : (
                    <MemoizedInputField label="SNF %" value={inputs.snf} name="snf" setter={handleInputChange} />
                )}
            </div>
            <Button onClick={calculate} className="w-full mt-6">Calculate</Button>
             {result && <Alert className="mt-6 bg-primary/10">
                <AlertTitle className="text-center font-bold text-lg">Calculated Values</AlertTitle>
                <AlertDescription>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Calculated CLR</p>
                            <p className="text-2xl font-bold">{result.clr}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Calculated SNF %</p>
                            <p className="text-2xl font-bold">{result.snf}</p>
                        </div>
                         <div>
                            <p className="text-sm text-muted-foreground">Calculated TS %</p>
                            <p className="text-2xl font-bold">{result.ts}</p>
                        </div>
                    </div>
                </AlertDescription>
            </Alert>}
        </CalculatorCard>
    );
}

function CustomStandardizationCalc() {
    const [scenario, setScenario] = useState<'increase' | 'decrease'>('increase');
    const [fatSource, setFatSource] = useState<'cream' | 'rich_milk'>('cream');
    const [leanSource, setLeanSource] = useState<'skim' | 'water'>('skim');

    const [inputs, setInputs] = useState({
        milkQty: '1000', milkFat: '3.5', milkClr: '28.0',
        creamFat: '40', creamSnf: '5.4',
        richMilkFat: '6.0', richMilkClr: '29.0',
        smpFat: '1.0', smpSnf: '96.0',
        skimFat: '0.05', skimSnf: '8.8',
        reqFat: '4.5', reqClr: '28.5',
        formula: "isi",
        customC: "0.72"
    });

    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({ ...prev, [name]: value }));
    }, []);

    const calculateSnf = useCallback((clr: number, fat: number) => {
        const formulaKey = inputs.formula as keyof typeof snfFormulas;
        if (formulaKey === 'general') {
            return snfFormulas.general.calc(clr, fat, parseFloat(inputs.customC));
        }
        return snfFormulas[formulaKey].calc(clr, fat);
    }, [inputs.formula, inputs.customC]);
    
    const milkSnf = useMemo(() => {
        const fat = parseFloat(inputs.milkFat);
        const clr = parseFloat(inputs.milkClr);
        return !isNaN(fat) && !isNaN(clr) ? calculateSnf(clr, fat) : 0;
    }, [inputs.milkFat, inputs.milkClr, calculateSnf]);
    
    const reqSnf = useMemo(() => {
        const fat = parseFloat(inputs.reqFat);
        const clr = parseFloat(inputs.reqClr);
        return !isNaN(fat) && !isNaN(clr) ? calculateSnf(clr, fat) : 0;
    }, [inputs.reqFat, inputs.reqClr, calculateSnf]);


    const calculate = useCallback(() => {
        setResult(null);
        setError(null);
        
        const i = {
            M: parseFloat(inputs.milkQty) || 0,
            Fm: parseFloat(inputs.milkFat) / 100, Sm: milkSnf / 100,
            Fr: parseFloat(inputs.reqFat) / 100, Sr: reqSnf / 100,
        };

        if (Object.values(i).some(v => isNaN(v)) || i.M <= 0) {
            setError("Please fill all initial milk and target fields with valid numbers.");
            return;
        }

        let ingredientX: {F: number, S: number, name: string};
        let ingredientY: {F: number, S: number, name: string};

        if (scenario === 'increase') {
            ingredientX = fatSource === 'cream' 
                ? { F: parseFloat(inputs.creamFat)/100, S: parseFloat(inputs.creamSnf)/100, name: "Cream" }
                : { F: parseFloat(inputs.richMilkFat)/100, S: calculateSnf(parseFloat(inputs.richMilkClr), parseFloat(inputs.richMilkFat))/100, name: "Rich Milk" };
            ingredientY = { F: parseFloat(inputs.smpFat)/100, S: (parseFloat(inputs.smpSnf)/100), name: "SMP" };
        } else { // decrease
             setError("Decrease scenario calculation not yet implemented in this fix.");
             return;
        }
        
        const A1 = ingredientX.F - i.Fr;
        const B1 = ingredientY.F - i.Fr;
        const C1 = i.M * (i.Fr - i.Fm);

        const A2 = ingredientX.S - i.Sr;
        const B2 = ingredientY.S - i.Sr;
        const C2 = i.M * (i.Sr - i.Sm);

        const det = A1 * B2 - B1 * A2;

        if (Math.abs(det) < 1e-9) {
            setError("Cannot solve with current inputs. Ingredients properties may be too similar or unable to meet the target.");
            return;
        }

        let X = (C1 * B2 - C2 * B1) / det;
        let Y = (C2 * A1 - C1 * A2) / det;

        if (X < -1e-9 || Y < -1e-9) { // Allow for small floating point inaccuracies
            setError("Calculation resulted in negative values. This scenario is not possible with the selected ingredients (e.g., target might be lower than initial values when trying to increase, or vice-versa).");
            return;
        }
        X = Math.max(0, X);
        Y = Math.max(0, Y);
        
        const finalQty = i.M + X + Y;
        const finalFatMass = (i.M * i.Fm) + (X * ingredientX.F) + (Y * ingredientY.F);
        const finalSnfMass = (i.M * i.Sm) + (X * ingredientX.S) + (Y * ingredientY.S);
        const finalFatPercent = (finalFatMass / finalQty) * 100;
        const finalSnfPercent = (finalSnfMass / finalQty) * 100;
        
        let resultText = `<p>To standardize your milk, you need to add:</p><ul class='list-disc list-inside mt-2 text-lg'>`;
        resultText += `<li><strong>${ingredientX.name}:</strong> ${X.toFixed(3)} kg</li>`;
        resultText += `<li><strong>${ingredientY.name}:</strong> ${Y.toFixed(3)} kg</li>`;
        resultText += "</ul>";
        
        resultText += "<hr class='my-4' />";
        resultText += "<h4 class='font-bold text-md'>Final Batch Summary:</h4><ul class='list-disc list-inside mt-2 text-lg'>";
        resultText += `<li><strong>Final Milk Quantity:</strong> ${finalQty.toFixed(3)} kg</li>`;
        resultText += `<li><strong>Final Fat % Achieved:</strong> ${finalFatPercent.toFixed(2)}% (Target: ${inputs.reqFat}%)</li>`;
        resultText += `<li><strong>Final SNF % Achieved:</strong> ${finalSnfPercent.toFixed(2)}% (Target: ${reqSnf.toFixed(2)}%)</li>`;
        resultText += "</ul>";
    
        setResult(resultText);

    }, [inputs, milkSnf, reqSnf, calculateSnf, scenario, fatSource, leanSource]);

    return (
        <>
            <CalculatorCard title="Multi-Purpose Milk Standardization Calculator" description="A precise tool to adjust Fat and SNF. Choose a scenario and your available ingredients.">
                <div className="bg-muted/50 p-4 rounded-lg mb-6">
                     <Label>Select SNF Calculation Formula</Label>
                     <Select value={inputs.formula} onValueChange={(val) => handleInputChange('formula', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {Object.entries(snfFormulas).map(([key, {name, formulaText}]) => (
                                <SelectItem key={key} value={key}>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{name}</span>
                                        <span className="text-xs text-muted-foreground">{formulaText}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                     </Select>
                     {inputs.formula === 'general' && (
                         <div className="mt-2">
                            <MemoizedInputField label="Custom Constant (C)" value={inputs.customC} name="customC" setter={handleInputChange} />
                         </div>
                     )}
                </div>
                
                <Tabs value={scenario} onValueChange={(val) => setScenario(val as 'increase' | 'decrease')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="increase">Increase Fat &amp; SNF</TabsTrigger>
                        <TabsTrigger value="decrease">Decrease Fat &amp; SNF</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Initial Milk */}
                    <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-gray-800 font-headline text-lg border-b pb-2">1. Your Milk</h3>
                        <MemoizedInputField label="Milk Quantity (kg)" value={inputs.milkQty} name="milkQty" setter={handleInputChange} />
                        <MemoizedInputField label="Fat in Milk (%)" value={inputs.milkFat} name="milkFat" setter={handleInputChange} />
                        <MemoizedInputField label="CLR in Milk" value={inputs.milkClr} name="milkClr" setter={handleInputChange} />
                        <div className="text-sm p-2 bg-blue-100 rounded">Calculated SNF: <strong className="font-bold">{milkSnf.toFixed(2)}%</strong></div>
                    </div>

                    {/* Target Milk */}
                     <div className="space-y-4 bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-gray-800 font-headline text-lg border-b pb-2">2. Your Target</h3>
                        <MemoizedInputField label="Required Fat (%)" value={inputs.reqFat} name="reqFat" setter={handleInputChange} />
                        <MemoizedInputField label="Required CLR" value={inputs.reqClr} name="reqClr" setter={handleInputChange} />
                         <div className="text-sm p-2 bg-green-100 rounded">Calculated Target SNF: <strong className="font-bold">{reqSnf.toFixed(2)}%</strong></div>
                    </div>
                </div>

                <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                     <h3 className="font-semibold text-gray-800 font-headline text-lg border-b pb-2 mb-4">3. Available Ingredients</h3>
                     {scenario === 'increase' ? (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                             <div>
                                <Label>Fat Source</Label>
                                <Select value={fatSource} onValueChange={(val) => setFatSource(val as 'cream' | 'rich_milk')}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cream">Cream</SelectItem>
                                        <SelectItem value="rich_milk">Rich Milk</SelectItem>
                                    </SelectContent>
                                </Select>
                             </div>
                             {fatSource === 'cream' ? (
                                 <>
                                    <MemoizedInputField label="Cream Fat (%)" value={inputs.creamFat} name="creamFat" setter={handleInputChange} />
                                    <MemoizedInputField label="Cream SNF (%)" value={inputs.creamSnf} name="creamSnf" setter={handleInputChange} />
                                 </>
                             ) : (
                                 <>
                                    <MemoizedInputField label="Rich Milk Fat (%)" value={inputs.richMilkFat} name="richMilkFat" setter={handleInputChange} />
                                    <MemoizedInputField label="Rich Milk CLR" value={inputs.richMilkClr} name="richMilkClr" setter={handleInputChange} />
                                 </>
                             )}
                             <div className="md:col-span-3"><hr className="my-2"/></div>
                             <MemoizedInputField label="SMP Fat (%)" value={inputs.smpFat} name="smpFat" setter={handleInputChange} />
                             <MemoizedInputField label="SMP SNF (%)" value={inputs.smpSnf} name="smpSnf" setter={handleInputChange} />
                         </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MemoizedInputField label="Skim Milk Fat (%)" value={inputs.skimFat} name="skimFat" setter={handleInputChange} />
                            <MemoizedInputField label="Skim Milk SNF (%)" value={inputs.skimSnf} name="skimSnf" setter={handleInputChange} />
                        </div>
                     )}
                </div>

                <Button onClick={calculate} className="w-full mt-6 text-lg py-6">➡️ Calculate Standardization</Button>
                {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
                {result && <Alert className="mt-4"><AlertTitle className="text-xl font-bold mb-4">📊 Results</AlertTitle><AlertDescription dangerouslySetInnerHTML={{__html: result}} /></Alert>}
            </CalculatorCard>
        </>
    );
}

const MemoizedMilkInputGroup = memo(function MilkInputGroup({
    milkNum,
    onInputChange,
    initialValues,
}: {
    milkNum: 1 | 2;
    onInputChange: (milkNum: 1 | 2, field: string, value: string) => void;
    initialValues: { qty: string; fat: string; clr: string };
}) {

    return (
        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-gray-700 font-headline">Milk Source {milkNum}</h3>
            <MemoizedInputField label="Quantity (kg/L)" value={initialValues.qty} name="qty" setter={(name, val) => onInputChange(milkNum, name, val)} />
            <MemoizedInputField label="Fat %" value={initialValues.fat} name="fat" setter={(name, val) => onInputChange(milkNum, name, val)} />
            <MemoizedInputField label="CLR" value={initialValues.clr} name="clr" setter={(name, val) => onInputChange(milkNum, name, val)} />
        </div>
    );
});

function MilkBlendingCalc() {
    const [milk1, setMilk1] = useState({ qty: '500', fat: '6.5', clr: '29' });
    const [milk2, setMilk2] = useState({ qty: '500', fat: '2.5', clr: '27' });

    const [result, setResult] = useState<{ finalQty: number; finalFat: number; finalClr: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((milkNum: 1 | 2, field: string, value: string) => {
        const setter = milkNum === 1 ? setMilk1 : setMilk2;
        setter(prev => ({ ...prev, [field]: value }));
    }, []);

    const calculate = useCallback(() => {
        setResult(null);
        setError(null);
        
        const q1 = parseFloat(milk1.qty);
        const f1 = parseFloat(milk1.fat);
        const c1 = parseFloat(milk1.clr);
        const q2 = parseFloat(milk2.qty);
        const f2 = parseFloat(milk2.fat);
        const c2 = parseFloat(milk2.clr);

        if ([q1, f1, c1, q2, f2, c2].some(isNaN)) {
            setError("Please fill all fields with valid numbers.");
            return;
        }

        if (q1 <= 0 || q2 <= 0) {
            setError("Quantities must be positive numbers.");
            return;
        }

        const finalQty = q1 + q2;
        const finalFat = ((q1 * f1) + (q2 * f2)) / finalQty;
        const finalClr = ((q1 * c1) + (q2 * c2)) / finalQty;

        setResult({ finalQty, finalFat, finalClr });
    }, [milk1, milk2]);

    return (
        <CalculatorCard title="Milk Blending Calculator" description="Calculate the final Fat% and CLR after mixing two different milk sources.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <MemoizedMilkInputGroup 
                    milkNum={1} 
                    onInputChange={handleInputChange} 
                    initialValues={milk1}
                />
                <MemoizedMilkInputGroup 
                    milkNum={2}
                    onInputChange={handleInputChange} 
                    initialValues={milk2}
                />
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Blend</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {result && (
                <Alert className="mt-4">
                    <AlertTitle>Blend Result</AlertTitle>
                    <AlertDescription>
                        <div className="space-y-2 mt-2">
                           <p><strong>Total Quantity:</strong> {result.finalQty.toFixed(2)} kg/L</p>
                           <p><strong>Final Fat:</strong> {result.finalFat.toFixed(2)} %</p>
                           <p><strong>Final CLR:</strong> {result.finalClr.toFixed(2)}</p>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
        </CalculatorCard>
    );
}

function TwoMilkBlendingToTargetCalc() {
    const [inputs, setInputs] = useState({
        f1: '6.5', c1: '29',
        f2: '2.5', c2: '27',
        fTarget: '4.5', cTarget: '28.5',
        qTotal: '1000'
    });
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({ ...prev, [name]: value }));
    }, []);

    const calculate = useCallback(() => {
        setResult(null);
        setError(null);
        
        const F1 = parseFloat(inputs.f1);
        const C1 = parseFloat(inputs.c1);
        const F2 = parseFloat(inputs.f2);
        const C2 = parseFloat(inputs.c2);
        const FT = parseFloat(inputs.fTarget);
        const CT = parseFloat(inputs.cTarget);
        const QT = parseFloat(inputs.qTotal);

        if ([F1, C1, F2, C2, FT, CT, QT].some(isNaN)) {
            setError("Please fill all fields with valid numbers.");
            return;
        }

        if (QT <= 0) {
            setError("Total Batch Quantity must be a positive number.");
            return;
        }

        if ( (FT > Math.max(F1,F2)) || (FT < Math.min(F1,F2)) ) {
            setError("The target Fat % is not achievable. It must be between the Fat % of the source milks.");
            return;
        }

        // --- Step 1: Calculate milk quantities to achieve Target Fat ---
        let q1, q2;

        if (Math.abs(F1 - F2) < 1e-9) { // If both milks have same fat
            if (Math.abs(F1 - FT) > 1e-9) { // and it's not the target fat
                 setError("Cannot achieve target fat as both source milks have the same fat percentage, which is different from the target.");
                 return;
            }
            // If fat is same and matches target, we can't solve for ratio based on fat.
            // Arbitrarily set q1 to half and check CLR later.
            q1 = QT / 2;
            q2 = QT / 2;
        } else {
            q1 = QT * (FT - F2) / (F1 - F2);
            q2 = QT - q1;
        }
        
        if (q1 < 0 || q2 < 0) {
             setError("Calculation error: Negative milk quantity resulted. This can happen if target fat is outside the range of source milks.");
             return;
        }

        // --- Step 2: Check the resulting CLR and adjust if necessary ---
        const finalClrCheck = (q1 * C1 + q2 * C2) / QT;
        const clrDifference = CT - finalClrCheck;

        let resultHTML = `<p>To achieve the target Fat of <strong>${FT}%</strong>, you need to blend:</p><ul class='list-disc list-inside mt-2 text-lg'>
                <li>Milk Source 1: <strong class='text-green-700'>${q1.toFixed(3)} kg/L</strong></li>
                <li>Milk Source 2: <strong class='text-green-700'>${q2.toFixed(3)} kg/L</strong></li>
            </ul>
            <p class='mt-3'>This blend will result in a CLR of approximately <strong>${finalClrCheck.toFixed(2)}</strong>.</p>
            <hr class='my-4' />
        `;

        if (Math.abs(clrDifference) < 0.05) { // If CLR is already close enough
            resultHTML += "<h4 class='font-bold text-md text-blue-700'>No CLR adjustment needed.</h4>";
        } else if (clrDifference > 0) { // If CLR is LOW and needs to be increased
            const smpSolidsPercent = 96;
            const smpNeeded = (QT * clrDifference * 0.25) / smpSolidsPercent;
            resultHTML += `<h4 class='font-bold text-md'>CLR Adjustment Required:</h4>
            To increase CLR from <strong>${finalClrCheck.toFixed(2)}</strong> to <strong>${CT}</strong>, you need to add:
            <ul class='list-disc list-inside mt-2 text-lg'>
                <li>Skimmed Milk Powder (SMP): <strong class='text-blue-700'>${smpNeeded.toFixed(3)} kg</strong></li>
            </ul>
            `;
        } else { // If CLR is HIGH and needs to be decreased
            const clrToDecrease = finalClrCheck - CT;
            const waterNeeded = (clrToDecrease * QT) / 50; // Simplified from (clrToDecrease * 20 * QT) / 1000
            resultHTML += `<h4 class='font-bold text-md'>CLR Adjustment Required:</h4>
            To decrease CLR from <strong>${finalClrCheck.toFixed(2)}</strong> to <strong>${CT}</strong>, you need to add:
            <ul class='list-disc list-inside mt-2 text-lg'>
                <li>Water: <strong class='text-blue-700'>${waterNeeded.toFixed(3)} L</strong></li>
            </ul>
            `;
        }
        
        setResult(resultHTML);

    }, [inputs]);

    return (
        <CalculatorCard title="Advanced Two-Milk Blending to Target" description="Calculate required quantities of two milk sources to hit a target Fat %, with automatic adjustment for CLR using SMP or water.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <h3 className="font-semibold text-gray-700 font-headline">Milk Source 1</h3>
                    <MemoizedInputField label="Fat % (F₁)" value={inputs.f1} name="f1" setter={handleInputChange} />
                    <MemoizedInputField label="CLR (C₁)" value={inputs.c1} name="c1" setter={handleInputChange} />
                </div>
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <h3 className="font-semibold text-gray-700 font-headline">Milk Source 2</h3>
                    <MemoizedInputField label="Fat % (F₂)" value={inputs.f2} name="f2" setter={handleInputChange} />
                    <MemoizedInputField label="CLR (C₂)" value={inputs.c2} name="c2" setter={handleInputChange} />
                </div>
                <div className="bg-primary/10 p-4 rounded-lg space-y-3 md:col-span-2">
                    <h3 className="font-semibold text-gray-700 font-headline">Target Batch</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MemoizedInputField label="Total Batch Qty (Qᴛ) kg/L" value={inputs.qTotal} name="qTotal" setter={handleInputChange} />
                        <MemoizedInputField label="Target Fat % (Fᴛ)" value={inputs.fTarget} name="fTarget" setter={handleInputChange} />
                        <MemoizedInputField label="Target CLR (Cᴛ)" value={inputs.cTarget} name="cTarget" setter={handleInputChange} />
                    </div>
                </div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Blend &amp; Adjust</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {result && (
                 <Alert className="mt-4">
                    <AlertTitle>Blending &amp; Adjustment Plan</AlertTitle>
                    <AlertDescription>
                        <div className="mt-2 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result }}/>
                    </AlertDescription>
                </Alert>
            )}
        </CalculatorCard>
    );
}

function FatReductionClrMaintainCalc() {
    const [fatSourceType, setFatSourceType] = useState<'richMilk' | 'cream' | 'skimmedMilk'>('richMilk');
    const [inputs, setInputs] = useState({
        initialVolume: '500',
        initialFat: '2.2',
        initialClr: '34',
        targetFat: '2.2',
        targetClr: '30',
        richMilkFat: '6.1',
        richMilkClr: '30',
        creamFat: '40.0',
        creamSnf: '5.4',
        skimmedMilkFat: '0.1',
        skimmedMilkClr: '27.0'
    });

    const [results, setResults] = useState<{ ingredient1: string, ingredient2: string, finalVolume: string, finalFat: string, finalClr: string, ing1Name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({...prev, [name]: value}));
    }, []);
    
    const calculate = useCallback(() => {
        const M0 = parseFloat(inputs.initialVolume) || 0;
        const F0 = parseFloat(inputs.initialFat);
        const C0 = parseFloat(inputs.initialClr);
        const Ft = parseFloat(inputs.targetFat);
        const Ct = parseFloat(inputs.targetClr);

        let ing1: { F: number, C: number };
        let ing1Name = "";
        
        if (fatSourceType === 'richMilk') {
            ing1 = { F: parseFloat(inputs.richMilkFat), C: parseFloat(inputs.richMilkClr) };
            ing1Name = "Rich Milk";
        } else if (fatSourceType === 'cream') {
            const creamFat = parseFloat(inputs.creamFat);
            const creamSnf = parseFloat(inputs.creamSnf);
            const creamClr = 4 * (creamSnf - 0.25 * creamFat - 0.72); // ISI formula inverse
            ing1 = { F: creamFat, C: creamClr };
            ing1Name = "Cream";
        } else { // skimmedMilk
            ing1 = { F: parseFloat(inputs.skimmedMilkFat), C: parseFloat(inputs.skimmedMilkClr) };
            ing1Name = "Skimmed Milk";
        }

        const ing2 = { F: 0, C: 0 }; // Water

        if ([M0, F0, C0, Ft, Ct, ing1.F, ing1.C].some(isNaN)) {
            setError("Please enter valid numbers in all input boxes.");
            setResults(null);
            return;
        }

        const a = (ing1.F - Ft);
        const b = (ing2.F - Ft);
        const d = (Ft - F0) * M0;

        const a2 = (ing1.C - Ct);
        const b2 = (ing2.C - Ct);
        const d2 = (Ct - C0) * M0;

        const det = a * b2 - b * a2;

        if (Math.abs(det) < 1e-9) {
            setError("Calculation is not possible with these inputs. Ingredients might not be able to achieve the target (e.g., they are collinear).");
            setResults(null);
            return;
        }

        const M1 = (d * b2 - b * d2) / det;
        const M2 = (a * d2 - d * a2) / det;

        if (M1 < -1e-9 || M2 < -1e-9) { // Small tolerance for floating point errors
             setError("Result is negative. This standardization scenario is not possible with the selected ingredients.");
             setResults(null);
             return;
        }
        
        const M1_final = Math.max(0, M1);
        const M2_final = Math.max(0, M2);

        setError(null);

        const finalVolume = M0 + M1_final + M2_final;
        const finalFatCheck = ((F0 * M0) + (ing1.F * M1_final)) / finalVolume;
        const finalClrCheck = ((C0 * M0) + (ing1.C * M1_final)) / finalVolume;

        setResults({
            ingredient1: `${M1_final.toFixed(2)} L`,
            ingredient2: `${M2_final.toFixed(2)} L`,
            finalVolume: `${finalVolume.toFixed(2)} L`,
            finalFat: `${finalFatCheck.toFixed(2)} %`,
            finalClr: `${finalClrCheck.toFixed(2)}`,
            ing1Name: ing1Name
        });

    }, [inputs, fatSourceType]);

    return (
        <CalculatorCard 
            title="Fat &amp; CLR Corrector"
            description="Calculate the amount of a correction ingredient (Rich Milk, Cream, or Skim Milk) and Water needed to adjust your batch to a target fat and CLR.">
            <div className="mb-4">
                <Label>Select Correction Ingredient</Label>
                <Select value={fatSourceType} onValueChange={(val) => setFatSourceType(val as 'richMilk' | 'cream' | 'skimmedMilk')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="richMilk">Rich Milk</SelectItem>
                        <SelectItem value="cream">Cream</SelectItem>
                        <SelectItem value="skimmedMilk">Skimmed Milk</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                    <h3 className="font-semibold text-gray-700 font-headline">Initial Milk</h3>
                    <MemoizedInputField label="Initial Volume (L):" value={inputs.initialVolume} name="initialVolume" setter={handleInputChange} />
                    <MemoizedInputField label="Initial Fat %:" value={inputs.initialFat} name="initialFat" setter={handleInputChange} />
                    <MemoizedInputField label="Initial CLR:" value={inputs.initialClr} name="initialClr" setter={handleInputChange} />
                </div>
                 <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-3">
                    <h3 className="font-semibold text-gray-700 font-headline">Target</h3>
                    <MemoizedInputField label="Target Fat %:" value={inputs.targetFat} name="targetFat" setter={handleInputChange} />
                    <MemoizedInputField label="Target CLR:" value={inputs.targetClr} name="targetClr" setter={handleInputChange} />
                </div>
                 <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-3 md:col-span-2">
                     <h3 className="font-semibold text-gray-700 font-headline">Available Ingredients for Correction</h3>
                     {fatSourceType === 'richMilk' ? (
                          <>
                              <MemoizedInputField label="Rich Milk Fat %:" value={inputs.richMilkFat} name="richMilkFat" setter={handleInputChange} />
                              <MemoizedInputField label="Rich Milk CLR:" value={inputs.richMilkClr} name="richMilkClr" setter={handleInputChange} />
                          </>
                      ) : fatSourceType === 'cream' ? (
                          <>
                              <MemoizedInputField label="Cream Fat %:" value={inputs.creamFat} name="creamFat" setter={handleInputChange} />
                              <MemoizedInputField label="Cream SNF %:" value={inputs.creamSnf} name="creamSnf" setter={handleInputChange} />
                          </>
                      ) : (
                         <>
                              <MemoizedInputField label="Skimmed Milk Fat %:" value={inputs.skimmedMilkFat} name="skimmedMilkFat" setter={handleInputChange} />
                              <MemoizedInputField label="Skimmed Milk CLR:" value={inputs.skimmedMilkClr} name="skimmedMilkClr" setter={handleInputChange} />
                         </>
                      )}
                      <p className="text-xs text-muted-foreground">The other ingredient available is Water (0% Fat, 0 CLR).</p>
                 </div>
            </div>
             <Button onClick={calculate} className="w-full mt-6">Calculate</Button>

            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {results && (
                 <div className="mt-6 bg-purple-50 p-6 rounded-2xl border-2 border-purple-200">
                    <h2 className="text-xl font-semibold mb-4 text-purple-700">Results</h2>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-md border">
                            <p className="text-sm font-medium text-gray-600">{results.ing1Name} to Add:</p>
                            <p className="text-2xl font-bold text-purple-800">{results.ingredient1 || '0 L'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md border">
                            <p className="text-sm font-medium text-gray-600">Water to Add:</p>
                            <p className="text-2xl font-bold text-purple-800">{results.ingredient2 || '0 L'}</p>
                        </div>
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg border">
                            <p className="text-lg font-semibold text-gray-800">Final Batch Summary</p>
                            <div className="flex justify-between mt-2"><span>Final Volume:</span><span className="font-bold">{results.finalVolume || '-'}</span></div>
                            <div className="flex justify-between mt-1"><span>Final Fat %:</span><span className="font-bold">{results.finalFat || '-'}</span></div>
                            <div className="flex justify-between mt-1"><span>Final CLR:</span><span className="font-bold">{results.finalClr || '-'}</span></div>
                        </div>
                    </div>
                 </div>
            )}
        </CalculatorCard>
    );
}

function TwoComponentStandardizationCalc() {
    const [correctionType, setCorrectionType] = useState('cream');
    const [inputs, setInputs] = useState({
        V0: '700', Fi: '3.5', CLRi: '28',
        Ft: '4.5', CLRt: '28.5',
        Fc: '40', CLRc: '10', // Cream
        Fr: '6', CLRr: '30',   // Rich Milk
        Fs: '0.1', CLRs: '27', // Skim Milk
        smpSnf: '96', smpFat: '1'
    });
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({...prev, [name]: value}));
    }, []);

    const calculate = useCallback(() => {
        setResults(null);
        setError(null);
        
        const V0 = parseFloat(inputs.V0) || 0;
        const Fi = parseFloat(inputs.Fi) / 100;
        const CLRi = parseFloat(inputs.CLRi) || 0;
        const Ft = parseFloat(inputs.Ft) / 100;
        const CLRt = parseFloat(inputs.CLRt) || 0;
        const smpSnf = parseFloat(inputs.smpSnf) / 100;
        const smpFat = parseFloat(inputs.smpFat) / 100;

        if ([V0, Fi, CLRi, Ft, CLRt, smpSnf, smpFat].some(isNaN)) {
             setError("Please fill all initial and target fields with valid numbers.");
             return;
        }

        const formula = (clr: number, fat: number) => clr / 4 + 0.25 * fat + 0.44; // Using ISI
        const SNFi = formula(CLRi, Fi * 100) / 100;
        const SNFt = formula(CLRt, Ft * 100) / 100;
        
        let mainIng: { F: number, SNF: number, name: string };
        switch(correctionType) {
            case 'cream':
                const Fc = parseFloat(inputs.Fc);
                mainIng = { F: Fc/100, SNF: formula(parseFloat(inputs.CLRc), Fc)/100, name: "Cream"};
                break;
            case 'rich_milk':
                const Fr = parseFloat(inputs.Fr);
                mainIng = { F: Fr/100, SNF: formula(parseFloat(inputs.CLRr), Fr)/100, name: "Rich Milk"};
                break;
            case 'skim_milk':
                 const Fs = parseFloat(inputs.Fs);
                mainIng = { F: Fs/100, SNF: formula(parseFloat(inputs.CLRs), Fs)/100, name: "Skimmed Milk"};
                break;
            default:
                setError("Invalid correction ingredient selected.");
                return;
        }
        
        const water = { F: 0, SNF: 0, name: "Water" };
        const smp = { F: smpFat, SNF: smpSnf, name: "SMP" };

        const A = [
            [mainIng.F - Ft, water.F - Ft, smp.F - Ft],
            [mainIng.SNF - SNFt, water.SNF - SNFt, smp.SNF - SNFt],
            [1, 1, 1] // This is not a mass balance equation, so this approach is flawed. Let's solve for 2 unknowns at a time.
        ];

        const C = [V0 * (Ft - Fi), V0 * (SNFt - SNFi)];

        // System 1: Main Ingredient (X) and Water (Y)
        const det1 = (mainIng.F - Ft) * (water.SNF - SNFt) - (water.F - Ft) * (mainIng.SNF - SNFt);
        let X1 = Infinity, Y1 = Infinity;
        if (Math.abs(det1) > 1e-9) {
            X1 = (C[0] * (water.SNF - SNFt) - (water.F - Ft) * C[1]) / det1;
            Y1 = ((mainIng.F - Ft) * C[1] - C[0] * (mainIng.SNF - SNFt)) / det1;
        }

        // System 2: Main Ingredient (X) and SMP (Z)
        const det2 = (mainIng.F - Ft) * (smp.SNF - SNFt) - (smp.F - Ft) * (mainIng.SNF - SNFt);
        let X2 = Infinity, Z2 = Infinity;
        if (Math.abs(det2) > 1e-9) {
            X2 = (C[0] * (smp.SNF - SNFt) - (smp.F - Ft) * C[1]) / det2;
            Z2 = ((mainIng.F - Ft) * C[1] - C[0] * (mainIng.SNF - SNFt)) / det2;
        }
        
        let X = 0, Y = 0, Z = 0;

        if (X1 >= -1e-6 && Y1 >= -1e-6) { // Prefer Water if it's a valid solution
            X = X1; Y = Y1;
        } else if (X2 >= -1e-6 && Z2 >= -1e-6) { // Fallback to SMP
            X = X2; Z = Z2;
        } else {
             // If neither simple 2-component system works, a 3-component solution is needed.
             // This can be complex (linear programming). For this calculator, we can show an error.
             setError("Cannot find a simple solution with two ingredients. The required adjustment may need a combination of Water and SMP, or is impossible with the given components.");
             return;
        }

        X = Math.max(0, X);
        Y = Math.max(0, Y);
        Z = Math.max(0, Z);
        
        const Vf = V0 + X + Y + Z;
        const finalFatMass = (Fi * V0) + (mainIng.F * X) + (water.F * Y) + (smp.F * Z);
        const finalFatPercent = (finalFatMass / Vf) * 100;
        const finalSnfMass = (SNFi * V0) + (mainIng.SNF * X) + (water.SNF * Y) + (smp.SNF * Z);
        const finalSnfPercent = finalSnfMass / Vf * 100;
        const finalClrCheck = 4 * (finalSnfPercent/100 - 0.25 * finalFatPercent/100 - 0.0044); // Inverse of ISI

        setResults({ x: X, y: Y, z: Z, Vf, finalFatPercent, finalSnfPercent, finalClrCheck, ing_name: mainIng.name });

    }, [inputs, correctionType]);

    return (
        <CalculatorCard title="Automated Standardization" description="Standardize milk by selecting one main ingredient. The calculator will automatically use Water or Skimmed Milk Powder (SMP) for fine-tuning.">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold text-gray-700">Initial Milk</h4>
                    <MemoizedInputField label="Volume (V₀) L/kg" value={inputs.V0} name="V0" setter={handleInputChange} />
                    <MemoizedInputField label="Fat (Fᵢ) %" value={inputs.Fi} name="Fi" setter={handleInputChange} />
                    <MemoizedInputField label="CLR (CLRᵢ)" value={inputs.CLRi} name="CLRi" setter={handleInputChange} />
                </div>
                <div className="bg-green-50 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold text-gray-700">Target Milk</h4>
                    <MemoizedInputField label="Target Fat (Fₜ) %" value={inputs.Ft} name="Ft" setter={handleInputChange} />
                    <MemoizedInputField label="Target CLR (CLRₜ)" value={inputs.CLRt} name="CLRt" setter={handleInputChange} />
                </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg space-y-3 mb-4">
                <h4 className="font-semibold text-gray-700">Correction Ingredient</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Select Main Ingredient</Label>
                        <Select value={correctionType} onValueChange={(v) => setCorrectionType(v)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cream">Cream</SelectItem>
                                <SelectItem value="rich_milk">Rich Milk</SelectItem>
                                <SelectItem value="skim_milk">Skimmed Milk</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {correctionType === 'cream' && (<>
                        <MemoizedInputField label="Cream Fat (F꜀) %" value={inputs.Fc} name="Fc" setter={handleInputChange} />
                        <MemoizedInputField label="Cream CLR (CLR꜀)" value={inputs.CLRc} name="CLRc" setter={handleInputChange} />
                    </>)}
                    {correctionType === 'rich_milk' && (<>
                        <MemoizedInputField label="Rich Milk Fat (Fᵣ) %" value={inputs.Fr} name="Fr" setter={handleInputChange} />
                        <MemoizedInputField label="Rich Milk CLR (CLRᵣ)" value={inputs.CLRr} name="CLRr" setter={handleInputChange} />
                    </>)}
                     {correctionType === 'skim_milk' && (<>
                        <MemoizedInputField label="Skim Milk Fat (Fₛ) %" value={inputs.Fs} name="Fs" setter={handleInputChange} />
                        <MemoizedInputField label="Skim Milk CLR (CLRₛ)" value={inputs.CLRs} name="CLRs" setter={handleInputChange} />
                    </>)}
                </div>
                 <p className="text-xs text-muted-foreground mt-2">Note: Water (0% Fat, 0 CLR) and SMP (1% Fat, 96% SNF) will be used automatically for fine-tuning.</p>
            </div>

            <Button onClick={calculate} className="w-full mt-4">Calculate</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {results && (
                <Alert className="mt-4">
                    <AlertTitle>Standardization Plan</AlertTitle>
                    <AlertDescription>
                        <p className="font-semibold">To reach your target, add the following:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            {results.x > 0.001 && <li><strong>{results.ing_name}:</strong> {results.x.toFixed(2)} L/kg</li>}
                            {results.y > 0.001 && <li><strong>Water:</strong> {results.y.toFixed(2)} L/kg</li>}
                            {results.z > 0.001 && <li><strong>SMP:</strong> {results.z.toFixed(2)} L/kg</li>}
                        </ul>
                        <hr className="my-2"/>
                        <p className="font-semibold">Final Batch Summary:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li><strong>Final Volume:</strong> {results.Vf.toFixed(2)} L/kg</li>
                            <li><strong>Final Fat:</strong> {results.finalFatPercent.toFixed(2)}% (Target: {inputs.Ft}%)</li>
                            <li><strong>Final CLR:</strong> {results.finalClrCheck.toFixed(2)} (Target: {inputs.CLRt})</li>
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
        </CalculatorCard>
    );
};

const PearsonSquareCalc = ({ unit, calcType }: { unit: string, calcType: 'Fat' | 'CLR' }) => {
    const [inputs, setInputs] = useState({ high: "", low: "", target: "", qty: "" });
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({...prev, [name]: value}));
    }, []);

    const handleCalc = useCallback(() => {
        const highVal = parseFloat(inputs.high);
        const lowVal = parseFloat(inputs.low);
        const targetVal = parseFloat(inputs.target);
        const qtyVal = parseFloat(inputs.qty);
        
        setResult(null);
        setError(null);

        if (isNaN(highVal) || isNaN(lowVal) || isNaN(targetVal) || isNaN(qtyVal)) {
            setError("Please fill all fields with numbers.");
            return;
        }

        if (targetVal > highVal || targetVal < lowVal) {
            setError(`Target ${calcType} must be between the High and Low values.`);
            return;
        }

        const highParts = targetVal - lowVal;
        const lowParts = highVal - targetVal;
        const totalParts = highParts + lowParts;

        if (totalParts === 0) {
            setError("Cannot calculate, total parts is zero. Check your inputs.");
            return;
        }

        const highQty = (qtyVal * highParts) / totalParts;
        const lowQty = (qtyVal * lowParts) / totalParts;

        setResult(`To get ${qtyVal} Kg/Ltr of ${targetVal}${unit} product, you need to mix:<br/><strong class="text-green-700">${highQty.toFixed(2)} Kg/Ltr</strong> of High ${calcType} milk and <strong class="text-green-700">${lowQty.toFixed(2)} Kg/Ltr</strong> of Low ${calcType} milk.`);
    }, [inputs, unit, calcType]);

    return (
         <CalculatorCard title={`${calcType} Blending Calculator`} description={`Blend two milks with different ${calcType}% to create a new product.`}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2 font-headline">Source Milk 1 (High ${calcType})</h3>
                    <MemoizedInputField label={`${calcType} ${unit}`} value={inputs.high} name="high" setter={handleInputChange} placeholder="e.g., 5.0" />
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2 font-headline">Source Milk 2 (Low ${calcType})</h3>
                    <MemoizedInputField label={`${calcType} ${unit}`} value={inputs.low} name="low" setter={handleInputChange} placeholder="e.g., 0.5" />
                </div>
            </div>
             <div className="bg-primary/10 p-4 rounded-lg mb-4">
                 <h3 className="font-semibold text-gray-700 mb-2 font-headline">Target Product</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MemoizedInputField label={`Target ${calcType} ${unit}`} value={inputs.target} name="target" setter={handleInputChange} placeholder="e.g., 3.0" />
                    <MemoizedInputField label="Target Batch Qty (Kg/Ltr)" value={inputs.qty} name="qty" setter={handleInputChange} placeholder="e.g., 100" />
                </div>
            </div>
            <Button onClick={handleCalc} className="w-full">Calculate Blend</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {result && <Alert className="mt-4"><AlertTitle>Result</AlertTitle><AlertDescription dangerouslySetInnerHTML={{__html: result}} /></Alert>}
        </CalculatorCard>
    );
}

function FatBlendingCalc() { return <PearsonSquareCalc unit="%" calcType="Fat" /> }
function ClrBlendingCalc() { return <PearsonSquareCalc unit="" calcType="CLR" /> }

function FatSnfAdjustmentCalc() {
    const [inputs, setInputs] = useState({
        milkQty: '100', milkFat: '3.5', milkClr: '28.0',
        targetFat: '4.5', targetClr: '28.5',
        creamFat: '40', powderTs: '96',
        formula: 'isi',
        customC: '0.72'
    });
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({...prev, [name]: value}));
    }, []);

    const calculateSnf = useCallback((clr: number, fat: number) => {
        const formulaKey = inputs.formula as keyof typeof snfFormulas;
        if (formulaKey === 'general') {
            return snfFormulas.general.calc(clr, fat, parseFloat(inputs.customC));
        }
        return snfFormulas[formulaKey].calc(clr, fat);
    }, [inputs.formula, inputs.customC]);

    const milkSnf = useMemo(() => {
        const fat = parseFloat(inputs.milkFat);
        const clr = parseFloat(inputs.milkClr);
        return !isNaN(fat) && !isNaN(clr) ? calculateSnf(clr, fat) : 0;
    }, [inputs.milkFat, inputs.milkClr, calculateSnf]);

    const targetSnf = useMemo(() => {
        const fat = parseFloat(inputs.targetFat);
        const clr = parseFloat(inputs.targetClr);
        return !isNaN(fat) && !isNaN(clr) ? calculateSnf(clr, fat) : 0;
    }, [inputs.targetFat, inputs.targetClr, calculateSnf]);

    const calculate = useCallback(() => {
        setResult(null);
        setError(null);

        const M = parseFloat(inputs.milkQty);
        const Fm = parseFloat(inputs.milkFat) / 100;
        const Ft = parseFloat(inputs.targetFat) / 100;
        const Fc = parseFloat(inputs.creamFat) / 100;
        const Fp = 1 / 100; // Powder fat is ~1%
        const Sp = (parseFloat(inputs.powderTs) / 100) - Fp; // Powder SNF
        
        const Sm = milkSnf / 100;
        const St = targetSnf / 100;

        // Estimate cream SNF
        const creamSnfFromFat = snfFormulas.isi.calc(20, parseFloat(inputs.creamFat));
        const Sc = creamSnfFromFat / 100;


        if ([M, Fm, Ft, Fc, Fp, Sp, Sm, St].some(isNaN) || M <= 0) {
            setError("Please fill all fields with valid positive numbers.");
            return;
        }

        const K1 = M * (Ft - Fm);
        const K2 = M * (St - Sm);
        
        const A1 = Fc - Ft;
        const B1 = Fp - Ft;
        
        const A2 = Sc - St;
        const B2 = Sp - St;
        
        const det = A1 * B2 - B1 * A2;

        if (Math.abs(det) < 1e-9) {
            setError("Cannot solve. Ingredients properties are too similar or invalid.");
            return;
        }

        const C = (K1 * B2 - K2 * B1) / det;
        const P = (K2 * A1 - K1 * A2) / det;

        if (C < -1e-9 || P < -1e-9) { // Allow for small floating point inaccuracies
            setError("Calculation resulted in negative values. This standardization is not possible with the given inputs (e.g., you might need to add skim milk instead).");
            return;
        }
        
        const creamToAdd = Math.max(0, C);
        const powderToAdd = Math.max(0, P);
        const finalWeight = M + creamToAdd + powderToAdd;
        
        setResult(`
            <p>For <strong>${M} kg</strong> of milk, to reach <strong>${inputs.targetFat}% Fat</strong> and <strong>${targetSnf.toFixed(2)}% SNF</strong>, you need to add:</p>
            <ul class='list-disc list-inside mt-2'>
                <li>Cream (${inputs.creamFat}% Fat): <strong class='text-green-700 text-lg'>${creamToAdd.toFixed(3)} kg</strong></li>
                <li>SMP (${inputs.powderTs}% TS): <strong class='text-green-700 text-lg'>${powderToAdd.toFixed(3)} kg</strong></li>
            </ul>
            <p class='mt-3'>Final Batch Weight will be approximately <strong>${finalWeight.toFixed(3)} kg</strong>.</p>
        `);
    }, [inputs, milkSnf, targetSnf]);

    return (
        <CalculatorCard title="Fat &amp; SNF Adjustment Calculator" description="Calculate how much Cream and Skimmed Milk Powder (SMP) to add to standardize both Fat and SNF upwards.">
            <div className="bg-primary/10 p-4 rounded-lg mb-4">
                 <h3 className="font-semibold text-gray-700 mb-2 font-headline">SNF Calculation Formula</h3>
                 <Select value={inputs.formula} onValueChange={(val) => handleInputChange('formula', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {Object.entries(snfFormulas).map(([key, {name, formulaText}]) => (
                            <SelectItem key={key} value={key}>
                                <div className="flex flex-col">
                                    <p className="font-semibold">{name}</p>
                                    <p className="text-xs text-muted-foreground">{formulaText}</p>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                 </Select>
                 {inputs.formula === 'general' && (
                     <div className="mt-2">
                        <MemoizedInputField label="Custom Constant (C)" value={inputs.customC} name="customC" setter={handleInputChange} />
                     </div>
                 )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                     <h3 className="font-semibold text-gray-700 mb-2 font-headline">Initial Milk</h3>
                     <MemoizedInputField label="Milk Quantity (kg)" value={inputs.milkQty} name="milkQty" setter={handleInputChange} />
                     <MemoizedInputField label="Milk Fat %" value={inputs.milkFat} name="milkFat" setter={handleInputChange} />
                     <MemoizedInputField label="Milk CLR" value={inputs.milkClr} name="milkClr" setter={handleInputChange} />
                     <div className="text-sm p-2 bg-blue-100 rounded">Calculated SNF: <strong className="font-bold">{milkSnf.toFixed(2)}%</strong></div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                     <h3 className="font-semibold text-gray-700 mb-2 font-headline">Target Milk</h3>
                     <MemoizedInputField label="Target Fat %" value={inputs.targetFat} name="targetFat" setter={handleInputChange} />
                     <MemoizedInputField label="Target CLR" value={inputs.targetClr} name="targetClr" setter={handleInputChange} />
                      <div className="text-sm p-2 bg-green-100 rounded">Calculated Target SNF: <strong className="font-bold">{targetSnf.toFixed(2)}%</strong></div>
                </div>
                 <div className="bg-primary/10 p-4 rounded-lg space-y-3 md:col-span-2">
                     <h3 className="font-semibold text-gray-700 mb-2 font-headline">Ingredients for Adjustment</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <MemoizedInputField label="Cream Fat %" value={inputs.creamFat} name="creamFat" setter={handleInputChange} />
                         <MemoizedInputField label="Powder Total Solids (TS) %" value={inputs.powderTs} name="powderTs" setter={handleInputChange} />
                     </div>
                </div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Adjustment</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {result && <Alert className="mt-4"><AlertTitle>Result</AlertTitle><AlertDescription dangerouslySetInnerHTML={{__html: result}} /></Alert>}
        </CalculatorCard>
    );
}

function ReconstitutedMilkCalc() {
    const [inputs, setInputs] = useState({ batchQty: '100', targetTS: '12.5', powderTS: '96' });
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({...prev, [name]: value}));
    }, []);

    const calculate = useCallback(() => {
        setResult(null);
        setError(null);
        const qty = parseFloat(inputs.batchQty);
        const tTS = parseFloat(inputs.targetTS) / 100;
        const pTS = parseFloat(inputs.powderTS) / 100;

        if ([qty, tTS, pTS].some(isNaN) || qty <= 0 || tTS <= 0 || pTS <= 0) {
            setError("Please fill all fields with valid positive numbers.");
            return;
        }

        if (pTS < tTS) {
            setError("Powder TS% cannot be less than Target TS%. Please check your inputs.");
            return;
        }

        const totalSolidsNeeded = qty * tTS;
        const powderNeeded = totalSolidsNeeded / pTS;
        const waterNeeded = qty - powderNeeded;

        if (waterNeeded < 0) {
            setError("Calculation resulted in negative water. Please check your inputs.");
            return;
        }

        setResult(`To make <strong>${qty} kg</strong> of milk with <strong>${inputs.targetTS}% TS</strong>, you need:<br/>- <strong class='text-green-700'>${powderNeeded.toFixed(3)} kg</strong> of Milk Powder (${inputs.powderTS}%)<br/>- <strong class='text-green-700'>${waterNeeded.toFixed(3)} kg</strong> of Water`);
    }, [inputs]);

    return (
        <CalculatorCard title="Reconstituted Milk Calculator" description="Calculate how much Milk Powder and Water are needed to create milk of a specific Total Solids (TS) content.">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <MemoizedInputField label="Target Batch Quantity (kg)" value={inputs.batchQty} name="batchQty" setter={handleInputChange} />
                <MemoizedInputField label="Target Total Solids (TS) %" value={inputs.targetTS} name="targetTS" setter={handleInputChange} />
                <MemoizedInputField label="Milk Powder Total Solids (TS) %" value={inputs.powderTS} name="powderTS" setter={handleInputChange} />
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {result && <Alert className="mt-4"><AlertTitle>Result</AlertTitle><AlertDescription dangerouslySetInnerHTML={{__html: result}} /></Alert>}
        </CalculatorCard>
    );
}

function RecombinedMilkCalc() {
    const [inputs, setInputs] = useState({
        batchQty: '100',
        targetFat: '3.5',
        targetClr: '28.5',
        smpFat: '1.0',
        smpSNF: '95.0',
        fatSourceFat: '99.8',
        formula: 'isi',
        customC: '0.72'
    });
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({...prev, [name]: value}));
    }, []);

    const calculateSnf = useCallback((clr: number, fat: number) => {
        const formulaKey = inputs.formula as keyof typeof snfFormulas;
        if (formulaKey === 'general') {
            return snfFormulas.general.calc(clr, fat, parseFloat(inputs.customC));
        }
        return snfFormulas[formulaKey].calc(clr, fat);
    }, [inputs.formula, inputs.customC]);
    
    const targetSnf = useMemo(() => {
        const fat = parseFloat(inputs.targetFat);
        const clr = parseFloat(inputs.targetClr);
        return !isNaN(fat) && !isNaN(clr) ? calculateSnf(clr, fat) : 0;
    }, [inputs.targetFat, inputs.targetClr, calculateSnf]);


    const calculate = useCallback(() => {
        setResult(null);
        setError(null);
        
        const Q = parseFloat(inputs.batchQty);
        const Ft = parseFloat(inputs.targetFat) / 100;
        const St = targetSnf / 100; // Calculated SNF
        const Fp = parseFloat(inputs.smpFat) / 100;
        const Sp = parseFloat(inputs.smpSNF) / 100;
        const Fb = parseFloat(inputs.fatSourceFat) / 100;

        if ([Q, Ft, St, Fp, Sp, Fb].some(isNaN) || Q <= 0) {
            setError("Please fill all fields with valid numbers.");
            return;
        }

        if (St <= 0) {
             setError("Calculated Target SNF is zero or negative. Please check Fat and CLR values.");
            return;
        }

        const P = (Q * St) / Sp; // Powder needed
        const B = (Q * Ft - P * Fp) / Fb; // Butter oil needed
        const W = Q - P - B; // Water needed

        if (P < 0 || B < 0 || W < 0) {
            setError("Calculation resulted in negative values. Please check your inputs. This can happen if ingredient compositions are not logical (e.g., SMP fat is higher than target fat).");
            return;
        }

        setResult(`To make <strong>${Q} kg</strong> of milk with <strong>${inputs.targetFat}% Fat</strong> and <strong>${targetSnf.toFixed(2)}% SNF</strong>, you need:<br/>
        - <strong class='text-green-700'>${P.toFixed(3)} kg</strong> of Skim Milk Powder<br/>
        - <strong class='text-green-700'>${B.toFixed(3)} kg</strong> of Butter Oil/AMF<br/>
        - <strong class='text-green-700'>${W.toFixed(3)} kg</strong> of Water`);
    }, [inputs, targetSnf]);

    return (
        <CalculatorCard title="Recombined Milk Calculator" description="Calculate the required Skim Milk Powder (SMP), Butter Oil (or other fat source), and Water to create milk of a desired composition.">
             <div className="bg-muted/50 p-4 rounded-lg mb-4">
                 <Label>Select SNF Calculation Formula</Label>
                 <Select value={inputs.formula} onValueChange={(val) => handleInputChange('formula', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {Object.entries(snfFormulas).map(([key, {name, formulaText}]) => (
                            <SelectItem key={key} value={key}>
                                <div className="flex flex-col">
                                    <span className="font-semibold">{name}</span>
                                    <span className="text-xs text-muted-foreground">{formulaText}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                 </Select>
                 {inputs.formula === 'general' && (
                     <div className="mt-2">
                        <MemoizedInputField label="Custom Constant (C)" value={inputs.customC} name="customC" setter={handleInputChange} />
                     </div>
                 )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <div className="bg-primary/10 p-4 rounded-lg space-y-3">
                     <h3 className="font-semibold text-gray-700 mb-2 font-headline">Target Milk</h3>
                    <MemoizedInputField label="Target Batch Quantity (kg)" value={inputs.batchQty} name="batchQty" setter={handleInputChange} />
                    <MemoizedInputField label="Target Fat %" value={inputs.targetFat} name="targetFat" setter={handleInputChange} />
                    <MemoizedInputField label="Target CLR" value={inputs.targetClr} name="targetClr" setter={handleInputChange} />
                    <div className="text-sm p-2 bg-green-100 rounded">Calculated Target SNF: <strong className="font-bold">{targetSnf > 0 ? targetSnf.toFixed(2) + '%' : '...'}</strong></div>
                </div>
                 <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                     <h3 className="font-semibold text-gray-700 mb-2 font-headline">Ingredients Composition</h3>
                     <MemoizedInputField label="Skim Milk Powder (SMP) Fat %" value={inputs.smpFat} name="smpFat" setter={handleInputChange} />
                     <MemoizedInputField label="Skim Milk Powder (SMP) SNF %" value={inputs.smpSNF} name="smpSNF" setter={handleInputChange} />
                     <MemoizedInputField label="Fat Source (e.g., Butter Oil) Fat %" value={inputs.fatSourceFat} name="fatSourceFat" setter={handleInputChange} />
                </div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Recombined Milk</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {result && <Alert className="mt-4"><AlertTitle>Result</AlertTitle><AlertDescription dangerouslySetInnerHTML={{__html: result}} /></Alert>}
        </CalculatorCard>
    );
}

function ClrCorrectionCalc() {
    const [result, setResult] = useState<string | null>(null);
    const [olr, setOlr] = useState("28.5");
    const [temp, setTemp] = useState("29");

    const handleCalc = () => {
        const olrNum = parseFloat(olr);
        const tempNum = parseFloat(temp);
        if (isNaN(olrNum) || isNaN(tempNum)) {
            setResult('Invalid Input'); return;
        }
        const clr = olrNum + (tempNum - 27) * 0.2;
        setResult(clr.toFixed(2));
    }

    return (
        <CalculatorCard title="CLR Correction Calculator" description="Correct Lactometer Reading based on temperature.">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div><Label>Observed Lactometer Reading (OLR)</Label><Input type="number" value={olr} onChange={e => setOlr(e.target.value)} placeholder="28.5" /></div>
                <div><Label>Milk Temperature (°C)</Label><Input type="number" value={temp} onChange={e => setTemp(e.target.value)} placeholder="29" /></div>
                <p className="text-xs text-gray-500">Note: Standard calibration temperature is 27°C.</p>
            </div>
            <Button onClick={handleCalc} className="w-full mt-4">Correct CLR</Button>
            {result && <div className="mt-4 text-center"><p className="text-gray-600">Corrected Lactometer Reading (CLR):</p><p className="text-3xl font-bold text-green-700">{result}</p></div>}
        </CalculatorCard>
    );
}

function KgFatSnfCalc() {
    const [inputs, setInputs] = useState({ literQty: "1000", kgQty: "", fat: "4.5", snf: "8.5" });
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("liter");

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({...prev, [name]: value}));
    }, []);

    const calculateByLiter = () => {
        const litersVal = parseFloat(inputs.literQty);
        const fatVal = parseFloat(inputs.fat);
        const snfVal = parseFloat(inputs.snf);
        setResult(null); setError(null);

        if([litersVal, fatVal, snfVal].some(isNaN)) {
            setError("Please fill all fields with numbers."); return;
        }
        
        const milkWeight = litersVal * componentProps.milkDensity;
        const fatKg = milkWeight * (fatVal / 100);
        const snfKg = milkWeight * (snfVal / 100);
        setResult(`In <strong>${litersVal} Ltr</strong> of milk:<br/>- <strong>Total Fat:</strong> ${fatKg.toFixed(2)} Kg<br/>- <strong>Total SNF (Powder):</strong> ${snfKg.toFixed(2)} Kg`);
    };

    const calculateByKg = () => {
        const kgVal = parseFloat(inputs.kgQty);
        const fatVal = parseFloat(inputs.fat);
        const snfVal = parseFloat(inputs.snf);
        setResult(null); setError(null);

        if([kgVal, fatVal, snfVal].some(isNaN)) {
            setError("Please fill all fields with numbers."); return;
        }
        
        const fatKg = kgVal * (fatVal / 100);
        const snfKg = kgVal * (snfVal / 100);
        setResult(`In <strong>${kgVal} Kg</strong> of milk:<br/>- <strong>Total Fat:</strong> ${fatKg.toFixed(2)} Kg<br/>- <strong>Total SNF (Powder):</strong> ${snfKg.toFixed(2)} Kg`);
    };

    return (
        <CalculatorCard title="Kg Fat &amp; SNF Calculator" description="Find out the amount (in Kg) of Fat and Powder (SNF) from a given quantity of milk.">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="liter">Calculate by Liter</TabsTrigger>
                    <TabsTrigger value="kg">Calculate by Kg</TabsTrigger>
                </TabsList>
                <TabsContent value="liter">
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3 mt-4">
                        <MemoizedInputField label="Milk Quantity (Liters)" value={inputs.literQty} name="literQty" setter={handleInputChange} placeholder="1000" />
                        <MemoizedInputField label="Fat %" value={inputs.fat} name="fat" setter={handleInputChange} placeholder="4.5" />
                        <MemoizedInputField label="SNF %" value={inputs.snf} name="snf" setter={handleInputChange} placeholder="8.5" />
                    </div>
                    <Button onClick={calculateByLiter} className="w-full mt-4">Calculate from Liters</Button>
                </TabsContent>
                <TabsContent value="kg">
                     <div className="bg-muted/50 p-4 rounded-lg space-y-3 mt-4">
                        <MemoizedInputField label="Milk Quantity (Kg)" value={inputs.kgQty} name="kgQty" setter={handleInputChange} placeholder="1030" />
                        <MemoizedInputField label="Fat %" value={inputs.fat} name="fat" setter={handleInputChange} placeholder="4.5" />
                        <MemoizedInputField label="SNF %" value={inputs.snf} name="snf" setter={handleInputChange} placeholder="8.5" />
                    </div>
                    <Button onClick={calculateByKg} className="w-full mt-4">Calculate from Kg</Button>
                </TabsContent>
            </Tabs>
            
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {result && <Alert className="mt-4"><AlertTitle>Result</AlertTitle><AlertDescription dangerouslySetInnerHTML={{__html: result}} /></Alert>}
        </CalculatorCard>
    );
}

function ClrIncreaseCalc() {
    const [inputs, setInputs] = useState({
        initialVolume: '1000',
        initialClr: '27',
        targetClr: '29',
        smpSnf: '96'
    });
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({...prev, [name]: value}));
    }, []);

    const calculate = useCallback(() => {
        setResult(null);
        setError(null);
        
        const V0 = parseFloat(inputs.initialVolume);
        const C0 = parseFloat(inputs.initialClr);
        const Ct = parseFloat(inputs.targetClr);
        const Ps = parseFloat(inputs.smpSnf) / 100;

        if ([V0, C0, Ct, Ps].some(isNaN) || V0 <= 0 || Ps <=0) {
            setError("Please fill all fields with valid positive numbers.");
            return;
        }
        if (Ct <= C0) {
            setError("Target CLR must be higher than the initial CLR.");
            return;
        }

        const snfToAdd = (Ct - C0) * 0.25 * V0;
        const smpNeeded = snfToAdd / Ps;
        
        setResult(`To increase CLR from <strong>${C0}</strong> to <strong>${Ct}</strong> in <strong>${V0} L</strong> of milk, you need to add approximately <strong>${smpNeeded.toFixed(2)} kg</strong> of SMP (${inputs.smpSnf}% SNF).`);
    }, [inputs]);

    return (
         <CalculatorCard title="CLR Increase Calculator" description="Calculate the amount of Skimmed Milk Powder (SMP) needed to increase the CLR of a milk batch.">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MemoizedInputField label="Initial Milk Volume (L)" value={inputs.initialVolume} name="initialVolume" setter={handleInputChange} />
                <MemoizedInputField label="Initial CLR" value={inputs.initialClr} name="initialClr" setter={handleInputChange} />
                <MemoizedInputField label="Target CLR" value={inputs.targetClr} name="targetClr" setter={handleInputChange} />
                <MemoizedInputField label="SNF in SMP (%)" value={inputs.smpSnf} name="smpSnf" setter={handleInputChange} />
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate SMP Needed</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {result && <Alert className="mt-4"><AlertTitle>Result</AlertTitle><AlertDescription dangerouslySetInnerHTML={{__html: result}} /></Alert>}
         </CalculatorCard>
    );
}

function FatClrMaintainerCalc() {
    const [inputs, setInputs] = useState({
        V0: '1000',
        Fi: '5.0',
        CLRi: '29.0',
        Fs: '0.1',
        CLRs: '27.0',
        Ft: '3.0'
    });
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((name: string, value: string) => {
        setInputs(prev => ({...prev, [name]: value}));
    }, []);

    const calculate = useCallback(() => {
        setResult(null); setError(null);
        const { V0, Fi, CLRi, Fs, CLRs, Ft } = Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, parseFloat(v)]));

        if (Object.values({ V0, Fi, CLRi, Fs, CLRs, Ft }).some(isNaN)) {
            setError("Please fill all fields with numbers.");
            return;
        }

        const S = (V0 * (Fi - Ft)) / (Ft - Fs);
        const CLRf = ((CLRi * V0) + (CLRs * S)) / (V0 + S);
        const Vf = V0 + S;

        setResult(`To reduce fat to <strong>${Ft}%</strong> while maintaining CLR, you need to add <strong>${S.toFixed(2)} kg/L</strong> of Skim Milk. The final batch will be <strong>${Vf.toFixed(2)} kg/L</strong> with a final CLR of approximately <strong>${CLRf.toFixed(2)}</strong>.`);
    }, [inputs]);

    return (
        <CalculatorCard title="Fat & CLR Maintainer" description="Calculate how much Skim Milk to add to reduce fat while maintaining CLR.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MemoizedInputField label="Initial Milk Volume (V₀)" value={inputs.V0} name="V0" setter={handleInputChange} />
                <MemoizedInputField label="Initial Fat % (Fᵢ)" value={inputs.Fi} name="Fi" setter={handleInputChange} />
                <MemoizedInputField label="Initial CLR (CLRᵢ)" value={inputs.CLRi} name="CLRi" setter={handleInputChange} />
                <MemoizedInputField label="Skim Milk Fat % (Fₛ)" value={inputs.Fs} name="Fs" setter={handleInputChange} />
                <MemoizedInputField label="Skim Milk CLR (CLRₛ)" value={inputs.CLRs} name="CLRs" setter={handleInputChange} />
                <MemoizedInputField label="Target Fat % (Fₜ)" value={inputs.Ft} name="Ft" setter={handleInputChange} />
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {result && <Alert className="mt-4"><AlertTitle>Result</AlertTitle><AlertDescription dangerouslySetInnerHTML={{__html: result}} /></Alert>}
        </CalculatorCard>
    );
}