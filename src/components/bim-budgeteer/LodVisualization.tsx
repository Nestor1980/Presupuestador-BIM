"use client";
import { useBimContext } from '@/contexts/BimContext';
import { LOD_LEVELS } from '@/config/constants';
import { SectionCard } from './SectionCard';
import { Layers, Scaling, Puzzle, Network, Construction, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <SectionCard title="Visualización LOD" description="Nivel de Desarrollo del Modelo BIM seleccionado." icon={Layers}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {LOD_LEVELS.map(lod => (
          <LodGraphic 
            key={lod} 
            level={lod} 
            Icon={LOD_ICONS[lod] || Layers} 
            isSelected={lod === selectedLOD} 
          />
        ))}
      </div>
      <div className="mt-4 p-4 bg-secondary/30 rounded-md text-center">
        <p className="text-sm text-muted-foreground">
          El Nivel de Desarrollo (LOD) seleccionado en la Configuración Básica es: <strong className="text-primary">{selectedLOD}</strong>.
          Este nivel influye en las horas estimadas y los tipos de Usos BIM aplicables.
        </p>
      </div>
    </SectionCard>
  );
}
