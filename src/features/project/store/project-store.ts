"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import type { DesignTaste } from "@/constants/design/taste";
import type { MatchPriority } from "@/constants/project/priority";
import type { Prefecture } from "@/constants/region/prefecture";
import type { DamageAnalysisResponse } from "@/presentation/dto/common/damage-analysis.schema";
import type { DesignOptionResponse } from "@/presentation/dto/common/design-option.schema";
import type { WorkshopCandidateResponse } from "@/presentation/dto/common/workshop-candidate.schema";

interface ProjectState {
  imageDataUrl: string | null;
  story: string;
  tastes: DesignTaste[];
  prefecture: Prefecture | null;
  priority: MatchPriority;
  analysis: DamageAnalysisResponse | null;
  designs: DesignOptionResponse[];
  selectedDesignId: string | null;
  candidates: WorkshopCandidateResponse[];
  selectedWorkshopId: string | null;
  savedProjectId: string | null;
  summary: string;
}

interface ProjectActions {
  setPhoto: (imageDataUrl: string) => void;
  setPreference: (params: {
    story: string;
    tastes: DesignTaste[];
    prefecture: Prefecture;
    priority: MatchPriority;
  }) => void;
  setAnalysis: (analysis: DamageAnalysisResponse) => void;
  setDesigns: (designs: DesignOptionResponse[]) => void;
  selectDesign: (designId: string) => void;
  setPriority: (priority: MatchPriority) => void;
  setCandidates: (candidates: WorkshopCandidateResponse[]) => void;
  selectWorkshop: (workshopId: string) => void;
  setSaved: (params: { projectId: string; summary: string }) => void;
  reset: () => void;
}

const INITIAL_STATE: ProjectState = {
  imageDataUrl: null,
  story: "",
  tastes: [],
  prefecture: null,
  priority: "design",
  analysis: null,
  designs: [],
  selectedDesignId: null,
  candidates: [],
  selectedWorkshopId: null,
  savedProjectId: null,
  summary: "",
};

/**
 * sessionStorage の容量超過（画像込みで 5MB を超える等）で保存に失敗しても、
 * 画面遷移は止めない。保存できなければメモリ上の状態だけで動く。
 */
const safeSessionStorage: StateStorage = {
  getItem: (name) => globalThis.sessionStorage?.getItem(name) ?? null,
  setItem: (name, value) => {
    try {
      globalThis.sessionStorage?.setItem(name, value);
    } catch {
      // 容量超過。復元は諦める。
    }
  },
  removeItem: (name) => globalThis.sessionStorage?.removeItem(name),
};

/**
 * 相談 1 件ぶんのクライアント状態。
 * 写真と解析結果はサーバーに保存しないため（設計書 8）、ここが唯一の保持場所になる。
 */
export const useProjectStore = create<ProjectState & ProjectActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setPhoto: (imageDataUrl) =>
        set({ ...INITIAL_STATE, imageDataUrl }),
      setPreference: ({ story, tastes, prefecture, priority }) =>
        set({ story, tastes, prefecture, priority }),
      setAnalysis: (analysis) => set({ analysis }),
      setDesigns: (designs) =>
        set({ designs, selectedDesignId: designs[0]?.id ?? null }),
      selectDesign: (selectedDesignId) =>
        set({ selectedDesignId, candidates: [], selectedWorkshopId: null }),
      setPriority: (priority) => set({ priority }),
      setCandidates: (candidates) =>
        set({ candidates, selectedWorkshopId: candidates[0]?.workshop.id ?? null }),
      selectWorkshop: (selectedWorkshopId) => set({ selectedWorkshopId }),
      setSaved: ({ projectId, summary }) =>
        set({ savedProjectId: projectId, summary }),
      reset: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: "kintsugi-project",
      storage: createJSONStorage(() => safeSessionStorage),
    }
  )
);
