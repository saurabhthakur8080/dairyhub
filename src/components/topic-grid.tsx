"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Factory,
  FlaskConical,
  Beaker,
  Scale,
  Calculator,
  Settings,
  Users,
  TestTube,
  ClipboardCheck,
  CheckSquare,
  Droplet,
  PackageCheck,
  Lock,
  DollarSign,
  Microscope,
  Recycle,
  Bug,
  ShieldCheck,
  FileSpreadsheet,
  Search,
  Wind,
  GraduationCap,
  Atom,
  Combine,
  ShieldAlert,
} from "lucide-react";
import { PaneerIcon, IceCreamIcon, ReagentIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// सभी Modals को इम्पोर्ट करें
import { DairyIndustryModal } from "./info-modals/dairy-industry-modal";
import { MilkChemistryModal } from "./info-modals/milk-chemistry-modal";
import { AdulterationModal } from "./info-modals/adulteration-modal";
import { StandardizationIModal } from "./calculators/standardization-i-modal";
import { StandardizationIIModal } from "./calculators/standardization-ii-modal";
import { SolutionsPrepModal } from "./calculators/solutions-prep-modal";
import { PaneerProcessingModal } from "./info-modals/paneer-processing-modal";
import { DairyProcessingModal } from "./info-modals/dairy-processing-modal";
import { AboutUsModal } from "./info-modals/about-us-modal";
import { CompositionalAnalysisModal } from "./info-modals/compositional-analysis-modal";
import { CalibrationStandardizationModal } from "./info-modals/calibration-standardization-modal";
import { QualityConceptModal } from "./info-modals/quality-concept-modal";
import { WaterTestingModal } from "./info-modals/water-testing-modal";
import { PackagingMaterialTestingModal } from "./info-modals/packaging-material-testing-modal";
import { LabEquipmentsModal } from "./info-modals/lab-equipments-modal";
import { CipProcessModal } from "./info-modals/cip-process-modal";
import { MicrobiologyTestingModal } from "./info-modals/microbiology-testing-modal";
import { MilkHandlingPreservationModal } from "./info-modals/milk-handling-preservation-modal";
import { FssaiStandardsModal } from "./info-modals/fssai-standards-modal";
import { VariousCalculatorsModal } from "./calculators/various-calculators-modal";
import { FermentedProductsModal } from "./info-modals/fermented-products-modal";
import { EvaporationDryingModal } from "./info-modals/evaporation-drying-modal";
import { AuditsModal } from "./info-modals/audits-modal";
import { ValidationVerificationModal } from "./info-modals/validation-verification-modal";
import { EtpModal } from "./info-modals/etp-modal";
import { IceCreamProductionModal } from "./info-modals/ice-cream-production-modal";
import { ExpertSupportModal } from "./info-modals/expert-support-modal";
import { ProductionCalculationsModal } from "./calculators/production-calculations-modal";
import { PlantCostModal } from "./calculators/plant-cost-modal";

type Topic = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  badge?: string;
  modal: React.ElementType;
  isPro: boolean;
  color: string;
};

// ## हर डिपार्टमेंट के लिए एक्सेस के नियम ##

const qualityAccessTopics = [
  'industry', 'fssai-standards', 'quality-concept', 'microbiology', 'audits', 'validation-verification',
  'expert-support', 'calibration', 'lab-equipments', 'milk-chemistry', 'lab-calculations', 'production-calculations',
  'adulteration', 'solutions-prep', 'compositional-analysis', 'water-testing', 'packaging-testing',
  'std1', 'std2', 'milk-handling', 'paneer-production', 'cip-process', 'etp', 'about-us', 'plant-cost'
];

const productionAccessTopics = [
  'industry', 'fssai-standards', 'quality-concept', 'audits', 'validation-verification', 'expert-support',
  'milk-chemistry', 'production-calculations', 'std1', 'std2', 'processing', 'milk-handling',
  'paneer-production', 'fermented-products', 'evaporation-drying', 'ice-cream-production',
  'cip-process', 'etp', 'about-us', 'plant-cost'
];

const processAccessTopics = [
  'industry', 'std1', 'std2', 'processing', 'milk-handling', 'paneer-production',
  'fermented-products', 'evaporation-drying', 'ice-cream-production', 'cip-process', 'about-us', 'plant-cost'
];

const departmentAccess: Record<string, string[]> = {
  'quality-access': qualityAccessTopics,
  'production-access': productionAccessTopics,
  'process-access': processAccessTopics,
};

// सभी Topics की लिस्ट
const topics: Topic[] = [
  { id: 'industry', title: 'Dairy Industry', description: 'Overview & Trends', category: 'production', icon: Factory, badge: 'New', modal: DairyIndustryModal, isPro: false, color: 'from-blue-50 to-blue-100' },
  { id: 'fssai-standards', title: 'FSSAI Standards', description: 'Official Dairy Standards', category: 'quality', icon: ShieldCheck, badge: 'New', modal: FssaiStandardsModal, isPro: false, color: 'from-green-50 to-green-100' },
  { id: 'quality-concept', title: 'Quality Concepts', description: 'HACCP, TQM, ISO', category: 'quality', icon: CheckSquare, modal: QualityConceptModal, isPro: false, color: 'from-teal-50 to-cyan-100' },
  { id: 'microbiology', title: 'Microbiology', description: 'Testing & Pathogens', category: 'quality', icon: Bug, badge: 'New', modal: MicrobiologyTestingModal, isPro: true, color: 'from-purple-50 to-violet-100' },
  { id: 'audits', title: 'Audits', description: 'Internal & External Audits', category: 'quality', icon: ClipboardCheck, badge: 'New', modal: AuditsModal, isPro: true, color: 'from-rose-50 to-red-100' },
  { id: 'validation-verification', title: 'Validation & Verification', description: 'Food Safety Assurance', category: 'quality', icon: ClipboardCheck, badge: 'New', modal: ValidationVerificationModal, isPro: true, color: 'from-violet-50 to-fuchsia-100' },
  { id: 'expert-support', title: 'Expert Support', description: 'AI & Real Expert Advice', category: 'production', icon: GraduationCap, badge: 'AI', modal: ExpertSupportModal, isPro: true, color: 'from-orange-50 to-amber-100' },
  { id: 'calibration', title: 'Calibration', description: 'Glassware & Reagents', category: 'quality', icon: ClipboardCheck, modal: CalibrationStandardizationModal, isPro: false, color: 'from-red-50 to-orange-100' },
  { id: 'lab-equipments', title: 'Lab Equipments', description: 'Principles & Working', category: 'quality', icon: Microscope, badge: 'Pro', modal: LabEquipmentsModal, isPro: true, color: 'from-gray-100 to-blue-100' },
  { id: 'milk-chemistry', title: 'Milk Chemistry', description: 'Composition & Properties', category: 'quality', icon: Atom, modal: MilkChemistryModal, isPro: false, color: 'from-red-50 to-rose-100' },
  { id: 'lab-calculations', title: 'Lab Calculations', description: 'Yield, Acidity, etc.', category: 'quality', icon: FileSpreadsheet, badge: 'Updated', modal: VariousCalculatorsModal, isPro: false, color: 'from-orange-50 to-red-100' },
  { id: 'production-calculations', title: 'Production Calculations', description: 'Batch & Yield Calculations', category: 'production', icon: Combine, modal: ProductionCalculationsModal, isPro: true, color: 'from-violet-50 to-purple-100' },
  { id: 'plant-cost', title: 'Plant P&L', description: 'Profit & Loss Calculator', category: 'production', icon: DollarSign, modal: PlantCostModal, isPro: true, color: 'from-lime-50 to-green-100'},
  { id: 'adulteration', title: 'Adulteration', description: 'Detection & Prevention', category: 'quality', icon: ReagentIcon, badge: 'Updated', modal: AdulterationModal, isPro: false, color: 'from-yellow-50 to-amber-100' },
  { id: 'solutions-prep', title: 'Solutions Preparation', description: 'Reagents & Calculators', category: 'quality', icon: Beaker, modal: SolutionsPrepModal, isPro: false, color: 'from-emerald-50 to-green-100' },
  { id: 'compositional-analysis', title: 'Compositional Analysis', description: 'Chemical tests for products', category: 'quality', icon: TestTube, modal: CompositionalAnalysisModal, isPro: false, color: 'from-indigo-50 to-purple-100' },
  { id: 'water-testing', title: 'Water Testing', description: 'WTP/ETP Analysis', category: 'quality', icon: Droplet, modal: WaterTestingModal, isPro: true, color: 'from-blue-100 to-sky-200' },
  { id: 'packaging-testing', title: 'Packaging Testing', description: 'Quality tests for materials', category: 'quality', icon: PackageCheck, modal: PackagingMaterialTestingModal, isPro: true, color: 'from-amber-50 to-yellow-100' },
  { id: 'std1', title: 'Standardization I', description: 'Basic Principles', category: 'process', icon: Scale, modal: StandardizationIModal, isPro: false, color: 'from-sky-50 to-cyan-100' },
  { id: 'std2', title: 'Advanced Standardization', description: 'Advanced Blending', category: 'process', icon: Calculator, modal: StandardizationIIModal, isPro: false, color: 'from-fuchsia-50 to-purple-100' },
  { id: 'processing', title: 'Dairy Processing', description: 'Techniques & Machinery', category: 'process', icon: Settings, modal: DairyProcessingModal, isPro: false, color: 'from-gray-50 to-gray-200' },
  { id: 'milk-handling', title: 'Milk Handling', description: 'Reception & Preservation', category: 'process', icon: Droplet, badge: 'New', modal: MilkHandlingPreservationModal, isPro: false, color: 'from-cyan-50 to-sky-100' },
  { id: 'paneer-production', title: 'Paneer Processing', description: 'Process & Yield', category: 'production', icon: PaneerIcon, modal: PaneerProcessingModal, isPro: false, color: 'from-lime-50 to-yellow-100' },
  { id: 'fermented-products', title: 'Fermented Products', description: 'Yogurt, Dahi & More', category: 'production', icon: ReagentIcon, badge: 'New', modal: FermentedProductsModal, isPro: true, color: 'from-pink-50 to-fuchsia-100' },
  { id: 'evaporation-drying', title: 'Evaporation & Drying', description: 'Condensed & Powdered Milk', category: 'production', icon: Wind, badge: 'New', modal: EvaporationDryingModal, isPro: true, color: 'from-indigo-50 to-blue-100' },
  { id: 'ice-cream-production', title: 'Ice-Cream Production', description: 'Process & Science', category: 'production', icon: IceCreamIcon, modal: IceCreamProductionModal, isPro: true, color: 'from-rose-50 to-pink-100' },
  { id: 'cip-process', title: 'CIP Process', description: 'Cleaning-In-Place Guide', category: 'process', icon: Recycle, badge: 'New', modal: CipProcessModal, isPro: true, color: 'from-blue-50 to-cyan-100' },
  { id: 'etp', title: 'ETP', description: 'Wastewater Treatment', category: 'process', icon: Recycle, badge: 'New', modal: EtpModal, isPro: true, color: 'from-green-50 to-lime-100' },
  { id: 'about-us', title: 'About Us', description: 'Our Mission & Vision', category: 'production', icon: Users, modal: AboutUsModal, isPro: false, color: 'from-stone-100 to-stone-200' },
];

export function TopicGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) || topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const openModal = (id: string) => {
    setActiveModal(id);
  };

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search topics..."
            className="w-full pl-10 pr-4 py-2 rounded-full shadow-sm bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
        {filteredTopics.map((topic) => {
          const userDepartment = user?.department;
          let hasAccess = false;

          // Access rules logic
          if (!user || user.isAnonymous) {
            hasAccess = topic.id === 'about-us';
          } else if (userDepartment === 'all-control-access') {
            hasAccess = true;
          } else if (userDepartment && departmentAccess[userDepartment]) {
            hasAccess = departmentAccess[userDepartment].includes(topic.id);
          }

          return (
            <div
              key={topic.id}
              onClick={() => {
                if (hasAccess) {
                  openModal(topic.id);
                } else {
                  if (!user || user.isAnonymous) {
                    toast({
                      title: "Feature Locked for Guests",
                      description: "Please sign up to access this feature.",
                      action: <ToastAction altText="Sign Up" onClick={() => router.push('/signup')}>Sign Up</ToastAction>,
                    });
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Access Denied",
                      description: "You do not have permission for this topic.",
                    });
                  }
                }
              }}
              className={cn(
                "bg-card p-4 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center relative overflow-hidden group",
                hasAccess ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              {!hasAccess && (
                <>
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10"></div>
                  <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-white z-20" />
                </>
              )}
              {topic.badge && <Badge variant={topic.badge === 'Pro' ? 'default' : 'destructive'} className="absolute top-2 right-2 text-xs px-1.5 py-0.5 h-auto animate-pulse z-30">{topic.badge}</Badge>}
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-gradient-to-br ${topic.color}`}>
                <topic.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-headline font-semibold text-card-foreground text-sm leading-tight">{topic.title}</h3>
              <p className="hidden sm:block text-xs text-muted-foreground mt-1">{topic.description}</p>
            </div>
          )
        })}
      </div>
      
      {topics.map(topic => {
          const ModalComponent = topic.modal;
          if (!ModalComponent) return null;
          return <ModalComponent key={`${topic.id}-modal`} isOpen={activeModal === topic.id} setIsOpen={() => setActiveModal(null)} />
      })}
    </>
  );
}
