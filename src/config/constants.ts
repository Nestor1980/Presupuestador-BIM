
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

export const DELIVERABLES_BY_BIM_USE: { [key: string]: { grafica: string; datosGestion: string; tecnicaProyecto: string; om: string; } } = {
  // Planificación
  "1": { grafica: "Modelo topográfico conceptual, curvas de nivel.", datosGestion: "Cuadro de superficies y cotas principales.", tecnicaProyecto: "Informe de condiciones iniciales del sitio.", om: "No aplica en esta etapa." },
  "2": { grafica: "Diagramas volumétricos de referencia.", datosGestion: "Estimación de cantidades preliminares (BoQ paramétrico).", tecnicaProyecto: "Presupuesto estimativo.", om: "No aplica." },
  "3": { grafica: "Gantt esquemático vinculado a hitos.", datosGestion: "Secuenciación preliminar de obra.", tecnicaProyecto: "Informe de planificación de fases.", om: "No aplica." },
  "4": { grafica: "Layouts conceptuales, diagramas de ocupación.", datosGestion: "Planillas de áreas funcionales.", tecnicaProyecto: "Reporte de cumplimiento con programa.", om: "No aplica." }, // Asumiendo que Programación es Distribución de Espacios
  "5": { grafica: "Mapas de asoleamiento, orientación, accesibilidad.", datosGestion: "Parámetros de localización (coordenadas, normativas aplicables).", tecnicaProyecto: "Informe de viabilidad del sitio.", om: "No aplica." },
  // Diseño
  "6": { grafica: "Modelos en desarrollo (LOD 200–300).", datosGestion: "Informes de revisiones y comentarios.", tecnicaProyecto: "Registro de issues de diseño.", om: "No aplica aún." }, // Asumiendo Auditoria de Diseño es Revisión de Diseño
  "7": { grafica: "Modelos disciplinares (ARQ, STR, MEP).", datosGestion: "Listas de componentes y sistemas preliminares.", tecnicaProyecto: "Informe de diseño y memoria descriptiva.", om: "No aplica aún." }, // Asumiendo Revisión de Diseño es Modelo de Diseño
  "8": { grafica: "Esquemas de cargas y deformaciones.", datosGestion: "Resultados numéricos de cálculo.", tecnicaProyecto: "Informe de cálculo estructural.", om: "No aplica." },
  "9": { grafica: "Mapas de lux, renderizados.", datosGestion: "Valores de iluminancia por espacio.", tecnicaProyecto: "Informe técnico de iluminación natural/artificial.", om: "No aplica." },
  "10": { grafica: "Diagramas de consumo energético.", datosGestion: "Tablas de simulación energética.", tecnicaProyecto: "Informe comparativo de escenarios.", om: "No aplica." },
  "11": { grafica: "Diagramas de flujos de aire.", datosGestion: "Listas de cargas térmicas.", tecnicaProyecto: "Informe de cálculo HVAC.", om: "No aplica." }, // Análisis mecánico as HVAC
  "12": { grafica: "Diagramas específicos (acústica, fuego, etc.).", datosGestion: "Resultados numéricos.", tecnicaProyecto: "Informes técnicos especializados.", om: "No aplica." },
  "13": { grafica: "Diagramas de huella ambiental.", datosGestion: "Tablas de emisiones, consumo de recursos.", tecnicaProyecto: "Informe LEED/BREEAM preliminar.", om: "No aplica." },
  "14": { grafica: "Planos de cumplimiento normativo.", datosGestion: "Checklist normativos.", tecnicaProyecto: "Informe de cumplimiento de códigos.", om: "No aplica." },
  "15": { grafica: "Modelo federado.", datosGestion: "Reportes de clash detection.", tecnicaProyecto: "Informe de coordinación.", om: "No aplica." }, // Coordinación 3D
  // Construcción
  "16": { grafica: "Secuencia 4D.", datosGestion: "Cronograma detallado.", tecnicaProyecto: "Informe de planificación ejecutiva.", om: "No aplica." },
  "17": { grafica: "Modelos 3D para montaje/VR.", datosGestion: "Catálogo digital de componentes.", tecnicaProyecto: "Guías de montaje.", om: "No aplica." }, // Diseño de sistemas constructivos
  "18": { grafica: "Planos de taller.", datosGestion: "Listas de corte y fabricación.", tecnicaProyecto: "Archivos CNC/impresión 3D.", om: "No aplica." },
  "19": { grafica: "Puntos topográficos y de control.", datosGestion: "Archivos de replanteo (CSV, XML).", tecnicaProyecto: "Reportes de verificación en sitio.", om: "No aplica." }, // Control y planificación de obra
  "20": { grafica: "Modelo actualizado (LOD 400/500).", datosGestion: "Listas finales de equipos y materiales.", tecnicaProyecto: "Planos finales de obra.", om: "Base para COBie y Facility Management." },
  // Operación
  "21": { grafica: "Diagramas de ciclo de mantenimiento.", datosGestion: "Calendarios y protocolos preventivos.", tecnicaProyecto: "Manual de mantenimiento.", om: "Registro en plataforma de gestión de activos." }, // Programación de mantenimiento
  "22": { grafica: "Dashboards de desempeño.", datosGestion: "KPIs de uso energético y funcionamiento.", tecnicaProyecto: "Informes comparativos de performance.", om: "Ajustes de operación." }, // Análisis de sistemas
  "23": { grafica: "Mapas de localización de activos.", datosGestion: "Inventarios y fichas de equipos.", tecnicaProyecto: "Reportes financieros asociados a activos.", om: "Integración con ERP/CMMS." },
  "24": { grafica: "Planos de ocupación.", datosGestion: "Listados de usuarios y espacios asignados.", tecnicaProyecto: "Reportes de uso de espacios.", om: "Actualización de layout." },
  "25": { grafica: "Rutas de evacuación, planos de seguridad.", datosGestion: "Protocolos y fichas de riesgos.", tecnicaProyecto: "Plan de contingencia documentado.", om: "Integración con protocolos de seguridad." },
};


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
