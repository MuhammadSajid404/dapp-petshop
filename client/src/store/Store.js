import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { adopReducer } from './adoptSlice'

export const Store = configureStore({
    reducer: {
        adoptReducer : adopReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
    })
})