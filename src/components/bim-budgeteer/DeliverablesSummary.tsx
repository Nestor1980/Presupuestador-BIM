"use client";
import { useBimContext } from '@/contexts/BimContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DELIVERABLES_CATEGORIES, BIM_USES_DATA } from '@/config/constants';
import { SectionCard } from './SectionCard';
import { FileText, DollarSign, Download, ListChecks, Calculator, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function DeliverablesSummary() {
  const { 
    projectName,
    selectedLOD, 
    selectedBimUses, 
    totalCostUSD, 
    totalCostLocal, 
    calculateTotalCost,
    dollarExchangeRate,
    valorBasico,
    regionPercentage,
    surfaceM2,
    actualLODHoursForSelected,
    resetAll
  } = useBimContext();
  const { toast } = useToast();

  useEffect(() => {
    // Automatically calculate on relevant changes
    calculateTotalCost();
  }, [valorBasico, regionPercentage, actualLODHoursForSelected, dollarExchangeRate, calculateTotalCost]);


  const handleDownloadPDF = () => {
    // Placeholder for PDF generation logic
    // This would typically involve a library like jsPDF or a backend service
    alert("La funcionalidad de descarga de PDF aún no está implementada.");
    toast({
      title: "Descarga PDF",
      description: "La funcionalidad de descarga de PDF está en desarrollo.",
      variant: "default",
    });
  };
  
  const handleCalculateClick = () => {
    calculateTotalCost();
    toast({
      title: "Cálculo Realizado",
      description: "El costo del presupuesto ha sido actualizado.",
      variant: "default",
    });
  };

  const handleResetClick = () => {
    resetAll();
    toast({
      title: "Formulario Reseteado",
      description: "Todos los campos han sido restaurados a sus valores iniciales.",
      variant: "default",
    });
  };

  const getSelectedBimUsesDetails = () => {
    return Array.from(selectedBimUses).map(id => {
      const use = BIM_USES_DATA.find(u => u.id === id);
      return use ? `${use.id}. ${use.nombre}` : `ID ${id} (desconocido)`;
    });
  };

  const selectedUsesDetails = getSelectedBimUsesDetails();

  return (
    <SectionCard 
      title="Resumen y Entregables" 
      description="Visualiza el costo estimado y los entregables sugeridos para tu proyecto." 
      icon={FileText}
      headerActions={
        <div className="flex space-x-2">
          <Button onClick={handleCalculateClick} variant="outline" size="sm">
            <Calculator className="mr-2 h-4 w-4" /> Calcular
          </Button>
           <Button onClick={handleResetClick} variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive">
            <RotateCcw className="mr-2 h-4 w-4" /> Resetear
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Summary Card */}
        <Card className="shadow-lg border-primary">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <DollarSign className="mr-2 h-6 w-6" /> Costo Estimado del Proyecto
            </CardTitle>
            <CardDescription>Basado en la configuración y selecciones realizadas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectName && <p className="text-sm"><strong>Proyecto:</strong> {projectName}</p>}
            <p className="text-sm"><strong>LOD Seleccionado:</strong> {selectedLOD}</p>
            <p className="text-sm"><strong>Horas {selectedLOD}:</strong> {actualLODHoursForSelected.toFixed(1)} h</p>
             <p className="text-sm"><strong>Valor Básico Hora:</strong> ${valorBasico.toFixed(2)} USD</p>
            <p className="text-sm"><strong>Ajuste Regional:</strong> {regionPercentage.toFixed(1)}%</p>
            <p className="text-sm"><strong>Superficie:</strong> {surfaceM2} m²</p>

            <Separator />
            {totalCostUSD !== null && (
              <div className="text-center my-4">
                <p className="text-2xl font-bold text-accent">
                  ${totalCostUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </p>
                {dollarExchangeRate !== 1 && totalCostLocal !== null && (
                  <p className="text-md text-muted-foreground">
                    Aprox. {totalCostLocal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Moneda Local a tasa {dollarExchangeRate})
                  </p>
                )}
              </div>
            )}
            {totalCostUSD === null && (
               <p className="text-center text-muted-foreground py-4">Presiona "Calcular" para ver el costo.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownloadPDF} className="w-full" variant="default">
              <Download className="mr-2 h-4 w-4" /> Descargar Resumen PDF (Próximamente)
            </Button>
          </CardFooter>
        </Card>

        {/* Deliverables Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecks className="mr-2 h-6 w-6 text-primary" /> Entregables Sugeridos
            </CardTitle>
            <CardDescription>Basado en el LOD y los Usos BIM seleccionados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
            <div>
              <h4 className="font-semibold mb-1">Usos BIM Seleccionados:</h4>
              {selectedUsesDetails.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {selectedUsesDetails.map(detail => <li key={detail}>{detail}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Ningún Uso BIM seleccionado.</p>
              )}
            </div>
            <Separator />
            {DELIVERABLES_CATEGORIES.map(category => (
              <div key={category.category}>
                <h4 className="font-semibold mb-1">{category.category}</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {category.items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
             <Separator />
             <div>
                <h4 className="font-semibold mb-1">Parámetros del Modelo (Ejemplos para {selectedLOD}):</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedLOD === "LoD 100" && "Parámetros básicos de área, volumen, ubicación, orientación."}
                  {selectedLOD === "LoD 200" && "Tipos genéricos de elementos, cantidades aproximadas, sistemas principales."}
                  {selectedLOD === "LoD 300" && "Dimensiones específicas, materiales, información de fabricante (genérica), atributos de rendimiento."}
                  {selectedLOD === "LoD 350" && "Detalles de conexión, interfaces entre sistemas, información para coordinación detallada."}
                  {selectedLOD === "LoD 400" && "Información para fabricación y montaje, tolerancias, instrucciones específicas."}
                  {selectedLOD === "LoD 500" && "Modelo As-Built verificado, datos para operación y mantenimiento, garantías, manuales."}
                </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </SectionCard>
  );
}
