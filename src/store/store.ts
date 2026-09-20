import { configureStore, type Middleware } from '@reduxjs/toolkit'
import appReducer, {
  createAppState,
  storageAvailabilityChanged,
  type AppSliceState,
} from './appSlice'
import { readDemoState, saveDemoState } from '../lib/storage'
import type { DemoState } from '../types'

type StateWithApp = { app: AppSliceState }

const persistenceMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const previousData = (storeApi.getState() as StateWithApp).app.data
  const result = next(action)
  const state = storeApi.getState() as StateWithApp

  if (state.app.data !== previousData) {
    const storageAvailable = saveDemoState(state.app.data)
    if (storageAvailable !== state.app.storageAvailable) {
      storeApi.dispatch(storageAvailabilityChanged(storageAvailable))
    }
  }

  return result
}

export function createAppStore(preloadedData: DemoState = readDemoState()) {
  return configureStore({
    reducer: { app: appReducer },
    preloadedState: { app: createAppState(preloadedData) },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistenceMiddleware),
  })
}

export const store = createAppStore()

export type AppStore = ReturnType<typeof createAppStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
