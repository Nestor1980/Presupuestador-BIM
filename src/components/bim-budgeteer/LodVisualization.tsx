
"use client";
import { useBimContext } from '@/contexts/BimContext';
import { ALL_LOD_LEVELS, LOD_DESCRIPTIONS, LOD_REFERENCE_TEXT } from '@/config/constants';
import { SectionCard } from './SectionCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, Scaling, Puzzle, Network, Construction, Building2, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface LodGraphicProps {
  level: string;
  Icon: LucideIcon;
  isSelected: boolean;
}

const LodGraphic: React.FC<LodGraphicProps> = ({ level, Icon, isSelected }) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105",
      isSelected ? "bg-primary/20 border-primary shadow-xl" : "bg-card border-border hover:border-primary/50"
    )}>
      <Icon size={48} className={cn("mb-3", isSelected ? "text-primary" : "text-muted-foreground")} />
      <h4 className={cn("text-lg font-semibold", isSelected ? "text-primary" : "text-card-foreground")}>{level}</h4>
    </div>
  );
};

const LOD_ICONS: { [key: string]: LucideIcon } = {
  "LoD 100": Scaling,      // Conceptual, massing
  "LoD 200": Puzzle,       // Approximate geometry, systems
  "LoD 300": Layers,       // Precise geometry, specific assemblies
  "LoD 350": Network,      // Detailed interfaces, connections
  "LoD 400": Construction, // Fabrication, assembly details
  "LoD 500": Building2,    // As-built, operational model
};


export function LodVisualization() {
  const { selectedLOD } = useBimContext();
  const currentLodDescription = LOD_DESCRIPTIONS[selectedLOD];

  return (
    <SectionCard title="Visualización LOD" description="Nivel de Desarrollo del Modelo BIM seleccionado y su definición." icon={Layers}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {ALL_LOD_LEVELS.map(lod => (
          <LodGraphic 
            key={lod} 
            level={lod} 
            Icon={LOD_ICONS[lod] || Layers} 
            isSelected={lod === selectedLOD} 
          />
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-secondary/30 rounded-md text-center">
        <p className="text-sm text-muted-foreground">
          El Nivel de Desarrollo (LOD) seleccionado en la Configuración Básica es: <strong className="text-primary">{selectedLOD}</strong>.
          Este nivel influye en las horas estimadas y los tipos de Usos BIM aplicables.
        </p>
      </div>

      {currentLodDescription && (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Info className="mr-2 h-5 w-5 text-primary" /> Definición de {selectedLOD}: {currentLodDescription.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h5 className="font-semibold text-primary">AIA Contract Documents Definition:</h5>
              <p className="text-muted-foreground">{currentLodDescription.aia}</p>
            </div>
            <div>
              <h5 className="font-semibold text-primary">BIMForum Expansion:</h5>
              <p className="text-muted-foreground">{currentLodDescription.bimForum}</p>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start text-xs text-muted-foreground/80 space-y-2 pt-4 border-t">
            <p><strong>Referencias:</strong></p>
            <p>{LOD_REFERENCE_TEXT.aia}</p>
            <Separator className="my-1" />
            <p>{LOD_REFERENCE_TEXT.bimForumSpec}</p>
            <p>{LOD_REFERENCE_TEXT.bimForumFeedback}</p>
            <p>{LOD_REFERENCE_TEXT.bimForumCopyright}</p>
          </CardFooter>
        </Card>
      )}
    </SectionCard>
  );
}
