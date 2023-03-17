import { useEffect } from 'react'

export function useAsyncEffect(cb: () => void, dependencies: any[] = []) {
  useEffect(() => { cb() }, dependencies);
}
