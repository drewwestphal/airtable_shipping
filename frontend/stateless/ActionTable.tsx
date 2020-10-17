import React, { ReactElement } from 'react'

//https://github.com/Microsoft/TypeScript/issues/26223#issuecomment-674514787

interface TDElements<
  record,
  indexType extends string | number,
  // tdInner will be wrapped in td
  tdInner extends ReactElement<any, any>
> {
  record: record
  getChild: (record: record, idx: indexType) => tdInner
}

interface TableArgs<
  indexType extends string | number,
  rowType,
  headerType,
  bodyTdType extends ReactElement<any, any>,
  headerTdType extends ReactElement<any, any>
> {
  indices: Array<indexType>
  header: TDElements<headerType, indexType, headerTdType>
  rows: Array<TDElements<rowType, indexType, bodyTdType>>
}

function wrapChildren<
  indexType extends string | number,
  record,
  tdInner extends ReactElement<any, any>
>(
  indices: Array<indexType>,
  tdEl: TDElements<record, indexType, tdInner>
): Array<ReactElement<any, any>> {
  return indices.map((idx: indexType) => {
    return <td key={idx}>{tdEl.getChild(tdEl.record, idx)}</td>
  })
}

export const ActionTable = function <
  indexType extends string | number,
  rowType,
  headerType,
  bodyTdType extends ReactElement<any, any>,
  headerTdType extends ReactElement<any, any>
>(
  args: TableArgs<indexType, rowType, headerType, bodyTdType, headerTdType>
): ReactElement<any, any> {
  return (
    <table>
      <thead>
        <th>{wrapChildren(args.indices, args.header)}</th>
      </thead>
      <tbody>
        {args.rows.map((row, idx: number) => {
          return (
            <tr key={idx}>
              <th>{wrapChildren(args.indices, row)}</th>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
