
"use client";
import React, { // Changed from "import type React from 'react';" and added React to the import
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect // Added useEffect to direct imports
} from 'react';
import type { LODLevel, LODHoursMap, UsoBIM } from '@/types';
import { DEFAULT_LOD_HOURS, INITIAL_LOD, INITIAL_VB, INITIAL_REGION_PERCENTAGE, INITIAL_DOLLAR_EXCHANGE_RATE, INITIAL_SURFACE_M2, BIM_USES_DATA, INITIAL_PROJECT_NAME } from '@/config/constants';

interface BimContextType {
  projectName: string;
  setProjectName: (name: string) => void;
  valorBasico: number;
  setValorBasico: (value: number) => void;
  regionPercentage: number;
  setRegionPercentage: (value: number) => void;
  dollarExchangeRate: number;
  setDollarExchangeRate: (value: number) => void;
  surfaceM2: number;
  setSurfaceM2: (value: number) => void;
  selectedLOD: LODLevel;
  setSelectedLOD: (lod: LODLevel) => void;
  lodHoursMap: LODHoursMap;
  setLodHoursMap: (map: LODHoursMap | ((prevMap: LODHoursMap) => LODHoursMap)) => void;
  currentLODHours: { min: number; max: number };
  actualLODHoursForSelected: number; // Actual hours input by user for the selected LOD
  setActualLODHoursForSelected: (hours: number) => void;
  selectedBimUses: Set<string>; // Store IDs of selected BIM Uses
  toggleBimUse: (useId: string) => void;
  totalCostUSD: number | null;
  totalCostLocal: number | null;
  calculateTotalCost: () => void;
  resetAll: () => void;
}

const BimContext = createContext<BimContextType | undefined>(undefined);

export const BimProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectName, setProjectName] = useState<string>(INITIAL_PROJECT_NAME);
  const [valorBasico, setValorBasico] = useState<number>(INITIAL_VB);
  const [regionPercentage, setRegionPercentage] = useState<number>(INITIAL_REGION_PERCENTAGE);
  const [dollarExchangeRate, setDollarExchangeRate] = useState<number>(INITIAL_DOLLAR_EXCHANGE_RATE);
  const [surfaceM2, setSurfaceM2] = useState<number>(INITIAL_SURFACE_M2);
  const [selectedLOD, setSelectedLOD] = useState<LODLevel>(INITIAL_LOD);
  const [lodHoursMap, setLodHoursMap] = useState<LODHoursMap>(DEFAULT_LOD_HOURS);
  
  const currentLODHours = useMemo(() => lodHoursMap[selectedLOD] || { min: 0, max: 0 }, [lodHoursMap, selectedLOD]);
  
  const [actualLODHoursForSelected, setActualLODHoursForSelected] = useState<number>(currentLODHours.min);

  useEffect(() => { // Changed from React.useEffect to useEffect
    setActualLODHoursForSelected(lodHoursMap[selectedLOD]?.min || 0);
  }, [selectedLOD, lodHoursMap]);


  const [selectedBimUses, setSelectedBimUses] = useState<Set<string>>(new Set());
  const [totalCostUSD, setTotalCostUSD] = useState<number | null>(null);
  const [totalCostLocal, setTotalCostLocal] = useState<number | null>(null);

  const toggleBimUse = useCallback((useId: string) => {
    setSelectedBimUses(prevUses => {
      const newUses = new Set(prevUses);
      const bimUse = BIM_USES_DATA.find(u => u.id === useId);
      if (!bimUse) return newUses;

      if (newUses.has(useId)) {
        newUses.delete(useId);
        // Basic uncheck: if other uses depend on this, they are NOT automatically unchecked for simplicity.
        // Advanced: Implement logic to warn or uncheck dependents.
      } else {
        newUses.add(useId);
        // Auto-select dependencies
        const checkDependencies = (dependencies: string[]) => {
          dependencies.forEach(depId => {
            if (!newUses.has(depId)) {
              newUses.add(depId);
              const depUse = BIM_USES_DATA.find(u => u.id === depId);
              if (depUse && depUse.dependencias.length > 0) {
                checkDependencies(depUse.dependencias);
              }
            }
          });
        };
        if (bimUse.dependencias.length > 0) {
          checkDependencies(bimUse.dependencias);
        }
      }
      return newUses;
    });
  }, []);
  
  const calculateTotalCost = useCallback(() => {
    // Basic calculation: (VB * (1 + Region %)) * Actual LOD Hours for selected LOD
    // This is a simplified calculation. A more complex one would sum hours for *all* selected BIM uses,
    // considering their typical hours and LOD relevance.
    // The prompt implies LOD hours are global for the model, not per BIM use.
    // "Seteo incial de horas por Lod" suggests the primary driver for hours is the overall model LOD.

    const regionalAdjustedVB = valorBasico * (1 + regionPercentage / 100);
    const costUSD = regionalAdjustedVB * actualLODHoursForSelected;
    
    // Placeholder for complexity factor based on surfaceM2 or number of BIM uses
    // For now, surfaceM2 is just an input field, not directly in calculation logic as per prompt's formula structure.
    // For now, selectedBimUses count is not directly in calculation logic, could be a multiplier.

    setTotalCostUSD(costUSD);
    setTotalCostLocal(costUSD * dollarExchangeRate);
  }, [valorBasico, regionPercentage, actualLODHoursForSelected, dollarExchangeRate]);

  const resetAll = useCallback(() => {
    setProjectName(INITIAL_PROJECT_NAME);
    setValorBasico(INITIAL_VB);
    setRegionPercentage(INITIAL_REGION_PERCENTAGE);
    setDollarExchangeRate(INITIAL_DOLLAR_EXCHANGE_RATE);
    setSurfaceM2(INITIAL_SURFACE_M2);
    setSelectedLOD(INITIAL_LOD);
    setLodHoursMap(DEFAULT_LOD_HOURS);
    setActualLODHoursForSelected(DEFAULT_LOD_HOURS[INITIAL_LOD].min);
    setSelectedBimUses(new Set());
    setTotalCostUSD(null);
    setTotalCostLocal(null);
  }, []);


  const contextValue = useMemo(() => ({
    projectName, setProjectName,
    valorBasico, setValorBasico,
    regionPercentage, setRegionPercentage,
    dollarExchangeRate, setDollarExchangeRate,
    surfaceM2, setSurfaceM2,
    selectedLOD, setSelectedLOD,
    lodHoursMap, setLodHoursMap,
    currentLODHours,
    actualLODHoursForSelected, setActualLODHoursForSelected,
    selectedBimUses, toggleBimUse,
    totalCostUSD, totalCostLocal, calculateTotalCost,
    resetAll,
  }), [
    projectName, valorBasico, regionPercentage, dollarExchangeRate, surfaceM2,
    selectedLOD, lodHoursMap, currentLODHours, actualLODHoursForSelected,
    selectedBimUses, toggleBimUse, totalCostUSD, totalCostLocal, calculateTotalCost, resetAll
  ]);

  return <BimContext.Provider value={contextValue}>{children}</BimContext.Provider>;
};

export const useBimContext = (): BimContextType => {
  const context = useContext(BimContext);
  if (context === undefined) {
    throw new Error('useBimContext must be used within a BimProvider');
  }
  return context;
};

