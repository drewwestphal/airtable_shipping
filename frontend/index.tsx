import {
  initializeBlock,
  useRecords,
  ViewportConstraint,
} from '@airtable/blocks/ui'
import React from 'react'
import { Provider } from 'react-redux'

import { Schema } from './airtable/Schema'
import { store } from './store/store'
import { SearchBar } from './components/SearchBar'
import { TrackingRecords } from './components/TrackingRecords'
import { SkuOrderRecords } from './components/SkuOrderRecords'
import { ReceivingWorkflow } from './components/ReceivingWorkflow'
import Record from '@airtable/blocks/dist/types/src/models/record'
import { SkuOrderTrackingNumberRoot } from './airtable/SkuOrderTrackingNumber'
import { PipelineState } from './components/ShowPipelineState'

function App() {
  const schema = new Schema()

  const skuOrdersTrackingRecords: Record[] = useRecords(
    schema.skuOrdersTracking.view.hasTrackingNumber,
    {
      fields: schema.skuOrdersTracking.allFields,
      sorts: [
        {
          field: schema.skuOrdersTracking.field.isReceivedRO,
          direction: 'asc',
        },
      ],
    }
  )
  const skuOrderRecords: Record[] = useRecords(
    schema.skuOrders.view.hasTrackingNumber,
    {
      fields: schema.skuOrders.allFields,
      sorts: [
        {
          field: schema.skuOrders.field.destinationPrefix,
          direction: 'desc',
        },
      ],
    }
  )

  const packableBoxRecords: Record[] = useRecords(
    schema.boxes.view.packableBoxes,
    {
      fields: schema.boxes.allFields,
    }
  )

  const boxDestinationRecords: Record[] = useRecords(
    schema.boxDestinations.table,
    { fields: schema.boxDestinations.allFields }
  )

  const boxRecordsOnlyDestLoaded: Record[] = useRecords(schema.boxes.table, {
    fields: [schema.boxes.field.boxDestRel],
  })

  const skotnrs = skuOrdersTrackingRecords.map(function (
    skuOrderTrackingRecord: Record
  ): SkuOrderTrackingNumberRoot {
    return new SkuOrderTrackingNumberRoot(
      schema,
      schema.skuOrdersTracking.table,
      skuOrderTrackingRecord
    )
  })
  return (
    <Provider store={store}>
      <ViewportConstraint minSize={{ width: 800 }} />
      <SearchBar />
      <TrackingRecords
        schema={schema}
        skuOrdersTrackingRecords={skuOrdersTrackingRecords}
      />
      <SkuOrderRecords schema={schema} skuOrderRecords={skuOrderRecords} />
      <ReceivingWorkflow
        schema={schema}
        skuOrderRecords={skuOrderRecords}
        packableBoxRecords={packableBoxRecords}
        boxDestinationRecords={boxDestinationRecords}
        boxRecordsOnlyDestLoaded={boxRecordsOnlyDestLoaded}
      />
      <PipelineState schema={schema} skotnrs={skotnrs} />
    </Provider>
  )
}

initializeBlock(() => <App />)
