import Base from '@airtable/blocks/dist/types/src/models/base'
import Field from '@airtable/blocks/dist/types/src/models/field'
import Record from '@airtable/blocks/dist/types/src/models/record'
import Table from '@airtable/blocks/dist/types/src/models/table'
import View from '@airtable/blocks/dist/types/src/models/view'
import { useBase } from '@airtable/blocks/ui'

export class Schema {
  base: Base
  skuOrdersTracking: SchemaTable
  skuOrders: SchemaTable
  boxes: SchemaTable
  boxDestinations: SchemaTable
  boxLines: SchemaTable

  constructor() {
    const base = useBase()
    this.base = base
    {
      /**
       *
       *
       * SKU Orders Tracking
       *
       *
       */
      let table = base.getTableByName('SKU Orders Tracking')
      this.skuOrdersTracking = {
        table: table,
        view: {
          hasTrackingNumber: table.getViewByName(
            'gtg_searchable_tracking_numbers'
          ),
        },
        field: {
          //pk
          trackingNumberPK: table.primaryField,
          //rel
          skuOrdersRel: table.getFieldByName('SKU Orders'),
          //data
          isReceivedRO: table.getFieldByName(
            'gtg_was_tracking_number_received'
          ),
          receivedAtDateTime: table.getFieldByName('Date Received'),
          receivingNotes: table.getFieldByName('Receiving Notes (JoCo)'),
          warehouseNotes: table.getFieldByName('Warehouse Notes (GTG)'),
        },
        val: {},
        stringVal: {},
        allViews: [],
        allFields: [],
      }
    }
    {
      /**
       *
       *
       * Sku Orders
       *
       *
       */
      let table = base.getTableByName('SKU Orders')
      this.skuOrders = {
        table: table,
        view: {},
        field: {
          // pk
          skuOrderPK: table.primaryField,
          // rels
          trackingNumberRel: table.getFieldByName('Tracking Number'),
          orderRel: table.getFieldByName('Order'),
          skuRel: table.getFieldByName('SKU'),
          boxDestinationRel: table.getFieldByName('Onboard Destination'),
          // data
          //trackingNumberReceived: table.getFieldByName('Tracking # Received?'),
          quantityOrdered: table.getFieldByName('Quantity Ordered'),
          quantityPacked: table.getFieldByName('gtg_packed_qty'),
          boxedCheckbox: table.getFieldByName('Boxed?'),
          externalProductName: table.getFieldByName('External Product Name'),
          skuIsReceived: table.getFieldByName('SKU Received?'),
          destinationPrefix: table.getFieldByName('gtg_dest_prefix'),
          receivingNotes: table.getFieldByName('SKU Receiving Notes'),
        },
        val: {},
        stringVal: {},
        allViews: [],
        allFields: [],
      }
    }
    {
      /**
       *
       *
       * Boxes
       *
       *
       */
      let table = base.getTableByName('Boxes')
      this.boxes = {
        table: table,
        view: {
          emptyOrMaximalBoxes: table.getViewByName(
            'gtg_empty_penultimate_or_max_boxes'
          ),
          emptyBoxesOnly: table.getViewByName('gtg_empty_boxes_only'),
        },
        field: {
          //pk
          boxNumberPK: table.primaryField,
          //rel
          onboardDestinationRel: table.getFieldByName('Onboard Destination'),
          boxNumberOnly: table.getFieldByName('# Only'),
          //data
          isMaxBox: table.getFieldByName('gtg_is_max_box'),
          isPenultimateBox: table.getFieldByName('gtg_is_penultimate_box'),
          isEmpty: table.getFieldByName('gtg_is_empty'),
          notes: table.getFieldByName('Notes'),
        },
        val: {},
        stringVal: {},
        allViews: [],
        allFields: [],
      }
    }
    {
      /**
       *
       *
       * Box Destinations
       *
       *
       */
      let table = base.getTableByName('Box Destinations')
      this.boxDestinations = {
        table: table,
        view: {
          destNeedsEmptyMaxBox: table.getViewByName(
            'gtg_dest_needs_empty_max_box'
          ),
        },
        field: {
          //pk
          boxDestNamePK: table.primaryField,
          //rel
          //data
          currentMaximalBoxNumber: table.getFieldByName(
            'Current Maximal Box #'
          ),
        },
        val: {},
        stringVal: {},
        allViews: [],
        allFields: [],
      }
    }
    {
      /**
       *
       *
       * Box Lines
       *
       *
       */
      let table = base.getTableByName('Box Lines')
      this.boxLines = {
        table: table,
        view: {},
        field: {
          //pk
          boxLinePK: table.primaryField,
          //rel
          boxRel: table.getFieldByName('Box #'),
          skuRel: table.getFieldByName('SKU'),
          skuOrderRel: table.getFieldByName('SKU Order'),
          //data
          skuQty: table.getFieldByName('SKU Qty'),
        },
        val: {},
        stringVal: {},
        allViews: [],
        allFields: [],
      }
    }
    for (const [key, schemaTable] of Object.entries(this)) {
      if (key !== 'base') {
        // it's a Schema Table
        for (const [fieldKey, field] of Object.entries(schemaTable.field)) {
          schemaTable.val[fieldKey] = (record: Record) => {
            return record.getCellValue(field as Field)
          }
          schemaTable.stringVal[fieldKey] = (record: Record) => {
            return record.getCellValueAsString(field as Field)
          }
        }
        schemaTable.allViews = Object.values(schemaTable.view)
        schemaTable.allFields = Object.values(schemaTable.field)
      }
    }
  }
}
interface SchemaTable {
  table: Table
  view: SchemaTableViews
  field: SchemaTableFields
  val: SchemaTableCellValueFunctions
  stringVal: SchemaTableCellStringValueFunctions
  allViews: Array<View>
  allFields: Array<Field>
}

interface SchemaTableViews {
  [index: string]: View
}

interface SchemaTableFields {
  [index: string]: Field
}

interface SchemaTableCellValueFunctions {
  [index: string]: CellValueFunction
}

interface SchemaTableCellStringValueFunctions {
  [index: string]: CellStringValueFunction
}

interface CellValueFunction {
  (record: Record): any
}
interface CellStringValueFunction {
  (record: Record): string
}
