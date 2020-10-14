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
export interface PotentialExtantBoxesForReceiving {
  extantMaxBox: Record | null
  maxBoxToMake: BoxToMake | null
  maxBoxIsEmpty: boolean
  penultimateBox: Record | null
  penultimateBoxIsEmpty: boolean
  emptyNonMaxBoxes: Array<Record>
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
