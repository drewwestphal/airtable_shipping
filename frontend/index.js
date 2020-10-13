import {
  initializeBlock,
  useBase,
  useGlobalConfig,
  Input,
  Switch,
  ViewportConstraint,
  useRecords,
  Box,
  FormField,
  Button,
  RecordCardList,
  ConfirmationDialog,
  expandRecord,
  useLoadable
} from '@airtable/blocks/ui'
import React, { useState } from 'react'
import getSchema from './schema.js'

function JoCoShipping () {
  const schema = getSchema()
  const base = schema.base
  const globalConfig = useGlobalConfig()

  const [searchString, setSearchString] = useState('')
  const searchBox = SearchBox(searchString, setSearchString)

  const trackingRecords = useRecords(schema.skuOrdersTracking.table, {
    fields: schema.skuOrdersTracking.allFields
  })

  const searchResults = trackingRecords.filter(record => {
    return (
      record
        .getCellValueAsString(schema.skuOrdersTracking.field.trackingNumberPK)
        .trim().length > 0 && record.name.includes(searchString)
    )
  })
  console.log(trackingRecords)

  const mustReceive = searchResults
    .filter(record => {
      return !record.getCellValue(
        schema.skuOrdersTracking.field.trackingNumberReceived
      )
    })
    .map(record => {
      return (
        <UnreceivedTrackingNumber
          key={record.id}
          record={record}
          table={schema.skuOrdersTracking.table}
          doneField={schema.skuOrdersTracking.field.trackingNumberReceived}
        />
      )
    })

  const skuOrders = UnreceivedSKUOrders({
    schema: schema,
    skuOrderTrackingRecordsToFollow: searchResults.filter(tracking => {
      return tracking.getCellValue(
        schema.skuOrdersTracking.field.trackingNumberReceived
      )
    })
  })
  // we only wanna see once which HAVE been received
  // this will result in 0 or more Query Results in an array

  return (
    <div>
      <ViewportConstraint minSize={{ width: 800 }} />

      {searchBox}
      {mustReceive.length > 0 && searchString.trim().length > 0 ? (
        <div>
          <h2>Unreceived Tracking Numbers</h2>
          <p>
            Click on a tracking number to receive it. Once the tracking
            number(s) for your query are received, then items from within can be
            received and boxed.
          </p>
          {mustReceive}
        </div>
      ) : (
        ''
      )}
      {mustReceive.length === 0 && searchString.trim().length > 0 ? (
        <div>{skuOrders}</div>
      ) : (
        ''
      )}
    </div>
  )
}

const SearchBox = (searchString, setSearchString) => {
  return (
    <FormField label='Tracking Number Search'>
      <Input
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
        placeholder='Search...'
        size='large'
        width='320px'
      />
    </FormField>
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
          cancelButtonText='Nevermind! AHH'
          confirmButtonText="Recevez S'il Vous Plait"
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

function UnreceivedSKUOrders ({ schema, skuOrderTrackingRecordsToFollow }) {
  // get an array of query results
  const skuOrderRecordQueryResults = skuOrderTrackingRecordsToFollow.map(
    tracking => {
      return tracking.selectLinkedRecordsFromCell(
        schema.skuOrdersTracking.field.skuOrdersRel,
        {
          fields: schema.skuOrders.allFields,
          sorts: [
            {
              field: schema.skuOrders.field.destinationPrefix,
              direction: 'desc'
            }
          ]
        }
      )
    }
  )
  useLoadable(skuOrderRecordQueryResults)
  // useloadable on the array to wait on these items
  // flatten out the results into one array
  const skuOrders = skuOrderRecordQueryResults.flatMap(queryRes => {
    return queryRes.records
  })

  const [whichDialogue, setWhichDialogue] = useState(false)

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
          {skuOrders.map(rec => {
            const skuName = rec.getCellValue(schema.skuOrders.field.skuName)
            const expectQty = rec.getCellValue(
              schema.skuOrders.field.quantityOrdered
            )
            const destPrefix = rec.getCellValue(
              schema.skuOrders.field.destinationPrefix
            )

            const canReceive =
              skuName &&
              skuName.trim().length > 0 &&
              expectQty &&
              expectQty > 0 &&
              destPrefix &&
              destPrefix.trim().length > 0

            // declare it up here so it gets all called now

            return (
              <tr>
                <td style={{ padding: '5px' }}>{skuName}</td>
                <td style={{ padding: '5px' }}>
                  {rec.getCellValue(schema.skuOrders.field.externalProductName)}
                </td>
                <td style={{ padding: '5px' }}>{expectQty}</td>
                <td style={{ padding: '5px' }}>{destPrefix}</td>
                <td style={{ padding: '5px' }}>
                  <Button
                    onClick={() => setWhichDialogue(skuName)}
                    variant='primary'
                    icon='edit'
                    disabled={!canReceive}
                  >
                    Receive {skuName}
                  </Button>
                  {whichDialogue === skuName &&
                    ReceiveSKUOrderDialogue({
                      setIsDialogOpen: setWhichDialogue,
                      skuName: skuName,
                      schema
                    })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Box>
  )
}

function ReceiveSKUOrderDialogue ({ setIsDialogOpen, skuName, schema }) {
  return (
    <ConfirmationDialog
      title={'Receiving ' + skuName}
      body='This action can’t be undone.'
      onConfirm={() => {
        setIsDialogOpen(false)
      }}
      onCancel={() => setIsDialogOpen(false)}
    />
  )
}

initializeBlock(() => <JoCoShipping />)
