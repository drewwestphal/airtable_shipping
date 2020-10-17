import Base from '@airtable/blocks/dist/types/src/models/base'
import Field from '@airtable/blocks/dist/types/src/models/field'
import Table from '@airtable/blocks/dist/types/src/models/table'
import View from '@airtable/blocks/dist/types/src/models/view'
import { useBase } from '@airtable/blocks/ui'

export class Schema {
  base: Base
  skuOrdersTracking: SchemaTable
  skuOrders: SchemaTable
  skus: SchemaTable
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
        view: {
          hasTrackingNumber: table.getViewByName('gtg_has_tracking_number'),
        },
        field: {
          // pk
          skuOrderPK: table.primaryField,
          // rels
          trackingNumberRel: table.getFieldByName('Tracking Number'),
          orderRel: table.getFieldByName('Order'),
          skuRel: table.getFieldByName('SKU'),
          boxDestRel: table.getFieldByName('Onboard Destination'),
          // data
          //trackingNumberReceived: table.getFieldByName('Tracking # Received?'),
          quantityExpected: table.getFieldByName('Quantity Ordered'),
          quantityReceived: table.getFieldByName('Quantity Received'),
          quantityPacked: table.getFieldByName('gtg_packed_qty'),
          boxedCheckbox: table.getFieldByName('Boxed?'),
          externalProductName: table.getFieldByName('External Product Name'),
          skuIsReceived: table.getFieldByName('SKU Received?'),
          destinationPrefix: table.getFieldByName('gtg_dest_prefix'),
          receivingNotes: table.getFieldByName('SKU Receiving Notes'),
        },
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
      let table = base.getTableByName('SKUs')
      this.skus = {
        table: table,
        view: {
          serialsRequired: table.getViewByName('gtg_serial_number_skus'),
        },
        field: {
          // pk
          skuPk: table.primaryField,
          // rels
          // data
          //trackingNumberReceived: table.getFieldByName('Tracking # Received?'),
          serialNumber: table.getFieldByName('Serial Number'),
          isSerialRequired: table.getFieldByName('gtg_is_serial_required'),
          lifetimeOrderQty: table.getFieldByName('gtg_lifetime_ordered_qty'),
          skuNameIsSerialTemplate: table.getFieldByName(
            'gtg_is_sku_name_a_serial_template_name'
          ),
        },
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
          boxesRel: table.getFieldByName('Boxes'),
          //data
          currentMaximalBoxNumber: table.getFieldByName(
            'Current Maximal Box #'
          ),
          destinationPrefix: table.getFieldByName('Prefix'),
          boxOffset: table.getFieldByName('Box Offset'),
          isSerialBox: table.getFieldByName('Serial Box?'),
        },
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
          packableBoxes: table.getViewByName(
            'gtg_empty_toggled_penultimate_or_max_boxes'
          ),
          emptyBoxesOnly: table.getViewByName('gtg_empty_boxes_only'),
        },
        field: {
          //pk
          boxNumberPK: table.primaryField,
          //rel
          boxDestRel: table.getFieldByName('Onboard Destination'),
          boxLinesRel: table.getFieldByName('Constituent Box Lines'),
          boxNumberOnly: table.getFieldByName('# Only'),
          //data
          isMaxBox: table.getFieldByName('gtg_is_max_box'),
          isToggledForPacking: table.getFieldByName(
            'gtg_is_user_toggled_for_packing'
          ),
          isPenultimateBox: table.getFieldByName('gtg_is_penultimate_box'),
          isEmpty: table.getFieldByName('gtg_is_empty'),
          notes: table.getFieldByName('Notes'),
        },
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
        allFields: [],
      }
    }
    for (const [key, schemaTable] of Object.entries(this)) {
      if (key !== 'base') {
        // it's a Schema Table
        schemaTable.allFields = Object.values(schemaTable.field)
      }
    }
  }
}
interface SchemaTable {
  table: Table
  view: SchemaTableViews
  field: SchemaTableFields
  allFields: Array<Field>
}

interface SchemaTableViews {
  [index: string]: View
}

interface SchemaTableFields {
  [index: string]: Field
}
