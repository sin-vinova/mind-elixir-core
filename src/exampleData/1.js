export default {
  nodeData: {
    id: 'root',
    topic: 'Mind Elixir',
    root: true,
    children: [
      {
        topic: 'What is Minde Elixir',
        id: 'bd4313fbac40284b',
        direction: 0,
        expanded: true,
        // background: '#E21818',
        style: {
          color: '',
          background: '#E21818',
          fontSize: '40px',
        },
        children: [
          {
            topic: 'A mind map core',
            id: 'beeb823afd6d2114',
            background: 'rgba(226, 24, 24, 0.7)',
          },
          {
            topic: 'Free',
            id: 'c1f068377de9f3a0',
            background: 'rgba(226, 24, 24, 0.7)',
          },
          {
            topic: 'Open-Source',
            id: 'c1f06d38a09f23ca',
            background: 'rgba(226, 24, 24, 0.7)',
          },
          {
            topic: 'Use without JavaScript framework',
            id: 'c1f06e4cbcf16463',
            expanded: true,
            children: [],
            background: 'green',
          },
          {
            topic: 'Use in your own project',
            id: 'c1f1f11a7fbf7550',
            background: 'rgba(226, 24, 24, 0.7)',
            children: [
              {
                topic: "import MindElixir from 'mind-elixir'",
                id: 'c1f1e245b0a89f9b',
                background: 'rgba(226, 24, 24, 0.7)',
              },
              {
                topic: 'new MindElixir({...}).init()',
                id: 'c1f1ebc7072c8928',
                background: 'rgba(226, 24, 24, 0.7)',
              },
            ],
          },
          {
            topic: 'Easy to use',
            id: 'c1f0723c07b408d7',
            expanded: true,
            background: '#000',
            children: [
              {
                topic: 'Use it like other mind map application',
                id: 'c1f09612fd89920d',
                // background: 'rgba(226, 24, 24, 0.7)',
                style: {
                  color: '',
                  background: 'green',
                  fontSize: '20px',
                },
              },
            ],
          },
        ],
      },
      {
        topic: 'Basics',
        id: 'bd1b66c4b56754d9',
        direction: 0,
        expanded: true,
        background: '#E25376',
        children: [
          {
            topic: 'tab - Create a child node',
            id: 'bd1b6892bcab126a',
            background: '#4D9BD9',
            style: { fontSize: 40 },
          },
          {
            topic: 'enter - Create a sibling node',
            id: 'bd1b6b632a434b27',
            background: '#4D9BD9',
          },
          {
            topic: 'del - Remove a node',
            id: 'bd1b983085187c0a',
            background: '#4D9BD9',
          },
        ],
      },
      {
        topic: 'Focus mode',
        id: 'bd1b9b94a9a7a913',
        direction: 1,
        expanded: true,
        background: '#EA8F24',
        children: [
          {
            topic: 'Right click and select Focus Mode',
            id: 'bd1bb2ac4bbab458',
            background: 'rgba(234, 143, 36, 0.7)',
          },
          {
            topic: 'Right click and select Cancel Focus Mode',
            id: 'bd1bb4b14d6697c3',
            background: '#000',
          },
        ],
      },
      {
        topic: 'Left menu',
        id: 'bd1b9d1816ede134',
        direction: 0,
        expanded: true,
        background: '#0070C9',
        children: [
          {
            topic: 'Node distribution',
            id: 'bd1ba11e620c3c1a',
            background: '#F4D017',
            expanded: true,
            children: [
              { topic: 'Left', id: 'bd1c1cb51e6745d3', background: '#EA8F24' },
              { topic: 'Right', id: 'bd1c1e12fd603ff6', background: '#EA8F24' },
              {
                topic: 'Both l & r',
                id: 'bd1c1f03def5c97b',
                background: '#EA8F24',
              },
            ],
          },
        ],
      },
      {
        topic: 'Bottom menu',
        id: 'bd1ba66996df4ba4',
        direction: 1,
        expanded: true,
        background: '#2BE07F',
        children: [
          {
            topic: 'Full screen',
            id: 'bd1ba81d9bc95a7e',
            background: 'rgba(43, 224, 127, .7)',
          },
          {
            topic: 'Return to Center',
            id: 'bd1babdd5c18a7a2',
            background: 'rgba(43, 224, 127, .7)',
          },
          {
            topic: 'Zoom in',
            id: 'bd1bae68e0ab186e',
            background: 'rgba(43, 224, 127, .7)',
          },
          {
            topic: 'Zoom out',
            id: 'bd1bb06377439977',
            background: 'rgba(43, 224, 127, .7)',
          },
        ],
      },
      // {
      //   topic: 'Link',
      //   id: 'bd1beff607711025',
      //   direction: 0,
      //   expanded: true,
      //   children: [
      //     { topic: 'Right click and select Link', id: 'bd1bf320da90046a' },
      //     {
      //       topic: 'Click the target you want to link',
      //       id: 'bd1bf6f94ff2e642',
      //     },
      //     { topic: 'Modify link with control points', id: 'bd1c0c4a487bd036' },
      //   ],
      // },
      // {
      //   topic: 'Node style',
      //   id: 'bd1c217f9d0b20bd',
      //   direction: 0,
      //   expanded: true,
      //   children: [
      //     {
      //       topic: 'Font Size',
      //       id: 'bd1c24420cd2c2f5',
      //       style: { fontSize: '32', color: '#3298db' },
      //     },
      //     {
      //       topic: 'Font Color',
      //       id: 'bd1c2a59b9a2739c',
      //       style: { color: '#c0392c' },
      //     },
      //     {
      //       topic: 'Background Color',
      //       id: 'bd1c2de33f057eb4',
      //       style: { color: '#bdc3c7', background: '#2c3e50' },
      //     },
      //     { topic: 'Add tags', id: 'bd1cff58364436d0', tags: ['Completed'] },
      //     {
      //       topic: 'Add icons',
      //       id: 'bd1d0317f7e8a61a',
      //       icons: ['😂'],
      //       tags: ['www'],
      //     },
      //     {
      //       topic: 'Bolder',
      //       id: 'bd41fd4ca32322a4',
      //       style: { fontWeight: 'bold' },
      //     },
      //   ],
      // },
      {
        topic:
          'Draggable ksnaknckjsbdcjsbvdsvbskdvsdvj ksnaknckjsbdcjsbvdsvbskdvsdvj ksnaknckjsbdcjsbvdsvbskdvsdvjksnaknckjsbdcjsbvdsvbskdvsdvj Draggable ksnaknckjsbdcjsbvdsvbskdvsdvj ksnaknckjsbdcjsbvdsvbskdvsdvj ksnaknckjsbdcjsbvdsvbskdvsdvjksnaknckjsbdcjsbvdsvbskdvsdvj Draggable ksnaknckjsbdcjsbvdsvbskdvsdvj ksnaknckjsbdcjsbvdsvbskdvsdvj ksnaknckjsbdcjsbvdsvbskdvsdvjksnaknckjsbdcjsbvdsvbskdvsdvj Draggable ksnaknckjsbdcjsbvdsvbskdvsdvj ksnaknckjsbdcjsbvdsvbskdvsdvj ksnaknckjsbdcjsbvdsvbskdvsdvjksnaknckjsbdcjsbvdsvbskdvsdvj',
        id: 'bd1f03fee1f63bc6',
        direction: 1,
        expanded: true,
        children: [
          {
            topic:
              'Drag a node to another node\nand the former one will become a child node of latter one',
            id: 'bd1f07c598e729dc',
          },
        ],
      },
      // {
      //   topic: 'TODO',
      //   id: 'bd1facea32a1967c',
      //   direction: 1,
      //   expanded: true,
      //   children: [
      //     { topic: 'Add image', id: 'bd1fb1ec53010749' },
      //     { topic: 'Free node (position)', id: 'bd42d3e3bee992b9' },
      //     { topic: 'Style adjustment', id: 'beeb7f3db6ad6496' },
      //   ],
      // },
      {
        topic: 'Export data',
        id: 'beeb7586973430db',
        direction: 1,
        expanded: true,
        children: [
          { topic: 'JSON', id: 'beeb784cc189375f' },
          { topic: 'HTML', id: 'beeb7a6bec2d68f5' },
        ],
      },
      {
        topic: 'Caution',
        id: 'bd42dad21aaf6bae',
        direction: 0,
        style: { background: '#f1c40e', fontSize: '20px' },
        expanded: true,
        children: [
          {
            topic: 'Only save manually',
            id: 'bd42e1d0163ebf04',
            expanded: true,
            children: [
              {
                topic: 'Save button in the top-right corner',
                id: 'bd42e619051878b3',
                expanded: true,
                children: [],
              },
              { topic: 'ctrl + S', id: 'bd42e97d7ac35e99' },
            ],
          },
        ],
      },
    ],
    expanded: true,
  },
  linkData: {},
}

export const aaa = {
  nodeData: {
    id: 935,
    topic: 'Brian Edited 2',
    root: true,
    direction: 1,
    expanded: true,
    parentNodeId: null,
    style: { color: '#3298db', background: '#3298db' },
    icons: ['👌'],
    mapId: 435,
    children: [
      {
        id: 936,
        topic: 'new node',
        root: false,
        direction: 0,
        expanded: true,
        parentNodeId: 935,
        style: { color: null, background: null, fontSize: null },
        icons: [],
        mapId: 435,
        children: [
          {
            id: 937,
            topic: 'new node',
            root: false,
            direction: 0,
            expanded: true,
            parentNodeId: 936,
            style: { color: null, background: null, fontSize: null },
            icons: [],
            mapId: 435,
            children: [
              {
                id: 954,
                topic: 'new node',
                root: false,
                direction: 0,
                expanded: true,
                parentNodeId: 937,
                style: { color: null, background: null, fontSize: null },
                icons: [],
                mapId: 435,
                children: [
                  {
                    id: 955,
                    topic: 'new node',
                    root: false,
                    direction: 0,
                    expanded: true,
                    parentNodeId: 954,
                    style: { color: null, background: null, fontSize: null },
                    icons: [],
                    mapId: 435,
                    children: [
                      {
                        id: 956,
                        topic: 'new node',
                        root: false,
                        direction: 0,
                        expanded: true,
                        parentNodeId: 955,
                        style: {
                          color: null,
                          background: null,
                          fontSize: null,
                        },
                        icons: [],
                        mapId: 435,
                        children: [
                          {
                            id: 968,
                            topic: 'new node',
                            root: false,
                            direction: 0,
                            expanded: true,
                            parentNodeId: 956,
                            style: {
                              color: null,
                              background: null,
                              fontSize: null,
                            },
                            icons: [],
                            mapId: 435,
                            children: [],
                            type: 'Node',
                          },
                        ],
                        type: 'Node',
                      },
                    ],
                    type: 'Node',
                  },
                ],
                type: 'Node',
              },
            ],
            type: 'Node',
          },
        ],
        type: 'Node',
      },
    ],
    type: 'Node',
  },
}
