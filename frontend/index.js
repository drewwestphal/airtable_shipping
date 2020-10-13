import {
  initializeBlock,
  useRecordIds,
  useGlobalConfig,
  Input,
  ViewportConstraint,
  useRecords,
  Box,
  FormField,
  Button,
  Heading,
  ConfirmationDialog,
  useLoadable,
  Text,
  Dialog
} from '@airtable/blocks/ui'
import React, { useState, useEffect } from 'react'
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
      // this line triggers the app to reload as soon as a string comes thru
      // searchString.length>0 &&
      record
        .getCellValueAsString(schema.skuOrdersTracking.field.trackingNumberPK)
        .trim().length > 0 && record.name.includes(searchString)
    )
  })

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

  const destsNeedingAMaxBox = useRecords(
    schema.boxDestinations.view.destNeedsEmptyMaxBox,
    { fields: schema.boxDestinations.allFields }
  )

  const boxesToCreate = getBoxesToCreate(schema, destsNeedingAMaxBox)
  useEffect(
    () => {
      // this must be wrapped and then called, in order to fully throw away
      // its result
      ;(async () => {
        // batch size is 50
        for (let i = 0; i < boxesToCreate.length; i += 50) {
          //console.log()
          await schema.boxes.table.createRecordsAsync(
            boxesToCreate.slice(i, i + 50)
          )
        }
        console.log('creating box records', boxesToCreate)
      })()
    },
    []
    /**
     * I should be able to be dependent on the length of boxesToCreate
     * but it keeps creating a few dupe records and I don't understand
     */
  )

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
  // doing this for now because idk if using it the easier way would be a bug
  const [whichDialogue, setWhichDialogue] = useState(false)
  const isDialogOpen = whichDialogue === record.name
  const setIsDialogOpen = aBool => {
    setWhichDialogue(aBool ? record.name : false)
  }

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
  const [whichBoxPickingDialog, setWhichBoxPickingDialog] = useState(false)
  const [whichPackingDialog, setWhichPackingDialog] = useState(false)
  const [howMuchToPack, setHowMuchToPack] = useState(0)

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
  // useloadable on the array to wait on these items
  useLoadable(skuOrderRecordQueryResults)
  // flatten out the results into one array
  const unreceivedSkuOrders = skuOrderRecordQueryResults.flatMap(queryRes => {
    return queryRes.records
  })

  /**
   * NOW: I need to get records for the destinations that I'm curious
   * about. I can't "use" them and wait on them using the airtable hooks
   * if I have a varying number of queries for them.
   *
   * The natural thing might be to trace all the relationships and pull in
   * the graph of these data for the results. Another natural approach
   * could be to just to a direct query on the destinations I am interested in
   *
   */
  const everyEmptyOrMaximalBox = useRecords(
    schema.boxes.view.emptyOrMaximalBoxes,
    { fields: schema.boxes.allFields }
  )

  return (
    <Box height='450px' border='thick' backgroundColor='lightGray1'>
      <h2>Unreceived SKUOrders</h2>
      <p>Click on a SKU Order below to receive that SKU</p>
      <table border={1}>
        <thead>
          <tr>
            <th>Tracking #</th>
            <th>SKU</th>
            <th>Desc</th>
            <th>Expect</th>
            <th>AlreadyPacked</th>
            <th>Dest</th>
            <th>Recv?</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {unreceivedSkuOrders.map(rec => {
            const skuRel = rec.getCellValue(schema.skuOrders.field.skuRel)
            if (!skuRel) {
              // if this is null we can't go on
              return
            }
            const skuId = skuRel[0].id
            const skuName = skuRel[0].name
            const expectQty = rec.getCellValue(
              schema.skuOrders.field.quantityOrdered
            )
            const alreadyPacked = rec.getCellValue(
              schema.skuOrders.field.quantityPacked
            )
            const destPrefix = rec.getCellValue(
              schema.skuOrders.field.destinationPrefix
            )
            const receivingNotes = rec.getCellValue(
              schema.skuOrders.field.receivingNotes
            )

            const canReceive =
              skuName &&
              skuName.trim().length > 0 &&
              expectQty &&
              expectQty > 0 &&
              destPrefix &&
              destPrefix.trim().length > 0

            return (
              <tr>
                <td style={{ padding: '5px' }}>
                  {rec.getCellValueAsString(
                    schema.skuOrders.field.trackingNumberRel
                  )}
                </td>
                <td style={{ padding: '5px' }}>{skuName}</td>
                <td style={{ padding: '5px' }}>
                  {rec.getCellValue(schema.skuOrders.field.externalProductName)}
                </td>
                <td style={{ padding: '5px' }}>{expectQty}</td>
                <td style={{ padding: '5px' }}>{alreadyPacked}</td>
                <td style={{ padding: '5px' }}>{destPrefix}</td>
                <td style={{ padding: '5px' }}>
                  <Button
                    onClick={() => setWhichBoxPickingDialog(skuName)}
                    variant='primary'
                    icon='edit'
                    disabled={!canReceive}
                  >
                    Receive {skuName}
                  </Button>
                  {whichBoxPickingDialog === skuName &&
                    PickABoxToReceiveIntoDialogue({
                      setIsDialogOpen: setWhichBoxPickingDialog,
                      skuId: skuId,
                      skuName: skuName,
                      skuOrder: rec,
                      everyEmptyOrMaximalBox: everyEmptyOrMaximalBox,
                      schema: schema,
                      whichPackingDialog: whichPackingDialog,
                      setWhichPackingDialog: setWhichPackingDialog,
                      howMuchToPack: howMuchToPack,
                      setHowMuchToPack: setHowMuchToPack
                    })}
                </td>
                <td style={{ padding: '5px' }}>{receivingNotes}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Box>
  )
}

function PickABoxToReceiveIntoDialogue ({
  setIsDialogOpen,
  skuName,
  skuId,
  schema,
  skuOrder,
  everyEmptyOrMaximalBox,
  whichPackingDialog,
  setWhichPackingDialog,
  howMuchToPack,
  setHowMuchToPack
}) {
  const skuOrderBoxDestRel = skuOrder.getCellValue(
    schema.skuOrders.field.boxDestinationRel
  )

  const myPotentialBoxes = everyEmptyOrMaximalBox.reduce(
    (accum, box) => {
      const boxDestRel = box.getCellValue(
        schema.boxes.field.onboardDestinationRel
      )
      if (
        boxDestRel &&
        skuOrderBoxDestRel &&
        // the rels are arrays... so you gotta get the first item
        boxDestRel[0].id === skuOrderBoxDestRel[0].id
      ) {
        const isMax = box.getCellValue(schema.boxes.field.isMaxBox)
        const isPenultimate = box.getCellValue(
          schema.boxes.field.isPenultimateBox
        )
        const isEmpty = box.getCellValue(schema.boxes.field.isEmpty)
        if (isMax) {
          accum.maxBox = box
          accum.maxBoxIsEmpty = isEmpty
        } else if (isPenultimate) {
          accum.penultimateBox = box
          accum.penultimateBoxIsEmpty = isEmpty
        } else if (isEmpty) {
          accum.emptyNonMaxBoxes.push(box)
        }
      }
      return accum
    },
    {
      maxBox: null,
      maxBoxIsEmpty: false,
      penultimateBox: null,
      penultimateBoxIsEmpty: false,
      emptyNonMaxBoxes: []
    }
  )

  const makeTR = (boxRecord, variant, statusStr, isEmpty) => {
    return (
      <tr>
        <td style={{ padding: '5px' }}>
          <Button
            onClick={() => setWhichPackingDialog(boxRecord.name)}
            variant={variant}
            icon='play'
            //disabled={!canReceive}
          >
            {boxRecord.name}
          </Button>

          {whichPackingDialog === boxRecord.name &&
            BoxPackingDialog({
              schema: schema,
              selectedSkuName: skuName,
              selectedSkuId: skuId,
              selectedSkuOrder: skuOrder,
              selectedBoxRecord: boxRecord,
              setIsDialogOpen: setWhichPackingDialog,
              howMuchToPack: howMuchToPack,
              setHowMuchToPack: setHowMuchToPack
            })}
        </td>
        <td style={{ padding: '5px' }}>{boxRecord.name}</td>
        <td style={{ padding: '5px' }}>{statusStr}</td>
        <td style={{ padding: '5px' }}>
          {isEmpty ? 'Empty Box 🕳️' : 'Already has items 🍱'}
        </td>
        <td style={{ padding: '5px' }}>
          {boxRecord.getCellValue(schema.boxes.field.notes)}
        </td>
      </tr>
    )
  }
  const bodyContent = (
    <Box>
      <Heading>What box should we receive {skuName} into?</Heading>
      <table border={1}>
        <thead>
          <tr>
            <th>Use?</th>
            <th>Box Number</th>
            <th>Status</th>
            <th>IsEmpty?</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {myPotentialBoxes.penultimateBox &&
            makeTR(
              myPotentialBoxes.penultimateBox,
              'primary',
              'The box you were packing last',
              myPotentialBoxes.penultimateBoxIsEmpty
            )}
          {myPotentialBoxes.maxBox &&
            makeTR(
              myPotentialBoxes.maxBox,
              'danger',
              'A new box',
              myPotentialBoxes.maxBoxIsEmpty
            )}
          {myPotentialBoxes.emptyNonMaxBoxes.map(box =>
            makeTR(box, 'default', 'Misc. empty box', true)
          )}
        </tbody>
      </table>
    </Box>
  )
  return (
    <Dialog
      width={800}
      onClose={() => {
        setIsDialogOpen(false)
      }}
    >
      <Dialog.CloseButton />
      {bodyContent}
    </Dialog>
  )
}

function BoxPackingDialog ({
  schema,
  selectedSkuName,
  selectedSkuId,
  selectedSkuOrder,
  selectedBoxRecord,
  setIsDialogOpen,
  howMuchToPack,
  setHowMuchToPack
}) {
  const body = (
    <div>
      <Heading>
        {'Receiving ' + selectedSkuName + ' into ' + selectedBoxRecord.name}
      </Heading>
      <Text variant='paragraph'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam neque dui,
        euismod ac quam eget, pretium cursus nisl.
      </Text>
      <FormField label='Quantity to Receive'>
        <Input
          value={howMuchToPack}
          min={0}
          required={true}
          type='number'
          size='large'
          tabIndex={0}
          onChange={e => setHowMuchToPack(e.target.value)}
        />
      </FormField>
    </div>
  )

  const newBoxLine = {
    [schema.boxLines.field.boxRel.id]: [{ id: selectedBoxRecord.id }],
    [schema.boxLines.field.skuOrderRel.id]: [{ id: selectedSkuOrder.id }],
    [schema.boxLines.field.skuRel.id]: [{ id: selectedSkuId }],
    [schema.boxLines.field.skuQty.id]: parseInt(howMuchToPack)
  }

  return (
    <ConfirmationDialog
      width={800}
      body={body}
      onClose={() => {
        setIsDialogOpen(false)
      }}
      onConfirm={() => {
        schema.boxLines.table.createRecordAsync(newBoxLine)
        setIsDialogOpen(false)
      }}
      cancelButtonText='Go Back... :('
      confirmButtonText='Pack that SKU!!'
    />
  )
}

function getBoxesToCreate (schema, destsNeedingAMaxBox) {
  return destsNeedingAMaxBox.reduce((accum, boxDestRecord) => {
    const newBox = {}
    newBox.fields = {}
    // attempt to track the changes
    newBox.fields[schema.boxes.field.boxNumberOnly.id] =
      boxDestRecord.getCellValue(
        schema.boxDestinations.field.currentMaximalBoxNumber
      ) + 1

    newBox.fields[schema.boxes.field.onboardDestinationRel.id] = [
      { id: boxDestRecord.id }
    ]
    newBox.fields[schema.boxes.field.notes.id] = 'Created by Receiving Tool'
    accum.push(newBox)
    return accum
  }, [])
}

initializeBlock(() => <JoCoShipping />)
