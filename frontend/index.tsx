import { initializeBlock, ViewportConstraint } from '@airtable/blocks/ui'
import React from 'react'
import { Provider } from 'react-redux'

import { Schema } from './schema/Schema'
import { store } from './store/store'
import { SkuOrderTrackingNumberRoot as SkuOrderTrackingNumberPipelineRoot } from './pipeline/SkuOrderTrackingPipeline'
import { SkuOrder } from './schema/SkuOrder'
import { Box } from './schema/Box'
import { SearchBar } from './components/SearchBar'
function App() {
  const schema = new Schema()

  const trackingPipelineRoots = SkuOrderTrackingNumberPipelineRoot.useWrappedRecords(
    schema,
    schema.skuOrdersTracking.view.hasTrackingNumber,
    {
      fields: schema.skuOrdersTracking.allFields,
      sorts: [
        {
          field: schema.skuOrdersTracking.isReceivedRO.field,
          direction: 'asc',
        },
      ],
    }
  )

  /**
   * follow (AND USE) the whole tree now
   * we start large and the tree shrinks later
   * we use EVERYTHING in this call
   * we are grabbing all the fields in all the tables we
   * need and having airtable keep them up to date for us
   *
   * later, we can just call the relationship methods again
   * in the background, those records will be loaded and will
   * not throw exceptions when we try to use them
   *
   * This is a bit profligate, yes, but it also seems to work fine
   */
  trackingPipelineRoots.forEach((sot: SkuOrderTrackingNumberPipelineRoot) => {
    sot.skuOrderPipelineRoots(true).forEach((so: SkuOrder) => {
      so.sku(true)
      so.boxDestination(true)
        .boxes(true)
        .forEach((box: Box) => {
          box.boxLines(true)
        })
    })
  })

  return (
    <Provider store={store}>
      <ViewportConstraint minSize={{ width: 800 }} />
      <SearchBar></SearchBar>
      <div>EHLO</div>
    </Provider>
  )
}

initializeBlock(() => <App />)
