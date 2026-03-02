"use client";
import { useBimContext } from '@/contexts/BimContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DELIVERABLES_BY_BIM_USE, BIM_USES_DATA } from '@/config/constants';
import { SectionCard } from './SectionCard';
import { FileText, DollarSign, Download, ListChecks, Calculator, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { jsPDF } from "jspdf"; // IMPORTANTE: Importar jsPDF así
//import "jspdf-autotable"; // Importar el plugin
//import { UserOptions } from 'jspdf-autotable'; // Opcional, para tipado

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

// --- NUEVA LÓGICA DE PDF AQUÍ ---
  const handleDownloadPDF = async () => {
  // Importaciones dinámicas con await — esto garantiza que autoTable
  // se registre DESPUÉS de que jsPDF esté disponible en el cliente
  const jsPDFModule = await import("jspdf");
  const jsPDF = jsPDFModule.jsPDF;
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();

  // Registrar manualmente el plugin en la instancia
  autoTable(doc, {
    startY: 65,
    head: [['Uso BIM', 'Entregable Gráfico', 'Entregable Técnico']],
    body: Array.from(selectedBimUses).map(id => {
      const use = BIM_USES_DATA.find(u => u.id === id);
      const delivs = DELIVERABLES_BY_BIM_USE[id];
      return [
        use?.nombre || "Desconocido",
        delivs?.grafica || "-",
        delivs?.tecnicaProyecto || "-"
      ];
    }),
    theme: 'grid',
    headStyles: { fillColor: [40, 116, 166] },
  });

  // Título principal
  doc.setFontSize(20);
  doc.text("Resumen de Presupuesto BIM", 14, 20);

  // Información General
  doc.setFontSize(12);
  doc.text(`Proyecto: ${projectName || "Sin nombre"}`, 14, 30);
  doc.text(`LOD Seleccionado: ${selectedLOD}`, 14, 38);
  doc.text(`Horas Totales: ${actualLODHoursForSelected.toFixed(1)} h`, 14, 46);

  // Costo Total destacado
  doc.setFontSize(14);
  doc.setTextColor(40, 116, 166);
  doc.text(
    `Costo Total: $${totalCostUSD?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`,
    14, 56
  );
  doc.setTextColor(0, 0, 0);

  doc.save(`Presupuesto_${projectName || "BIM"}.pdf`);

  toast({
    title: "PDF Generado",
    description: "El resumen ha sido descargado exitosamente.",
    variant: "default",
  });
};
  // ---------------------------------
  
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
      return BIM_USES_DATA.find(u => u.id === id);
    }).filter(Boolean); // Filter out undefined if a use is not found
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
              <Download className="mr-2 h-4 w-4" /> Descargar Resumen PDF
            </Button>
          </CardFooter>
        </Card>

        {/* Deliverables Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecks className="mr-2 h-6 w-6 text-primary" /> Entregables Sugeridos por Uso BIM
            </CardTitle>
            <CardDescription>Basado en el LOD y los Usos BIM seleccionados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
             {selectedUsesDetails.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {selectedUsesDetails.map(use => {
                    const deliverables = DELIVERABLES_BY_BIM_USE[use!.id];
                    const isLodCompatible = use!.lods_sugeridos.includes(selectedLOD);
                    return (
                       <AccordionItem value={use!.id} key={use!.id}>
                        <AccordionTrigger className={!isLodCompatible ? 'text-destructive' : ''}>
                          {use!.id}. {use!.nombre}
                          {!isLodCompatible && <span className="text-xs ml-2">(LOD no óptimo)</span>}
                        </AccordionTrigger>
                        <AccordionContent className="text-xs space-y-1 pl-2">
                          {deliverables ? (
                            <>
                              <p><strong>Gráfica:</strong> {deliverables.grafica}</p>
                              <p><strong>Datos/Gestión:</strong> {deliverables.datosGestion}</p>
                              <p><strong>Técnica/Proyecto:</strong> {deliverables.tecnicaProyecto}</p>
                              <p><strong>O&M:</strong> {deliverables.om}</p>
                            </>
                          ) : (
                            <p className="text-muted-foreground">No hay entregables específicos definidos para este uso.</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Selecciona uno o más Usos BIM para ver los entregables sugeridos.</p>
              )}
          </CardContent>
        </Card>
      </div>
    </SectionCard>
  );
}