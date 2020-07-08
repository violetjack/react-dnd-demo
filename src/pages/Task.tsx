import React, { useRef } from 'react'
import { useDrag, useDrop, DropTargetMonitor, XYCoord } from 'react-dnd'
import styles from './index.less'
import ItemTypes from './ItemTypes'
import { TaskData } from './typing'

interface TaskProps {
  task: TaskData
  statusIndex: number
  taskIndex: number
  moveTask: (dragIndex: number, dragStatusIndex: number, hoverIndex: number, hoverStatusIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
  statusIndex: number
  taskIndex: number
}

export default (props: TaskProps) => {
  const { task, statusIndex, taskIndex, moveTask } = props
  const { id, text } = task
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover (item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragStatusIndex = item.statusIndex
      const hoverStatusIndex = statusIndex
      const dragTaskIndex = item.taskIndex
      const hoverTaskIndex = taskIndex

      if (dragStatusIndex === hoverStatusIndex && dragTaskIndex === hoverTaskIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragTaskIndex < hoverTaskIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (dragTaskIndex > hoverTaskIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveTask(dragStatusIndex, dragTaskIndex, hoverStatusIndex, hoverTaskIndex)

      item.statusIndex = statusIndex
      item.taskIndex = taskIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.TASK, id, statusIndex, taskIndex },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  })

  const opacity = isDragging ? 0 : 1
  const cursor = isDragging ? 'grabbing' : 'pointer'

  drag(drop(ref))
  return (
    <div ref={ref} className={styles.task} style={{ opacity, cursor }}>
      {text}
    </div>
  )
}
