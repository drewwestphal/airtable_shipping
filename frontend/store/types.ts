import Field from '@airtable/blocks/dist/types/src/models/field'
import Record from '@airtable/blocks/dist/types/src/models/record'
import Table from '@airtable/blocks/dist/types/src/models/table'

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
  maxBoxToMake: BoxToMake | null
}

export interface BoxToMake {
  boxNumberOnly: number
  boxDestinationId: string
  notes: string
}
export interface ReceivableSkuOrder {
  rec: Record
  boxDestinationId: string
  skuName: string
}
