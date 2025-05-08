
"use client";
import { useBimContext } from '@/contexts/BimContext';
import { BIM_USES_DATA, PROJECT_PHASES } from '@/config/constants';
import type { ProjectPhase, UsoBIM } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SectionCard } from './SectionCard';
import { CheckSquare, Workflow, Info, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

export function BimUsesSelection() {
  const { selectedLOD, selectedBimUses, toggleBimUse, highlightedDependencies } = useBimContext();

  const usosByPhase = (phase: ProjectPhase): UsoBIM[] => {
    return BIM_USES_DATA.filter(uso => uso.etapa_proyecto === phase);
  };

  const isUsoBimDisabled = (uso: UsoBIM): boolean => {
    // A BIM Use is disabled if any of its dependencies are not met (i.e., not in selectedBimUses)
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
    <SectionCard 
        title="Selección de Usos BIM" 
        description="Elige los usos BIM. Los LODs se sugerirán en Configuración. Las dependencias se seleccionarán automáticamente y se resaltarán." 
        icon={Workflow}
    >
      <TooltipProvider>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {PROJECT_PHASES.map(phase => (
              <div key={phase} className="flex-shrink-0 w-[300px] md:w-[350px]">
                <div className="p-3 rounded-lg bg-secondary shadow">
                  <h3 className="text-lg font-semibold mb-3 text-primary text-center border-b pb-2">{phase.toUpperCase()}</h3>
                  <ScrollArea className="h-[400px] pr-3">
                    <div className="space-y-3">
                      {usosByPhase(phase).map(uso => {
                        const isDisabledByDependency = isUsoBimDisabled(uso); // Disabled if dependencies not met
                        const isChecked = selectedBimUses.has(uso.id);
                        const isLodCompatibleWithGlobalLod = selectedLOD ? uso.lods_sugeridos.includes(selectedLOD) : true; // Assume compatible if no LOD selected yet
                        const isHighlightedAsDependency = highlightedDependencies.has(uso.id) && isChecked;
                        
                        let tooltipContent = `ID: ${uso.id}\nLODs Sugeridos: ${uso.lods_sugeridos.join(', ')}\nDependencias: ${getDependencyNames(uso.dependencias)}`;
                        if (isDisabledByDependency && !isChecked) {
                           tooltipContent += `\n\nREQUIERE dependencias no seleccionadas.`;
                        }
                        if (isChecked && selectedLOD && !isLodCompatibleWithGlobalLod) {
                           tooltipContent += `\n\nADVERTENCIA: El LOD ${selectedLOD} seleccionado globalmente no está entre los sugeridos para este Uso BIM.`;
                        }

                        return (
                          <Tooltip key={uso.id} delayDuration={300}>
                            <TooltipTrigger asChild>
                              <div className={cn(
                                "flex items-start space-x-2 p-2 rounded-md transition-colors",
                                isChecked ? 'bg-accent/20' : 'hover:bg-muted/50',
                                isDisabledByDependency && !isChecked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                                isHighlightedAsDependency ? 'border-2 border-blue-400 shadow-md' : '' // Highlight for dependencies
                              )}>
                                <Checkbox
                                  id={`uso-${uso.id}`}
                                  checked={isChecked}
                                  onCheckedChange={() => { if (!isDisabledByDependency || isChecked) toggleBimUse(uso.id) }}
                                  disabled={isDisabledByDependency && !isChecked} 
                                  aria-label={uso.nombre}
                                />
                                <Label 
                                  htmlFor={`uso-${uso.id}`} 
                                  className={cn(
                                    'flex-1 text-sm',
                                    isDisabledByDependency && !isChecked ? 'text-muted-foreground' : ''
                                  )}
                                >
                                  {uso.id}. {uso.nombre}
                                </Label>
                                {isChecked && selectedLOD && !isLodCompatibleWithGlobalLod && (
                                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                                )}
                                <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs whitespace-pre-wrap text-xs p-2 shadow-lg rounded-md bg-popover text-popover-foreground border">
                              <p className="font-semibold">{uso.nombre} (ID: {uso.id})</p>
                              <p>LODs Sugeridos: {uso.lods_sugeridos.join(', ')}</p>
                              <p>Dependencias: {getDependencyNames(uso.dependencias)}</p>
                              {isDisabledByDependency && !isChecked && <p className="text-amber-600 font-medium mt-1">REQUIERE dependencias no seleccionadas.</p>}
                              {isChecked && selectedLOD && !isLodCompatibleWithGlobalLod && (
                                <p className="text-destructive font-medium mt-1">
                                  ADVERTENCIA: El LOD {selectedLOD} seleccionado globalmente no está entre los sugeridos ({uso.lods_sugeridos.join(', ')}) para este Uso BIM.
                                </p>
                              )}
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
        Los Usos BIM cuyas dependencias no estén cumplidas aparecerán deshabilitados.
        Coloca el cursor sobre el icono <Info className="inline h-3 w-3" /> para más detalles sobre LODs sugeridos y dependencias.
        Un icono <AlertTriangle className="inline h-3 w-3 text-amber-500" /> indica si un Uso BIM seleccionado no es ideal para el LOD globalmente elegido.
        Los usos BIM que son dependencias de otros seleccionados aparecerán resaltados.
      </p>
    </SectionCard>
  );
}
