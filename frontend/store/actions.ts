import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { PersistFieldToRecordArgs, TrackingDisplayChoice } from './types'

export const searchBarValueDidChange = createAction<string>('search/value')

export const trackingDisplayChoiceDidChange = createAction<
  TrackingDisplayChoice
>('search/displaychoice')

export const trackingReceiveDialogSetFocus = createAction<string | null>(
  'tracking/dialogfocus'
)
export const warehouseNotesDidChange = createAction<string>(
  'tracking/warehouseNotes'
)
export const skuOrderReceiveDialogSetFocus = createAction<string | null>(
  'skuOrder/dialogfocus'
)

export const persistValueToRecordField = createAsyncThunk(
  'util/persistfield',
  // Declare the type your function argument here:
  async (args: PersistFieldToRecordArgs) => {
    const promise = args.table.updateRecordAsync(args.record, {
      [args.field.id]: args.val,
    })
    console.log(promise)
    return (await promise) as void
  }
)
