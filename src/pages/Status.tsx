import React, { useRef } from 'react'
import { useDrop, useDrag, DropTargetMonitor, XYCoord } from 'react-dnd'
import styles from './index.less'
import ItemTypes from './ItemTypes'
import { TaskData } from './typing'
import Task from './Task'

interface CardProps {
  id: any
  name: string
  index: number
  isScrolling: boolean
  tasks: TaskData[]
  moveTask: (dragIndex: number, dragStatusIndex: number, hoverIndex: number, hoverStatusIndex: number) => void
  scrollLeft: () => void
  scrollRight: () => void
  scrollStop: () => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

export default (props: CardProps) => {
  const { name, index, isScrolling, tasks, moveTask, scrollLeft, scrollRight, scrollStop } = props
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop({
    accept: ItemTypes.STATUS,
    hover (item, monitor: DropTargetMonitor) {
      // 侧滑
      const SCROLL_VALUE = 500
      const offset = monitor.getClientOffset() as XYCoord
      if (isScrolling) {
        if (window.innerWidth - offset.x < SCROLL_VALUE) {
          scrollRight()
        } else if (offset.x < SCROLL_VALUE) {
          scrollLeft()
        }
      } else if (window.innerWidth - offset.x > SCROLL_VALUE && offset.x > SCROLL_VALUE) {
        scrollStop()
      }
    }
  })

  drop(ref)

  return (
    <div ref={ref} className={styles.card}>
      <div className={styles.cardTitle}>{name}</div>
      {tasks.map((task, i) => (
        <Task task={task} key={task.id} statusIndex={index} taskIndex={i} moveTask={moveTask} />
      ))}
    </div>
  )
}
