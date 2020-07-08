import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styles from './index.less'
import Container from './Container'

export default () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.app}>
        <Container />
      </div>
    </DndProvider>
  )
}
