
export type LODLevel = "LoD 100" | "LoD 200" | "LoD 300" | "LoD 350" | "LoD 400" | "LoD 500";

export interface LODHours {
  min: number;
  max: number;
}

export type LODHoursMap = {
  [key in LODLevel]: LODHours;
};

export interface ConfiguracionGlobal {
  valor_basico: number;
  porcentaje_region: { [key: string]: number };
  cotizacion_dolar: number;
  superficie_minima: number;
  horas_por_lod: LODHoursMap;
}

export type ProjectPhase = "Planificación" | "Diseño" | "Construcción" | "Operación";

export interface UsoBIM {
  id: string;
  nombre: string;
  etapa_proyecto: ProjectPhase;
  lods_sugeridos: LODLevel[]; // Renamed from lod
  dependencias: string[];
  description?: string; // Optional: for tooltips or more info
}

export interface Presupuesto {
  id: string;
  usuario_id?: string; // Optional if no auth initially
  configuracion: {
    valor_basico: number;
    porcentaje_region_seleccionado: number; // Assuming one percentage for simplicity
    cotizacion_dolar: number;
    superficie_m2: number;
    horas_por_lod: LODHoursMap; // User might adjust these per budget
  };
  lod_seleccionado: LODLevel;
  horas_reales_lod: number; // Actual hours chosen by user for the selected LOD
  usos_seleccionados: string[]; // Array of UsoBIM IDs
  fecha_creacion: Date;
  costo_total_usd?: number;
  costo_total_local?: number;
  nombre_proyecto?: string;
}

export interface Deliverable {
  category: string;
  items: string[];
}
