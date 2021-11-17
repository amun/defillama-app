import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'

import { useDisplayUsdManager } from './LocalStorage'
import { fetchAPI } from './API'
import {
  NFT_COLLECTIONS_API,
  NFT_COLLECTION_API,
  NFT_STATISTICS_API,
  NFT_TIMESERIES_API,
  UPDATE_ALL_NFT_COLLECTIONS,
  UPDATE_NFT_CHART,
  UPDATE_NFT_STATISTICS,
} from '../constants'

const NFTDataContext = createContext()

function useNFTDataContext() {
  return useContext(NFTDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_ALL_NFT_COLLECTIONS: {
      const { collections } = payload
      return {
        ...state,
        collections,
      }
    }
    case UPDATE_NFT_CHART: {
      const { timeSeriesData } = payload
      return {
        ...state,
        timeSeriesData,
      }
    }
    case UPDATE_NFT_STATISTICS: {
      const { statistics } = payload
      return {
        ...state,
        statistics,
      }
    }
    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, { collections: [] })

  const updateCollections = useCallback(collections => {
    dispatch({
      type: UPDATE_ALL_NFT_COLLECTIONS,
      payload: { collections },
    })
  }, [])

  const updateChart = useCallback(timeSeriesData => {
    dispatch({
      type: UPDATE_NFT_CHART,
      payload: { timeSeriesData },
    })
  }, [])

  const updateStatistics = useCallback(statistics => {
    dispatch({
      type: UPDATE_NFT_STATISTICS,
      payload: { statistics },
    })
  }, [])

  return (
    <NFTDataContext.Provider
      value={[
        state,
        {
          updateCollections,
          updateChart,
          updateStatistics,
        }
      ]}
    >
      {children}
    </NFTDataContext.Provider>
  )
}

const getCollections = async () => {
  try {
    let data = await fetchAPI(NFT_COLLECTIONS_API)
    for (const collection of data) {
      Object.entries(collection).forEach(([key, value]) => {
        if (key.endsWith("USD")) {
          collection[key] = parseInt(value);
        }
      })
    }
    return data
  } catch (e) {
    console.log(e)
  }
}

export const getCollection = async (slug) => {
  try {
    const data = await fetchAPI(`${NFT_COLLECTION_API}/${slug}`)
    return data
  } catch (e) {
    console.log(e)
  }
}

const getChartData = async (slug = "total", statistic = "dailyVolume") => {
  try {
    const data = await fetchAPI(`${NFT_TIMESERIES_API}/${slug}/${statistic}`)
    return data
  } catch (e) {
    console.log(e)
  }
}

const getStatisticsData = async () => {
  try {
    const data = await fetchAPI(NFT_STATISTICS_API)
    return data
  } catch (e) {
    console.log(e)
  }
}

export function Updater() {
  const [, { updateCollections, updateChart, updateStatistics }] = useNFTDataContext()
  useEffect(() => {
    async function getData() {
      const collections = await getCollections()
      collections && updateCollections(collections)
    }
    getData()
  }, [updateCollections])

  useEffect(() => {
    async function fetchData() {
      let timeSeriesData = await getChartData()
      updateChart(timeSeriesData)
    }
    fetchData()
  }, [updateChart])

  useEffect(() => {
    async function fetchStatistics() {
      const statisticsData = await getStatisticsData()
      updateStatistics(statisticsData)
    }
    fetchStatistics()
  }, [updateStatistics])

  return null
}

export function useNFTCollectionsData() {
  const [state] = useNFTDataContext()
  const [displayUsd] = useDisplayUsdManager()

  return state.collections.map(collection => ({
    ...collection,
    floor: displayUsd ? collection.floorUSD: collection.floor,
    dailyVolume: displayUsd ? collection.dailyVolumeUSD : collection.dailyVolume,
    totalVolume: displayUsd ? collection.totalVolumeUSD : collection.totalVolume,
  }))
}

export function useNFTChartData() {
  const [state] = useNFTDataContext()
  return state.timeSeriesData
}

export function useNFTStatisticsData() {
  const [state] = useNFTDataContext()
  return state.statistics
}