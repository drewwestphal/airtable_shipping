import { Button, CellRenderer, Dialog, Heading } from '@airtable/blocks/ui'
import { connect } from 'react-redux'
import { Schema } from '../schema'
import { ApplicationState } from '../store/reducer'
import React from 'react'
import { skuOrderReceiveDialogSetFocus } from '../store/actions'
import Record from '@airtable/blocks/dist/types/src/models/record'
import {
  BoxToMake,
  PotentialExtantBoxesForReceiving,
  ReceivableSkuOrder,
} from '../store/types'

interface StateProps {
  skuOrderReceiveDialogFocusedRecordId: string | null
}
interface OwnProps {
  schema: Schema
  skuOrderRecords: Record[]
  emptyOrMaximalBoxRecords: Record[]
  boxDestinationRecordsNeedingAMaxBox: Record[]
}
interface DispatchProps {
  skuOrderReceiveDialogSetFocus(id: string | null): void
}
interface Props extends StateProps, DispatchProps, OwnProps {}

const ReceivingWorkflowImpl = (props: Props) => {
  const schema = props.schema
  const bailOut = <span></span>
  if (props.skuOrderReceiveDialogFocusedRecordId === null) {
    return bailOut
  }

  // validate all the props we need are on this thing
  const receivableSkuOrder: ReceivableSkuOrder | null = props.skuOrderRecords
    .filter((skuOrder: Record) => {
      return skuOrder.id === props.skuOrderReceiveDialogFocusedRecordId
    })
    .reduce(
      (
        accum: ReceivableSkuOrder | null,
        skuOrder: Record
      ): ReceivableSkuOrder | null => {
        let rel: Array<{
          id: string
          name: string
        }> = schema.skuOrders.val.boxDestRel(skuOrder)
        // accum === null so we bailout after first finding
        if (accum === null && rel.length > 0 && rel[0].id.length) {
          return {
            rec: skuOrder,
            boxDestinationId: rel[0].id,
            skuName: schema.skuOrders.stringVal.skuRel(skuOrder),
          }
        }
        return accum
      },
      null
    )

  if (receivableSkuOrder === null) {
    return bailOut
  }

  const myPotentialBoxes: PotentialExtantBoxesForReceiving = props.emptyOrMaximalBoxRecords
    // get only box records for this destination
    .filter((boxRecord: Record) => {
      let rel: Array<{
        id: string
        name: string
      }> = schema.boxes.val.boxDestRel(boxRecord)

      if (rel.length > 0 && rel[0].id.length > 0) {
        return rel[0].id === receivableSkuOrder.boxDestinationId
      }
      return false
    })
    .reduce(
      (accum: PotentialExtantBoxesForReceiving, boxRecord: Record) => {
        let isMax = schema.boxes.val.isMaxBox(boxRecord)
        let isPenultimate = schema.boxes.val.isPenultimateBox(boxRecord)
        let isEmpty = schema.boxes.val.isEmpty(boxRecord) as boolean

        if (isMax) {
          accum.extantMaxBox = boxRecord
          accum.maxBoxIsEmpty = isEmpty
        } else if (isPenultimate) {
          accum.penultimateBox = boxRecord
          accum.penultimateBoxIsEmpty = isEmpty
        } else if (isEmpty) {
          accum.emptyNonMaxBoxes.push(boxRecord)
        }

        return accum
      },
      {
        extantMaxBox: null,
        maxBoxIsEmpty: false,
        penultimateBox: null,
        penultimateBoxIsEmpty: false,
        emptyNonMaxBoxes: [],
        maxBoxToMake: props.boxDestinationRecordsNeedingAMaxBox
          .filter((boxDestination: Record) => {
            // only for this dest
            return boxDestination.id === receivableSkuOrder.boxDestinationId
          })
          .reduce((accum: BoxToMake | null, boxDestRecord: Record) => {
            if (accum !== null) {
              // return first
              return accum
            }
            return {
              boxNumberOnly: schema.boxDestinations.val.currentMaximalBoxNumber(
                boxDestRecord
              ),
              boxDestinationId: boxDestRecord.id,
              notes: 'Created by receiving tool',
            }
          }, null),
      }
    )

  return (
    <div>
      <Dialog
        width={800}
        paddingTop={'28px'}
        paddingX={'33px'}
        paddingBottom={'55px'}
        onClose={() => {
          props.skuOrderReceiveDialogSetFocus(null)
        }}
      >
        <Dialog.CloseButton />
        <Heading marginBottom={'17px'}>
          {'Pick a box to receive ' + receivableSkuOrder.skuName + ' into'}
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
          <tbody></tbody>
        </table>
      </Dialog>
    </div>
  )
}

export const ReceivingWorkflow = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  ApplicationState
>(
  // mapStateToProps
  (state: ApplicationState, ownProps: OwnProps) => ({
    schema: ownProps.schema,
    skuOrderRecords: ownProps.skuOrderRecords,
    emptyOrMaximalBoxes: ownProps.emptyOrMaximalBoxRecords,
    boxDestinationRecordsNeedingAMaxBox:
      ownProps.boxDestinationRecordsNeedingAMaxBox,
    skuOrderReceiveDialogFocusedRecordId:
      state.skuOrderReceiveDialogFocusedRecordId,
  }),
  { skuOrderReceiveDialogSetFocus: skuOrderReceiveDialogSetFocus }
)(ReceivingWorkflowImpl)
