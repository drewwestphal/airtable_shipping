import { createReducer, PayloadAction } from '@reduxjs/toolkit'
import {
  persistFieldToRecord,
  searchBarValueDidChange,
  trackingReceiveDialogSetFocus,
  warehouseNotesDidChange,
} from './actions'

export interface ApplicationState {
  searchString: string
  trackingReceiveDialogFocusedRecordId: string | null
  warehouseNotes: string
}

export const initialState: ApplicationState = {
  searchString: '',
  trackingReceiveDialogFocusedRecordId: null,
  warehouseNotes: '',
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
