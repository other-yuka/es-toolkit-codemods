export type CompatibilityMapping = {
  [key: string]: {
    module: 'es-toolkit' | 'es-toolkit/compat';
    name: string;
  };
};

export interface ImportMapping {
  originalName: string;
  importName: string;
}

export interface MappingTracker {
  esToolkit: ImportMapping[];
  esToolkitCompat: ImportMapping[];
  failed: string[];
}
