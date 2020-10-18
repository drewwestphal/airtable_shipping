import Field from '@airtable/blocks/dist/types/src/models/field'
import Record from '@airtable/blocks/dist/types/src/models/record'
import Table from '@airtable/blocks/dist/types/src/models/table'
import View from '@airtable/blocks/dist/types/src/models/view'
import { useRecords } from '@airtable/blocks/ui'
export interface RelSingle<T> {
  // the ID of the linked record this lookup value comes from
  linkedRecordId: string
  // the cell value of the lookup. the actual type depends on the field being looked up
  value: T
}
export type RelField<T> = Array<RelSingle<T>>
import { Schema } from './Schema'

export class WrappedField<T> {
  field: Field
  table: Table
  constructor(table: Table, field: Field) {
    this.table = table
    this.field = field
  }
  hydrate(record: Record): HydratedWrappedField<T> {
    return {
      field: this.field,
      record: record,
      stringVal: () => record.getCellValueAsString(this.field),
      val: () => record.getCellValue(this.field) as T,
      updateAsync: (val: T) =>
        this.table.updateRecordAsync(record, { [this.field.id]: val }),
    }
  }
}
export interface HydratedWrappedField<T> {
  record: Record
  field: Field
  stringVal: () => string
  val: () => T
  updateAsync: (val: T) => Promise<void>
}

export type StaticThis<T> = { new (schema: Schema, record: Record): T }
export abstract class HydratedRow {
  schema: Schema
  table: Table
  record: Record

  constructor(schema: Schema, table: Table, record: Record) {
    this.schema = schema
    this.table = table
    this.record = record
  }

  // https://stackoverflow.com/a/45262288
  // this takes the wrong arguments for the base class and
  // the right ones for all the children...the type also sorta
  // protects u as much as that really happens in "typescript"
  static create<T extends HydratedRow>(
    this: StaticThis<T>,
    schema: Schema,
    record: Record
  ): T {
    const that = Object.assign(new this(schema, record))
    return that
  }

  public static followRelTowardMe<T extends HydratedRow>(
    schema: Schema,
    relfield: HydratedWrappedField<RelField<any>>,
    fetchfields: Array<Field>,
    sortsArr: Array<{ field: Field; direction: 'asc' | 'desc' }>,
    shouldUseWithHook?: boolean
  ): Array<T> {
    let recordQueryResult = relfield.record.selectLinkedRecordsFromCell(
      relfield.field,
      {
        fields: fetchfields,
        sorts: sortsArr,
      }
    )
    let recs = (shouldUseWithHook as boolean)
      ? useRecords(recordQueryResult)
      : recordQueryResult.records

    //console.log(this)
    //console.log(recs)
    return recs.map((childRecord: Record) => {
      // @ts-expect-error
      return this.create(schema, childRecord) as T
    })
  }

  public static useWrappedRecords<T extends HydratedRow>(
    this: StaticThis<T>,
    schema: Schema,
    tableOrView: Table | View,
    useRecordsQuery: any
  ): Array<T> {
    return useRecords(tableOrView, useRecordsQuery).map((record: Record) => {
      // @ts-expect-error
      return this.create(schema, record)
    })
  }
}
