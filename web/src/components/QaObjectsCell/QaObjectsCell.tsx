import type { QaObjectsQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import QaObjects from 'src/components/QaObjects'

export const QUERY = gql`
  query QaObjectsQuery($page: Int, $pageSize: Int) {
    qaObjectsPage(page: $page, pageSize: $pageSize) {
      qaObjects {
        id
        typeId
        name
        description
        batchId
        threads
        loops
        json
        jsonata
        address
        method
        header
        createdAt
        updatedAt
      }
      count
      page
      pageSize
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)


export const Success = ({ qaObjectsPage }: CellSuccessProps<QaObjectsQuery>) => {
  return <QaObjects
              qaObjects={qaObjectsPage.qaObjects}
              page={qaObjectsPage.page}
              pageSize={qaObjectsPage.pageSize}
              count={qaObjectsPage.count} />
}
