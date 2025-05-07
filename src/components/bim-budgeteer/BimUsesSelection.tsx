"use client";
import { useBimContext } from '@/contexts/BimContext';
import { BIM_USES_DATA, PROJECT_PHASES } from '@/config/constants';
import type { ProjectPhase, UsoBIM } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SectionCard } from './SectionCard';
import { CheckSquare, Workflow, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function BimUsesSelection() {
  const { selectedLOD, selectedBimUses, toggleBimUse } = useBimContext();

  const usosByPhase = (phase: ProjectPhase): UsoBIM[] => {
    return BIM_USES_DATA.filter(uso => uso.etapa_proyecto === phase);
  };

  const isUsoBimDisabled = (uso: UsoBIM): boolean => {
    // Disable if the selected LOD is not applicable for this BIM Use
    // Or if any of its dependencies are not met
    const lodCompatible = uso.lod.includes(selectedLOD);
    if (!lodCompatible) return true;
    
    // Check dependencies
    return uso.dependencias.some(depId => !selectedBimUses.has(depId));
  };
  
  const getDependencyNames = (dependencies: string[]): string => {
    if (!dependencies || dependencies.length === 0) return "Ninguna";
    return dependencies.map(depId => {
      const foundUse = BIM_USES_DATA.find(u => u.id === depId);
      return foundUse ? `${foundUse.id}. ${foundUse.nombre}` : `ID ${depId} (desconocido)`;
    }).join(', ');
  };

  return (
    <SectionCard title="Selección de Usos BIM" description="Elige los usos BIM que aplicarás a tu proyecto. Las dependencias se seleccionarán automáticamente." icon={Workflow}>
      <TooltipProvider>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {PROJECT_PHASES.map(phase => (
              <div key={phase} className="flex-shrink-0 w-[300px] md:w-[350px]">
                <div className="p-3 rounded-lg bg-secondary shadow">
                  <h3 className="text-lg font-semibold mb-3 text-primary text-center border-b pb-2">{phase.toUpperCase()}</h3>
                  <ScrollArea className="h-[400px] pr-3"> {/* Inner scroll for uses list */}
                    <div className="space-y-3">
                      {usosByPhase(phase).map(uso => {
                        const isDisabled = isUsoBimDisabled(uso);
                        const isChecked = selectedBimUses.has(uso.id);
                        const isLodCompatible = uso.lod.includes(selectedLOD);
                        
                        let tooltipContent = `ID: ${uso.id}\nLODs Aplicables: ${uso.lod.join(', ')}\nDependencias: ${getDependencyNames(uso.dependencias)}`;
                        if (!isLodCompatible) {
                           tooltipContent += `\n\nNO COMPATIBLE con ${selectedLOD} seleccionado.`;
                        } else if (isDisabled && !isChecked) {
                           tooltipContent += `\n\nREQUIERE dependencias no seleccionadas.`;
                        }


                        return (
                          <Tooltip key={uso.id} delayDuration={300}>
                            <TooltipTrigger asChild>
                              <div className={`flex items-start space-x-2 p-2 rounded-md transition-colors ${isChecked ? 'bg-accent/20' : 'hover:bg-muted/50'} ${isDisabled && !isChecked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                <Checkbox
                                  id={`uso-${uso.id}`}
                                  checked={isChecked}
                                  onCheckedChange={() => { if (!isDisabled || isChecked) toggleBimUse(uso.id) }}
                                  disabled={isDisabled && !isChecked} 
                                  aria-label={uso.nombre}
                                />
                                <Label 
                                  htmlFor={`uso-${uso.id}`} 
                                  className={`flex-1 text-sm ${isDisabled && !isChecked ? 'text-muted-foreground' : ''} ${!isLodCompatible ? 'line-through text-destructive/70' : ''}`}
                                >
                                  {uso.id}. {uso.nombre}
                                </Label>
                                <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs whitespace-pre-wrap text-xs p-2 shadow-lg rounded-md bg-popover text-popover-foreground border">
                              <p className="font-semibold">{uso.nombre} (ID: {uso.id})</p>
                              <p>LODs Aplicables: {uso.lod.join(', ')}</p>
                              <p>Dependencias: {getDependencyNames(uso.dependencias)}</p>
                              {!isLodCompatible && <p className="text-destructive font-medium mt-1">NO COMPATIBLE con {selectedLOD} seleccionado.</p>}
                              {isDisabled && !isChecked && isLodCompatible && <p className="text-amber-600 font-medium mt-1">REQUIERE dependencias no seleccionadas.</p>}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </TooltipProvider>
      <p className="text-xs text-muted-foreground mt-4">
        Los Usos BIM no compatibles con el LOD seleccionado en "Configuración Básica" o cuyas dependencias no estén cumplidas aparecerán deshabilitados o con una indicación visual.
        Coloca el cursor sobre el icono <Info className="inline h-3 w-3" /> para más detalles.
      </p>
    </SectionCard>
  );
}
