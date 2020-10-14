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
