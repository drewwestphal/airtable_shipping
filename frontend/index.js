import {
  initializeBlock,
  useBase,
  useGlobalConfig,
  Input,
  Switch,
  ViewportConstraint,
  useRecords,
  Box,
  RecordCardList,
  ConfirmationDialog,
  expandRecord,
  useLoadable
} from '@airtable/blocks/ui'
import React, { useState } from 'react'

function JoCoShipping () {
  const base = useBase()
  const globalConfig = useGlobalConfig()

  const [searchString, setSearchString] = useState('')
  const searchBox = SearchBox(searchString, setSearchString)

  const skuOrdersTrackingTable = base.getTableByName('SKU Orders Tracking')
  // Tracking Number
  const trackingNumberField = skuOrdersTrackingTable.primaryField
  // Tracking # Received?
  const isReceivedField = skuOrdersTrackingTable.getFieldByName(
    'Tracking # Received?'
  )
  const linkToSkuOrders = skuOrdersTrackingTable.getFieldByName('SKU Orders')

  const skuOrdersTable = base.getTableByName('SKU Orders')
  const skuOrderOrderField = skuOrdersTable.getFieldByName('Order')
  const skuOrderSKUField = skuOrdersTable.getFieldByName('SKU')
  const skuOrderQuantityField = skuOrdersTable.getFieldByName(
    'Quantity Ordered'
  )
  const skuOrderExternalProductName = skuOrdersTable.getFieldByName(
    'External Product Name'
  )
  const skuOrderReceivedField = skuOrdersTable.getFieldByName('Received?')
  const skuOrderDestinationField = skuOrdersTable.getFieldByName(
    'Onboard Destination'
  )
  const skuOrderDestinationNotesField = skuOrdersTable.getFieldByName(
    'Onboard Destination Notes'
  )
  const skuOrderFields = [
    skuOrderOrderField,
    skuOrderSKUField,
    skuOrderQuantityField,
    skuOrderExternalProductName,
    skuOrderReceivedField,
    skuOrderDestinationField,
    skuOrderDestinationNotesField
  ]

  const trackingRecords = useRecords(skuOrdersTrackingTable, {
    fields: [trackingNumberField, isReceivedField]
  })

  const searchResults = trackingRecords.filter(record => {
    return (
      record.getCellValue(trackingNumberField).trim().length > 0 &&
      record.name.includes(searchString)
    )
  })
  const mustReceive = searchResults
    .filter(record => {
      return !record.getCellValue(isReceivedField)
    })
    .map(record => {
      return (
        <UnreceivedTrackingNumber
          key={record.id}
          record={record}
          table={skuOrdersTrackingTable}
          doneField={isReceivedField}
        />
      )
    })

  // we only wanna see once which HAVE been received
  // this will result in 0 or more Query Results in an array
  const skuOrdersResult = searchResults
    .filter(tracking => {
      return tracking.getCellValue(isReceivedField)
    })
    .map(tracking => {
      return tracking.selectLinkedRecordsFromCell(linkToSkuOrders, {
        fields: skuOrderFields,
        sorts: [{ field: skuOrderDestinationField, direction: 'desc' }]
      })
    })

  useLoadable(skuOrdersResult)

  const skuOrders = skuOrdersResult.flatMap(queryRes => {
    return queryRes.records
  })
  return (
    <div>
      <ViewportConstraint minSize={{ width: 800 }} />

      <h2>Search by Tracking Number</h2>
      {searchBox}
      {mustReceive.length > 0 && searchString.trim().length > 0 ? (
        <div>
          <h2>Unreceived Tracking Numbers</h2>
          <p>
            Click on a tracking number to receive it. Once the tracking
            number(s) for your query are received, then items from within can be
            received and boxed.
          </p>
          <ul>{mustReceive}</ul>
        </div>
      ) : (
        ''
      )}
      {mustReceive.length === 0 && searchString.trim().length > 0 ? (
        <div>
          {UnreceivedSKUOrders({
            records: skuOrders,
            table: skuOrdersTable,
            skuOrderOrderField: skuOrderOrderField,
            skuOrderSKUField: skuOrderSKUField,
            skuOrderQuantityField: skuOrderQuantityField,
            skuOrderExternalProductName: skuOrderExternalProductName,
            skuOrderReceivedField: skuOrderReceivedField,
            skuOrderDestinationField: skuOrderDestinationField,
            skuOrderDestinationNotesField: skuOrderDestinationNotesField
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

const SearchBox = (searchString, setSearchString) => {
  return (
    <Input
      value={searchString}
      onChange={e => setSearchString(e.target.value)}
      placeholder='Search...'
      size='large'
      width='320px'
    />
  )
}

function UnreceivedTrackingNumber ({ record, table, doneField }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Box
      fontSize={4}
      paddingX={3}
      paddingY={2}
      marginRight={-2}
      borderBottom='default'
      display='flex'
      alignItems='center'
    >
      <a
        style={{
          cursor: 'pointer',
          flex: 'auto',
          padding: 8,
          border: '1px dotted blue'
        }}
        onClick={() => {
          setIsDialogOpen(true)
        }}
      >
        {record.name || 'Unnamed record'}
      </a>
      {isDialogOpen && (
        <ConfirmationDialog
          title={'Receive ' + record.name + '?'}
          body='This action can’t be undone.'
          onConfirm={() => {
            table.updateRecordAsync(record, {
              [doneField.id]: true
            })
            setIsDialogOpen(false)
          }}
          onCancel={() => setIsDialogOpen(false)}
        />
      )}
    </Box>
  )
}

function UnreceivedSKUOrders ({
  records,
  table,
  skuOrderOrderField,
  skuOrderSKUField,
  skuOrderQuantityField,
  skuOrderExternalProductName,
  skuOrderReceivedField,
  skuOrderDestinationField,
  skuOrderDestinationNotesField
}) {
  return (
    <Box height='450px' border='thick' backgroundColor='lightGray1'>
      <h2>Unreceived SKUOrders</h2>
      <p>Click on a SKU Order below to receive that SKU</p>
      <table border={1}>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Desc</th>
            <th>Expect</th>
            <th>Dest</th>
            <th>Recv?</th>
          </tr>
        </thead>
        <tbody>
          {records.map(rec => {
            var dest = ''
            var sku = ''
            return (
              <tr>
                <td>
                  {(sku = rec.getCellValue(skuOrderSKUField)) ? sku.name : ''}
                </td>
                <td>{rec.getCellValue(skuOrderExternalProductName)}</td>
                <td>{rec.getCellValue(skuOrderQuantityField)}</td>
                <td>
                  {(dest = rec.getCellValue(skuOrderDestinationField))
                    ? dest.name
                    : 'n/a'}
                </td>
                <td></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Box>
  )
}

initializeBlock(() => <JoCoShipping />)
