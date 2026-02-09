import { useEffect } from 'react'

type CallbackFunction = (...args: any[]) => void;
class ImEvent {
  public _cache: any = {}

  // Bind
  on(type: string, callback: CallbackFunction): this {
    let fns = (this._cache[type] = this._cache[type] || [])
    if (fns.indexOf(callback) === -1) {
      fns.push(callback)
    }
    return this
  }

  // Trigger
  // emit
  trigger(type: string, ...data: any): this {
    let fns = this._cache[type]
    if (Array.isArray(fns)) {
      fns.forEach((fn) => {
        fn(...(data as any))
      })
    }
    return this
  }

  asyncTrigger(type: string, ...data: any): Promise<this> {
    return new Promise((resolve) => {
      this.trigger(type, ...data, resolve)
    })
  }

  // Unbind
  off(type: string, callback?: CallbackFunction): this {
    let fns = this._cache[type]
    if (Array.isArray(fns)) {
      if (callback) {
        let index = fns.indexOf(callback)
        if (index !== -1) {
          fns.splice(index, 1)
        }
      } else {
        // Clear all callbacks
        fns.length = 0
      }
    }
    return this
  }

  clear(type: string) {
    this._cache[type] = null
  }
}

export const imEvent = new ImEvent()
export const useEvent = (name, cb, deps:any = []) => {
  useEffect(() => {
    imEvent.on(name, cb)
    return () => {
      imEvent.off(name, cb)
    }
  }, deps)
}
export default ImEvent
