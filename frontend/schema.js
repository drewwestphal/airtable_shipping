import { useBase } from '@airtable/blocks/ui'

export default function getSchema () {
  const base = useBase()
  const schema = { base: base }
  /**
   *
   *
   * SKU Orders Tracking
   *
   *
   */
  {
    let table = base.getTableByName('SKU Orders Tracking')
    schema.skuOrdersTracking = {}
    schema.skuOrdersTracking.view = {}
    schema.skuOrdersTracking.field = {}
    schema.skuOrdersTracking.table = table
    schema.skuOrdersTracking.field.trackingNumberPK = table.primaryField
    schema.skuOrdersTracking.field.trackingNumberReceived = table.getFieldByName(
      'Tracking # Received?'
    )
    schema.skuOrdersTracking.field.skuOrdersRel = table.getFieldByName(
      'SKU Orders'
    )
    schema.skuOrdersTracking.allViews = Object.values(
      schema.skuOrdersTracking.view
    )
    schema.skuOrdersTracking.allFields = Object.values(
      schema.skuOrdersTracking.field
    )
  }
  /**
   *
   * Sku Orders
   *
   */

  {
    let table = base.getTableByName('SKU Orders')
    schema.skuOrders = {}
    schema.skuOrders.view = {}
    schema.skuOrders.field = {}
    schema.skuOrders.table = table
    // pk
    schema.skuOrders.field.skuOrderPK = table.primaryField
    // rels
    schema.skuOrders.field.trackingNumberRel = table.getFieldByName(
      'Tracking Number'
    )
    schema.skuOrders.field.orderRel = table.getFieldByName('Order')
    schema.skuOrders.field.skuRel = table.getFieldByName('SKU')
    schema.skuOrders.field.boxDestinationRel = table.getFieldByName(
      'Onboard Destination'
    )
    // data
    schema.skuOrders.field.trackingNumberReceived = table.getFieldByName(
      'Tracking # Received?'
    )
    schema.skuOrders.field.skuName = table.getFieldByName('gtg_sku_name')
    schema.skuOrders.field.quantityOrdered = table.getFieldByName(
      'Quantity Ordered'
    )
    schema.skuOrders.field.externalProductName = table.getFieldByName(
      'External Product Name'
    )
    schema.skuOrders.field.skuIsReceived = table.getFieldByName('SKU Received?')
    schema.skuOrders.field.destinationPrefix = table.getFieldByName(
      'gtg_dest_prefix'
    )
    schema.skuOrders.field.receivingNotes = table.getFieldByName(
      'SKU Receiving Notes'
    )

    schema.skuOrders.allViews = Object.values(schema.skuOrders.view)
    schema.skuOrders.allFields = Object.values(schema.skuOrders.field)
  }
  /**
   *
   *
   * Boxes
   *
   *
   */

  {
    let table = base.getTableByName('Boxes')
    schema.boxes = {}
    schema.boxes.view = {}
    schema.boxes.field = {}
    schema.boxes.table = table

    //view
    schema.boxes.view.emptyOrMaximalBoxes = table.getViewByName(
      'gtg_empty_penultimate_or_max_boxes'
    )
    schema.boxes.view.emptyBoxesOnly = table.getViewByName(
      'gtg_empty_boxes_only'
    )
    //pk
    schema.boxes.field.boxNumberPK = table.primaryField
    //rel
    schema.boxes.field.onboardDestinationRel = table.getFieldByName(
      'Onboard Destination'
    )
    schema.boxes.field.boxNumberOnly = table.getFieldByName('# Only')
    //data
    schema.boxes.field.isMaxBox = table.getFieldByName('gtg_is_max_box')
    schema.boxes.field.isPenultimateBox = table.getFieldByName(
      'gtg_is_penultimate_box'
    )
    schema.boxes.field.isEmpty = table.getFieldByName('gtg_is_empty')
    schema.boxes.field.notes = table.getFieldByName('Notes')

    schema.boxes.allViews = Object.values(schema.boxes.view)
    schema.boxes.allFields = Object.values(schema.boxes.field)
  }
  /**
   *
   *
   * Box Destinations
   *
   *
   */

  {
    let table = base.getTableByName('Box Destinations')
    schema.boxDestinations = {}
    schema.boxDestinations.view = {}
    schema.boxDestinations.field = {}
    schema.boxDestinations.table = table

    schema.boxDestinations.view.destNeedsEmptyMaxBox = table.getViewByName(
      'gtg_dest_needs_empty_max_box'
    )

    //pk
    schema.boxDestinations.field.boxDestNamePK = table.primaryField
    //rel
    //data
    schema.boxDestinations.field.prefix = table.getFieldByName('Prefix')
    schema.boxDestinations.field.currentMaximalBoxNumber = table.getFieldByName(
      'Current Maximal Box #'
    )

    schema.boxDestinations.allViews = Object.values(schema.boxDestinations.view)
    schema.boxDestinations.allFields = Object.values(
      schema.boxDestinations.field
    )
  }

  return schema
}
