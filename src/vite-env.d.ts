declare module "*.webp" {
  const value: string;
  export default value;
}
/// <reference types="vite/client" />

// Si quieres definir manualmente las vars que usas:
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // añade aquí más vars que uses, siempre readonly
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />
declare module '*.svg' {
  const src: string;
  export default src;
}

