import { RawSpan } from './lib/model/tree-model';

export const data: RawSpan[] = [
  {
    traceId: '5573d32c5206c048ce7745921bdf750f',
    parentId: '919a4c8832b7bd71',
    name: 'pre',
    id: 'a1b258057b14a9d0',
    kind: 0,

    timestamp: 1665601749931258,
    duration: 4216,
    attributes: {},
    status: { code: 0 },
    events: [
      {
        name: 'myEvent',
        attributes: { foo: 'bar' },
        time: [1665601749, 931416512],
      },
      {
        name: 'exception',
        attributes: {
          'exception.type': 'Error',
          'exception.message': 'My Exception',
          'exception.stacktrace':
            'Error: My Exception\n' +
            '    at /Users/marc/Workspace/orchid/packages/logger-terminal/repl/ot-model.repl.ts:49:29\n' +
            '    at Generator.next (<anonymous>)\n' +
            '    at /Users/marc/Workspace/orchid/node_modules/tslib/tslib.js:118:75\n' +
            '    at new Promise (<anonymous>)\n' +
            '    at Object.__awaiter (/Users/marc/Workspace/orchid/node_modules/tslib/tslib.js:114:16)\n' +
            '    at /Users/marc/Workspace/orchid/packages/logger-terminal/repl/ot-model.repl.ts:45:21\n' +
            '    at /Users/marc/Workspace/orchid/packages/logger-terminal/repl/ot-model.repl.ts:35:11\n' +
            '    at Generator.next (<anonymous>)\n' +
            '    at /Users/marc/Workspace/orchid/node_modules/tslib/tslib.js:118:75\n' +
            '    at new Promise (<anonymous>)',
        },
        time: [1665601749, 931561708],
      },
    ],
    links: [],
  },
  {
    traceId: '5573d32c5206c048ce7745921bdf750f',
    parentId: 'ad7cd2ef4c758934',
    name: 'list_4',
    id: 'e5481e08cd5d0ac8',
    kind: 0,
    timestamp: 1665601749944133,
    duration: 2962,
    attributes: {},
    status: { code: 1 },
    events: [],
    links: [],
  },
  {
    traceId: '5573d32c5206c048ce7745921bdf750f',
    parentId: 'ad7cd2ef4c758934',
    name: 'list_3',
    id: 'c16ca3d2c3db5d9f',
    kind: 0,
    timestamp: 1665601749944894,
    duration: 2961,
    attributes: {},
    status: { code: 0 },
    events: [],
    links: [],
  },
  {
    traceId: '5573d32c5206c048ce7745921bdf750f',
    parentId: 'ad7cd2ef4c758934',
    name: 'list_2',
    id: '4ea78c985aa1cdaf',
    kind: 0,
    timestamp: 1665601749945950,
    duration: 2940,
    attributes: {},
    status: { code: 2, message: 'I hate index 2' },
    events: [],
    links: [],
  },
  {
    traceId: '5573d32c5206c048ce7745921bdf750f',
    parentId: 'ad7cd2ef4c758934',
    name: 'list_1',
    id: 'c0d153a9a9ee7867',
    kind: 0,
    timestamp: 1665601749946915,
    duration: 2910,
    attributes: {},
    status: { code: 0 },
    events: [],
    links: [],
  },
  {
    traceId: '5573d32c5206c048ce7745921bdf750f',
    parentId: 'ad7cd2ef4c758934',
    name: 'list_0',
    id: 'cf713d4cce3ccd51',
    kind: 0,
    timestamp: 1665601749947299,
    duration: 2562,
    attributes: {},
    status: { code: 0 },
    events: [],
    links: [],
  },
  {
    traceId: '5573d32c5206c048ce7745921bdf750f',
    parentId: '919a4c8832b7bd71',
    name: 'sub',
    id: 'ad7cd2ef4c758934',
    kind: 0,
    timestamp: 1665601749935762,
    duration: 14114,
    attributes: { input: '{"foo":"bar"}' },
    status: { code: 0 },
    events: [],
    links: [],
  },
  {
    traceId: '5573d32c5206c048ce7745921bdf750f',
    parentId: 'e024653c23225f19',
    name: 'main',
    id: '919a4c8832b7bd71',
    kind: 0,
    timestamp: 1665601749925756,
    duration: 24228,
    attributes: {},
    status: { code: 0 },
    events: [],
    links: [],
  },
];
