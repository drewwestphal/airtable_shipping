import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import {
  BoxToMake,
  MakeBoxActionArgs,
  PersistFieldToRecordArgs,
  SelectedExtantBox,
  TrackingDisplayChoice,
} from './types'

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
export const skuReceivingSetSkuOrderFocus = createAction<string | null>(
  'skuOrder/dialogfocus'
)
export const skuReceivingSetBoxFocus = createAction<
  | SelectedExtantBox // they can actually pack this one
  | BoxToMake // we are loading...someone has to ask to make the box
  | null // the dialog for this is not open
>('skuOrder/box/dialogfocus')

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
/*
export const makeBoxForSkuReceiving = createAsyncThunk(
  'util/persistfield',
  // Declare the type your function argument here:
  async ({ schema, btm }: MakeBoxActionArgs) => {
    let newBoxLine = {
      [schema.boxLines.field.boxRel.id]: [{ id: selectedBoxRecord.id }],
      [schema.boxLines.field.skuOrderRel.id]: [{ id: selectedSkuOrder.id }],
      [schema.boxLines.field.skuRel.id]: [{ id: selectedSkuId }],
      [schema.boxLines.field.skuQty.id]: parseInt(howMuchToPack),
    }

    const promise = args.table.updateRecordAsync(args.record, {
      [args.field.id]: args.val,
    })
    console.log(promise)
    return (await promise) as void
  }
)
*/
