import { searchBarValueDidChange } from './actions'

export interface ApplicationState {
  searchString: string
}

export type ApplicationAction = ReturnType<typeof searchBarValueDidChange>
