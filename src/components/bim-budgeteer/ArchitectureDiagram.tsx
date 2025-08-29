
"use client";

import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { SectionCard } from './SectionCard';
import { Share2 } from 'lucide-react';

const mermaidChart = `
graph TD
    subgraph "Cliente (Navegador)"
        A[Usuario]
    end

    subgraph "Frontend (Next.js / React)"
        B[Páginas y Componentes <br> /src/app/page.tsx <br> /src/components/bim-budgeteer/*]
        C[Gestión de Estado (React Context) <br> /src/contexts/BimContext.tsx]
        D[UI Components (ShadCN UI) <br> /src/components/ui/*]
        E[Estilos (Tailwind CSS) <br> /src/app/globals.css]
    end

    subgraph "Backend (Next.js / Firebase)"
        F[Lógica de Servidor <br> (en BimContext.tsx)]
        G[Base de Datos (Firestore) <br> /src/lib/firebase.ts]
    end

    A -- Interactúa con --> B
    B -- Lee y actualiza estado --> C
    B -- Usa --> D
    D -- Estilizado por --> E
    C -- Llama a funciones de backend --> F
    F -- Guarda y carga datos --> G
`;

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    background: '#ffffff',
    primaryColor: '#f2f2f2',
    primaryTextColor: '#333333',
    primaryBorderColor: '#3498db',
    lineColor: '#3498db',
    textColor: '#333333',
    fontSize: '14px',
    fontFamily: 'Arial, Helvetica, sans-serif'
  }
});

export function ArchitectureDiagram() {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render('mermaid-diagram', mermaidChart);
        setSvg(svg);
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
      }
    };
    renderDiagram();
  }, []);

  return (
    <SectionCard
      title="Diagrama de Arquitectura del Proyecto"
      description="Este diagrama ilustra cómo las diferentes tecnologías y componentes del proyecto interactúan entre sí."
      icon={Share2}
    >
      <div className="flex justify-center items-center p-4 border rounded-lg bg-card shadow-inner">
        {svg ? (
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <p>Cargando diagrama...</p>
        )}
      </div>
       <div className="mt-6 space-y-2 text-sm text-muted-foreground">
        <p><strong>Frontend:</strong> La interfaz de usuario está construida con <strong>Next.js</strong> y <strong>React</strong>. Los componentes visuales son de <strong>ShadCN UI</strong>, estilizados con <strong>Tailwind CSS</strong>. El estado global se maneja a través de <strong>React Context</strong>.</p>
        <p><strong>Backend:</strong> La lógica del lado del servidor, como guardar y cargar presupuestos, se maneja dentro de funciones que se comunican con <strong>Firebase Firestore</strong>, nuestra base de datos NoSQL.</p>
        <p><strong>Flujo:</strong> El usuario interactúa con los componentes de React. Estos componentes leen y escriben en el <strong>BimContext</strong>. Cuando se necesita persistir datos (guardar/cargar), el Context llama a funciones que se ejecutan en el servidor para comunicarse de forma segura con la base de datos de Firestore.</p>
      </div>
    </SectionCard>
  );
}
