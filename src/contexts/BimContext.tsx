
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
import { db } from '@/lib/firebase'; // Assuming you have firebase initialized in lib/firebase.ts

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
  bimUsesData: UsoBIM[]; // Store BIM uses from Firebase
  totalCostUSD: number | null;
  totalCostLocal: number | null;
  calculateTotalCost: () => void;
  resetAll: () => void;
  saveBudget: (budgetId?: string) => Promise<string | undefined>;
  loadBudget: (budgetId: string) => Promise<void>;
  suggestedLodsForSelect: LODLevel[];
  highlightedDependencies: Set<string>;
}

// Define UsoBIM type matching Firebase structure
interface UsoBIM {
  id: string;
  nombre: string;
  etapa_proyecto: string; // Or ProjectPhase if you map it
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
  const [bimUsesData, setBimUsesData] = useState<UsoBIM[]>(BIM_USES_DATA); // Fallback to constants if Firebase fails


  // Fetch BIM Uses from Firebase on mount
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
            // Fallback to constants if Firebase is empty or error occurs
            setBimUsesData(BIM_USES_DATA);
          }
        }, (error) => {
          console.error("Error fetching BIM uses from Firebase: ", error);
          setBimUsesData(BIM_USES_DATA); // Fallback on error
        });
        return () => unsubscribe(); // Cleanup listener on unmount
      } catch (error) {
        console.error("Error setting up BIM uses listener: ", error);
        setBimUsesData(BIM_USES_DATA); // Fallback on error
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
      } else {
        newUses.add(useId);
        const checkDependencies = (dependencies: string[]) => {
          dependencies.forEach(depId => {
            if (!newUses.has(depId)) {
              newUses.add(depId);
              const depUse = bimUsesData.find(u => u.id === depId);
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
  }, [bimUsesData]);
  
  useEffect(() => {
    const newSuggestedLodsSet = new Set<LODLevel>();
    const newHighlightedDepsSet = new Set<string>();

    selectedBimUses.forEach(useId => {
      const bimUse = bimUsesData.find(u => u.id === useId);
      if (bimUse) {
        bimUse.lods_sugeridos.forEach(lod => newSuggestedLodsSet.add(lod));
        bimUse.dependencias.forEach(depId => newHighlightedDepsSet.add(depId));
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
      if (!ALL_LOD_LEVELS.includes(selectedLOD)){
        setSelectedLOD(INITIAL_LOD);
      }
    }
  }, [selectedBimUses, bimUsesData]); // Changed dependency array


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
    setSelectedBimUses(new Set());
    // suggestedLodsForSelect and highlightedDependencies will be reset by the useEffect
    setTotalCostUSD(null);
    setTotalCostLocal(null);
  }, []);

   const saveBudget = useCallback(async (budgetId?: string) => {
    const budgetData = {
      // usuario_id: currentUser?.uid || "anonymous", // Example, integrate auth later
      nombre_proyecto: projectName,
      configuracion: {
        valor_basico: valorBasico,
        porcentaje_region_seleccionado: regionPercentage,
        cotizacion_dolar: dollarExchangeRate,
        superficie_m2: surfaceM2,
        horas_por_lod: lodHoursMap, // Storing the possibly customized map
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
        // Create a new budget document, Firestore will generate an ID
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

        setSelectedLOD(data.lod_seleccionado || INITIAL_LOD);
        // actualLODHoursForSelected will be set by its useEffect
        setActualLODHoursForSelected(data.horas_reales_lod || (config.horas_por_lod?.[data.lod_seleccionado || INITIAL_LOD]?.min || 0));


        setSelectedBimUses(new Set(data.usos_seleccionados || []));
        
        // Costs will be recalculated or could be loaded if stored consistently
        setTotalCostUSD(data.costo_total_usd !== undefined ? data.costo_total_usd : null);
        setTotalCostLocal(data.costo_total_local !== undefined ? data.costo_total_local : null);
        if (data.costo_total_usd === undefined) { // Recalculate if not stored
            calculateTotalCost();
        }

        console.log("Budget loaded: ", budgetId);
      } else {
        console.log("No such budget document!");
        resetAll(); // Reset to defaults if budget not found
      }
    } catch (e) {
      console.error("Error loading budget: ", e);
      resetAll(); // Reset on error
    }
  }, [calculateTotalCost, resetAll]);


  useEffect(() => {
    // This effect ensures actualLODHoursForSelected is updated when selectedLOD or its map range changes.
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
    bimUsesData, // Provide bimUsesData from Firebase/constants
    totalCostUSD, totalCostLocal, calculateTotalCost,
    resetAll,
    saveBudget, loadBudget,
    suggestedLodsForSelect,
    highlightedDependencies,
  }), [
    projectName, valorBasico, regionPercentage, dollarExchangeRate, surfaceM2,
    selectedLOD, lodHoursMap, currentLODHours, actualLODHoursForSelected,
    selectedBimUses, toggleBimUse, bimUsesData, 
    totalCostUSD, totalCostLocal, calculateTotalCost, resetAll,
    saveBudget, loadBudget,
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

