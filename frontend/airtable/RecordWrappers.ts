import Field from '@airtable/blocks/dist/types/src/models/field'
import Record from '@airtable/blocks/dist/types/src/models/record'
import Table from '@airtable/blocks/dist/types/src/models/table'
import { Schema } from './Schema'

export class RecordWrapper {
  schema: Schema
  table: Table
  record: Record
  id: string
  constructor(schema: Schema, table: Table, record: Record) {
    this.id = record.id
    this.schema = schema
    this.table = table
    this.record = record
  }
  updateField(field: Field, value: any): Promise<void> {
    return this.table.updateRecordAsync(this.record, {
      [field.id]: value,
    })
  }
  followRel(
    relfield: Field,
    fetchfields: Array<Field>,
    sortsArr: any,
    wrapFun: (schema: Schema, table: Table, record: Record) => any
  ) {
    return this.record
      .selectLinkedRecordsFromCell(relfield, {
        fields: fetchfields,
        sorts: sortsArr,
      })
      .records.map((childRecord: Record) => {
        return wrapFun(this.schema, this.table, childRecord)
      })
  }
}

export class SkuOrderTrackingWrapper extends RecordWrapper {
  trackingNumber(): string {
    return this.schema.skuOrdersTracking.val.trackingNumberPK(this.record)
  }

  isReceived(): boolean {
    return this.schema.skuOrdersTracking.val.isReceivedRO(
      this.record
    ) as boolean
  }
}

export class SkuOrderWrapper extends RecordWrapper {
  skuExpectQty(): number {
    return this.schema.skuOrders.val.quantityExpected(this.record)
  }
  skuDestId(): string {
    let fld = this.schema.skuOrders.val.boxDestRel(this.record)
    return (fld && fld.id) ?? ''
  }
  quantityExpected(): number {
    return this.schema.skuOrders.val.quantityExpected(this.record)
  }
  quantityReceived(): number {
    return this.schema.skuOrders.val.quantityReceived(this.record)
  }
  receivingNotes(): string {
    return this.schema.skuOrders.stringVal.receivingNotes(this.record).trim()
  }
  sku(): SkuWrapper {
    return this.followRel(
      this.schema.skuOrders.field.skuRel,
      this.schema.skus.allFields,
      [],
      (schema: Schema, table: Table, record: Record) => {
        return new SkuWrapper(schema, table, record)
      }
    )[0]
  }
  dest(): DestWrapper {
    return this.followRel(
      this.schema.skuOrders.field.boxDestRel,
      this.schema.boxDestinations.allFields,
      [],
      (schema: Schema, table: Table, record: Record) => {
        return new DestWrapper(schema, table, record)
      }
    )[0]
  }
}

export class DestWrapper extends RecordWrapper {
  maximalBoxNumber() {
    return this.schema.boxDestinations.val.currentMaximalBoxNumber(this.record)
  }

  boxes(): BoxWrapper[] {
    return this.followRel(
      this.schema.boxDestinations.field.boxesRel,
      this.schema.boxDestinations.allFields,
      [],
      (schema: Schema, table: Table, record: Record) => {
        return new BoxWrapper(schema, table, record)
      }
    )
  }
}
export class BoxWrapper extends RecordWrapper {
  isMax(): boolean {
    return this.schema.boxes.val.isMaxBox(this.record) > 0
  }
  isPenultimate(): boolean {
    return this.schema.boxes.val.isPenultimateBox(this.record) > 0
  }
  isEmpty(): boolean {
    return this.schema.boxes.val.isEmpty(this.record) > 0
  }
  isUserSelected(): boolean {
    return this.schema.boxes.val.isToggledForPacking(this.record)
  }
}

export class SkuWrapper extends RecordWrapper {
  skuName() {
    return this.schema.skus.val.skuPk(this.record).name
  }
  skuNameIsSerialTemplate(): boolean {
    return this.schema.skus.val.skuNameIsSerialTemplate(this.record) as boolean
  }
  skuNameIsSerialized(): boolean {
    return this.serial().slice(-4) === this.skuName().slice(-4)
  }
  serial(): string {
    return this.schema.skus.stringVal.serialNumber(this.record)
  }
  isSerialRequired(): boolean {
    return this.schema.skus.val.isSerialRequired(this.record) > 0
  }
  lifetimeOrderQty(): number {
    return this.schema.skuOrders.val.lifetimeOrderQty(this.record) as number
  }
  // not programming serialize
  serializeSkuName(serial: string) {
    //the last 4 of serial in place of last 4 in sku
    return this.skuName().slice(0, this.skuName().length - 4) + serial.slice(-4)
  }
}

export abstract class PipelineCell {
  abstract next(): PipelineCell | string
  abstract action(): Promise<void> | null
}

export abstract class SkuOrderPipelineCell extends SkuOrderWrapper {
  error: string
  constructor(schema: Schema, table: Table, record: Record) {
    super(schema, table, record)
    this.error = ''
  }
}
export abstract class SkuOrderTrackingPipelineCell extends SkuOrderTrackingWrapper {}
