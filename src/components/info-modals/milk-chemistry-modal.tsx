"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Atom, Droplets, FlaskConical, Gem, Dna, TestTube, Cpu } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { milkChemistryContent } from "@/lib/content/milk-chemistry-content";


const InfoBlock = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-card p-4 sm:p-6 rounded-xl shadow-sm border mt-6">
        <h4 className="text-lg font-bold text-primary mb-2 font-headline">{title}</h4>
        {/* ## समाधान: यहाँ 'force-wrap' क्लास जोड़ी गई है ## */}
        <div className="text-base leading-relaxed text-gray-700 break-words prose max-w-none force-wrap">
            {children}
        </div>
    </div>
);


const Section = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
    <div>
        <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3 font-headline">
            <Icon className="w-6 h-6" />
            <span>{title}</span>
        </h3>
        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
            {children}
        </div>
    </div>
);

// Content Components
// अपनी फाइल में इस फंक्शन को नीचे दिए गए कोड से बदलें

function CompositionContent({ content }: { content: any }) {
    return (
        <Section title={content.composition.title} icon={BookOpen}>
            <InfoBlock title={content.composition.whatIsMilk.title}>
                <p dangerouslySetInnerHTML={{ __html: content.composition.whatIsMilk.fssaiDef }} />
                <p dangerouslySetInnerHTML={{ __html: content.composition.whatIsMilk.codexDef }} />
                <p dangerouslySetInnerHTML={{ __html: content.composition.whatIsMilk.usaDef }} />
                <p>{content.composition.whatIsMilk.p1}</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    {content.composition.whatIsMilk.phases.map((phase: string, i: number) => <li key={i}>{phase}</li>)}
                </ul>
            </InfoBlock>
            
            {/* ===== START: यहाँ बदलाव किया गया है ===== */}
            <InfoBlock title={content.composition.generalComposition.title}>
                <div className="table-container">
                     <Table>
                        <TableHeader>
                           <TableRow>
                               {/* अब चारों हेडर सही से दिखाए जा रहे हैं */}
                               <TableHead>{content.composition.generalComposition.headers[0]}</TableHead>
                               <TableHead>{content.composition.generalComposition.headers[1]}</TableHead>
                               <TableHead>{content.composition.generalComposition.headers[2]}</TableHead>
                               <TableHead>{content.composition.generalComposition.headers[3]}</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                            {content.composition.generalComposition.rows.map((row: any, i: number) => (
                                <TableRow key={i}>
                                    {/* अब चारों सेल (c1, v1, c2, v2) सही से दिखाए जा रहे हैं */}
                                    <TableCell>{row.c1}</TableCell>
                                    <TableCell>{row.v1}</TableCell>
                                    <TableCell>{row.c2}</TableCell>
                                    <TableCell>{row.v2}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </InfoBlock>
            {/* ===== END: यहाँ बदलाव खत्म हुआ ===== */}

            <InfoBlock title={content.composition.speciesDifferences.title}>
                 <div className="table-container">
                    <Table>
                         <TableHeader>
                            <TableRow>
                                {content.composition.speciesDifferences.headers.map((h: string) => <TableHead key={h}>{h}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {content.composition.speciesDifferences.rows.map((row: any, i: number) => (
                                <TableRow key={i}>
                                    <TableCell>{row.species}</TableCell>
                                    <TableCell>{row.water}</TableCell>
                                    <TableCell>{row.fat}</TableCell>
                                    <TableCell>{row.sugar}</TableCell>
                                    <TableCell>{row.protein}</TableCell>
                                    <TableCell>{row.ash}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </InfoBlock>
            <InfoBlock title={content.composition.water.title}>
                <p>{content.composition.water.p1}</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                     {content.composition.water.forms.map((form: any, i: number) => <li key={i}><strong className="font-semibold">{form.name}:</strong> {form.desc}</li>)}
                </ul>
            </InfoBlock>
        </Section>
    )
}

function MammaryGlandContent({ content }: { content: any }) {
    return (
        <Section title={content.mammaryGland.title} icon={Cpu}>
            <InfoBlock title={content.mammaryGland.structure.title}>
                <p>{content.mammaryGland.structure.p1}</p>
                <p className="mt-2">{content.mammaryGland.structure.p2}</p>
            </InfoBlock>
            <InfoBlock title={content.mammaryGland.physiology.title}>
                <p>{content.mammaryGland.physiology.p1}</p>
                <p className="mt-2"><strong className="font-semibold">{content.mammaryGland.physiology.ejectionTitle}:</strong> {content.mammaryGland.physiology.ejectionText}</p>
            </InfoBlock>
            <InfoBlock title={content.mammaryGland.precursors.title}>
                <div className="table-container">
                    <Table>
                        <TableCaption>{content.mammaryGland.precursors.caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                {content.mammaryGland.precursors.headers.map((h: string) => <TableHead key={h}>{h}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {content.mammaryGland.precursors.rows.map((row: any, i: number) => (
                                <TableRow key={i}>
                                    <TableCell>{row.constituent}</TableCell>
                                    <TableCell>{row.plasma}</TableCell>
                                    <TableCell dangerouslySetInnerHTML={{ __html: row.milk }} />
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </InfoBlock>
        </Section>
    );
}

function ProteinsContent({ content }: { content: any }) {
    return (
        <Section title={content.proteins.title} icon={Dna}>
             <InfoBlock title={content.proteins.overview.title}>
                <p dangerouslySetInnerHTML={{ __html: content.proteins.overview.p1 }} />
            </InfoBlock>
            <InfoBlock title={content.proteins.casein.title}>
                <p dangerouslySetInnerHTML={{ __html: content.proteins.casein.p1 }} />
                <h5 className="font-bold mt-4">{content.proteins.casein.fractionsTitle}</h5>
                <p>{content.proteins.casein.fractionsText}</p>
                <h5 className="font-bold mt-4">{content.proteins.casein.coagulationTitle}</h5>
                <p>{content.proteins.casein.coagulationText}</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    {content.proteins.casein.coagulationTypes.map((type: any, i: number) => <li key={i}><strong className="font-semibold">{type.name}:</strong> {type.desc}</li>)}
                </ul>
            </InfoBlock>

            <InfoBlock title={content.proteins.whey.title}>
                <p>{content.proteins.whey.p1}</p>
                <h5 className="font-bold mt-4">{content.proteins.whey.fractionsTitle}</h5>
                {content.proteins.whey.fractions.map((frac: any, i: number) => <p key={i} className="mt-2"><strong className="font-semibold">{frac.name}:</strong> {frac.desc}</p>)}
            </InfoBlock>
        </Section>
    )
}

function FatContent({ content }: { content: any }) {
    return (
        <Section title={content.fat.title} icon={Droplets}>
            <InfoBlock title={content.fat.characteristics.title}>
                <p>{content.fat.characteristics.p1}</p>
                <p className="mt-2">{content.fat.characteristics.p2}</p>
            </InfoBlock>
            <InfoBlock title={content.fat.stability.title}>
                 <p>{content.fat.stability.p1}</p>
                 <p className="mt-2"><strong className="font-semibold">{content.fat.stability.creamingTitle}:</strong> {content.fat.stability.creamingText}</p>
                 <p className="mt-2"><strong className="font-semibold">{content.fat.stability.lipolysisTitle}:</strong> {content.fat.stability.lipolysisText}</p>
            </InfoBlock>
            <InfoBlock title={content.fat.autoxidation.title}>
                <p><strong className="font-semibold">{content.fat.autoxidation.autoxidationTitle}:</strong> {content.fat.autoxidation.autoxidationText}</p>
                <p className="mt-2"><strong className="font-semibold">{content.fat.autoxidation.crystallizationTitle}:</strong> {content.fat.autoxidation.crystallizationText}</p>
            </InfoBlock>
        </Section>
    )
}

function LactoseContent({ content }: { content: any }) {
    return (
        <Section title={content.lactose.title} icon={Atom}>
             <InfoBlock title={content.lactose.properties.title}>
               <p>{content.lactose.properties.p1}</p>
               <p className="mt-2">{content.lactose.properties.p2}</p>
                <h5 className="font-bold mt-4">{content.lactose.properties.crystallizationTitle}</h5>
                <p className="mt-2" dangerouslySetInnerHTML={{__html: content.lactose.properties.crystallizationText1}} />
                <p className="mt-2">{content.lactose.properties.crystallizationText2}</p>
            </InfoBlock>
        </Section>
    )
}

function MineralsContent({ content }: { content: any }) {
    return (
        <Section title={content.minerals.title} icon={Gem}>
             <InfoBlock title={content.minerals.composition.title}>
               <p>{content.minerals.composition.p1}</p>
               <p className="mt-2">{content.minerals.composition.p2}</p>
            </InfoBlock>
             <InfoBlock title={content.minerals.trace.title}>
                <p>{content.minerals.trace.p1}</p>
             </InfoBlock>
        </Section>
    )
}

function VitaminsEnzymesContent({ content }: { content: any }) {
    return (
        <Section title={content.vitaminsEnzymes.title} icon={FlaskConical}>
             <InfoBlock title={content.vitaminsEnzymes.vitamins.title}>
                <p>{content.vitaminsEnzymes.vitamins.p1}</p>
            </InfoBlock>
             <InfoBlock title={content.vitaminsEnzymes.enzymes.title}>
                <p>{content.vitaminsEnzymes.enzymes.p1}</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    {content.vitaminsEnzymes.enzymes.list.map((enzyme: any, i: number) => <li key={i}><strong className="font-semibold">{enzyme.name}:</strong> {enzyme.desc}</li>)}
                </ul>
            </InfoBlock>
        </Section>
    )
}

function PropertiesContent({ content }: { content: any }) {
    return (
        <Section title={content.properties.title} icon={TestTube}>
             <InfoBlock title={content.properties.overview.title}>
                <p>{content.properties.overview.p1}</p>
            </InfoBlock>
            <div className="table-container mt-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">{content.properties.headers[0]}</TableHead>
                            <TableHead>{content.properties.headers[1]}</TableHead>
                            <TableHead>{content.properties.headers[2]}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {content.properties.rows.map((prop: any) => (
                            <TableRow key={prop.property}>
                                <TableCell className="font-medium">{prop.property}</TableCell>
                                <TableCell>{prop.value}</TableCell>
                                <TableCell>{prop.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Section>
    )
}

function OtherComponentsContent({ content }: { content: any }) {
    return (
        <Section title={content.other.title} icon={FlaskConical}>
            <InfoBlock title={content.other.minor.title}>
                <ul className="list-disc list-inside space-y-2">
                    {content.other.minor.list.map((item: any, i: number) => <li key={i}><strong className="font-semibold">{item.name}:</strong> {item.desc}</li>)}
                </ul>
            </InfoBlock>
            <InfoBlock title={content.other.contaminants.title}>
                <p>{content.other.contaminants.p1}</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    {content.other.contaminants.list.map((item: any, i: number) => <li key={i}><strong className="font-semibold">{item.name}:</strong> {item.desc}</li>)}
                </ul>
            </InfoBlock>
        </Section>
    );
}

const chemistryTopicComponents: { [key: string]: React.FC<{ content: any }> } = {
    "composition": CompositionContent,
    "mammary_gland": MammaryGlandContent,
    "proteins": ProteinsContent,
    "fat": FatContent,
    "lactose": LactoseContent,
    "minerals": MineralsContent,
    "vitamins_enzymes": VitaminsEnzymesContent,
    "properties": PropertiesContent,
    "other": OtherComponentsContent,
};


export function MilkChemistryModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void; }) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const { t } = useLanguage();
  const content = t(milkChemistryContent);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setActiveTopic(null); // Reset when closing
    }
    setIsOpen(open);
  };
  
  const chemistryTopics = [
    { value: "composition", title: content.composition.title, icon: BookOpen },
    { value: "mammary_gland", title: content.mammaryGland.title, icon: Cpu },
    { value: "proteins", title: content.proteins.title, icon: Dna },
    { value: "fat", title: content.fat.title, icon: Droplets },
    { value: "lactose", title: content.lactose.title, icon: Atom },
    { value: "minerals", title: content.minerals.title, icon: Gem },
    { value: "vitamins_enzymes", title: content.vitaminsEnzymes.title, icon: FlaskConical },
    { value: "properties", title: content.properties.title, icon: TestTube },
    { value: "other", title: content.other.title, icon: FlaskConical },
  ];

  const selectedTopic = chemistryTopics.find(t => t.value === activeTopic);
  const ActiveComponent = activeTopic ? chemistryTopicComponents[activeTopic] : null;
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl lg:max-w-6xl w-[95vw] h-full max-h-[90vh] flex flex-col p-0 sm:p-6">
        <DialogHeader className="p-4 sm:p-0 shrink-0">
          <DialogTitle className="font-headline text-2xl md:text-3xl text-center">{content.mainTitle}</DialogTitle>
          <DialogDescription className="text-center text-lg text-gray-500">
            {selectedTopic ? selectedTopic.title : content.description}
          </DialogDescription>
        </DialogHeader>

        {selectedTopic && ActiveComponent ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 sm:px-0">
              <Button variant="ghost" onClick={() => setActiveTopic(null)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {content.backToTopics}
              </Button>
            </div>
            <ScrollArea className="flex-1 mt-4 sm:pr-4">
              <div className="p-4 pt-0 sm:p-0">
                <ActiveComponent content={content} />
              </div>
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea className="flex-1 mt-4 sm:pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-0">
              {chemistryTopics.map(topic => (
                <button
                  key={topic.value}
                  onClick={() => setActiveTopic(topic.value)}
                  className="flex items-center p-4 bg-card hover:bg-primary/10 rounded-lg shadow-sm border text-left transition-all duration-200"
                >
                  <topic.icon className="w-8 h-8 text-primary mr-4 shrink-0" />
                  <div>
                    <span className="font-semibold font-headline text-card-foreground">{topic.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}