import { createReducer, PayloadAction } from '@reduxjs/toolkit'
import {
  searchBarValueDidChange,
  trackingDisplayChoiceDidChange,
  trackingReceiveDialogSetFocus,
  warehouseNotesDidChange,
} from './actions'
import { TrackingDisplayChoice } from './types'

export interface ApplicationState {
  searchString: string
  trackingReceiveDialogFocusedRecordId: string | null
  warehouseNotes: string
  trackingDisplayChoice: TrackingDisplayChoice
}

export const initialState: ApplicationState = {
  searchString: '',
  trackingReceiveDialogFocusedRecordId: null,
  warehouseNotes: '',
  trackingDisplayChoice: TrackingDisplayChoice.OnlySearch,
}

const reducer = createReducer(initialState, (builder) =>
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
)

export default reducer
