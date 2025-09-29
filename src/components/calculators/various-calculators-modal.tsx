
      
"use client";

import { useState, memo, useCallback, useEffect, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { componentProps, getSnf } from "@/lib/utils";
import { CheckCircle, PlusCircle, XCircle, Beaker, Thermometer, Weight, Percent, Scaling, Combine, Calculator, FlaskConical, ArrowLeft, RotateCw, Dna, Atom, Droplet, DollarSign, Microscope, Recycle, Bug, ShieldCheck, FileSpreadsheet, Search, Wind } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


type CalculatorType = 'acidity' | 'fat-dry' | 'gravimetric' | 'formulas' | 'cip-strength' | 'protein-casein' | 'minerals' | 'cream' | 'pricing' | 'rm-pv' | 'peroxide-value' | 'salt-percent' | 'ffa-percent' | 'oil-percent';

const calculatorsInfo = {
    'pricing': { title: "Milk Pricing", icon: DollarSign, component: MilkPricingCalculators },
    'rm-pv': { title: "RM & Polenske Value", icon: FlaskConical, component: RMPVCalc },
    'ffa-percent': { title: "FFA % & Acid Value", icon: FlaskConical, component: FfaPercentCalc },
    'peroxide-value': { title: "Peroxide Value", icon: FlaskConical, component: PeroxideValueCalc },
    'salt-percent': { title: "Salt %", icon: FlaskConical, component: SaltPercentCalc },
    'oil-percent': { title: "Oil % (Soxhlet)", icon: FlaskConical, component: OilPercentCalc },
    'acidity': { title: "Acidity", icon: Beaker, component: ProductAcidityCalc },
    'protein-casein': { title: "Protein & Casein", icon: Dna, component: ProteinCaseinCalc },
    'minerals': { title: "Minerals (Na/K)", icon: Atom, component: MineralAnalysisCalc },
    'cream': { title: "Cream", icon: Droplet, component: CreamCalculators },
    'gravimetric': { title: "Gravimetric Analysis", icon: Weight, component: GravimetricAnalysisCalc },
    'cip-strength': { title: "CIP Strength", icon: RotateCw, component: SolutionStrengthCalc },
    'formulas': { title: "Common Formulas", icon: Calculator, component: FormulasTab },
};

export function VariousCalculatorsModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType | null>(null);

  const handleBack = () => setActiveCalculator(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setActiveCalculator(null); // Reset on close
    }
    setIsOpen(open);
  };
  
  const ActiveCalculatorComponent = activeCalculator ? calculatorsInfo[activeCalculator].component : null;
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-full max-h-[90vh] flex flex-col p-0 sm:p-6">
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
                    <DialogTitle className="text-3xl font-bold text-center font-headline">Lab Calculations</DialogTitle>
                    <DialogDescription className="text-center">Choose a calculator from the options below.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-full mt-4 pr-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
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
  );
}

const CalculatorCard = ({ title, children, description }: { title: string; children: React.ReactNode; description?: string }) => (
    <div className="bg-card p-4 rounded-xl shadow-sm border mt-4">
        <h3 className="text-xl font-bold text-primary mb-2 font-headline">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        {children}
    </div>
);


function ProductAcidityCalc() {
    const [activeCalc, setActiveCalc] = useState('check');

    const renderCalculator = () => {
        switch (activeCalc) {
            case 'maintenance':
                return <AcidityMaintenanceCalc />;
            case 'increase':
                return <IncreaseAcidityCalc />;
            case 'check':
            default:
                return <AcidityCheckCalc />;
        }
    };

    return (
        <CalculatorCard title="Acidity Calculators" description="Select a calculator to check, decrease, or increase acidity.">
             <div className="mb-6">
                <Label>Select Calculator</Label>
                <Select value={activeCalc} onValueChange={setActiveCalc}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a calculator" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="check">Acidity Check Calculator</SelectItem>
                        <SelectItem value="maintenance">Acidity Maintenance Calculator (Decrease)</SelectItem>
                        <SelectItem value="increase">Increase Acidity Calculator</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {renderCalculator()}
        </CalculatorCard>
    );
}

const productSampleWeights: Record<string, string> = {
    'milk': '10.0',
    'cream': '10.0',
    'dahi': '10.0',
    'butter': '10.0',
    'other': ''
};

function AcidityCheckCalc() {
    const [productType, setProductType] = useState('milk');
    const [inputs, setInputs] = useState({
        sampleWeight: productSampleWeights.milk,
        titreValue: '',
        naohNormality: '0.1'
    });
    const [result, setResult] = useState<string | null>(null);

    const handleProductChange = (value: string) => {
        setProductType(value);
        setInputs(prev => ({...prev, sampleWeight: productSampleWeights[value] || ''}))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const calculateAcidity = () => {
        const W = parseFloat(inputs.sampleWeight);
        const V = parseFloat(inputs.titreValue);
        const N = parseFloat(inputs.naohNormality);
        if (isNaN(W) || isNaN(V) || isNaN(N) || W <= 0) {
            setResult(null);
            alert("Please enter valid positive numbers for all fields.");
            return;
        }
        const acidity = (9 * V * N) / W;
        setResult(`Calculated Acidity: <strong>${acidity.toFixed(3)}% Lactic Acid</strong>`);
    }
    
    return (
         <div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Select Product</Label>
                  <Select value={productType} onValueChange={handleProductChange}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="milk">Milk</SelectItem>
                      <SelectItem value="cream">Cream</SelectItem>
                      <SelectItem value="dahi">Dahi / Yoghurt</SelectItem>
                      <SelectItem value="butter">Butter</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Sample Weight (g)</Label><Input name="sampleWeight" value={inputs.sampleWeight} onChange={handleInputChange}/></div>
                <div><Label>Titre Value (ml of NaOH)</Label><Input name="titreValue" value={inputs.titreValue} onChange={handleInputChange}/></div>
                <div><Label>Normality of NaOH</Label><Input name="naohNormality" value={inputs.naohNormality} onChange={handleInputChange}/></div>
            </div>
            <Button onClick={calculateAcidity} className="w-full mt-4">Calculate Acidity</Button>
            {result && (
                <Alert className="mt-4">
                    <AlertTitle>Result</AlertTitle>
                    <AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} />
                </Alert>
            )}
        </div>
    );
}


function AcidityMaintenanceCalc() {
    const [inputs, setInputs] = useState({ milkQty: "100", initialAcidity: "0.14", targetAcidity: "0.13" });
    const [results, setResults] = useState<{ naoh: string, na2co3: string, nahco3: string } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}));
    };
    
    const calculate = () => {
        const qty = parseFloat(inputs.milkQty);
        const initial = parseFloat(inputs.initialAcidity);
        const target = parseFloat(inputs.targetAcidity);

        if(isNaN(qty) || isNaN(initial) || isNaN(target) || qty <= 0 || initial <= 0 || target <= 0) {
            alert("Please enter valid positive numbers for all fields.");
            return;
        }

        if (initial <= target) {
            alert("Initial acidity must be higher than the target acidity.");
            return;
        }

        const acidityToNeutralize = initial - target;
        const totalLacticAcidKg = (acidityToNeutralize / 100) * qty;

        // Molecular weights: Lactic Acid (LA) = 90.08, NaOH = 40.00, Na2CO3 = 105.99, NaHCO3 = 84.01
        // Reactions:
        // LA + NaOH -> Na-Lactate + H2O (1:1 molar)
        // 2LA + Na2CO3 -> 2Na-Lactate + H2CO3 (2:1 molar)
        // LA + NaHCO3 -> Na-Lactate + H2CO3 (1:1 molar)

        const molesLA = (totalLacticAcidKg * 1000) / 90.08;

        const gramsNaOH = molesLA * 40.00;
        const gramsNa2CO3 = (molesLA / 2) * 105.99;
        const gramsNaHCO3 = molesLA * 84.01;
        
        setResults({
            naoh: gramsNaOH.toFixed(2),
            na2co3: gramsNa2CO3.toFixed(2),
            nahco3: gramsNaHCO3.toFixed(2),
        });
    }


    return (
        <div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Milk Quantity (kg)</Label><Input name="milkQty" value={inputs.milkQty} onChange={handleInputChange}/></div>
                <div><Label>Initial Acidity (% Lactic Acid)</Label><Input name="initialAcidity" value={inputs.initialAcidity} onChange={handleInputChange}/></div>
                <div><Label>Target Acidity (% Lactic Acid)</Label><Input name="targetAcidity" value={inputs.targetAcidity} onChange={handleInputChange}/></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Neutralizer</Button>
            {results && (
                <Alert className="mt-4">
                    <AlertTitle>Required Neutralizer (in grams)</AlertTitle>
                    <AlertDescription>
                        <Table>
                            <TableBody>
                                <TableRow><TableCell>Sodium Hydroxide (NaOH)</TableCell><TableCell className="text-right font-bold text-lg">{results.naoh} g</TableCell></TableRow>
                                <TableRow><TableCell>Sodium Carbonate (Na₂CO₃)</TableCell><TableCell className="text-right font-bold text-lg">{results.na2co3} g</TableCell></TableRow>
                                <TableRow><TableCell>Sodium Bicarbonate (NaHCO₃)</TableCell><TableCell className="text-right font-bold text-lg">{results.nahco3} g</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}

function IncreaseAcidityCalc() {
    const [inputs, setInputs] = useState({ milkQty: "100", initialAcidity: "0.14", targetAcidity: "0.18" });
    const [results, setResults] = useState<{ lactic: string, citric: string } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({...prev, [e.target.name]: e.target.value}));
    };
    
    const calculate = () => {
        const qty = parseFloat(inputs.milkQty);
        const initial = parseFloat(inputs.initialAcidity);
        const target = parseFloat(inputs.targetAcidity);

        if(isNaN(qty) || isNaN(initial) || isNaN(target) || qty <= 0 || initial < 0 || target <= 0) {
            alert("Please enter valid positive numbers for all fields.");
            return;
        }

        if (target <= initial) {
            alert("Target acidity must be higher than the initial acidity.");
            return;
        }

        const acidityToIncrease = target - initial;
        const totalLacticAcidEquivalentsKg = (acidityToIncrease / 100) * qty;

        // Lactic Acid (MW: 90.08, n-factor: 1)
        const gramsLacticAcid = totalLacticAcidEquivalentsKg * 1000; // Directly add as it's the reference

        // Citric Acid (MW: 192.12, n-factor: 3)
        // Equivalent weight of Citric Acid = 192.12 / 3 = 64.04
        // Equivalent weight of Lactic Acid = 90.08 / 1 = 90.08
        // Grams of Citric = Grams of Lactic * (Eq. Wt. Citric / Eq. Wt. Lactic)
        const gramsCitricAcid = gramsLacticAcid * (64.04 / 90.08);

        setResults({
            lactic: gramsLacticAcid.toFixed(2),
            citric: gramsCitricAcid.toFixed(2)
        });
    }

    return (
        <div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Milk Quantity (kg)</Label><Input name="milkQty" value={inputs.milkQty} onChange={handleInputChange}/></div>
                <div><Label>Initial Acidity (% Lactic Acid)</Label><Input name="initialAcidity" value={inputs.initialAcidity} onChange={handleInputChange}/></div>
                <div><Label>Target Acidity (% Lactic Acid)</Label><Input name="targetAcidity" value={inputs.targetAcidity} onChange={handleInputChange}/></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Acid Required</Button>
            {results && (
                <Alert className="mt-4">
                    <AlertTitle>Required Acid (in grams)</AlertTitle>
                    <AlertDescription>
                        <Table>
                            <TableBody>
                                <TableRow><TableCell>Lactic Acid (C₃H₆O₃)</TableCell><TableCell className="text-right font-bold text-lg">{results.lactic} g</TableCell></TableRow>
                                <TableRow><TableCell>Citric Acid (C₆H₈O₇)</TableCell><TableCell className="text-right font-bold text-lg">{results.citric} g</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}

function PeroxideValueCalc() {
    const [sampleWeight, setSampleWeight] = useState('5.0');
    const [sampleTitre, setSampleTitre] = useState('');
    const [blankTitre, setBlankTitre] = useState('');
    const [normality, setNormality] = useState('0.01');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const W = parseFloat(sampleWeight);
        const S = parseFloat(sampleTitre);
        const B = parseFloat(blankTitre);
        const N = parseFloat(normality);
        if (isNaN(W) || isNaN(S) || isNaN(B) || isNaN(N) || W <= 0) {
            setResult("Please enter valid positive numbers for all fields.");
            return;
        }
        const pv = ((S - B) * N * 1000) / W;
        setResult(`Peroxide Value (PV): <strong>${pv.toFixed(2)} meq/kg</strong>`);
    };

    return (
        <CalculatorCard title="Peroxide Value (PV) Calculator" description="Measures the initial stages of oxidative rancidity in fats and oils.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Sample Weight (g)</Label><Input type="number" value={sampleWeight} onChange={e => setSampleWeight(e.target.value)} /></div>
                <div><Label>Normality of Sodium Thiosulphate</Label><Input type="number" step="0.001" value={normality} onChange={e => setNormality(e.target.value)} /></div>
                <div><Label>Sample Titration Volume (S)</Label><Input type="number" value={sampleTitre} onChange={e => setSampleTitre(e.target.value)} placeholder="ml" /></div>
                <div><Label>Blank Titration Volume (B)</Label><Input type="number" value={blankTitre} onChange={e => setBlankTitre(e.target.value)} placeholder="ml" /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Peroxide Value</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </CalculatorCard>
    );
}

function SaltPercentCalc() {
    const [sampleWeight, setSampleWeight] = useState('2.0');
    const [titrantVolume, setTitrantVolume] = useState('');
    const [normality, setNormality] = useState('0.1');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const W = parseFloat(sampleWeight);
        const V = parseFloat(titrantVolume);
        const N = parseFloat(normality);
        if (isNaN(W) || isNaN(V) || isNaN(N) || W <= 0) {
            setResult("Please enter valid positive numbers for all fields.");
            return;
        }
        const saltPercent = (5.845 * V * N) / W;
        setResult(`Salt Percentage: <strong>${saltPercent.toFixed(2)}%</strong>`);
    };

    return (
        <CalculatorCard title="Salt % Calculator" description="Calculate salt percentage using titration with silver nitrate.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Sample Weight (g)</Label><Input type="number" value={sampleWeight} onChange={e => setSampleWeight(e.target.value)} /></div>
                <div><Label>Volume of AgNO₃ Used (V)</Label><Input type="number" value={titrantVolume} onChange={e => setTitrantVolume(e.target.value)} placeholder="ml" /></div>
                <div><Label>Normality of AgNO₃ (N)</Label><Input type="number" step="0.01" value={normality} onChange={e => setNormality(e.target.value)} /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Salt %</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </CalculatorCard>
    );
}

function FfaPercentCalc() {
    const [sampleWeight, setSampleWeight] = useState('15.0');
    const [titrantVolume, setTitrantVolume] = useState('');
    const [normality, setNormality] = useState('0.1');
    const [result, setResult] = useState<{ ffa: string, acidValue: string } | null>(null);

    const calculate = () => {
        const W = parseFloat(sampleWeight);
        const V = parseFloat(titrantVolume);
        const N = parseFloat(normality);
        if (isNaN(W) || isNaN(V) || isNaN(N) || W <= 0) {
            setResult(null);
            alert("Please enter valid positive numbers for all fields.");
            return;
        }
        const ffaPercent = (28.2 * V * N) / W;
        const acidValue = ffaPercent * 1.99;
        setResult({
            ffa: ffaPercent.toFixed(3),
            acidValue: acidValue.toFixed(3)
        });
    };

    return (
        <CalculatorCard title="Free Fatty Acid (FFA) % Calculator" description="Calculate FFA as oleic acid and the corresponding Acid Value.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Sample Weight (g)</Label><Input type="number" value={sampleWeight} onChange={e => setSampleWeight(e.target.value)} /></div>
                <div><Label>Volume of NaOH Used (V)</Label><Input type="number" value={titrantVolume} onChange={e => setTitrantVolume(e.target.value)} placeholder="ml" /></div>
                <div><Label>Normality of NaOH (N)</Label><Input type="number" step="0.01" value={normality} onChange={e => setNormality(e.target.value)} /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate FFA %</Button>
            {result && (
                <Alert className="mt-4">
                    <AlertTitle>Results</AlertTitle>
                    <AlertDescription className="text-lg font-bold text-center space-y-2 mt-2">
                        <p>FFA as Oleic Acid: <strong>{result.ffa}%</strong></p>
                        <p>Acid Value: <strong>{result.acidValue}</strong></p>
                    </AlertDescription>
                </Alert>
            )}
        </CalculatorCard>
    );
}

function OilPercentCalc() {
    const [w1, setW1] = useState(''); // Empty thimble
    const [w2, setW2] = useState(''); // Thimble + Sample
    const [w4, setW4] = useState(''); // Empty RBF
    const [w5, setW5] = useState(''); // RBF + Oil
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const numW1 = parseFloat(w1);
        const numW2 = parseFloat(w2);
        const numW4 = parseFloat(w4);
        const numW5 = parseFloat(w5);

        if ([numW1, numW2, numW4, numW5].some(isNaN)) {
             setResult("Please enter valid numbers for all weights.");
            return;
        }

        const w3 = numW2 - numW1; // Sample Weight
        const w6 = numW5 - numW4; // Oil Weight

        if (w3 <= 0 || w6 < 0) {
            setResult("Invalid weights. Please check your inputs.");
            return;
        }
        
        const fatPercent = (w6 * 100) / w3;
        setResult(`Oil/Fat Percentage: <strong>${fatPercent.toFixed(2)}%</strong>`);
    };

    return (
        <CalculatorCard title="Oil % Calculator (Soxhlet Method)" description="Calculate oil/fat percentage using weights from the Soxhlet extraction method.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Weight of Empty Thimble (W1)</Label><Input type="number" value={w1} onChange={e => setW1(e.target.value)} placeholder="g" /></div>
                <div><Label>Weight of Thimble + Sample (W2)</Label><Input type="number" value={w2} onChange={e => setW2(e.target.value)} placeholder="g" /></div>
                <div><Label>Weight of Empty R.B. Flask (W4)</Label><Input type="number" value={w4} onChange={e => setW4(e.target.value)} placeholder="g" /></div>
                <div><Label>Weight of Flask + Extracted Oil (W5)</Label><Input type="number" value={w5} onChange={e => setW5(e.target.value)} placeholder="g" /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Oil %</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </CalculatorCard>
    );
}

function MilkPricingCalculators() {
    const [activeTab, setActiveTab] = useState("two-axis");
    return (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="two-axis">Two-Axis Pricing</TabsTrigger>
                <TabsTrigger value="point-based">Point-Based Pricing</TabsTrigger>
            </TabsList>
            <TabsContent value="two-axis" className="pt-4">
                <TwoAxisPricingCalc />
            </TabsContent>
            <TabsContent value="point-based" className="pt-4">
                <PointBasedPricingCalc />
            </TabsContent>
        </Tabs>
    )
}

function RMPVCalc() {
    const [activeCalc, setActiveCalc] = useState('rm-volume');

    const renderCalculator = () => {
        switch (activeCalc) {
            case 'rm-weight':
                return <RMCalcByWeight />;
            case 'pv':
                return <PVCalc />;
            case 'rm-volume':
            default:
                return <RMCalcByVolume />;
        }
    };

    return (
        <CalculatorCard title="RM & Polenske Value Calculators" description="Select a calculator to determine RM or Polenske value.">
             <div className="mb-6">
                <Label>Select Calculator</Label>
                <Select value={activeCalc} onValueChange={setActiveCalc}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a calculator" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rm-volume">RM Value (By Volume)</SelectItem>
                        <SelectItem value="rm-weight">RM Value (By Weight)</SelectItem>
                        <SelectItem value="pv">Polenske Value</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {renderCalculator()}
        </CalculatorCard>
    );
}


function RMCalcByVolume() {
    const [reading, setReading] = useState('');
    const [blank, setBlank] = useState('0.2');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const r = parseFloat(reading);
        const b = parseFloat(blank);
        if (isNaN(r) || isNaN(b)) {
            setResult("Please enter valid numbers for reading and blank.");
            return;
        }
        const rmValue = (r - b) * 1.1;
        setResult(`Reichert-Meissl (RM) Value: <strong>${rmValue.toFixed(2)}</strong>`);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Titration Reading (ml)</Label><Input type="number" value={reading} onChange={e => setReading(e.target.value)} placeholder="e.g., 28.5" /></div>
                <div><Label>Blank Reading (ml)</Label><Input type="number" value={blank} onChange={e => setBlank(e.target.value)} /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate RM Value</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    );
}

function RMCalcByWeight() {
    const [reading, setReading] = useState('');
    const [blank, setBlank] = useState('0.2');
    const [weight, setWeight] = useState('5.0');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const r = parseFloat(reading);
        const b = parseFloat(blank);
        const w = parseFloat(weight);
        if (isNaN(r) || isNaN(b) || isNaN(w) || w <= 0) {
            setResult("Please enter valid numbers for all fields.");
            return;
        }
        const rmValue = ((r - b) * 5.5) / w;
        setResult(`Reichert-Meissl (RM) Value: <strong>${rmValue.toFixed(2)}</strong>`);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Titration Reading (ml)</Label><Input type="number" value={reading} onChange={e => setReading(e.target.value)} placeholder="e.g., 28.5" /></div>
                <div><Label>Blank Reading (ml)</Label><Input type="number" value={blank} onChange={e => setBlank(e.target.value)} /></div>
                <div><Label>Sample Weight (g)</Label><Input type="number" value={weight} onChange={e => setWeight(e.target.value)} /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate RM Value</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    );
}

function PVCalc() {
    const [reading, setReading] = useState('');
    const [blank, setBlank] = useState('0.1');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const r = parseFloat(reading);
        const b = parseFloat(blank);
        if (isNaN(r) || isNaN(b)) {
            setResult("Please enter valid numbers for reading and blank.");
            return;
        }
        const pvValue = r - b;
        setResult(`Polenske Value (PV): <strong>${pvValue.toFixed(2)}</strong>`);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Titration Reading (ml)</Label><Input type="number" value={reading} onChange={e => setReading(e.target.value)} placeholder="e.g., 1.5" /></div>
                <div><Label>Blank Reading (ml)</Label><Input type="number" value={blank} onChange={e => setBlank(e.target.value)} /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Polenske Value</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    );
}


function TwoAxisPricingCalc() {
    const [inputs, setInputs] = useState({
        fatPercent: '4.5',
        clr: '28',
        fatRate: '300',
        snfRate: '200'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({...prev, [name]: value}));
    };
    
    const results = useMemo(() => {
        const fat = parseFloat(inputs.fatPercent) || 0;
        const clr = parseFloat(inputs.clr) || 0;
        const fatRate = parseFloat(inputs.fatRate) || 0;
        const snfRate = parseFloat(inputs.snfRate) || 0;

        if (fat <= 0 || clr <= 0 || fatRate <= 0 || snfRate <= 0) {
            return null;
        }

        const snf = getSnf(fat, clr);
        const pricePerKg = ((fat / 100) * fatRate) + ((snf / 100) * snfRate);
        const pricePerLitre = pricePerKg * componentProps.milkDensity;

        return {
            snf: snf.toFixed(2),
            pricePerKg: pricePerKg.toFixed(2),
            pricePerLitre: pricePerLitre.toFixed(2)
        };
    }, [inputs]);

    return (
        <CalculatorCard title="Milk Pricing Calculator (Two-Axis)" description="Calculate the price of milk based on its Fat and SNF content, a standard industry practice.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                    <h3 className="font-semibold text-gray-700 font-headline">Milk Composition</h3>
                    <div><Label>Fat %</Label><Input type="number" name="fatPercent" value={inputs.fatPercent} onChange={handleInputChange} placeholder="e.g., 4.5" /></div>
                    <div><Label>CLR (Corrected Lactometer Reading)</Label><Input type="number" name="clr" value={inputs.clr} onChange={handleInputChange} placeholder="e.g., 28.0" /></div>
                </div>
                 <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-3">
                    <h3 className="font-semibold text-gray-700 font-headline">Market Rates (per Kg)</h3>
                    <div><Label>Fat Rate (₹ per Kg)</Label><Input type="number" name="fatRate" value={inputs.fatRate} onChange={handleInputChange} placeholder="e.g., 300" /></div>
                    <div><Label>SNF Rate (₹ per Kg)</Label><Input type="number" name="snfRate" value={inputs.snfRate} onChange={handleInputChange} placeholder="e.g., 200" /></div>
                </div>
            </div>
            
            {results && (
                <Alert className="mt-6 bg-green-50 border-green-200">
                    <AlertTitle className="text-xl font-bold text-green-800">Calculated Price</AlertTitle>
                    <AlertDescription>
                        <div className="mt-2 text-lg space-y-2 text-gray-800">
                            <p>Calculated SNF: <strong className="text-gray-900">{results.snf}%</strong></p>
                            <hr className="my-2" />
                            <p>Price per Kg: <strong className="text-2xl text-green-700">₹ {results.pricePerKg}</strong></p>
                            <p>Price per Litre: <strong className="text-2xl text-green-700">₹ {results.pricePerLitre}</strong></p>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
        </CalculatorCard>
    );
}

function PointBasedPricingCalc() {
    const [inputs, setInputs] = useState({
        fatPercent: '4.5',
        clr: '28',
        ratePerFat: '7.0',
        ratePerClr: '3.0'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({...prev, [name]: value}));
    };

    const results = useMemo(() => {
        const fat = parseFloat(inputs.fatPercent) || 0;
        const clr = parseFloat(inputs.clr) || 0;
        const ratePerFat = parseFloat(inputs.ratePerFat) || 0;
        const ratePerClr = parseFloat(inputs.ratePerClr) || 0;

        if (fat <= 0 || clr <= 0 || ratePerFat <= 0 || ratePerClr <= 0) {
            return null;
        }

        const snf = getSnf(fat, clr); // Still useful to show
        const pricePerLitre = (fat * ratePerFat) + (clr * ratePerClr); // Direct calculation
        const pricePerKg = pricePerLitre / componentProps.milkDensity;

        return {
            snf: snf.toFixed(2),
            pricePerLitre: pricePerLitre.toFixed(2),
            pricePerKg: pricePerKg.toFixed(2)
        };
    }, [inputs]);

    return (
        <CalculatorCard title="Milk Pricing Calculator (Point-Based)" description="Calculate milk price based on rates per point of Fat and CLR. This method is common at collection centers.">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                    <h3 className="font-semibold text-gray-700 font-headline">Milk Composition</h3>
                    <div><Label>Fat %</Label><Input type="number" name="fatPercent" value={inputs.fatPercent} onChange={handleInputChange} placeholder="e.g., 4.5" /></div>
                    <div><Label>CLR (Corrected Lactometer Reading)</Label><Input type="number" name="clr" value={inputs.clr} onChange={handleInputChange} placeholder="e.g., 28.0" /></div>
                </div>
                 <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-3">
                    <h3 className="font-semibold text-gray-700 font-headline">Point Rates (per Litre)</h3>
                    <div><Label>Rate per Fat Point (₹)</Label><Input type="number" name="ratePerFat" value={inputs.ratePerFat} onChange={handleInputChange} placeholder="e.g., 7.0" /></div>
                    <div><Label>Rate per CLR Point (₹)</Label><Input type="number" name="ratePerClr" value={inputs.ratePerClr} onChange={handleInputChange} placeholder="e.g., 3.0" /></div>
                </div>
            </div>
            
            {results && (
                <Alert className="mt-6 bg-green-50 border-green-200">
                    <AlertTitle className="text-xl font-bold text-green-800">Calculated Price</AlertTitle>
                    <AlertDescription>
                        <div className="mt-2 text-lg space-y-2 text-gray-800">
                            <p>Calculated SNF (for reference): <strong className="text-gray-900">{results.snf}%</strong></p>
                            <hr className="my-2" />
                            <p>Price per Litre: <strong className="text-2xl text-green-700">₹ {results.pricePerLitre}</strong></p>
                             <p>Price per Kg: <strong className="text-2xl text-green-700">₹ {results.pricePerKg}</strong></p>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
        </CalculatorCard>
    );
}


function CreamCalculators() {
    const [activeCalc, setActiveCalc] = useState('cream-dilution');

    const renderCalculator = () => {
        switch (activeCalc) {
            case 'fat-percent':
                return <CreamFatCalc />;
            case 'actual-snf':
                return <ActualCreamSnfCalc />;
            case 'cream-dilution':
            default:
                return <CreamDilutionCalc />;
        }
    };
    
    return (
        <CalculatorCard title="Cream Calculators" description="Select a calculator for cream-related analysis.">
            <div className="mb-6">
                <Label>Select Calculator</Label>
                <Select value={activeCalc} onValueChange={setActiveCalc}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a calculator" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cream-dilution">Cream Dilution (by Water)</SelectItem>
                        <SelectItem value="fat-percent">Fat %</SelectItem>
                        <SelectItem value="actual-snf">Actual SNF</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {renderCalculator()}
        </CalculatorCard>
    );
}

function CreamFatCalc() {
    const [reading, setReading] = useState('');
    const [weight, setWeight] = useState('5');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const r = parseFloat(reading);
        const w = parseFloat(weight);
        if (isNaN(r) || isNaN(w) || w <= 0) {
            setResult("Please enter valid numbers for reading and weight.");
            return;
        }
        const fatPercent = (r * 11.25) / w;
        setResult(`Cream Fat: <strong>${fatPercent.toFixed(2)}%</strong>`);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Butyrometer Reading</Label><Input type="number" value={reading} onChange={e => setReading(e.target.value)} placeholder="e.g., 8.0" /></div>
                <div><Label>Sample Weight (g)</Label><Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g., 5" /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Fat %</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    );
}

function ActualCreamSnfCalc() {
    const [ts, setTs] = useState('');
    const [fat, setFat] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const totalSolids = parseFloat(ts);
        const fatPercent = parseFloat(fat);
        if (isNaN(totalSolids) || isNaN(fatPercent)) {
            setResult("Please enter valid numbers for TS and Fat.");
            return;
        }
        if (fatPercent > totalSolids) {
            setResult("Fat % cannot be greater than Total Solids %.");
            return;
        }
        const snfPercent = totalSolids - fatPercent;
        setResult(`Actual Cream SNF: <strong>${snfPercent.toFixed(2)}%</strong>`);
    };
    
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Total Solids (TS) %</Label><Input type="number" value={ts} onChange={e => setTs(e.target.value)} placeholder="e.g., 45.5" /></div>
                <div><Label>Fat %</Label><Input type="number" value={fat} onChange={e => setFat(e.target.value)} placeholder="e.g., 40.0" /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate SNF %</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    );
}

function CreamDilutionCalc() {
    const [inputs, setInputs] = useState({
        initialQty: '100',
        initialFat: '40',
        targetFat: '30'
    });
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({...prev, [name]: value}));
    }, []);

    const calculate = useCallback(() => {
        setResult(null);
        setError(null);

        const initialQty = parseFloat(inputs.initialQty);
        const initialFat = parseFloat(inputs.initialFat);
        const targetFat = parseFloat(inputs.targetFat);

        if ([initialQty, initialFat, targetFat].some(isNaN) || initialQty <= 0) {
            setError("Please fill all fields with valid positive numbers.");
            return;
        }

        if (initialFat <= targetFat) {
            setError("Target Fat % must be lower than the Initial Fat %.");
            return;
        }
        if (targetFat <= 0) {
             setError("Target Fat % must be a positive number.");
            return;
        }

        const waterToAdd = initialQty * (initialFat / targetFat - 1);
        const finalVolume = initialQty + waterToAdd;

        setResult(`To dilute <strong>${initialQty} kg</strong> of <strong>${initialFat}%</strong> fat cream to <strong>${targetFat}%</strong>, you need to add:<br/><strong class="text-green-700 text-xl">${waterToAdd.toFixed(2)} kg</strong> of Water.<br/>The final volume will be <strong>${finalVolume.toFixed(2)} kg</strong>.`);
    }, [inputs]);

    return (
        <div>
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                 <div>
                    <Label htmlFor="initialQty">Initial Cream Quantity (kg)</Label>
                    <Input id="initialQty" name="initialQty" type="number" value={inputs.initialQty} onChange={handleInputChange} />
                 </div>
                 <div>
                    <Label htmlFor="initialFat">Initial Cream Fat %</Label>
                    <Input id="initialFat" name="initialFat" type="number" value={inputs.initialFat} onChange={handleInputChange} />
                 </div>
                 <div>
                    <Label htmlFor="targetFat">Target Cream Fat %</Label>
                    <Input id="targetFat" name="targetFat" type="number" value={inputs.targetFat} onChange={handleInputChange} />
                 </div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Water to Add</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {result && <Alert className="mt-4"><AlertTitle>Result</AlertTitle><AlertDescription dangerouslySetInnerHTML={{__html: result}} /></Alert>}
        </div>
    );
}


function MineralAnalysisCalc() {
    const [mineral, setMineral] = useState<'sodium' | 'potassium'>('sodium');
    const [stdConc, setStdConc] = useState('10');
    const [stdReading, setStdReading] = useState('');
    const [sampleReading, setSampleReading] = useState('');
    const [dilutionFactor, setDilutionFactor] = useState('100');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const stdC = parseFloat(stdConc);
        const stdR = parseFloat(stdReading);
        const sampleR = parseFloat(sampleReading);
        const dilution = parseFloat(dilutionFactor);

        if (isNaN(stdC) || isNaN(stdR) || isNaN(sampleR) || isNaN(dilution) || stdR <= 0 || dilution <= 0) {
            setResult("Please enter valid positive numbers for all fields.");
            return;
        }

        const factor = stdC / stdR;
        const dilutedConcentration = sampleR * factor;
        const finalConcentration = dilutedConcentration * dilution;

        setResult(`Estimated ${mineral === 'sodium' ? 'Sodium' : 'Potassium'} Content: <strong>${finalConcentration.toFixed(2)} ppm</strong>`);
    };

    return (
        <CalculatorCard title="Sodium & Potassium Analysis (Flame Photometry)" description="Estimate Sodium (Na) and Potassium (K) content in milk using flame photometer readings. This calculator accounts for sample dilution during preparation.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label>Select Mineral</Label>
                    <Select value={mineral} onValueChange={(val) => setMineral(val as any)}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sodium">Sodium (Na)</SelectItem>
                            <SelectItem value="potassium">Potassium (K)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                     <Label>Sample Dilution Factor</Label>
                     <Input type="number" value={dilutionFactor} onChange={e => setDilutionFactor(e.target.value)} placeholder="e.g., 100"/>
                </div> 
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold text-gray-700 font-headline">Standard Calibration</h4>
                    <div><Label>Standard Concentration (ppm)</Label><Input type="number" value={stdConc} onChange={e => setStdConc(e.target.value)} /></div>
                    <div><Label>Standard Reading</Label><Input type="number" value={stdReading} onChange={e => setStdReading(e.target.value)} placeholder="e.g., 50"/></div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg space-y-3">
                     <h4 className="font-semibold text-gray-700 font-headline">Milk Sample</h4>
                    <div><Label>Sample Reading</Label><Input type="number" value={sampleReading} onChange={e => setSampleReading(e.target.value)} placeholder="e.g., 25" /></div>
                </div>
            </div>
             <Button onClick={calculate} className="w-full mt-6">Calculate Mineral Content</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </CalculatorCard>
    );
}


function ProteinCaseinCalc() {
    const [activeCalc, setActiveCalc] = useState<'kjeldahl' | 'formol' | 'casein-titration' | 'casein-factor' | 'protein-factor'>('kjeldahl');

    const renderCalculator = () => {
        switch (activeCalc) {
            case 'formol': return <FormolTitrationCalc />;
            case 'casein-titration': return <CaseinTitrationCalc />;
            case 'casein-factor': return <CaseinFromProteinCalc />;
            case 'protein-factor': return <ProteinFromCaseinCalc />;
            case 'kjeldahl':
            default: return <KjeldahlProteinCalc />;
        }
    };

    return (
        <CalculatorCard title="Protein & Casein Calculators" description="Select a method to estimate protein or casein content.">
             <div className="mb-6">
                <Label>Select Calculator</Label>
                <Select value={activeCalc} onValueChange={(val) => setActiveCalc(val as any)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="kjeldahl">Kjeldahl Protein</SelectItem>
                        <SelectItem value="formol">Formol Protein</SelectItem>
                        <SelectItem value="casein-titration">Casein (Titration)</SelectItem>
                        <SelectItem value="casein-factor">Casein (from Protein)</SelectItem>
                        <SelectItem value="protein-factor">Protein (from Casein)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {renderCalculator()}
        </CalculatorCard>
    );
}


function KjeldahlProteinCalc() {
    const [sampleWeight, setSampleWeight] = useState('5');
    const [sampleTitre, setSampleTitre] = useState('');
    const [blankTitre, setBlankTitre] = useState('0.1');
    const [acidNormality, setAcidNormality] = useState('0.1');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const W = parseFloat(sampleWeight);
        const Vs = parseFloat(sampleTitre);
        const Vb = parseFloat(blankTitre);
        const N = parseFloat(acidNormality);
        if (isNaN(W) || isNaN(Vs) || isNaN(Vb) || isNaN(N) || W <= 0) {
            setResult("Please enter valid positive numbers for all fields.");
            return;
        }
        const nitrogenPercent = ( (Vs - Vb) * N * 1.4007 ) / W;
        const proteinPercent = nitrogenPercent * 6.38; // Factor for milk
        setResult(`Total Nitrogen: <strong>${nitrogenPercent.toFixed(4)}%</strong><br/>Crude Protein: <strong>${proteinPercent.toFixed(2)}%</strong>`);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Sample Weight (g)</Label><Input type="number" value={sampleWeight} onChange={e => setSampleWeight(e.target.value)} /></div>
                <div><Label>Normality of HCl/H₂SO₄</Label><Input type="number" step="0.01" value={acidNormality} onChange={e => setAcidNormality(e.target.value)} /></div>
                <div><Label>Sample Titre Value (ml)</Label><Input type="number" value={sampleTitre} onChange={e => setSampleTitre(e.target.value)} placeholder="e.g., 8.5" /></div>
                <div><Label>Blank Titre Value (ml)</Label><Input type="number" value={blankTitre} onChange={e => setBlankTitre(e.target.value)} placeholder="e.g., 0.1" /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Protein %</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    );
}

function FormolTitrationCalc() {
    const [initialTitre, setInitialTitre] = useState('');
    const [finalTitre, setFinalTitre] = useState('');
    const [factor, setFactor] = useState('1.7');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const v1 = parseFloat(initialTitre);
        const v2 = parseFloat(finalTitre);
        const f = parseFloat(factor);
        if (isNaN(v1) || isNaN(v2) || isNaN(f)) {
            setResult("Please enter valid numbers for all fields.");
            return;
        }
        const proteinPercent = (v2 - v1) * f;
        setResult(`Estimated Protein: <strong>${proteinPercent.toFixed(2)}%</strong>`);
    };
    
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Initial Titre (V₁)</Label><Input type="number" value={initialTitre} onChange={e => setInitialTitre(e.target.value)} placeholder="Titre before formaldehyde" /></div>
                <div><Label>Final Titre (V₂)</Label><Input type="number" value={finalTitre} onChange={e => setFinalTitre(e.target.value)} placeholder="Titre after formaldehyde" /></div>
                <div><Label>Formol Factor</Label><Input type="number" value={factor} onChange={e => setFactor(e.target.value)} /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Protein %</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    );
}

function CaseinTitrationCalc() {
    const [sampleWeight, setSampleWeight] = useState('10');
    const [sampleTitre, setSampleTitre] = useState('');
    const [blankTitre, setBlankTitre] = useState('0.1');
    const [acidNormality, setAcidNormality] = useState('0.1');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const W = parseFloat(sampleWeight);
        const Vs = parseFloat(sampleTitre);
        const Vb = parseFloat(blankTitre);
        const N = parseFloat(acidNormality);
        if (isNaN(W) || isNaN(Vs) || isNaN(Vb) || isNaN(N) || W <= 0) {
            setResult("Please enter valid positive numbers for all fields.");
            return;
        }
        // Calculation based on Kjeldahl method for nitrogen content of casein precipitate
        const nitrogenPercent = ( (Vs - Vb) * N * 1.4007 ) / W;
        const caseinPercent = nitrogenPercent * 6.38;
        setResult(`Estimated Casein: <strong>${caseinPercent.toFixed(2)}%</strong>`);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Sample Weight (g)</Label><Input type="number" value={sampleWeight} onChange={e => setSampleWeight(e.target.value)} placeholder="e.g., 10" /></div>
                <div><Label>Normality of HCl/H₂SO₄</Label><Input type="number" step="0.01" value={acidNormality} onChange={e => setAcidNormality(e.target.value)} placeholder="e.g., 0.1" /></div>
                <div><Label>Sample Titre Value (ml)</Label><Input type="number" value={sampleTitre} onChange={e => setSampleTitre(e.target.value)} placeholder="e.g., 2.5" /></div>
                <div><Label>Blank Titre Value (ml)</Label><Input type="number" value={blankTitre} onChange={e => setBlankTitre(e.target.value)} placeholder="e.g., 0.1" /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate Casein %</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    );
}

function CaseinFromProteinCalc() {
    const [protein, setProtein] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const p = parseFloat(protein);
        if (isNaN(p)) {
            setResult("Please enter a valid protein percentage.");
            return;
        }
        // On average, casein is about 78-82% of total protein in cow's milk. Using a factor of 0.8.
        const caseinPercent = p * 0.8;
        setResult(`Estimated Casein: <strong>~${caseinPercent.toFixed(2)}%</strong>`);
    };

    return (
        <div>
            <div><Label>Total Protein %</Label><Input type="number" value={protein} onChange={e => setProtein(e.target.value)} placeholder="e.g., 3.4" /></div>
            <Button onClick={calculate} className="w-full mt-4">Estimate Casein %</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    );
}

function ProteinFromCaseinCalc() {
    const [casein, setCasein] = useState('');
    const [result, setResult] = useState<string | null>(null);

    const calculate = () => {
        const c = parseFloat(casein);
        if (isNaN(c)) {
            setResult("Please enter a valid casein percentage.");
            return;
        }
        // Protein = Casein / 0.8 or Casein * 1.25
        const proteinPercent = c / 0.8;
        setResult(`Estimated Total Protein: <strong>~${proteinPercent.toFixed(2)}%</strong>`);
    };

    return (
        <div>
            <div><Label>Casein %</Label><Input type="number" value={casein} onChange={e => setCasein(e.target.value)} placeholder="e.g., 2.7" /></div>
            <Button onClick={calculate} className="w-full mt-4">Estimate Protein %</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    );
}


function GravimetricAnalysisCalc() {
    const [activeCalc, setActiveCalc] = useState('moisture-ts');

    const renderCalculator = () => {
        switch (activeCalc) {
            case 'ash': return <AshCalc />;
            case 'fat-on-dry-basis': return <FatOnDryBasisCalc />;
            case 'moisture-ts':
            default: return <MoistureTsCalc />;
        }
    };

    return (
        <CalculatorCard title="Gravimetric Analysis" description="Select a calculator for gravimetric analysis.">
            <div className="mb-6">
                <Label>Select Calculator</Label>
                <Select value={activeCalc} onValueChange={setActiveCalc}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a calculator" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="moisture-ts">Moisture & Total Solids (TS)</SelectItem>
                        <SelectItem value="ash">Ash Percentage</SelectItem>
                        <SelectItem value="fat-on-dry-basis">Fat on Dry Basis</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {renderCalculator()}
        </CalculatorCard>
    );
}

function MoistureTsCalc() {
    const [w1, setW1] = useState(''); // Empty Dish
    const [w2, setW2] = useState(''); // Dish + Sample
    const [w3, setW3] = useState(''); // Dish + Dried
    const [results, setResults] = useState<{ moisture: string; ts: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        const numW1 = parseFloat(w1);
        const numW2 = parseFloat(w2);
        const numW3 = parseFloat(w3);

        setError(null);
        setResults(null);
        
        if ([numW1, numW2, numW3].some(isNaN) || numW2 <= numW1 || numW3 < numW1) {
            setError("Please enter valid weights. W2 > W1 and W3 >= W1 must be true.");
            return;
        }

        const sampleWeight = numW2 - numW1;
        const moistureWeight = numW2 - numW3;
        const moisture = (moistureWeight / sampleWeight) * 100;
        const ts = 100 - moisture;

        setResults({ moisture: moisture.toFixed(2), ts: ts.toFixed(2) });
    };

    return (
        <div>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label>Empty Dish Weight (W₁)</Label><Input type="number" value={w1} onChange={e => setW1(e.target.value)} placeholder="g" /></div>
                    <div><Label>Dish + Sample Weight (W₂)</Label><Input type="number" value={w2} onChange={e => setW2(e.target.value)} placeholder="g" /></div>
                    <div><Label>Dish + Dried Sample Weight (W₃)</Label><Input type="number" value={w3} onChange={e => setW3(e.target.value)} placeholder="g" /></div>
                </div>
            </div>
            <Button onClick={handleCalculate} className="w-full mt-4">Calculate Moisture & TS</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {results && (
                 <Alert className="mt-4">
                    <AlertTitle>Analysis Results</AlertTitle>
                    <AlertDescription>
                        <Table>
                            <TableBody>
                                 <TableRow><TableCell className="font-medium">Moisture</TableCell><TableCell className="text-right font-bold">{results.moisture} %</TableCell></TableRow>
                                 <TableRow><TableCell className="font-medium">Total Solids (TS)</TableCell><TableCell className="text-right font-bold">{results.ts} %</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}

function AshCalc() {
    const [w1, setW1] = useState(''); // Empty Crucible
    const [w2, setW2] = useState(''); // Crucible + Sample
    const [w3, setW3] = useState(''); // Crucible + Ash
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        const numW1 = parseFloat(w1);
        const numW2 = parseFloat(w2);
        const numW3 = parseFloat(w3);
        
        setError(null);
        setResult(null);

        if ([numW1, numW2, numW3].some(isNaN) || numW2 <= numW1 || numW3 < numW1) {
            setError("Please enter valid weights. W2 > W1 and W3 >= W1 must be true.");
            return;
        }

        const sampleWeight = numW2 - numW1;
        const ashWeight = numW3 - numW1;
        const ashPercent = (ashWeight / sampleWeight) * 100;
        
        setResult(`Ash Percentage: <strong>${ashPercent.toFixed(2)}%</strong>`);
    };

    return (
        <div>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label>Empty Crucible Weight (W₁)</Label><Input type="number" value={w1} onChange={e => setW1(e.target.value)} placeholder="g" /></div>
                    <div><Label>Crucible + Sample Weight (W₂)</Label><Input type="number" value={w2} onChange={e => setW2(e.target.value)} placeholder="g" /></div>
                    <div><Label>Crucible + Ash Weight (W₃)</Label><Input type="number" value={w3} onChange={e => setW3(e.target.value)} placeholder="g" /></div>
                </div>
            </div>
            <Button onClick={handleCalculate} className="w-full mt-4">Calculate Ash %</Button>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    );
}

function FatOnDryBasisCalc() {
    const [fatPercent, setFatPercent] = useState('');
    const [moisturePercent, setMoisturePercent] = useState('');
    const [result, setResult] = useState<string | null>(null);
    
    const calculate = () => {
        const fat = parseFloat(fatPercent);
        const moisture = parseFloat(moisturePercent);
        if (isNaN(fat) || isNaN(moisture)) {
            setResult("Please enter valid numbers for fat and moisture.");
            return;
        }
        if (moisture >= 100) {
            setResult("Moisture content must be less than 100%.");
            return;
        }
        const totalSolids = 100 - moisture;
        const fatOnDryBasis = (fat / totalSolids) * 100;
        setResult(`Fat % on Dry Basis: <strong>${fatOnDryBasis.toFixed(2)}%</strong>`);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Fat % in Product (as is)</Label><Input type="number" value={fatPercent} onChange={e => setFatPercent(e.target.value)} placeholder="e.g., 25" /></div>
                <div><Label>Moisture % in Product</Label><Input type="number" value={moisturePercent} onChange={e => setMoisturePercent(e.target.value)} placeholder="e.g., 55" /></div>
            </div>
            <Button onClick={calculate} className="w-full mt-4">Calculate</Button>
            {result && <Alert className="mt-4"><AlertDescription className="text-lg font-bold text-center" dangerouslySetInnerHTML={{ __html: result }} /></Alert>}
        </div>
    )
}


function FormulasTab() {
    return (
        <div className="space-y-6">
            <CalculatorCard title="SNF Calculation (Richmond's Formula)">
                <p className="font-mono text-sm text-blue-900 mt-2">SNF % = (CLR / 4) + (0.25 * Fat %) + Correction_Factor</p>
                <p className="text-xs mt-2">Correction Factor: Cow Milk = 0.72, Buffalo Milk = 0.85</p>
            </CalculatorCard>
             <CalculatorCard title="CLR Correction Formula">
                <p className="font-mono text-sm text-green-900 mt-2">Corrected CLR = Observed_LR + (Milk_Temp_°C - 27) * 0.2</p>
            </CalculatorCard>
             <CalculatorCard title="Pearson Square (Blending)">
                <p className="font-mono text-sm text-purple-900 mt-2">Parts_High = Target - Low</p>
                <p className="font-mono text-sm text-purple-900">Parts_Low = High - Target</p>
                <p className="text-xs mt-2">Qty_High = (Total_Qty * Parts_High) / (Parts_High + Parts_Low)</p>
            </CalculatorCard>
             <CalculatorCard title="Component Quantity Calculation">
                 <p className="font-mono text-sm text-yellow-900 mt-2">Milk Weight (Kg) = Milk_Liters * 1.03</p>
                <p className="font-mono text-sm text-yellow-900">Fat_Kg = Milk_Weight * (Fat % / 100)</p>
                 <p className="font-mono text-sm text-yellow-900">SNF_Kg = Milk_Weight * (SNF % / 100)</p>
            </CalculatorCard>
             <CalculatorCard title="Common Conversion Factors">
                 <Table className="mt-2 text-sm">
                     <TableBody>
                        <TableRow><TableCell className="font-medium">1 Liter Milk</TableCell><TableCell>approx. 1.03 Kg</TableCell></TableRow>
                        <TableRow><TableCell className="font-medium">1 Kg Milk</TableCell><TableCell>approx. 0.97 Liters</TableCell></TableRow>
                        <TableRow><TableCell className="font-medium">Kg to Grams</TableCell><TableCell>Multiply by 1000</TableCell></TableRow>
                        <TableRow><TableCell className="font-medium">Liters to Milliliters</TableCell><TableCell>Multiply by 1000</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CalculatorCard>
        </div>
    )
}

function SolutionStrengthCalc() {
    const { toast } = useToast();
    const [activeCalc, setActiveCalc] = useState('naoh');
    const [titreValue, setTitreValue] = useState("");
    const [result, setResult] = useState<string | null>(null);

    const calculatorInfo = {
        naoh: { label: "0.1 N Acid Used (ml)", formula: (titre: number) => `Caustic Soda (NaOH): ${(titre * 0.4).toFixed(3)}%`, description: "Titrate a 10ml sample of the CIP solution with 0.1 N acid (e.g., HCl) using phenolphthalein indicator." },
        hno3: { label: "0.1 N Base Used (ml)", formula: (titre: number) => `Nitric Acid (HNO₃): ${(titre * 0.63).toFixed(3)}%`, description: "Titrate a 10ml sample of the CIP solution with 0.1 N base (e.g., NaOH) using phenolphthalein indicator." },
        h3po4: { label: "0.1 N Base Used (ml)", formula: (titre: number) => `Phosphoric Acid (H₃PO₄): ${(titre * 0.49).toFixed(3)}%`, description: "Titrate a 10ml sample of the CIP solution with 0.1 N base (e.g., NaOH) using phenolphthalein indicator." },
        chlorine: { label: "0.01 N Sodium Thiosulphate Used (ml)", formula: (titre: number) => `Available Chlorine: ${(titre * 35.45).toFixed(2)} ppm`, description: "Titrate a 100ml sample of the CIP solution using the iodometric titration method with 0.01 N Sodium Thiosulphate." }
    };
    
    const currentCalc = calculatorInfo[activeCalc as keyof typeof calculatorInfo];

    const handleCalc = () => {
        const titre = parseFloat(titreValue);
        if (isNaN(titre) || titre < 0) {
            toast({ variant: 'destructive', title: "Error", description: "Please enter a valid titre value." });
            setResult(null);
            return;
        }
        const calcResult = currentCalc.formula(titre);
        setResult(calcResult);
        toast({ title: "Calculated Successfully", description: calcResult });
    }

    const handleSelectChange = (value: string) => {
        setActiveCalc(value);
        setTitreValue("");
        setResult(null);
    }
    
    return (
        <CalculatorCard title="CIP Solution Strength Calculator" description="Check the strength of common Cleaning-In-Place solutions.">
             <div className="mb-6">
                <Label>Select CIP Solution</Label>
                <Select value={activeCalc} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a solution" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="naoh">NaOH (%)</SelectItem>
                        <SelectItem value="hno3">HNO₃ (%)</SelectItem>
                        <SelectItem value="h3po4">H₃PO₄ (%)</SelectItem>
                        <SelectItem value="chlorine">Chlorine (ppm)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {currentCalc && (
                <div>
                    <p className="text-sm text-muted-foreground mb-4">{currentCalc.description}</p>
                    <div><Label>{currentCalc.label}</Label><Input type="number" value={titreValue} onChange={e => setTitreValue(e.target.value)} placeholder="e.g., 2.5"/></div>
                    <Button onClick={handleCalc} className="w-full mt-4">Calculate Strength</Button>
                    {result && <Alert className="mt-4"><AlertDescription className="font-bold text-center">{result}</AlertDescription></Alert>}
                </div>
            )}
        </CalculatorCard>
    );
}


    

