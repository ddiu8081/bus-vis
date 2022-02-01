/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_ACCESS_TOKEN: string
  readonly VITE_CDN_HOST: string
  readonly VITE_CDN_VERIFY_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
