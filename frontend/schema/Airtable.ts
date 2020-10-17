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
interface WrappedTableViews {
  [index: string]: View
}
interface ATKeyVal {
  [index: string]: Field
}

export abstract class WrappedRow {
  base: Base
  table: Table
  view: WrappedTableViews
  record: Record
  static allFields: ATKeyVal

  constructor(base: Base, table: Table, record: Record) {
    this.base = base
    this.table = table
    this.record = record
    this.view = {}
  }
  followRel(
    relfield: WrappedField<RelField<any>>,
    fetchfields: Array<Field>,
    relTable: Table,
    sortsArr: any,
    wrapFun: (base: Base, table: Table, record: Record) => Array<WrappedRow>
  ) {
    return this.record
      .selectLinkedRecordsFromCell(relfield.field, {
        fields: fetchfields,
        sorts: sortsArr,
      })
      .records.map((childRecord: Record) => {
        return wrapFun(this.base, relTable, childRecord)
      })
  }

  protected makeWrapped<T>(field: Field): WrappedField<T> {
    let wf = new WrappedField<T>(this.table, field, this.record)
    return wf
  }

  static useWrappedRecords(
    schema: Schema,
    tableOrView: Table | View,
    useRecordsQuery: any,
    wrapFn: (schema: Schema, record: Record) => WrappedRow
  ): Array<WrappedRow> {
    // @ts-expect-error
    return useRecords(tableOrView, useRecordsQuery).map((record: Record) => {
      return wrapFn(schema, record)
    })
  }
}
