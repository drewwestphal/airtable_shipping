import {
  ActionReducerMapBuilder,
  createReducer,
  PayloadAction,
} from '@reduxjs/toolkit'
import {
  searchBarValueDidChange,
  skuReceivingSetBoxFocus,
  skuReceivingSetSkuOrderFocus,
  trackingDisplayChoiceDidChange,
  trackingReceiveDialogSetFocus,
  warehouseNotesDidChange,
} from './actions'
import { BoxToMake, SelectedExtantBox, TrackingDisplayChoice } from './types'

export interface ApplicationState {
  searchString: string
  trackingReceiveDialogFocusedRecordId: string | null
  warehouseNotes: string
  trackingDisplayChoice: TrackingDisplayChoice
  skuReceivingDialogFocusedSkuOrderId: string | null
  skuReceivingDialogFocusedBox: SelectedExtantBox | BoxToMake | null
}

export const initialState: ApplicationState = {
  searchString: '',
  trackingReceiveDialogFocusedRecordId: null,
  warehouseNotes: '',
  trackingDisplayChoice: TrackingDisplayChoice.OnlySearch,
  skuReceivingDialogFocusedSkuOrderId: null,
  skuReceivingDialogFocusedBox: null,
}

const reducer = createReducer(
  initialState,
  (builder: ActionReducerMapBuilder<ApplicationState>) =>
    builder
      .addCase(
        searchBarValueDidChange,
        (state: ApplicationState, action: PayloadAction<string>) => {
          return { ...state, searchString: action.payload }
        }
      )
      .addCase(
        trackingDisplayChoiceDidChange,
        (
          state: ApplicationState,
          action: PayloadAction<TrackingDisplayChoice>
        ) => {
          return { ...state, trackingDisplayChoice: action.payload }
        }
      )
      .addCase(
        trackingReceiveDialogSetFocus,
        (state: ApplicationState, action: PayloadAction<string | null>) => {
          return {
            ...state,
            trackingReceiveDialogFocusedRecordId: action.payload,
          }
        }
      )
      .addCase(
        warehouseNotesDidChange,
        (state: ApplicationState, action: PayloadAction<string>) => {
          return {
            ...state,
            warehouseNotes: action.payload,
          }
        }
      )
      .addCase(
        skuReceivingSetSkuOrderFocus,
        (state: ApplicationState, action: PayloadAction<string | null>) => {
          return {
            ...state,
            skuReceivingDialogFocusedSkuOrderId: action.payload,
          }
        }
      )
      .addCase(
        skuReceivingSetBoxFocus,
        (
          state: ApplicationState,
          action: PayloadAction<SelectedExtantBox | BoxToMake | null | null>
        ) => {
          return {
            ...state,
            skuReceivingDialogFocusedBox: action.payload,
          }
        }
      )
)

export default reducer
