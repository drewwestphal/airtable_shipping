import Base from '@airtable/blocks/dist/types/src/models/base'
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
  record: Record
  constructor(table: Table, field: Field, record: Record) {
    this.table = table
    this.field = field
    this.record = record
  }
  fieldId(): string {
    return this.field.id
  }
  stringVal(): string {
    return this.record.getCellValueAsString(this.field)
  }
  val(): T {
    return this.record.getCellValue(this.field) as T
  }
}
export abstract class WrappedRow {
  schema: Schema
  base: Base
  table: Table
  record: Record

  constructor(schema: Schema, table: Table, record: Record) {
    this.schema = schema
    this.base = schema.base
    this.table = table
    this.record = record
  }

  followRel<T extends WrappedRow>(
    relfield: WrappedField<RelField<any>>,
    fetchfields: Array<Field>,
    sortsArr: Array<{ field: Field; direction: 'asc' | 'desc' }>,
    wrapFun: (schema: Schema, record: Record) => T,
    shouldUseWithHook?: boolean
  ): any {
    let recordQueryResult = this.record.selectLinkedRecordsFromCell(
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
      return wrapFun(this.schema, childRecord) as T
    })
  }

  protected makeWrapped<T>(field: Field): WrappedField<T> {
    let wf = new WrappedField<T>(this.table, field, this.record)
    return wf
  }
  protected static useWrappedRecords<T extends WrappedRow>(
    schema: Schema,
    tableOrView: Table | View,
    useRecordsQuery: any,
    wrapFn: (schema: Schema, record: Record) => T
  ): Array<T> {
    return useRecords(tableOrView, useRecordsQuery).map((record: Record) => {
      return wrapFn(schema, record) as T
    })
  }
}
