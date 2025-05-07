"use client";
import { useBimContext } from '@/contexts/BimContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DEFAULT_LOD_HOURS, LOD_LEVELS } from '@/config/constants';
import type { LODLevel, LODHoursMap } from '@/types';
import { SectionCard } from './SectionCard';
import { Settings, DollarSign, Percent, Square, Layers, Edit3, SlidersHorizontal } from 'lucide-react';

export function BasicSettingsForm() {
  const {
    projectName, setProjectName,
    valorBasico, setValorBasico,
    regionPercentage, setRegionPercentage,
    dollarExchangeRate, setDollarExchangeRate,
    surfaceM2, setSurfaceM2,
    selectedLOD, setSelectedLOD,
    lodHoursMap, setLodHoursMap,
    actualLODHoursForSelected, setActualLODHoursForSelected,
    currentLODHours
  } = useBimContext();

  const handleLODChange = (value: string) => {
    const newLOD = value as LODLevel;
    setSelectedLOD(newLOD);
    // When LOD changes, reset actualLODHoursForSelected to the min of the new LOD
    setActualLODHoursForSelected(lodHoursMap[newLOD]?.min || 0); 
  };

  const handleLODHoursMapChange = (lod: LODLevel, type: 'min' | 'max', value: number) => {
    setLodHoursMap((prevMap: LODHoursMap) => {
      const newMap = { ...prevMap };
      const currentEntry = newMap[lod] || { min: 0, max: 0 };
      if (type === 'min') {
        newMap[lod] = { ...currentEntry, min: Math.max(0, value) };
        if (value > currentEntry.max) {
          newMap[lod].max = value; // Ensure min is not greater than max
        }
      } else { // type === 'max'
        newMap[lod] = { ...currentEntry, max: Math.max(currentEntry.min, value) }; // Ensure max is not less than min
      }
      
      // If the currently selected LOD's bounds changed, update actualLODHoursForSelected
      if (lod === selectedLOD) {
        const newActualMin = newMap[lod].min;
        const newActualMax = newMap[lod].max;
        if (actualLODHoursForSelected < newActualMin) {
          setActualLODHoursForSelected(newActualMin);
        } else if (actualLODHoursForSelected > newActualMax) {
          setActualLODHoursForSelected(newActualMax);
        }
      }
      return newMap;
    });
  };

  return (
    <SectionCard title="Configuración Básica" description="Define los parámetros iniciales para tu presupuesto." icon={Settings}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="projectName" className="flex items-center"><Edit3 className="mr-2 h-4 w-4 text-primary" />Nombre del Proyecto</Label>
          <Input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Ej: Edificio Residencial Alfa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valorBasico" className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-primary" />Valor Básico (VB) por Hora (USD)</Label>
          <Input
            id="valorBasico"
            type="number"
            value={valorBasico}
            onChange={(e) => setValorBasico(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="regionPercentage" className="flex items-center"><Percent className="mr-2 h-4 w-4 text-primary" />Porcentaje por Región (R)</Label>
          <Input
            id="regionPercentage"
            type="number"
            value={regionPercentage}
            onChange={(e) => setRegionPercentage(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.1"
            placeholder="Ej: 10 para 10%"
          />
          <p className="text-xs text-muted-foreground">Ajuste porcentual sobre VB para regiones no centrales.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dollarExchangeRate" className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-primary" />Cotización del Dólar (a moneda local)</Label>
          <Input
            id="dollarExchangeRate"
            type="number"
            value={dollarExchangeRate}
            onChange={(e) => setDollarExchangeRate(parseFloat(e.target.value) || 1)}
            min="0.01"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="surfaceM2" className="flex items-center"><Square className="mr-2 h-4 w-4 text-primary" />Superficie (M²)</Label>
          <Input
            id="surfaceM2"
            type="number"
            value={surfaceM2}
            onChange={(e) => setSurfaceM2(parseFloat(e.target.value) || 0)}
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="selectedLOD" className="flex items-center"><Layers className="mr-2 h-4 w-4 text-primary" />Nivel de Desarrollo (LOD)</Label>
          <Select value={selectedLOD} onValueChange={handleLODChange}>
            <SelectTrigger id="selectedLOD">
              <SelectValue placeholder="Selecciona LOD" />
            </SelectTrigger>
            <SelectContent>
              {LOD_LEVELS.map(lod => (
                <SelectItem key={lod} value={lod}>{lod}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold flex items-center"><SlidersHorizontal className="mr-2 h-5 w-5 text-primary" />Ajuste de Horas por LOD</h3>
          <p className="text-sm text-muted-foreground">Modifica las horas base por LOD si es necesario. Estos valores son referencias que puedes ajustar según la complejidad del proyecto.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOD_LEVELS.map((lod) => (
            <Card key={lod} className={lod === selectedLOD ? 'border-primary shadow-lg' : ''}>
              <CardHeader>
                <CardTitle className="text-md">{lod}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor={`lod-min-${lod}`}>Horas Mínimas</Label>
                  <Input
                    id={`lod-min-${lod}`}
                    type="number"
                    value={lodHoursMap[lod]?.min || 0}
                    onChange={(e) => handleLODHoursMapChange(lod, 'min', parseFloat(e.target.value))}
                    min="0"
                    step="0.1"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`lod-max-${lod}`}>Horas Máximas</Label>
                  <Input
                    id={`lod-max-${lod}`}
                    type="number"
                    value={lodHoursMap[lod]?.max || 0}
                    onChange={(e) => handleLODHoursMapChange(lod, 'max', parseFloat(e.target.value))}
                    min={lodHoursMap[lod]?.min || 0}
                    step="0.1"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {selectedLOD && currentLODHours && (
        <div className="mt-8 space-y-3 p-4 border rounded-md bg-secondary/50">
          <Label htmlFor="actualLODHours" className="text-md font-semibold">
            Horas Estimadas para {selectedLOD}: <span className="text-primary font-bold">{actualLODHoursForSelected.toFixed(1)}</span> horas
          </Label>
          <Slider
            id="actualLODHours"
            min={currentLODHours.min}
            max={currentLODHours.max}
            step={0.5} // Or more granular if needed
            value={[actualLODHoursForSelected]}
            onValueChange={(value) => setActualLODHoursForSelected(value[0])}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: {currentLODHours.min.toFixed(1)}h</span>
            <span>Max: {currentLODHours.max.toFixed(1)}h</span>
          </div>
           <p className="text-xs text-muted-foreground mt-1">Ajusta el control deslizante para indicar las horas que consideras para el modelo en {selectedLOD} dentro del rango definido.</p>
        </div>
      )}
    </SectionCard>
  );
}
