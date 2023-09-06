export interface ResBody<T = undefined> {
  success?: boolean
  body?: T
  message?: string
}

export type PResBody<T = undefined> = Promise<ResBody<T>>
