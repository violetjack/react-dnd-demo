import React from 'react';
import styles from './index.less';
import { useDrop, useDrag, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const ItemTypes = {
  APP: 'demo-app',
  OTHER: 'other'
}

const Child = () => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.APP },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return <div className={styles.child} style={{ opacity: isDragging ? 0.5 : 1 }} ref={drag}>
    Child
  </div>
}

const Container = () => {
  const [{ isOver }, drag] = useDrop({
    accept: ItemTypes.APP,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  return <div className={styles.container} ref={drag} style={{ background: isOver ? '#FFAA00' : '#FFFFFF' }}>
    Container
  </div>
}

export default () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.app}>
        <Container />
        <Child />
      </div>
    </DndProvider>
  );
}
