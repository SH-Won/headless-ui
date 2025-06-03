export interface IDropdown {
  open: boolean
  handleOpen: () => void
  handleClose: () => void
}
export interface IDropdownProps<T> {
  selectItem: T
  children: (props: IDropdown) => JSX.Element
}
