import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DragUpdate,
} from 'react-beautiful-dnd';
import update from 'immutability-helper';
import styles from './index.less';

interface initialDataInferface {
  id: number;
  name: string;
  issues: {
    id: number;
    name: string;
  }[];
  acceptIds: number[];
}

interface ColumnProps {
  columnIndex: number;
  activeColumn: initialDataInferface | null;
  column: initialDataInferface;
}

interface IssueProps {
  id: number;
  issueIndex: number;
  name: string;
}

const InitialData: initialDataInferface[] = [
  {
    id: 100,
    name: 'todo',
    issues: [
      { id: 1, name: '吃饭' },
      { id: 2, name: '睡觉' },
      { id: 3, name: '打豆豆' },
    ],
    acceptIds: [200],
  },
  {
    id: 200,
    name: 'doing',
    issues: [
      { id: 4, name: '删库' },
      { id: 5, name: '跑路' },
    ],
    acceptIds: [300],
  },
  {
    id: 300,
    name: 'done',
    issues: [],
    acceptIds: [100, 200],
  },
];

for (let i = 6; i < 100; i++) {
  InitialData[0].issues.push({ id: i, name: `uten${i}` });
}

const Issue = (props: IssueProps) => {
  const { id, issueIndex, name } = props;

  return (
    <Draggable draggableId={`${id}`} index={issueIndex}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          className={snapshot.isDragging ? styles.issueDragging : styles.issue}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {name}
        </div>
      )}
    </Draggable>
  );
};

const Column = (props: ColumnProps) => {
  const { columnIndex, activeColumn, column } = props;
  const { id, issues } = column;

  return (
    <div className={styles.column}>
      <div className={styles.columnTitle}>
        {column.name}({column.issues.length})
      </div>
      <Droppable
        droppableId={`${columnIndex}`}
        mode="virtual"
        isDropDisabled={
          activeColumn
            ? !(activeColumn.acceptIds.includes(id) || id === activeColumn.id)
            : true
        }
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            className={
              snapshot.isDraggingOver
                ? styles.columnContentActive
                : styles.columnContent
            }
            {...provided.droppableProps}
          >
            {issues.map((issue, index) => (
              <Issue
                key={issue.id}
                issueIndex={index}
                id={issue.id}
                name={issue.name}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default () => {
  const [data, setData] = useState(InitialData);
  const [activeColumn, setActiveColumn] = useState<initialDataInferface | null>(
    null,
  );

  const onDragStart = (result: DragUpdate) => {
    const { source } = result;
    const columnIndex = Number(source.droppableId);

    setActiveColumn(data[columnIndex]);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    const fromColumnIndex = Number(source.droppableId);
    const fromIssueIndex = source.index;
    const toColumnIndex = Number(destination.droppableId);
    const toIssueIndex = destination.index;

    const TempIssue = data[fromColumnIndex].issues[fromIssueIndex];

    let TempData = update(data, {
      [fromColumnIndex]: {
        issues: issues =>
          update(issues, {
            $splice: [[fromIssueIndex, 1]],
          }),
      },
    });

    TempData = update(TempData, {
      [toColumnIndex]: {
        issues: issues =>
          update(issues, {
            $splice: [[toIssueIndex, 0, TempIssue]],
          }),
      },
    });

    setData(TempData);
    setActiveColumn(null);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <div className={styles.container}>
        {data.map((column, index) => {
          return (
            <Column
              columnIndex={index}
              key={column.id}
              activeColumn={activeColumn}
              column={column}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};
