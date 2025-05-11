
import type { LODLevel, LODHoursMap, UsoBIM, ProjectPhase } from '@/types';

// Master list of all possible LOD Levels
export const ALL_LOD_LEVELS: LODLevel[] = [
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
  { id: "1", nombre: "Modelado de estado actual", etapa_proyecto: "Planificación", lods_sugeridos: ["LoD 100", "LoD 200"], dependencias: [] },
  { id: "2", nombre: "Estimación de costes", etapa_proyecto: "Planificación", lods_sugeridos: ["LoD 100", "LoD 200"], dependencias: ["1"] },
  { id: "3", nombre: "Planificación de fases", etapa_proyecto: "Planificación", lods_sugeridos: ["LoD 100", "LoD 200"], dependencias: ["1"] },
  { id: "4", nombre: "Programación", etapa_proyecto: "Planificación", lods_sugeridos: ["LoD 100", "LoD 200"], dependencias: ["1"] },
  { id: "5", nombre: "Análisis de ubicación", etapa_proyecto: "Planificación", lods_sugeridos: ["LoD 100"], dependencias: ["1"] },
  { id: "6", nombre: "Auditoría de diseño", etapa_proyecto: "Diseño", lods_sugeridos: ["LoD 200", "LoD 300"], dependencias: ["5"] },
  { id: "7", nombre: "Revisión de diseño", etapa_proyecto: "Diseño", lods_sugeridos: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "8", nombre: "Análisis estructural", etapa_proyecto: "Diseño", lods_sugeridos: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "9", nombre: "Análisis de iluminación", etapa_proyecto: "Diseño", lods_sugeridos: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "10", nombre: "Análisis energético", etapa_proyecto: "Diseño", lods_sugeridos: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "11", nombre: "Análisis mecánico", etapa_proyecto: "Diseño", lods_sugeridos: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "12", nombre: "Otros análisis de ingeniería", etapa_proyecto: "Diseño", lods_sugeridos: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "13", nombre: "Evaluación de sostenibilidad", etapa_proyecto: "Diseño", lods_sugeridos: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "14", nombre: "Validación de la normativa", etapa_proyecto: "Diseño", lods_sugeridos: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "15", nombre: "Coordinación 3D", etapa_proyecto: "Diseño", lods_sugeridos: ["LoD 200", "LoD 300"], dependencias: ["6"] },
  { id: "16", nombre: "Planificación de obra", etapa_proyecto: "Construcción", lods_sugeridos: ["LoD 300", "LoD 350"], dependencias: ["3", "4"] },
  { id: "17", nombre: "Diseño de sistemas constructivos", etapa_proyecto: "Construcción", lods_sugeridos: ["LoD 300", "LoD 400"], dependencias: ["6", "7", "8"] },
  { id: "18", nombre: "Fabricación digital", etapa_proyecto: "Construcción", lods_sugeridos: ["LoD 350", "LoD 400"], dependencias: ["17"] },
  { id: "19", nombre: "Control y planificación de obra", etapa_proyecto: "Construcción", lods_sugeridos: ["LoD 300", "LoD 400"], dependencias: ["16"] },
  { id: "20", nombre: "Modelado As Built", etapa_proyecto: "Construcción", lods_sugeridos: ["LoD 400", "LoD 500"], dependencias: ["18", "19"] },
  { id: "21", nombre: "Programación de mantenimiento", etapa_proyecto: "Operación", lods_sugeridos: ["LoD 500"], dependencias: ["20"] },
  { id: "22", nombre: "Análisis de sistemas", etapa_proyecto: "Operación", lods_sugeridos: ["LoD 500"], dependencias: ["21"] },
  { id: "23", nombre: "Gestión de activos", etapa_proyecto: "Operación", lods_sugeridos: ["LoD 500"], dependencias: ["20", "21"] },
  { id: "24", nombre: "Administración y gestión de espacios", etapa_proyecto: "Operación", lods_sugeridos: ["LoD 500"], dependencias: ["20", "21"] },
  { id: "25", nombre: "Planificación y gestión de emergencias", etapa_proyecto: "Operación", lods_sugeridos: ["LoD 500"], dependencias: ["20", "21", "23"] },
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

export const LOD_DESCRIPTIONS: {
  [key in LODLevel]?: {
    title: string;
    aia: string;
    bimForum: string;
  }
} = {
  "LoD 100": {
    title: "LOD 100 - Conceptual",
    aia: "The Model Element may be graphically represented in the Model with a symbol or other generic representation, but does not satisfy the requirements for LOD 200. Information related to the Model Element (e.g., cost per square foot, tonnage of HVAC, etc.) can be derived from other Model Elements.",
    bimForum: "LOD 100 elements are not necessarily geometric representations. Examples are information attached to other model elements: symbols showing the existence of a component but not its shape, size, or precise location; or space reservation volumes. In essence, if information about an element can be derived from the model but the element is not at LOD 200 it is said to be at LOD 100. Any information derived from LOD 100 elements must be considered approximate."
  },
  "LoD 200": {
    title: "LOD 200 - Geometría Aproximada",
    aia: "The Model Element is generically and graphically represented within the Model with approximate quantity, size, shape, location, and orientation.",
    bimForum: "LOD 200 elements are generic placeholders but are recognizable as the components they represent (e.g. a pump, a light fixture, a beam, etc.). Any information derived from LOD 200 elements must be considered approximate."
  },
  "LoD 300": {
    title: "LOD 300 - Geometría Precisa (Diseño)",
    aia: "The Model Element, as designed, is graphically represented within the Model such that its quantity, size, shape, location, and orientation can be measured.",
    bimForum: "LOD 300 elements are sufficiently developed to fully convey the design intent for the represented item. Note that while neither the LOD definitions nor this Specification specify who models the element, designers rarely generate model elements higher than 300. See interpretation of LOD 350 below."
  },
  "LoD 350": {
    title: "LOD 350 - Coordinación",
    aia: "The Model Element, as designed, is graphically represented within the Model such that its quantity, size, shape, location, orientation, and interfaces with adjacent or dependent Model Elements can be measured.",
    bimForum: "LOD 350 is intended to define requirements for model elements that are sufficiently developed to support construction-level coordination. This LOD usually requires craft knowledge, thus the caveat in the LOD 300 interpretation above that designers rarely generate elements at LODs higher than 300. It should be remembered, though, that neither the LOD definitions nor this Specification specify who models the element – if a design team has craft knowledge available they might choose to develop elements to LOD 350 or higher."
  },
  "LoD 400": {
    title: "LOD 400 - Fabricación y Montaje",
    aia: "The Model Element is graphically represented within the Model with detail sufficient for fabrication, assembly, and installation.",
    bimForum: "LOD 400 describes a model element developed to the level of shop drawings – in most cases, if a project’s specifications call for shop drawings of an item, the project team might model the item at LOD 400. Thus most models contain few LOD 400 elements."
  },
  "LoD 500": {
    title: "LOD 500 - Como Construido / Condiciones Existentes",
    aia: "The Model Element is a graphic representation of an existing or as-constructed condition developed through a combination of observation, field verification, or interpolation. The level of accuracy shall be noted or attached to the Model Element.",
    bimForum: "LOD 500 does not indicate a higher level than LOD 400, rather it indicates that the element’s geometry is determined through observation of an existing item rather than design of a future item. The LOD 500 definition requires that the model element’s accuracy be specified – BIMForum recommends USIBD’s Level of Accuracy (LOA) Specification for this purpose."
  }
};

// Removed LOD_REFERENCE_TEXT
// export const LOD_REFERENCE_TEXT = {
//   aia: "AIA Contract Document E201-2022, BIM Exhibit for Sharing Models with Project Participants, Where Model Versions May be Enumerated as a Contract Document. The LOD definitions are used by permission. Copyright © 2022. ACD Operations, LLC. All rights reserved.",
//   bimForumSpec: "Level of Development Specification Version: 2024 Part I PUBLIC COMMENT DRAFT. www.bimforum.org/lod",
//   bimForumFeedback: "Post feedback/comments to https://form.jotform.com/233625210758051",
//   bimForumCopyright: "Copyright © 2024 BIMForum. All rights reserved. This document is copyrighted under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License."
// };

