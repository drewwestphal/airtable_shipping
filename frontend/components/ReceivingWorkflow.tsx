import { Button, CellRenderer, Dialog, Heading } from '@airtable/blocks/ui'
import { connect } from 'react-redux'
import { Schema } from '../schema'
import { ApplicationState } from '../store/reducer'
import React from 'react'
import { skuOrderReceiveDialogSetFocus } from '../store/actions'
import Record from '@airtable/blocks/dist/types/src/models/record'
import {
  BoxToMake,
  ReceivableSkuOrder,
  PotentialBoxesForReceiving,
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
          <tbody></tbody>
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
  emptyOrMaximalBoxRecords: Record[]
  boxDestinationRecordsNeedingAMaxBox: Record[]
}
interface DispatchProps {
  skuOrderReceiveDialogSetFocus(id: string | null): void
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
        return skuOrder.id === state.skuOrderReceiveDialogFocusedRecordId
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
            return {
              rec: skuOrder,
              boxDestinationId: rel[0].id,
              skuName: ownProps.schema.skuOrders.stringVal.skuRel(skuOrder),
            }
          }
          return accum
        },
        null
      )
    return {
      schema: ownProps.schema,
      skuOrderRecords: ownProps.skuOrderRecords,
      emptyOrMaximalBoxes: ownProps.emptyOrMaximalBoxRecords,
      boxDestinationRecordsNeedingAMaxBox:
        ownProps.boxDestinationRecordsNeedingAMaxBox,
      skuOrderReceiveDialogFocusedRecordId:
        state.skuOrderReceiveDialogFocusedRecordId,
      receivableSkuOrder: receivableSkuOrder,
      potentialBoxesForReceiving: ownProps.emptyOrMaximalBoxRecords
        // get only box records for this destination
        .filter((boxRecord: Record) => {
          let rel: Array<{
            id: string
            name: string
          }> = ownProps.schema.boxes.val.boxDestRel(boxRecord)

          if (receivableSkuOrder && rel.length > 0 && rel[0].id.length > 0) {
            return rel[0].id === receivableSkuOrder.boxDestinationId
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

            if (isMax) {
              accum.extantMaxBox = boxRecord
              accum.maxBoxIsEmpty = isEmpty
            } else if (isPenultimate) {
              accum.extantPenultimateBox = boxRecord
              accum.penultimateBoxIsEmpty = isEmpty
            } else if (isEmpty) {
              accum.extantEmptyNonMaxBoxes.push(boxRecord)
            }

            return accum
          },
          {
            extantMaxBox: null,
            maxBoxIsEmpty: false,
            extantPenultimateBox: null,
            penultimateBoxIsEmpty: false,
            extantEmptyNonMaxBoxes: [],
            maxBoxToMake: ownProps.boxDestinationRecordsNeedingAMaxBox
              .filter((boxDestination: Record) => {
                // only for this dest
                return (
                  receivableSkuOrder &&
                  boxDestination.id === receivableSkuOrder.boxDestinationId
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
  { skuOrderReceiveDialogSetFocus: skuOrderReceiveDialogSetFocus }
)(ReceivingWorkflowImpl)
