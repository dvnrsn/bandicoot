import {useState, useContext, useEffect} from 'react'
import {RichTextContext} from './rich-text-container.component.js'

const defaultActiveInfo = {isActive: false, value: false}

export function useDocumentQueryCommandState(commandName) {
  const [activeInfo, setActiveInfo] = useState(defaultActiveInfo)
  const richTextContext = useContext(RichTextContext)

  useEffect(() => {
    richTextContext.addSelectionChangedListener(recheckActive)
    return () => richTextContext.removeSelectionChangedListener(recheckActive)
  }, [activeInfo, setActiveInfo])

  useEffect(() => {
    richTextContext.addBlurListener(setInactive)
    return () => richTextContext.removeBlurListener(setInactive)
  }, [activeInfo, setActiveInfo])

  function recheckActive() {
    const isActuallyActive = document.queryCommandState(commandName)
    const actualActiveValue = document.queryCommandValue(commandName)
    if (isActuallyActive !== activeInfo.isActive || actualActiveValue !== activeInfo.value) {
      setActiveInfo({
        isActive: isActuallyActive,
        value: actualActiveValue,
      })
    }
  }

  function setInactive() {
    setActiveInfo(defaultActiveInfo)
  }

  return {
    isActive: activeInfo.isActive,
    activeValue: activeInfo.value,
  }
}
