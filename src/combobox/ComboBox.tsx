import { useEffect, useMemo, useRef, useState } from 'react'
// import { OverlayScrollbars } from 'overlayscrollbars'
import { IComboBoxInputProps, IComboBoxProps } from './combobox.types'

const ComboBox = <T extends {}>({ options, selectedItem, onSelect, displayFn, children }: IComboBoxProps<T>) => {
  const scrollRef = useRef<any>(null)
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isSelect, setIsSelect] = useState(false)
  const filteredOptions = useMemo(() => {
    if (!inputValue) return options
    try {
      const regex = new RegExp(inputValue)

      return options.filter((item) => {
        const testString = displayFn(item)
        if (typeof testString !== 'string') return false
        return regex.test(testString)
      })
    } catch (e) {
      return []
    }
  }, [inputValue])

  const adjustScroll = (index: number | null) => {
    if (!scrollRef.current) return
    if (index === null) return

    try {
      const shared = Math.floor(index / 5)
      const rest = index % 5

      const content = scrollRef.current.children?.[0]?.children?.[0].children?.[0]
      const viewport = scrollRef.current.children?.[0]?.children?.[0]

      console.log(content.scrollTop)
      // if (!scrollRef.current.children[index]) return
      if (rest === 0) {
        viewport.scrollTop = content.children[index].clientHeight * shared * 4
      } else {
        viewport.scrollTop = content.children[index].clientHeight * shared * 4
        content.children[index]?.scrollIntoView({ behavior: 'auto', block: 'nearest' })
      }
      // const content = scrollRef.current?.elements().content.children?.[0]
      // const viewport = scrollRef.current?.elements().viewport

      // if (!content.children?.length || !viewport) return

      // const shared = Math.floor(index / 4)
      // const rest = index % 4

      // // setCurrentIndex(index)

      // viewport.scrollTop = content.children[index].clientHeight * shared * 4
      // if (rest !== 0) {
      //   content.children[index].scrollIntoView({ behavior: 'auto', block: 'nearest' })
      // }
    } catch (e) {}
  }
  useEffect(() => {
    if (currentIndex === null) return
    adjustScroll(currentIndex)
  }, [currentIndex])

  useEffect(() => {
    if (!inputValue && isSelect) {
      adjustScroll(currentIndex)
      setOpen(true)
      return
    }
    if (filteredOptions.length && displayFn(selectedItem) === inputValue) {
      if (!open) {
        // setOpen(true)
        return
      }
      setOpen(false)
    }

    if (filteredOptions.length && inputValue) {
      setOpen(true)
    } else {
      // setOpen(false)
    }
  }, [filteredOptions, inputValue])

  const handleClose = () => {
    const isMatch = inputValue === displayFn(selectedItem)
    setOpen(false)
    if (!isMatch) {
      const value = displayFn(selectedItem)
      setInputValue(value as unknown as string)
    }
  }
  const handleOpen = () => {
    if (!open) {
      setOpen(true)
    } else {
      handleClose()
    }
  }

  const handleSelectOption = (item: T) => {
    const findIndex = filteredOptions.findIndex((option) => displayFn(item) === displayFn(option))
    if (findIndex === -1) return

    setIsSelect(true)
    onSelect(item)
    setInputValue(displayFn(item) as string)
    setOpen(false)
  }

  const handleChange: IComboBoxInputProps['handleChange'] = (e) => setInputValue(e.target.value)

  const handleKeydown: IComboBoxInputProps['handleKeydown'] = (e) => {
    if (!scrollRef.current) return

    switch (e.key) {
      case 'ArrowUp': {
        e.preventDefault()
        if (currentIndex === null) {
          return
        }

        const nextIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : 0
        // adjustScroll(nextIndex)
        setCurrentIndex(nextIndex)

        break
      }
      case 'ArrowDown': {
        e.preventDefault()
        if (currentIndex === null) {
          setCurrentIndex(0)
          return
        }
        const length = filteredOptions.length
        const nextIndex = currentIndex + 1 <= length - 1 ? currentIndex + 1 : length - 1
        // adjustScroll(nextIndex)
        setCurrentIndex(nextIndex)
        break
      }
      case 'Enter': {
        e.preventDefault()
        if (currentIndex === null) return
        // adjustScroll(currentIndex)

        handleSelectOption(filteredOptions[currentIndex])

        break
      }

      case 'Escape': {
        setOpen(false)
        break
      }
    }
  }

  const handleKeyup: IComboBoxInputProps['handleKeyup'] = (e) => {
    if (!scrollRef.current) return
    switch (e.key) {
      case 'Backspace': {
        setInputValue(e.currentTarget.value)
        if (currentIndex === null) {
          return
        }
        break
      }
    }
  }

  return children({
    inputProps: {
      open,
      handleChange,
      handleKeydown,
      handleKeyup,
      handleOpen,
      inputValue,
    },
    optionProps: {
      open,
      handleClose,
      scrollRef,
    },
    filteredOptions,
    onSelect: handleSelectOption,
    currentIndex,
  })
}

export default ComboBox

/**
 * Example
 * <ComboBox
    selectedItem={selectedItem}
    onSelect={setSelectedItem}
    options={options}
    displayFn={(item) => item?.name}
    >
      {({ inputProps, optionProps, filteredOptions, onSelect, currentIndex }) => {
        return (
          <RelativeLayout>
            <ComboBoxInput {...inputProps} />
            <ComboBoxOptions {...optionProps}>
              {filteredOptions.map((option, index) => (
                <ComboBoxOption
                  isSelected={selectedItem.name === option.name}
                  isKeyActive={currentIndex === index}
                  onSelect={() => onSelect(option)}
                  value={option.name}
                />
              ))}
            </ComboBoxOptions>
          </RelativeLayout>
        )
      }}
   </ComboBox>
 */
