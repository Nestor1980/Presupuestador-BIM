
import { Header } from '@/components/bim-budgeteer/Header';
import { Footer } from '@/components/bim-budgeteer/Footer';
import { BasicSettingsForm } from '@/components/bim-budgeteer/BasicSettingsForm';
import { BimUsesSelection } from '@/components/bim-budgeteer/BimUsesSelection';
import { LodVisualization } from '@/components/bim-budgeteer/LodVisualization';
import { DeliverablesSummary } from '@/components/bim-budgeteer/DeliverablesSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Workflow, Layers, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="settings" className="flex items-center gap-2"><Settings className="h-4 w-4"/>Configuración</TabsTrigger>
            <TabsTrigger value="bimUses" className="flex items-center gap-2"><Workflow className="h-4 w-4"/>Usos BIM</TabsTrigger>
            <TabsTrigger value="lodViz" className="flex items-center gap-2"><Layers className="h-4 w-4"/>Visualización LOD</TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2"><FileText className="h-4 w-4"/>Resumen</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <BasicSettingsForm />
          </TabsContent>
          <TabsContent value="bimUses">
            <BimUsesSelection />
          </TabsContent>
          <TabsContent value="lodViz">
            <LodVisualization />
          </TabsContent>
          <TabsContent value="summary">
            <DeliverablesSummary />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
