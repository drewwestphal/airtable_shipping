import { ApplicationState, ApplicationAction } from './types'

export const initialState: ApplicationState = {
  searchString: '',
}

const reducer = (
  state: ApplicationState = initialState,
  action: ApplicationAction
) => {
  switch (action.type) {
    case 'searchBarValueDidChange': {
      let { searchString } = action
      return { ...state, searchString: searchString }
    }
    default:
      return state
  }
}
export default reducer
