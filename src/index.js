import info from '../package.json'
import vari from './var'
import {
  isMobile,
  addParentLink,
  getObjById,
  generateUUID,
} from './utils/index'
import { findEle, createInputDiv, layout } from './utils/dom'
import { createLinkSvg, createLine } from './utils/svg'
import {
  selectNode,
  unselectNode,
  selectNextSibling,
  selectPrevSibling,
  selectFirstChild,
  selectParent,
  getAllDataString,
  getAllData,
  getAllDataMd,
  scale,
  toCenter,
  focusNode,
  cancelFocus,
  initLeft,
  initRight,
  initRightTree,
  initSide,
  setLocale,
  enableEdit,
  disableEdit,
  expandNode,
  refresh,
} from './interact'
import {
  insertSibling,
  insertBefore,
  addChild,
  moveNode,
  removeNode,
  moveUpNode,
  moveDownNode,
  beginEdit,
  updateNodeStyle,
  updateNodeTags,
  updateNodeIcons,
  processPrimaryNode,
  setNodeTopic,
  moveNodeBefore,
  moveNodeAfter,
} from './nodeOperation'
import {
  createLink,
  removeLink,
  selectLink,
  hideLinkController,
  showLinkController,
} from './linkOperation'
import { LEFT, RIGHT, SIDE, RIGHT_TREE } from './const'
import example from './exampleData/1'
import nodeDataTagging from './exampleData/tagging'
import example2 from './exampleData/2'
import example3 from './exampleData/1.cn'
import linkDiv from './linkDiv'
import initMouseEvent from './mouse'

import contextMenu from './plugin/contextMenu'
import toolBar from './plugin/toolBar'
import nodeMenu from './plugin/nodeMenu'
import nodeDraggable from './plugin/nodeDraggable'
import keypress from './plugin/keypress'
import mobileMenu from './plugin/mobileMenu'

import Bus from './utils/pubsub'

import './index.less'
import './plugin/contextMenu.less'
import './plugin/toolBar.less'
import './plugin/nodeMenu.less'
import './plugin/mobileMenu.less'

// import { exportSvg, exportPng } from '../painter'

import './iconfont/iconfont.js'

// TODO MindElixirLite
// TODO Link label
// TODO show up animation

window.E = findEle
export let E = findEle

let $d = document
/** 
 * @class MindElixir 
 * @example 
 * let mind = new MindElixir({
  el: '#map',
  direction: 2,
  data: data,
  draggable: true,
  editable: true,
  contextMenu: true,
  toolBar: true,
  nodeMenu: true,
  keypress: true,
})
mind.init()
 *
 */
function MindElixir({
  el,
  data,
  direction,
  locale,
  draggable,
  editable,
  contextMenu,
  contextMenuOption,
  toolBar,
  nodeMenu,
  keypress,
  before,
  newTopicName,
  allowUndo,
  primaryLinkStyle,
  overflowHidden,
  primaryNodeHorizontalGap,
  primaryNodeVerticalGap,
  mobileMenu,
  onChangeText,
  onCreateNodeRequest,
  onEditNodeRequest,
  onDeleteNodeRequest,
  onRedirectPath,
  onRedirectRoutePost,
  colorList,
  onClickTag,
  isTagging,
}) {
  vari.newTopicName = newTopicName
  this.mindElixirBox = document.querySelector(el)
  this.history = [] // TODO
  this.before = before || {}
  this.nodeData = data.nodeData || {}
  this.linkData = data.linkData || {}
  this.locale = locale
  this.contextMenuOption = contextMenuOption
  this.contextMenu = contextMenu === undefined ? true : contextMenu
  this.toolBar = toolBar === undefined ? true : toolBar
  this.nodeMenu = nodeMenu === undefined ? true : nodeMenu
  this.keypress = keypress === undefined ? true : keypress
  this.mobileMenu = mobileMenu
  // record the direction before enter focus mode, must true in focus mode, reset to null after exit focus
  // todo move direction to data
  this.direction = typeof direction === 'number' ? direction : 1
  vari.mevar_draggable = draggable === undefined ? true : draggable
  this.editable = editable === undefined ? true : editable
  this.allowUndo = allowUndo === undefined ? true : allowUndo
  this.parentMap = {} // deprecate?
  this.currentNode = null // the selected <tpc/> element
  this.currentLink = null // the selected link svg element
  this.inputDiv = null // editor
  this.bus = new Bus()
  this.scaleVal = 1
  this.tempDir = null
  this.primaryLinkStyle = primaryLinkStyle || 0
  this.overflowHidden = overflowHidden
  this.primaryNodeHorizontalGap = primaryNodeHorizontalGap
  this.primaryNodeVerticalGap = primaryNodeVerticalGap
  this.onChangeText = onChangeText || null
  this.onCreateNodeRequest = onCreateNodeRequest || null
  this.onEditNodeRequest = onEditNodeRequest || null
  this.onDeleteNodeRequest = onDeleteNodeRequest || null
  this.onRedirectPath = onRedirectPath || null
  this.onRedirectRoutePost = onRedirectRoutePost || null
  this.colorList = colorList || null

  this.isUndo = false
  this.isTagging = !!isTagging
  this.onClickTag = onClickTag || null
  this.bus.addListener('operation', operation => {
    if (this.isUndo) {
      this.isUndo = false
      return
    }
    if (
      ['moveNode', 'removeNode', 'addChild', 'finishEdit'].includes(
        operation.name
      )
    ) {
      this.history.push(operation)
      // console.log(operation, this.history)
    }
  })

  this.undo = function () {
    let operation = this.history.pop()
    if (!operation) return
    this.isUndo = true
    if (operation.name === 'moveNode') {
      this.moveNode(
        E(operation.obj.fromObj.id),
        E(operation.obj.originParentId)
      )
    } else if (operation.name === 'removeNode') {
      if (operation.originSiblingId) {
        this.insertBefore(E(operation.originSiblingId), operation.obj)
      } else {
        this.addChild(E(operation.originParentId), operation.obj)
      }
    } else if (operation.name === 'addChild') {
      this.removeNode(E(operation.obj.id))
    } else if (operation.name === 'finishEdit') {
      this.setNodeTopic(E(operation.obj.id), operation.origin)
    } else {
      this.isUndo = false
    }
  }
}

MindElixir.prototype = {
  addParentLink,
  getObjById,
  // node operation
  addPost: async function (...args) {
    alert("addPost clicked");
    console.log(args, 'addPost')
  },
  insertSibling: async function (...args) {
    if (
      !this.before.insertSibling ||
      (await this.before.insertSibling.apply(this, args))
    ) {
      insertSibling.apply(this, args)
    }
  },
  insertBefore: async function (...args) {
    if (
      !this.before.insertBefore ||
      (await this.before.insertBefore.apply(this, args))
    ) {
      insertBefore.apply(this, args)
    }
  },
  addChild: async function (...args) {
    if (
      !this.before.addChild ||
      (await this.before.addChild.apply(this, args))
    ) {
      addChild.apply(this, args)
    }
  },
  moveNode: async function (...args) {
    if (
      !this.before.moveNode ||
      (await this.before.moveNode.apply(this, args))
    ) {
      moveNode.apply(this, args)
    }
  },
  removeNode: async function (...args) {
    if (
      !this.before.removeNode ||
      (await this.before.removeNode.apply(this, args))
    ) {
      removeNode.apply(this, args)
    }
  },
  moveUpNode: async function (...args) {
    if (
      !this.before.moveUpNode ||
      (await this.before.moveUpNode.apply(this, args))
    ) {
      moveUpNode.apply(this, args)
    }
  },
  moveDownNode: async function (...args) {
    if (
      !this.before.moveDownNode ||
      (await this.before.moveDownNode.apply(this, args))
    ) {
      moveDownNode.apply(this, args)
    }
  },
  beginEdit: async function (...args) {
    if (
      !this.before.beginEdit ||
      (await this.before.beginEdit.apply(this, args))
    ) {
      beginEdit.apply(this, args)
    }
  },
  moveNodeBefore: async function (...args) {
    if (
      !this.before.moveNodeBefore ||
      (await this.before.moveNodeBefore.apply(this, args))
    ) {
      moveNodeBefore.apply(this, args)
    }
  },
  moveNodeAfter: async function (...args) {
    if (
      !this.before.moveNodeAfter ||
      (await this.before.moveNodeAfter.apply(this, args))
    ) {
      moveNodeAfter.apply(this, args)
    }
  },
  updateNodeStyle,
  updateNodeTags,
  updateNodeIcons,
  processPrimaryNode,
  setNodeTopic,

  createLink,
  removeLink,
  selectLink,
  hideLinkController,
  showLinkController,

  layout,
  linkDiv,
  createInputDiv,

  selectNode,
  unselectNode,
  selectNextSibling,
  selectPrevSibling,
  selectFirstChild,
  selectParent,
  getAllDataString,
  getAllData,
  getAllDataMd,
  scale,
  toCenter,
  focusNode,
  cancelFocus,
  initLeft,
  initRight,
  initSide,
  initRightTree,
  setLocale,
  enableEdit,
  disableEdit,
  expandNode,
  refresh,

  init: function () {
    /**
     * @function
     * @global
     * @name E
     * @param {string} id Node id.
     * @return {TargetElement} Target element.
     * @example
     * E('bd4313fbac40284b')
     */
    addParentLink(this.nodeData)
    console.log('ME_version ' + MindElixir.version)
    console.log(this)
    this.mindElixirBox.className += ' mind-elixir'
    this.mindElixirBox.innerHTML = ''

    this.container = $d.createElement('div') // map container
    this.container.className = 'map-container'

    if (this.overflowHidden) this.container.style.overflow = 'hidden'

    this.map = $d.createElement('div') // map-canvas Element
    this.map.className = 'map-canvas'
    this.isTagging && this.map.classList.add('map-canvas-tag')
    this.map.setAttribute('tabindex', '0')
    this.container.appendChild(this.map)
    this.mindElixirBox.appendChild(this.container)
    this.root = $d.createElement('root')

    this.box = $d.createElement('children')
    this.box.className = 'box'

    // infrastructure

    this.svg2nd = createLinkSvg('svg2nd') // main link container

    this.linkController = createLinkSvg('linkcontroller') // bezier controller container
    this.P2 = $d.createElement('div') // bezier P2
    this.P3 = $d.createElement('div') // bezier P3
    this.P2.className = this.P3.className = 'circle'
    this.line1 = createLine(0, 0, 0, 0) // bezier auxiliary line1
    this.line2 = createLine(0, 0, 0, 0) // bezier auxiliary line2
    this.linkController.appendChild(this.line1)
    this.linkController.appendChild(this.line2)

    this.linkSvgGroup = createLinkSvg('topiclinks') // storage user custom link svg

    this.map.appendChild(this.root)
    this.map.appendChild(this.box)
    this.map.appendChild(this.svg2nd)
    this.map.appendChild(this.linkController)
    this.map.appendChild(this.linkSvgGroup)
    this.map.appendChild(this.P2)
    this.map.appendChild(this.P3)

    // plugin
    this.toolBar && toolBar(this)
    this.nodeMenu && nodeMenu(this)
    this.keypress && keypress(this)

    if (isMobile && this.mobileMenu) {
      mobileMenu(this)
    } else {
      this.contextMenu && contextMenu(this, this.contextMenuOption)
    }
    vari.mevar_draggable && nodeDraggable(this)

    this.toCenter()
    this.layout()
    this.linkDiv()
    if (!this.overflowHidden) initMouseEvent(this)
  },
}
// MindElixir.exportSvg = exportSvg
// MindElixir.exportPng = exportPng
MindElixir.LEFT = LEFT
MindElixir.RIGHT = RIGHT
MindElixir.SIDE = SIDE
MindElixir.RIGHT_TREE = RIGHT_TREE
/**
 * @memberof MindElixir
 * @static
 */
MindElixir.version = info.version
MindElixir.E = findEle
/**
 * @memberof MindElixir
 * @static
 * @description Example data help you try Mind-elxir quickly.
 */
// console.log(nodeData,"ppppppp  ")
MindElixir.exampleTagging = nodeDataTagging
MindElixir.example = example
MindElixir.example2 = example2
MindElixir.example3 = example3
/**
 * @function new
 * @memberof MindElixir
 * @static
 * @param {String} topic root topic
 */
MindElixir.new = topic => ({
  nodeData: {
    id: generateUUID(),
    topic: topic || 'new topic',
    root: true,
    children: [],
  },
  linkData: {},
})
MindElixir.newNode = ({ topic }) => {
  let id = generateUUID()
  return {
    id,
    topic,
    // selected: true,
    // new: true,
  }
}

export default MindElixir
