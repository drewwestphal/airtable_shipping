import Field from '@airtable/blocks/dist/types/src/models/field'
import Record from '@airtable/blocks/dist/types/src/models/record'
import Table from '@airtable/blocks/dist/types/src/models/table'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

export const searchBarValueDidChange = createAction<string>('search/value')
export const trackingReceiveDialogSetFocus = createAction<string | null>(
  'tracking/dialogfocus'
)
export const warehouseNotesDidChange = createAction<string>(
  'tracking/warehouseNotes'
)

export interface PersistFieldToRecordArgs {
  table: Table
  field: Field
  record: Record
  val: any
}
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
