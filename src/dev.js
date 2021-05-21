import MindElixir, { E } from './index'
import { exportSvg, exportPng } from '../painter/index'

let mind = new MindElixir({
  el: '#map',
  newTopicName: '子节点',
  direction: MindElixir.SIDE,
  // direction: MindElixir.RIGHT,
  data: MindElixir.example,
  // data: {nodeData: JSON.parse('{"id":"rootTag","topic":"ok1 #tag1","root":true,"tagActive":"#tag1","expanded":true,"children":[{"id":617,"topic":"CPU#tag1","root":false,"direction":0,"expanded":false,"parentNodeId":385,"style":null,"icons":[],"mapId":383,"type":"Node","tags":"Tag1,Tag2,Tag3,Tag4","nodeLinkCount":0,"createdBy":"Brain Ng","customerProfilePicture":"https://cortishare-dev.s3.ap-southeast-1.amazonaws.com/maps/774e6bb2-7fd5-11eb-a7c1-90e2ba30e15c/774e6bb2-7fd5-11eb-a7c1-90e2ba30e15c.png?AWSAccessKeyId=AKIATJCHCXBCXHXUKBUW&Expires=1648709170&Signature=aOnXQLr2HD0lvTeRbAxRN5KADwg%3D","children":[],"firstChildTag":true,"typeTag":"relate"},{"id":612,"topic":"CPU","root":false,"direction":0,"expanded":true,"parentNodeId":385,"style":null,"icons":[],"mapId":383,"children":[],"level":null,"type":"Node","nodeLinkCount":3,"createdBy":null,"customerProfilePicture":null,"tags":"Tag1,Tag2,Tag3,Tag4","belongOtherMap":true,"firstNodeOtherMap":true,"firstChildTag":true,"typeTag":"available"}]}')},
  locale: 'en',
  draggable: true,
  editable: true,
  // contextMenu: true,
  // contextMenuOption: {
  //   focus: true,
  //   link: true,
  //   extend: [
  //     {
  //       name: 'Node edit',
  //       onclick: () => {
  //         alert('extend menu')
  //       },
  //     },
  //   ],
  // },
  toolBar: true,
  nodeMenu: true,
  keypress: true,
  allowUndo: false,
  // before: {
  //   moveDownNode(){
  //     return false
  //   },
  //   insertSibling(el, obj) {
  //     return true
  //   },
  //   async addChild(el, obj) {
  //     await sleep()
  //     return true
  //   },
  // },
  // primaryLinkStyle: 1,
  // primaryNodeVerticalGap: 25, // 25
  // primaryNodeHorizontalGap: 100, // 65,
  isTagging: false,
})
mind.init()
// setTimeout(() => mind.init(), 1000)
// function sleep() {
//   return new Promise((res, rej) => {
//     setTimeout(() => res(), 1000)
//   })
// }
console.log('test E function', E('bd4313fbac40284b'))
// let mind2 = new MindElixir({
//   el: '#map2',
//   direction: 2,
//   data: MindElixir.example2,
//   draggable: false,
//   // overflowHidden: true,
//   nodeMenu: true,
// })
// mind2.init()
// window.currentOperation = null
// mind.bus.addListener('operation', operation => {
//   console.log(operation)
//   if (operation.name !== 'finishEdit') window.currentOperation = operation
//   // return {
//   //   name: action name,
//   //   obj: target object
//   // }

//   // name: [insertSibling|addChild|removeNode|beginEdit|finishEdit]
//   // obj: target

//   // name: moveNode
//   // obj: {from:target1,to:target2}
// })
// mind.bus.addListener('selectNode', node => {
//   console.log(node)
// })
// window.m = mind
// window.M = MindElixir
// window.exportSvg = exportSvg
// window.exportPng = exportPng
