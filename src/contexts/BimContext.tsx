
"use client";
import React, { 
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect
} from 'react';
import type { LODLevel, LODHoursMap } from '@/types';
import { 
  DEFAULT_LOD_HOURS, 
  INITIAL_LOD, 
  INITIAL_VB, 
  INITIAL_REGION_PERCENTAGE, 
  INITIAL_DOLLAR_EXCHANGE_RATE, 
  INITIAL_SURFACE_M2, 
  BIM_USES_DATA, 
  INITIAL_PROJECT_NAME,
  ALL_LOD_LEVELS // Ensure this is imported
} from '@/config/constants';

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
  actualLODHoursForSelected: number;
  setActualLODHoursForSelected: (hours: number) => void;
  selectedBimUses: Set<string>;
  toggleBimUse: (useId: string) => void;
  totalCostUSD: number | null;
  totalCostLocal: number | null;
  calculateTotalCost: () => void;
  resetAll: () => void;
  suggestedLodsForSelect: LODLevel[]; // LODs suggested by selected BIM uses for the dropdown
  highlightedDependencies: Set<string>; // BIM Use IDs that are dependencies of selected uses
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

  const [selectedBimUses, setSelectedBimUses] = useState<Set<string>>(new Set());
  const [suggestedLodsForSelect, setSuggestedLodsForSelect] = useState<LODLevel[]>(ALL_LOD_LEVELS);
  const [highlightedDependencies, setHighlightedDependencies] = useState<Set<string>>(new Set());

  const [totalCostUSD, setTotalCostUSD] = useState<number | null>(null);
  const [totalCostLocal, setTotalCostLocal] = useState<number | null>(null);

  useEffect(() => {
    setActualLODHoursForSelected(lodHoursMap[selectedLOD]?.min || 0);
  }, [selectedLOD, lodHoursMap]);

  const toggleBimUse = useCallback((useId: string) => {
    setSelectedBimUses(prevUses => {
      const newUses = new Set(prevUses);
      const bimUse = BIM_USES_DATA.find(u => u.id === useId);
      if (!bimUse) return newUses;

      if (newUses.has(useId)) {
        newUses.delete(useId);
        // Basic uncheck: if other uses depend on this, they are NOT automatically unchecked.
        // Users will need to manually uncheck them or they will become disabled if their dependency is removed.
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
  
  useEffect(() => {
    const newSuggestedLods = new Set<LODLevel>();
    const newHighlightedDeps = new Set<string>();

    selectedBimUses.forEach(useId => {
      const bimUse = BIM_USES_DATA.find(u => u.id === useId);
      if (bimUse) {
        bimUse.lods_sugeridos.forEach(lod => newSuggestedLods.add(lod));
        bimUse.dependencias.forEach(depId => newHighlightedDeps.add(depId));
      }
    });

    const sortedSuggestedLods = Array.from(newSuggestedLods).sort((a, b) => {
        const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
        const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
        return aNum - bNum;
    });

    setHighlightedDependencies(newHighlightedDeps);

    if (sortedSuggestedLods.length > 0) {
      setSuggestedLodsForSelect(sortedSuggestedLods);
      if (!sortedSuggestedLods.includes(selectedLOD)) {
        setSelectedLOD(sortedSuggestedLods[0]);
      }
    } else {
      setSuggestedLodsForSelect(ALL_LOD_LEVELS);
      // If no suggestions, ensure selectedLOD is still valid or reset
      if (!ALL_LOD_LEVELS.includes(selectedLOD)){
        setSelectedLOD(INITIAL_LOD);
      }
    }
  }, [selectedBimUses, selectedLOD]);


  const calculateTotalCost = useCallback(() => {
    const regionalAdjustedVB = valorBasico * (1 + regionPercentage / 100);
    const costUSD = regionalAdjustedVB * actualLODHoursForSelected;
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
    // actualLODHoursForSelected will be reset by its useEffect based on INITIAL_LOD and DEFAULT_LOD_HOURS
    setSelectedBimUses(new Set());
    setSuggestedLodsForSelect(ALL_LOD_LEVELS); // Reset suggested LODs to all
    setHighlightedDependencies(new Set());
    setTotalCostUSD(null);
    setTotalCostLocal(null);
  }, []);

  useEffect(() => {
    // This effect ensures actualLODHoursForSelected is updated when selectedLOD changes.
    // It needs to run after selectedLOD might have been changed by the BIM use selection logic.
    setActualLODHoursForSelected(lodHoursMap[selectedLOD]?.min || 0);
  }, [selectedLOD, lodHoursMap]);


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
    suggestedLodsForSelect,
    highlightedDependencies,
  }), [
    projectName, valorBasico, regionPercentage, dollarExchangeRate, surfaceM2,
    selectedLOD, lodHoursMap, currentLODHours, actualLODHoursForSelected,
    selectedBimUses, toggleBimUse, totalCostUSD, totalCostLocal, calculateTotalCost, resetAll,
    suggestedLodsForSelect, highlightedDependencies
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
