import { useLayoutEffect, useState } from 'react'
import { IDropdownProps } from './dropdown.types'

const Dropdown = <T,>({ selectItem, children }: IDropdownProps<T>) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useLayoutEffect(() => {
    if (!open) return
    setOpen(false)
  }, [selectItem])

  return children({
    open,
    handleClose,
    handleOpen,
  })
}

export default Dropdown
