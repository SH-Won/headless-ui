import { OverlayScrollbars } from 'overlayscrollbars'
import { ChangeEvent, Dispatch, KeyboardEvent, MutableRefObject, PropsWithChildren, SetStateAction } from 'react'

export interface IComboBoxInputProps {
  open: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleKeydown: (e: KeyboardEvent<HTMLInputElement>) => void
  handleKeyup: (e: KeyboardEvent<HTMLInputElement>) => void
  handleOpen: () => void
  inputValue: string
}
export interface IComboBoxOptionListProps extends PropsWithChildren {
  open: boolean
  handleClose: () => void
  scrollRef: MutableRefObject<OverlayScrollbars | null>
}

export interface IComboBox<T> {
  inputProps: IComboBoxInputProps
  optionProps: IComboBoxOptionListProps
  currentIndex: null | number
  filteredOptions: T[]
  onSelect: (option: T) => void
}

export interface IComboBoxProps<T extends {}> {
  selectedItem: T
  options: T[]
  displayFn: (options: T) => T[keyof T]
  onSelect: Dispatch<SetStateAction<T>>
  children: (props: IComboBox<T>) => JSX.Element
}
