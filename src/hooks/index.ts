import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
export { default as useInfiniteScroll } from './useInfiniteScroll'
export { default as useFetchInfiniteScroll } from './useFetchInfiniteScroll'
export { default as useResize } from './useResize'
export { default as useAnalytics } from "./useAnalytics"
export { default as useMedia } from "./useMedia"
export { default as useDebounce } from "./useDebounce"
export * from './useBreakpoints'

export const useOutsideClick = (ref, ref2, callback) => {

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && ref.current && !ref2.current) {
        callback(true)
      } else if (ref.current && !ref.current.contains(e.target) && ref2.current && !ref2.current.contains(e.target)) {
        callback(true)
      } else {
        callback(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}

export default function useInterval(callback: () => void, delay: null | number) {
  const savedCallback = useRef<() => void>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      const current = savedCallback.current
      current && current()
    }

    if (delay !== null) {
      tick()
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
    return
  }, [delay])
}

export function useNFTApp() {
  const router = useRouter()
  return router.pathname.startsWith('/nfts')
}

export function useYieldApp() {
  const router = useRouter()
  return router.pathname.startsWith('/yields')
}

export function usePeggedApp() {
  const router = useRouter()
  return router.pathname.startsWith('/peggedasset') || router.pathname.startsWith('/peggedassets')
}

export const useScrollToTop = () => {
  useEffect(() => {
    if (window) {
      window.scrollTo({
        behavior: 'smooth',
        top: 0,
      })
    }
  }, [])
}

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false)

  const windowType = typeof window

  useEffect(() => {
    if (windowType !== 'undefined') {
      setIsClient(true)
    }
  }, [windowType])

  return isClient
}
