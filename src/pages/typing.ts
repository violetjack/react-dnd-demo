export interface StatusData {
  id: number
  name: string
  tasks: TaskData[]
}

export interface TaskData {
  id: number
  text: string
}
