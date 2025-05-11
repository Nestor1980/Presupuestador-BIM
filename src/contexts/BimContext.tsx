
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
  ALL_LOD_LEVELS
} from '@/config/constants';
import { collection, getDocs, query, where, doc, getDoc, setDoc, updateDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 

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
  bimUsesData: UsoBIM[]; 
  totalCostUSD: number | null;
  totalCostLocal: number | null;
  calculateTotalCost: () => void;
  resetAll: () => void;
  saveBudget: (budgetId?: string) => Promise<string | undefined>;
  loadBudget: (budgetId: string) => Promise<void>;
  suggestedLodsForSelect: LODLevel[];
  highlightedDependencies: Set<string>;
}

interface UsoBIM {
  id: string;
  nombre: string;
  etapa_proyecto: string; 
  lods_sugeridos: LODLevel[];
  dependencias: string[];
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
  const [bimUsesData, setBimUsesData] = useState<UsoBIM[]>(BIM_USES_DATA); 


 useEffect(() => {
    const fetchBimUses = async () => {
      try {
        const q = query(collection(db, "usos_bim"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const uses: UsoBIM[] = [];
          querySnapshot.forEach((doc) => {
            uses.push({ id: doc.id, ...doc.data() } as UsoBIM);
          });
          if (uses.length > 0) {
            setBimUsesData(uses);
          } else {
            setBimUsesData(BIM_USES_DATA);
          }
        }, (error) => {
          console.error("Error fetching BIM uses from Firebase: ", error);
          setBimUsesData(BIM_USES_DATA); 
        });
        return () => unsubscribe(); 
      } catch (error) {
        console.error("Error setting up BIM uses listener: ", error);
        setBimUsesData(BIM_USES_DATA); 
      }
    };
    fetchBimUses();
  }, []);


  useEffect(() => {
    setActualLODHoursForSelected(lodHoursMap[selectedLOD]?.min || 0);
  }, [selectedLOD, lodHoursMap]);

  const toggleBimUse = useCallback((useId: string) => {
    setSelectedBimUses(prevUses => {
      const newUses = new Set(prevUses);
      const bimUse = bimUsesData.find(u => u.id === useId);
      if (!bimUse) return newUses;

      if (newUses.has(useId)) {
        newUses.delete(useId);
        // Note: Deselecting dependencies automatically if they are no longer required by any other selected use
        // can be complex. Current behavior: a use becomes disabled if its direct dependency is deselected.
        // Highlighting and suggestion logic will update based on the remaining selected uses.
      } else {
        newUses.add(useId);
        // Recursively add dependencies
        const addDepsRecursive = (dependencies: string[]) => {
          dependencies.forEach(depId => {
            if (!newUses.has(depId)) {
              newUses.add(depId);
              const depU = bimUsesData.find(u => u.id === depId);
              if (depU && depU.dependencias.length > 0) {
                addDepsRecursive(depU.dependencias);
              }
            }
          });
        };
        addDepsRecursive(bimUse.dependencias);
      }
      return newUses;
    });
  }, [bimUsesData]);
  
  useEffect(() => {
    const newSuggestedLodsSet = new Set<LODLevel>();
    const newHighlightedDepsSet = new Set<string>();

    selectedBimUses.forEach(selectedUseId => {
      const bimUse = bimUsesData.find(u => u.id === selectedUseId);
      if (bimUse) {
        bimUse.lods_sugeridos.forEach(lod => newSuggestedLodsSet.add(lod));
        bimUse.dependencias.forEach(depId => {
          if (selectedBimUses.has(depId)) { // Only mark for highlight if the dependency is actually selected
            newHighlightedDepsSet.add(depId);
          }
        });
      }
    });

    const sortedSuggestedLodsArray = Array.from(newSuggestedLodsSet).sort((a, b) => {
        const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
        const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
        return aNum - bNum;
    });

    setHighlightedDependencies(newHighlightedDepsSet);

    if (sortedSuggestedLodsArray.length > 0) {
      setSuggestedLodsForSelect(sortedSuggestedLodsArray);
      if (!selectedLOD || !sortedSuggestedLodsArray.includes(selectedLOD)) {
        setSelectedLOD(sortedSuggestedLodsArray[0]);
      }
    } else {
      setSuggestedLodsForSelect(ALL_LOD_LEVELS);
      if (selectedLOD && !ALL_LOD_LEVELS.includes(selectedLOD)) {
        setSelectedLOD(INITIAL_LOD);
      } else if (!selectedLOD) {
        setSelectedLOD(INITIAL_LOD);
      }
    }
  }, [selectedBimUses, bimUsesData, selectedLOD, setSelectedLOD]);


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
    setLodHoursMap(DEFAULT_LOD_HOURS);
    setSelectedBimUses(new Set()); // This triggers useEffect to reset suggestedLods & selectedLOD
    setTotalCostUSD(null);
    setTotalCostLocal(null);
    // actualLODHoursForSelected will be reset by its own useEffect when selectedLOD changes
  }, []);

   const saveBudget = useCallback(async (budgetId?: string) => {
    const budgetData = {
      nombre_proyecto: projectName,
      configuracion: {
        valor_basico: valorBasico,
        porcentaje_region_seleccionado: regionPercentage,
        cotizacion_dolar: dollarExchangeRate,
        superficie_m2: surfaceM2,
        horas_por_lod: lodHoursMap, 
      },
      lod_seleccionado: selectedLOD,
      horas_reales_lod: actualLODHoursForSelected,
      usos_seleccionados: Array.from(selectedBimUses),
      fecha_creacion: Timestamp.now(),
      costo_total_usd: totalCostUSD,
      costo_total_local: totalCostLocal,
    };

    try {
      if (budgetId) {
        const budgetRef = doc(db, "presupuestos", budgetId);
        await updateDoc(budgetRef, budgetData);
        console.log("Budget updated with ID: ", budgetId);
        return budgetId;
      } else {
        const newBudgetRef = doc(collection(db, "presupuestos"));
        await setDoc(newBudgetRef, { ...budgetData, id: newBudgetRef.id });
        console.log("Budget saved with ID: ", newBudgetRef.id);
        return newBudgetRef.id;
      }
    } catch (e) {
      console.error("Error saving budget: ", e);
      return undefined;
    }
  }, [projectName, valorBasico, regionPercentage, dollarExchangeRate, surfaceM2, lodHoursMap, selectedLOD, actualLODHoursForSelected, selectedBimUses, totalCostUSD, totalCostLocal]);

  const loadBudget = useCallback(async (budgetId: string) => {
    try {
      const budgetRef = doc(db, "presupuestos", budgetId);
      const budgetSnap = await getDoc(budgetRef);

      if (budgetSnap.exists()) {
        const data = budgetSnap.data();
        setProjectName(data.nombre_proyecto || INITIAL_PROJECT_NAME);
        
        const config = data.configuracion || {};
        setValorBasico(config.valor_basico || INITIAL_VB);
        setRegionPercentage(config.porcentaje_region_seleccionado || INITIAL_REGION_PERCENTAGE);
        setDollarExchangeRate(config.cotizacion_dolar || INITIAL_DOLLAR_EXCHANGE_RATE);
        setSurfaceM2(config.superficie_m2 || INITIAL_SURFACE_M2);
        setLodHoursMap(config.horas_por_lod || DEFAULT_LOD_HOURS);
        
        // Set selectedLOD first, then actualLODHoursForSelected will be updated by its useEffect
        setSelectedLOD(data.lod_seleccionado || INITIAL_LOD); 
        setActualLODHoursForSelected(data.horas_reales_lod !== undefined ? data.horas_reales_lod : (config.horas_por_lod?.[data.lod_seleccionado || INITIAL_LOD]?.min || 0));
        
        setSelectedBimUses(new Set(data.usos_seleccionados || []));
        
        setTotalCostUSD(data.costo_total_usd !== undefined ? data.costo_total_usd : null);
        setTotalCostLocal(data.costo_total_local !== undefined ? data.costo_total_local : null);
        
        if (data.costo_total_usd === undefined || data.costo_total_usd === null) {
            calculateTotalCost(); // Recalculate if not present or null
        }

        console.log("Budget loaded: ", budgetId);
      } else {
        console.log("No such budget document!");
        resetAll(); 
      }
    } catch (e) {
      console.error("Error loading budget: ", e);
      resetAll(); 
    }
  }, [calculateTotalCost, resetAll, setSelectedLOD]);


  useEffect(() => {
    const currentRange = lodHoursMap[selectedLOD] || { min: 0, max: 0 };
    if (actualLODHoursForSelected < currentRange.min || actualLODHoursForSelected > currentRange.max) {
       setActualLODHoursForSelected(currentRange.min);
    } else if (actualLODHoursForSelected === undefined && currentRange.min !== undefined ) {
       setActualLODHoursForSelected(currentRange.min);
    }
  }, [selectedLOD, lodHoursMap, actualLODHoursForSelected]);


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
    bimUsesData, 
    totalCostUSD, totalCostLocal, calculateTotalCost,
    resetAll,
    saveBudget, loadBudget,
    suggestedLodsForSelect,
    highlightedDependencies,
  }), [
    projectName, valorBasico, regionPercentage, dollarExchangeRate, surfaceM2,
    selectedLOD, lodHoursMap, currentLODHours, actualLODHoursForSelected, // Removed setSelectedLOD from here
    selectedBimUses, toggleBimUse, bimUsesData, 
    totalCostUSD, totalCostLocal, calculateTotalCost, resetAll,
    saveBudget, loadBudget,
    suggestedLodsForSelect, highlightedDependencies, setSelectedLOD // Added setSelectedLOD back here
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

