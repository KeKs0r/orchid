import { TaskContext, TaskSpec, TaskSpecObject } from 'orchid';

export class List {
  list: number[];
  constructor(length: number) {
    this.list = Array.from({ length }).map((a, i) => i);
  }
  getList() {
    return this.list;
  }
}

export const mainTask: TaskSpec<undefined, Promise<number>> = {
  name: 'main',
  async run(input: undefined, { run }) {
    const inputList = await run(getListTask, 4);

    const list = await run(listTask, inputList);
    return list;
  },
};

export const getListTask: TaskSpecObject<number, List> = {
  name: 'getList',
  run(length: number, { log }) {
    log.info('Creating list with length', length);
    return new List(length);
  },
};

export const listTask = {
  name: 'list',
  async run(list: List, { run }: TaskContext): Promise<number> {
    const doubled = await Promise.all(
      list.getList().map((number) => {
        return run(addOneTask, number);
      })
    );
    const sum = await run(sumTask, doubled);
    return sum;
  },
};

export const addOneTask: TaskSpec<number, number> = {
  name: 'addOne',
  run(amount: number) {
    return amount + 1;
  },
};

export function sumTask(list: number[]) {
  return list.reduce((a, b) => a + b, 0);
}
