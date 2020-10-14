export const searchBarValueDidChange = (searchString: string) =>
  ({
    type: 'searchBarValueDidChange',
    searchString,
  } as const)
