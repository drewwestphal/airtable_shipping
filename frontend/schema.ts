import Base from '@airtable/blocks/dist/types/src/models/base'
import Field from '@airtable/blocks/dist/types/src/models/field'
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
        view: {},
        field: {
          //pk
          trackingNumberPK: table.primaryField,
          //rel
          skuOrdersRel: table.getFieldByName('SKU Orders'),
          //data
          //trackingNumberReceived: table.getFieldByName('Tracking # Received?'),
        },
        allViews: [],
        allFields: [],
      }

      this.skuOrdersTracking.allViews = Object.values(
        this.skuOrdersTracking.view
      )
      this.skuOrdersTracking.allFields = Object.values(
        this.skuOrdersTracking.field
      )
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
        allViews: [],
        allFields: [],
      }

      this.skuOrders.allViews = Object.values(this.skuOrders.view)
      this.skuOrders.allFields = Object.values(this.skuOrders.field)
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
        allViews: [],
        allFields: [],
      }

      this.boxDestinations.allViews = Object.values(this.boxDestinations.view)
      this.boxDestinations.allFields = Object.values(this.boxDestinations.field)
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
        allViews: [],
        allFields: [],
      }
      this.boxLines.allViews = Object.values(this.boxLines.view)
      this.boxLines.allFields = Object.values(this.boxLines.field)
    }
  }
}

interface SchemaTable {
  table: Table
  view: SchemaTableViews
  field: SchemaTableFields
  allViews: Array<View>
  allFields: Array<Field>
}

interface SchemaTableViews {
  [index: string]: View
}

interface SchemaTableFields {
  [index: string]: Field
}
