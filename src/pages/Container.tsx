import React, { useState, useCallback, useRef } from 'react'
import update from 'immutability-helper'
import styles from './index.less'
import Status from './Status'
import InitialData from './InitialData'
import { StatusData } from './typing'

export default () => {
  const ref = useRef<HTMLDivElement>(null)
  const [data, setData] = useState(InitialData)

  const moveTask = useCallback(
    (dragStatusIndex: number, dragTaskIndex: number, hoverStatusIndex: number, hoverTaskIndex: number) => {
      const dragCard = {
        ...data[dragStatusIndex].tasks[dragTaskIndex],
        dragging: true
      }

      if (dragStatusIndex === hoverStatusIndex) {
        setData(
          update(data, {
            [dragStatusIndex]: {
              tasks: tasks =>
                update(tasks, {
                  $splice: [
                    [dragTaskIndex, 1],
                    [hoverTaskIndex, 0, dragCard]
                  ]
                })
            }
          })
        )
      } else {
        let tempData = update(data, {
          [dragStatusIndex]: {
            tasks: tasks =>
              update(tasks, {
                $splice: [[dragTaskIndex, 1]]
              })
          }
        })
        tempData = update(tempData, {
          [hoverStatusIndex]: {
            tasks: tasks =>
              update(tasks, {
                $splice: [[hoverTaskIndex, 0, dragCard]]
              })
          }
        })

        setData(
          tempData
        )
      }
    },
    [data]
  )

  let scrollInterval: number = 0

  const scrollRight = () => {
    function scroll() {
      if (ref.current) ref.current.scrollLeft += 10
    }
    scrollInterval = setInterval(scroll, 10)
  }

  const scrollLeft = () => {
    function scroll() {
      if (ref.current) ref.current.scrollLeft += 10
    }
    scrollInterval = setInterval(scroll, 10)
  }

  const scrollStop = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval)
      scrollInterval = 0
    }
  }

  const renderStatus = (card: StatusData, index: number) => {
    return (
      <Status
        key={card.id}
        index={index}
        id={card.id}
        name={card.name}
        isScrolling={!!scrollInterval}
        tasks={card.tasks}
        moveTask={moveTask}
        scrollLeft={scrollLeft}
        scrollRight={scrollRight}
        scrollStop={scrollStop}
      />
    )
  }
  return (
    <>
      <div ref={ref} className={styles.container}>
        {data.map((card, i) => renderStatus(card, i))}
      </div>
    </>
  )
}
