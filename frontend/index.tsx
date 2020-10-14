import {
  initializeBlock,
  useRecords,
  ViewportConstraint,
} from '@airtable/blocks/ui'
import React from 'react'
import { Provider } from 'react-redux'

import { Schema } from './schema'
import { store } from './store/store'
import { SearchBar } from './components/SearchBar'
import { TrackingRecords } from './components/TrackingRecords'
import { SkuOrderRecords } from './components/SkuOrderRecords'
import { ReceivingWorkflow } from './components/ReceivingWorkflow'
import Record from '@airtable/blocks/dist/types/src/models/record'

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

  const emptyOrMaximalBoxRecords: Record[] = useRecords(
    schema.boxes.view.emptyOrMaximalBoxes,
    {
      fields: schema.boxes.allFields,
    }
  )

  const boxDestinationRecordsNeedingAMaxBox: Record[] = useRecords(
    schema.boxDestinations.view.destNeedsEmptyMaxBox,
    { fields: schema.boxDestinations.allFields }
  )

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
        emptyOrMaximalBoxRecords={emptyOrMaximalBoxRecords}
        boxDestinationRecordsNeedingAMaxBox={
          boxDestinationRecordsNeedingAMaxBox
        }
      />
    </Provider>
  )
}

initializeBlock(() => <App />)
