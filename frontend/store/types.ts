import Field from '@airtable/blocks/dist/types/src/models/field'
import Record from '@airtable/blocks/dist/types/src/models/record'
import Table from '@airtable/blocks/dist/types/src/models/table'
import { Schema } from '../schema'

export enum TrackingDisplayChoice {
  OnlySearch,
  All,
  Unreceived,
  Received,
}
export interface PersistFieldToRecordArgs {
  table: Table
  field: Field
  record: Record
  val: any
}
export interface PotentialBoxesForReceiving {
  extantMaxBox: Record | null
  maxBoxIsEmpty: boolean
  extantPenultimateBox: Record | null
  penultimateBoxIsEmpty: boolean
  extantEmptyNonMaxBoxes: Array<Record>
  extantNonEmptyUserSelectedBoxes: Array<Record>
  maxBoxToMake: BoxToMake | null
}
export interface BoxToMake {
  boxNumberOnly: number
  boxDestinationId: string
  notes: string
}
export interface SelectedExtantBox {
  recordId: string
}

export interface UserSelectableBox {
  root: BoxToMake | SelectedExtantBox
  boxName: string
  boxStatus: string
  boxIsEmpty: boolean
  boxNotes: string
}

export interface MakeBoxActionArgs {
  btm: BoxToMake
  schema: Schema
}
export function isBoxToMake(
  // needs differentiate between records too for use in receiving workflow
  thing: BoxToMake | SelectedExtantBox | Record
): thing is BoxToMake {
  return (thing as BoxToMake).boxNumberOnly !== undefined
}

export interface ReceivableSkuOrder {
  rec: Record
  boxDestination: Record
  skuName: string
}
