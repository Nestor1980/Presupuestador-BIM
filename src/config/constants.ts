import type { LODLevel, LODHoursMap, UsoBIM, ProjectPhase } from '@/types';

export const LOD_LEVELS: LODLevel[] = [
  "LoD 100",
  "LoD 200",
  "LoD 300",
  "LoD 350",
  "LoD 400",
  "LoD 500",
];

export const DEFAULT_LOD_HOURS: LODHoursMap = {
  "LoD 100": { min: 2.5, max: 5 },
  "LoD 200": { min: 5, max: 10 },
  "LoD 300": { min: 10, max: 20 },
  "LoD 350": { min: 10, max: 20 }, // As per prompt, same as LOD 300
  "LoD 400": { min: 20, max: 40 },
  "LoD 500": { min: 30, max: 60 },
};

export const PROJECT_PHASES: ProjectPhase[] = [
  "Planificación",
  "Diseño",
  "Construcción",
  "Operación",
];

export const BIM_USES_DATA: UsoBIM[] = [
  { id: "1", nombre: "Modelado de estado actual", etapa_proyecto: "Planificación", lod: ["LoD 100", "LoD 200"], dependencias: [] },
  { id: "2", nombre: "Estimación de costes", etapa_proyecto: "Planificación", lod: ["LoD 100", "LoD 200"], dependencias: ["1"] },
  { id: "3", nombre: "Planificación de fases", etapa_proyecto: "Planificación", lod: ["LoD 100", "LoD 200"], dependencias: ["1"] },
  { id: "4", nombre: "Programación", etapa_proyecto: "Planificación", lod: ["LoD 100", "LoD 200"], dependencias: ["1"] },
  { id: "5", nombre: "Análisis de ubicación", etapa_proyecto: "Planificación", lod: ["LoD 100"], dependencias: ["1"] },
  { id: "6", nombre: "Auditoría de diseño", etapa_proyecto: "Diseño", lod: ["LoD 200", "LoD 300"], dependencias: ["5"] },
  { id: "7", nombre: "Revisión de diseño", etapa_proyecto: "Diseño", lod: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "8", nombre: "Análisis estructural", etapa_proyecto: "Diseño", lod: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "9", nombre: "Análisis de iluminación", etapa_proyecto: "Diseño", lod: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "10", nombre: "Análisis energético", etapa_proyecto: "Diseño", lod: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "11", nombre: "Análisis mecánico", etapa_proyecto: "Diseño", lod: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "12", nombre: "Otros análisis de ingeniería", etapa_proyecto: "Diseño", lod: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "13", nombre: "Evaluación de sostenibilidad", etapa_proyecto: "Diseño", lod: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "14", nombre: "Validación de la normativa", etapa_proyecto: "Diseño", lod: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "15", nombre: "Coordinación 3D", etapa_proyecto: "Diseño", lod: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "16", nombre: "Planificación de obra", etapa_proyecto: "Construcción", lod: ["LoD 300", "LoD 350"], dependencias: ["3", "4"] },
  { id: "17", nombre: "Diseño de sistemas constructivos", etapa_proyecto: "Construcción", lod: ["LoD 300", "LoD 400"], dependencias: ["6", "7", "8"] },
  { id: "18", nombre: "Fabricación digital", etapa_proyecto: "Construcción", lod: ["LoD 350", "LoD 400"], dependencias: ["17"] },
  { id: "19", nombre: "Control y planificación de obra", etapa_proyecto: "Construcción", lod: ["LoD 300", "LoD 400"], dependencias: ["16"] },
  { id: "20", nombre: "Modelado As Built", etapa_proyecto: "Construcción", lod: ["LoD 400", "LoD 500"], dependencias: ["18", "19"] },
  { id: "21", nombre: "Programación de mantenimiento", etapa_proyecto: "Operación", lod: ["LoD 500"], dependencias: ["20"] },
  { id: "22", nombre: "Análisis de sistemas", etapa_proyecto: "Operación", lod: ["LoD 500"], dependencias: ["21"] },
  { id: "23", nombre: "Gestión de activos", etapa_proyecto: "Operación", lod: ["LoD 500"], dependencias: ["20", "21"] },
  { id: "24", nombre: "Administración y gestión de espacios", etapa_proyecto: "Operación", lod: ["LoD 500"], dependencias: ["20", "21"] },
  { id: "25", nombre: "Planificación y gestión de emergencias", etapa_proyecto: "Operación", lod: ["LoD 500"], dependencias: ["20", "21", "23"] },
];

export const INITIAL_PROJECT_NAME = "Mi Proyecto BIM";
export const INITIAL_VB = 25; // USD
export const INITIAL_REGION_PERCENTAGE = 0; // For "Region Central"
export const INITIAL_DOLLAR_EXCHANGE_RATE = 1; // Default 1:1 if not specified
export const INITIAL_SURFACE_M2 = 50;
export const INITIAL_LOD: LODLevel = "LoD 300";

export const DELIVERABLES_CATEGORIES = [
  {
    category: "Documentación Gráfica",
    items: [
      "Planos 2D extraídos del modelo BIM (plantas, cortes, vistas, fachadas).",
      "Diagramas y esquemas (redes de instalaciones, detalles constructivos).",
      "Tablas de planificación generadas automáticamente desde el modelo.",
    ],
  },
  {
    category: "Documentación de Datos y Gestión de Información",
    items: [
      "Plan de Ejecución BIM (BEP): Documento que define cómo se implementará BIM en el proyecto.",
      "EIR (Exchange Information Requirements): Documento con los requerimientos de información esperados en cada fase.",
      "Modelo de Información del Activo (AIM - Asset Information Model): Conjunto de datos para la operación y mantenimiento del edificio.",
    ],
  },
  {
    category: "Documentación Técnica y de Gestión del Proyecto",
    items: [
      "Especificaciones técnicas vinculadas a los elementos modelados.",
      "Memorias descriptivas y cálculos de estructuras e instalaciones.",
      "Cronogramas y planificación 4D (integración de modelos con planificación).",
      "Presupuestos y estimaciones 5D (asociación de costos a elementos del modelo).",
    ],
  },
  {
    category: "Documentación para Operación y Mantenimiento (O&M)",
    items: [
      "Manuales de operación y mantenimiento.",
      "Registros de garantía y fichas técnicas de los equipos e instalaciones.",
      "Historial de mantenimiento y documentación de revisiones.",
      "COBie (Construction-Operations Building Information Exchange) (si aplica)",
    ],
  },
];
