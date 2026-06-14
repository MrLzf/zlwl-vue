interface TypecheckRequestOption {
  url: string
  params?: unknown
  data?: unknown
  headers?: Record<string, unknown>
  headersType?: string
  responseType?: string
}

declare const request: {
  get: <T = any>(option: TypecheckRequestOption) => Promise<T>
  post: <T = any>(option: TypecheckRequestOption) => Promise<T>
  postOriginal: <T = any>(option: TypecheckRequestOption) => Promise<T>
  delete: <T = any>(option: TypecheckRequestOption) => Promise<T>
  put: <T = any>(option: TypecheckRequestOption) => Promise<T>
  download: <T = any>(option: TypecheckRequestOption) => Promise<T>
  upload: <T = any>(option: TypecheckRequestOption) => Promise<T>
}

export default request
