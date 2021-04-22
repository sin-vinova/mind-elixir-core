import { dragMoveHelper } from './utils/index'


function getParent(el,query) {
  let result = [];
  let parent
  for (let p = el && el.parentElement; p; p = p.parentElement) {
    result.push(p);
  }
  result.forEach(eleParent =>{
    if(eleParent.matches(query))
      parent = eleParent
  })
  return parent;
}
export default function (mind) {
  mind.map.addEventListener('click', e => {
    // if (dragMoveHelper.afterMoving) return
    e.preventDefault()
    const nodeTopic =  getParent(e.target, 'T') ? getParent(e.target, 'T') : getParent(e.target, 'ROOT') ? getParent(e.target, 'ROOT') : null
    if (e.target.nodeName === 'EPD') {
      // W1
      // e.target.parentElement.children.forEach(element => {
      //   if (element.nodeName === 'TPC') {
      //     mind.expandNode(element)
      //   }
      // });
      // W2
      mind.expandNode(e.target.parentElement.children[0])
      // mind.expandNode(e.target.previousSibling)
    } else if (
      e.target.nodeName === 'ADD'
    ) {
      mind.addChild()
    } else if (
      nodeTopic
    ) {
      if (mind.onRedirectPath) {
        mind.onRedirectPath(e.target.nodeObj)
      }
      // mind.selectNode(e.target)
      if(e.target.classList.contains('tag')){
        const listElemnentTag =  e.target.parentElement.children
        const listTag = []
        Array.from(listElemnentTag).forEach(item => listTag.push(item.innerHTML.substring(1).trim()))
        const curTag = e.target.innerHTML.substring(1).trim()
        const topic =e.target.parentElement.parentElement.firstElementChild.innerHTML
        console.log({
          listTag,
          curTag,
          topic
        },"pppppp")
        mind.onClickTag && mind.onClickTag({
          listTag,
          curTag,
          topic
        })
        // mind.onClickTag && mind.onClickTag(
      }
      mind.selectNode(nodeTopic.firstChild)
    } else if (e.target.nodeName === 'path') {
      if (e.target.parentElement.nodeName === 'g') {
        mind.selectLink(e.target.parentElement)
      }
    } else if (e.target.className === 'circle') {
      // skip circle
    } else {
      mind.unselectNode()
      mind.hideLinkController()
    }
  })

  mind.map.addEventListener('dblclick', e => {
    e.preventDefault()

    // define between edit and create --> edit
    let isEdit = true
    if (!mind.editable) return
    if (
      e.target.parentElement.nodeName === 'T' ||
      e.target.parentElement.nodeName === 'ROOT'
    ) {
      mind.beginEdit(e.target, isEdit)
    }
  })

  /**
   * drag and move
   */
  mind.map.addEventListener('mousemove', e => {
    // click trigger mousemove in windows chrome
    // the 'true' is a string
    if (e.target.contentEditable !== 'true') {
      dragMoveHelper.onMove(e, mind.container)
    }
  })
  mind.map.addEventListener('mousedown', e => {
    if (e.target.contentEditable !== 'true') {
      dragMoveHelper.afterMoving = false
      dragMoveHelper.mousedown = true
    }
  })
  mind.map.addEventListener('mouseleave', e => {
    dragMoveHelper.clear()
  })
  mind.map.addEventListener('mouseup', e => {
    dragMoveHelper.clear()
  })
}
