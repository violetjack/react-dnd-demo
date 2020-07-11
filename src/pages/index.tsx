import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
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
}

interface ColumnProps {
  columnIndex: number;
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
  },
  {
    id: 200,
    name: 'doing',
    issues: [
      { id: 4, name: '删库' },
      { id: 5, name: '跑路' },
    ],
  },
  {
    id: 300,
    name: 'done',
    issues: [],
  },
];

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
  const { columnIndex, column } = props;
  const { issues } = column;
  return (
    <div className={styles.column}>
      <div className={styles.columnTitle}>
        {column.name}({column.issues.length})
      </div>
      <Droppable droppableId={`${columnIndex}`}>
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

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    const fromColumnIndex = Number(source.droppableId);
    const fromIssueIndex = source.index;
    const toColumnIndex = Number(destination.droppableId);
    const toIssueIndex = destination.index;

    console.log(fromColumnIndex, fromIssueIndex);
    console.log(toColumnIndex, toIssueIndex);

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
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.container}>
        {data.map((column, index) => {
          return <Column columnIndex={index} key={column.id} column={column} />;
        })}
      </div>
    </DragDropContext>
  );
};
