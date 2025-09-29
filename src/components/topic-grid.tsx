"use client";

import { useState } from 'react';
import { IndianDairyIcon, FssaiIcon, QualityIcon, MicrobiologyIcon, AuditIcon, ValidationIcon, ExpertIcon, CalibrationIcon, LabEquipIcon, MilkChemistryIcon, LabCalcIcon, ProductionCalcIcon, AdulterationIcon, SolutionPrepIcon, CompositionIcon, WaterTestIcon, PackagingIcon, MilkStandardizationIcon, AdvancedStandardizationIcon, DairyProcessingIcon, MilkHandlingIcon, PaneerIcon, FermentedIcon, EvaporationIcon, IceCreamIcon, CipIcon, EtpIcon, GheeIcon, ButterIcon, CheeseIcon, MarketIcon, PackagingDevIcon, SensoryIcon, HygieneIcon, MaintenanceIcon, HrIcon, SecurityIcon, AccountsIcon, StoreIcon, ComputerIcon, AutomationIcon, UtilitiesIcon, SafetyIcon, LegalIcon, NewProductIcon, BrandingIcon, SalesIcon, DigitalMarketingIcon, ColdChainIcon, ExportIcon, StartupIcon, FarmingIcon, AboutIcon } from '@/components/icons';
import { StandardizationIModal } from '@/components/calculators/standardization-i-modal';
import { VariousCalculatorsModal } from '@/components/calculators/various-calculators-modal';
import { ProductionCalculationsModal } from '@/components/calculators/production-calculations-modal';
import { StandardizationIIModal } from '@/components/calculators/standardization-ii-modal';
import { AdulterationModal } from '@/components/info-modals/adulteration-modal';
import { SolutionsPrepModal } from '@/components/calculators/solutions-prep-modal';
import { FermentedProductsModal } from '@/components/info-modals/fermented-products-modal';
import { DairyProcessingModal } from '@/components/info-modals/dairy-processing-modal';
import { FssaiStandardsModal } from '@/components/info-modals/fssai-standards-modal';
import { AuditsModal } from '@/components/info-modals/audits-modal';
import { ValidationVerificationModal } from '@/components/info-modals/validation-verification-modal';
import { CalibrationStandardizationModal } from '@/components/info-modals/calibration-standardization-modal';
import { LabEquipmentsModal } from '@/components/info-modals/lab-equipments-modal';
import { MilkChemistryModal } from '@/components/info-modals/milk-chemistry-modal';
import { CompositionalAnalysisModal } from '@/components/info-modals/compositional-analysis-modal';
import { WaterTestingModal } from '@/components/info-modals/water-testing-modal';
import { PackagingMaterialTestingModal } from '@/components/info-modals/packaging-material-testing-modal';
import { MilkHandlingPreservationModal } from '@/components/info-modals/milk-handling-preservation-modal';
import { PaneerProcessingModal } from '@/components/info-modals/paneer-processing-modal';
import { EvaporationDryingModal } from '@/components/info-modals/evaporation-drying-modal';
import { IceCreamProductionModal } from '@/components/info-modals/ice-cream-production-modal';
import { CipProcessModal } from '@/components/info-modals/cip-process-modal';
import { EtpModal } from '@/components/info-modals/etp-modal';
import { AboutUsModal } from '@/components/info-modals/about-us-modal';
import { ExpertSupportModal } from '@/components/info-modals/expert-support-modal';
import { DairyIndustryModal } from "@/components/info-modals/dairy-industry-modal";
import { QualityConceptModal } from "@/components/info-modals/quality-concept-modal";
import { MicrobiologyTestingModal } from "@/components/info-modals/microbiology-testing-modal";
import { PlantCostModal } from '@/components/calculators/plant-cost-modal';


type Topic = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className: string }>;
  modal: React.ComponentType<{ isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }>;
};

const topics: Topic[] = [
  { id: 'dairy-industry', title: 'Dairy Industry', icon: IndianDairyIcon, modal: DairyIndustryModal },
  { id: 'fssai-standards', title: 'FSSAI Standards', icon: FssaiIcon, modal: FssaiStandardsModal },
  { id: 'quality-concepts', title: 'Quality Concepts', icon: QualityIcon, modal: QualityConceptModal },
  { id: 'milk-microbiology', title: 'Milk Microbiology', icon: MicrobiologyIcon, modal: MicrobiologyTestingModal },
  { id: 'audits-guides', title: 'Audits Guides', icon: AuditIcon, modal: AuditsModal },
  { id: 'validation-verification', title: 'Validation & Verification', icon: ValidationIcon, modal: ValidationVerificationModal },
  { id: 'expert-support', title: 'Expert Support', icon: ExpertIcon, modal: ExpertSupportModal },
  { id: 'calibration-standardization', title: 'Calibration', icon: CalibrationIcon, modal: CalibrationStandardizationModal },
  { id: 'lab-equipments', title: 'Lab Equipments', icon: LabEquipIcon, modal: LabEquipmentsModal },
  { id: 'milk-chemistry', title: 'Milk Chemistry', icon: MilkChemistryIcon, modal: MilkChemistryModal },
  { id: 'lab-calculations', title: 'Lab Calculations', icon: LabCalcIcon, modal: VariousCalculatorsModal },
  { id: 'production-calculations', title: 'Production Calculations', icon: ProductionCalcIcon, modal: ProductionCalculationsModal },
  { id: 'adulteration-tests', title: 'Adulteration Tests', icon: AdulterationIcon, modal: AdulterationModal },
  { id: 'solutions-preparation', title: 'Solutions Preparation', icon: SolutionPrepIcon, modal: SolutionsPrepModal },
  { id: 'compositional-analysis', title: 'Compositional Analysis', icon: CompositionIcon, modal: CompositionalAnalysisModal },
  { id: 'water-testing', title: 'Water Testing', icon: WaterTestIcon, modal: WaterTestingModal },
  { id: 'packaging-material-testing', title: 'Packaging Material Testing', icon: PackagingIcon, modal: PackagingMaterialTestingModal },
  { id: 'milk-standardization-i', title: 'Milk Standardization I', icon: MilkStandardizationIcon, modal: StandardizationIModal },
  { id: 'milk-standardization-ii', title: 'Milk Standardization II', icon: AdvancedStandardizationIcon, modal: StandardizationIIModal },
  { id: 'dairy-processing', title: 'Dairy Processing', icon: DairyProcessingIcon, modal: DairyProcessingModal },
  { id: 'milk-handling-preservation', title: 'Milk Handling & Preservation', icon: MilkHandlingIcon, modal: MilkHandlingPreservationModal },
  { id: 'paneer-processing', title: 'Paneer Processing', icon: PaneerIcon, modal: PaneerProcessingModal },
  { id: 'fermented-products', title: 'Fermented Products', icon: FermentedIcon, modal: FermentedProductsModal },
  { id: 'evaporation-drying', title: 'Evaporation & Drying', icon: EvaporationIcon, modal: EvaporationDryingModal },
  { id: 'ice-cream-production', title: 'Ice-Cream Production', icon: IceCreamIcon, modal: IceCreamProductionModal },
  { id: 'cip-process', title: 'CIP Process', icon: CipIcon, modal: CipProcessModal },
  { id: 'etp', title: 'ETP', icon: EtpIcon, modal: EtpModal },
  { id: 'about-us', title: 'About Us', icon: AboutIcon, modal: AboutUsModal },
  { id: 'plant-cost-analysis', title: 'Plant Cost Analysis', icon: LabCalcIcon, modal: PlantCostModal },
];

export function TopicGrid() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  const getCardClass = (index: number) => {
    const delay = index * 50; // 50ms delay per card
    return `card-enter card-enter-active`;
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            className={`flex flex-col items-center justify-center text-center p-4 rounded-xl shadow-md cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 ${getCardClass(index)}`}
            onClick={() => openModal(topic.id)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <topic.icon className="h-12 w-12 text-primary dark:text-sky-400 mb-2" />
            <h3 className="font-headline text-sm font-semibold text-gray-700 dark:text-gray-200">{topic.title}</h3>
          </div>
        ))}
      </div>

      {topics.map(topic => {
        const ModalComponent = topic.modal;
        return (
          <ModalComponent
            key={`${topic.id}-modal`}
            isOpen={activeModal === topic.id}
            setIsOpen={closeModal}
          />
        );
      })}
    </>
  );
}
