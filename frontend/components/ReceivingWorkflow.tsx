import { Button, CellRenderer, Dialog, Heading } from '@airtable/blocks/ui'
import { connect } from 'react-redux'
import { Schema } from '../airtable/Schema'
import { ApplicationState } from '../store/reducer'
import React from 'react'
import {
  skuReceivingSetBoxFocus,
  skuReceivingSetSkuOrderFocus,
} from '../store/actions'
import Record from '@airtable/blocks/dist/types/src/models/record'
import {
  BoxToMake,
  ReceivableSkuOrder,
  PotentialBoxesForReceiving,
  UserSelectableBox,
} from '../store/types'

const ReceivingWorkflowImpl = (props: Props) => {
  const schema = props.schema
  const bailOut = <span></span>
  if (
    props.skuOrderReceiveDialogFocusedRecordId === null ||
    props.receivableSkuOrder === null
  ) {
    return bailOut
  }

  const recordToUSB = (
    box: Record,
    status: string,
    isEmpty: boolean
  ): UserSelectableBox => {
    return {
      root: { recordId: box.id },
      boxName: box.name,
      boxStatus: status,
      boxIsEmpty: isEmpty,
      boxNotes: schema.boxes.stringVal.notes(box),
    }
  }
  const boxToMakeToUSB = (
    btm: BoxToMake,
    boxDestination: Record
  ): UserSelectableBox => {
    let boxPrefix = schema.boxDestinations.stringVal.destinationPrefix(
      boxDestination
    )
    let boxOffset = schema.boxDestinations.val.boxOffset(boxDestination)
    let numericPortionStrlen = schema.boxDestinations.val.isSerialBox(
      boxDestination
    )
    let boxNumberOnly = ((1 +
      schema.boxDestinations.val.currentMaximalBoxNumber(
        boxDestination
      )) as number)
      ? 2
      : 3
    return {
      root: {
        boxNumberOnly: boxNumberOnly,
        boxDestinationId: boxDestination.id,
        notes: 'Created by Receiving Tool',
      },
      boxName:
        boxPrefix +
        '-' +
        String(boxNumberOnly + boxOffset)
          .padStart(4, '0')
          .slice(numericPortionStrlen * -1),
      boxStatus: 'Box will be created if selected',
      boxIsEmpty: true,
      boxNotes: '',
    }
  }
  const selectBoxButton = (
    usb: UserSelectableBox,
    variant: 'default' | 'primary' | 'secondary' | 'danger'
  ) => {
    return (
      <Button
        variant={variant}
        onClick={() => {
          props.skuReceivingSetBoxFocus(usb.root)
        }}
      >
        {usb.boxName}
      </Button>
    )
  }
  const usbToTr = (
    usb: UserSelectableBox,
    variant: 'default' | 'primary' | 'secondary' | 'danger'
  ) => {
    return (
      <tr>
        <td>{selectBoxButton(usb, variant)}</td>
        <td>{usb.boxName}</td>
        <td>{usb.boxStatus}</td>
        <td>{usb.boxIsEmpty}</td>
        <td>{usb.boxNotes}</td>
      </tr>
    )
  }
  return (
    <div>
      <Dialog
        width={800}
        paddingTop={'28px'}
        paddingX={'33px'}
        paddingBottom={'55px'}
        onClose={() => {
          props.skuReceivingSetSkuOrderFocus(null)
        }}
      >
        <Dialog.CloseButton />
        <Heading marginBottom={'17px'}>
          {'Pick a box to receive ' +
            props.receivableSkuOrder.skuName +
            ' into'}
        </Heading>
        <table
          // @ts-expect-error
          border={1}
        >
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
            {props.potentialBoxesForReceiving.extantMaxBox
              ? usbToTr(
                  recordToUSB(
                    props.potentialBoxesForReceiving.extantMaxBox,
                    'The highest numbered box around (you were probably packing this last)',
                    props.potentialBoxesForReceiving.maxBoxIsEmpty
                  ),
                  'primary'
                )
              : ''}
            {props.potentialBoxesForReceiving.maxBoxToMake
              ? usbToTr(
                  boxToMakeToUSB(
                    props.potentialBoxesForReceiving.maxBoxToMake,
                    props.receivableSkuOrder.boxDestination
                  ),
                  'primary'
                )
              : ''}
          </tbody>
        </table>
      </Dialog>
    </div>
  )
}

interface StateProps {
  skuOrderReceiveDialogFocusedRecordId: string | null
  receivableSkuOrder: ReceivableSkuOrder | null
  potentialBoxesForReceiving: PotentialBoxesForReceiving
}
interface OwnProps {
  schema: Schema
  skuOrderRecords: Record[]
  packableBoxRecords: Record[]
  boxDestinationRecords: Record[]
  boxRecordsOnlyDestLoaded: Record[]
}
interface DispatchProps {
  skuReceivingSetSkuOrderFocus: typeof skuReceivingSetSkuOrderFocus
  skuReceivingSetBoxFocus: typeof skuReceivingSetBoxFocus
}
interface Props extends StateProps, DispatchProps, OwnProps {}

export const ReceivingWorkflow = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  ApplicationState
>(
  // mapStateToProps
  (state: ApplicationState, ownProps: OwnProps) => {
    let receivableSkuOrder: ReceivableSkuOrder | null = ownProps.skuOrderRecords
      .filter((skuOrder: Record) => {
        return skuOrder.id === state.skuReceivingDialogFocusedSkuOrderId
      })
      .reduce(
        (
          accum: ReceivableSkuOrder | null,
          skuOrder: Record
        ): ReceivableSkuOrder | null => {
          let rel: Array<{
            id: string
            name: string
          }> = ownProps.schema.skuOrders.val.boxDestRel(skuOrder)
          // accum === null so we bailout after first finding
          if (accum === null && rel.length > 0 && rel[0].id.length) {
            let boxDestinationId = rel[0].id
            let boxDestRecord = ownProps.boxDestinationRecords.reduce(
              (accum: Record | null, boxDestRecord: Record) => {
                if (boxDestinationId === boxDestRecord.id) {
                  return boxDestRecord
                }
                return accum
              },
              null
            )
            if (boxDestRecord !== null) {
              return {
                rec: skuOrder,
                boxDestination: boxDestRecord,
                skuName: ownProps.schema.skuOrders.stringVal.skuRel(skuOrder),
              }
            }
          }
          return accum
        },
        null
      )
    return {
      schema: ownProps.schema,
      skuOrderRecords: ownProps.skuOrderRecords,
      emptyOrMaximalBoxes: ownProps.packableBoxRecords,
      boxDestinationRecordsNeedingAMaxBox: ownProps.boxDestinationRecords,
      skuOrderReceiveDialogFocusedRecordId:
        state.skuReceivingDialogFocusedSkuOrderId,
      receivableSkuOrder: receivableSkuOrder,
      potentialBoxesForReceiving: ownProps.packableBoxRecords
        // get only box records for this destination
        .filter((boxRecord: Record) => {
          let rel: Array<{
            id: string
            name: string
          }> = ownProps.schema.boxes.val.boxDestRel(boxRecord)

          if (receivableSkuOrder && rel.length > 0 && rel[0].id.length > 0) {
            return rel[0].id === receivableSkuOrder.boxDestination.id
          }
          return false
        })
        .reduce(
          (accum: PotentialBoxesForReceiving, boxRecord: Record) => {
            let isMax = ownProps.schema.boxes.val.isMaxBox(boxRecord)
            let isPenultimate = ownProps.schema.boxes.val.isPenultimateBox(
              boxRecord
            )
            let isEmpty = ownProps.schema.boxes.val.isEmpty(
              boxRecord
            ) as boolean
            let isUserSelected = ownProps.schema.boxes.val.isToggledForPacking(
              boxRecord
            ) as boolean
            if (isMax) {
              accum.extantMaxBox = boxRecord
              accum.maxBoxIsEmpty = isEmpty
            } else if (isPenultimate) {
              accum.extantPenultimateBox = boxRecord
              accum.penultimateBoxIsEmpty = isEmpty
            } else if (isEmpty) {
              accum.extantEmptyNonMaxBoxes.push(boxRecord)
            } else if (isUserSelected) {
              accum.extantNonEmptyUserSelectedBoxes.push(boxRecord)
            }

            return accum
          },
          {
            extantMaxBox: null,
            maxBoxIsEmpty: false,
            extantPenultimateBox: null,
            penultimateBoxIsEmpty: false,
            extantEmptyNonMaxBoxes: [],
            extantNonEmptyUserSelectedBoxes: [],
            maxBoxToMake: ownProps.boxDestinationRecords
              .filter((boxDestination: Record) => {
                // only for this dest
                return (
                  receivableSkuOrder &&
                  boxDestination.id === receivableSkuOrder.boxDestination.id
                )
              })
              .reduce((accum: BoxToMake | null, boxDestRecord: Record) => {
                if (accum !== null) {
                  // return first
                  return accum
                }
                return {
                  boxNumberOnly: ownProps.schema.boxDestinations.val.currentMaximalBoxNumber(
                    boxDestRecord
                  ),
                  boxDestinationId: boxDestRecord.id,
                  notes: 'Created by receiving tool',
                }
              }, null),
          }
        ),
    }
  },
  {
    skuReceivingSetSkuOrderFocus: skuReceivingSetSkuOrderFocus,
    skuReceivingSetBoxFocus: skuReceivingSetBoxFocus,
  }
)(ReceivingWorkflowImpl)
