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
  let isPanning = false;
  mind.map.addEventListener('click', e => {
    // if (dragMoveHelper.afterMoving) return
    e.preventDefault()
    const nodeTopic =  getParent(e.target, 'T') ? getParent(e.target, 'T') : getParent(e.target, 'ROOT') ? getParent(e.target, 'ROOT') : null
    if(mind.isTagging)
      document.querySelectorAll('.tag-topic-relate').forEach(item =>{
        if(item.nodeObj.firstChildTag)
          mind.expandNode(item,false)
      })
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
      const dataId = nodeTopic.firstElementChild.dataset.nodeid
      if(nodeTopic.firstElementChild.nodeObj && nodeTopic.firstElementChild.nodeObj.typeTag && nodeTopic.firstElementChild.nodeObj.typeTag === 'relate' && nodeTopic.firstElementChild.nodeObj.firstChildTag){
        mind.expandNode(nodeTopic.firstElementChild,true)
      }
      if(e.target.classList.contains('disagree-icon'))
        mind.onRemoveRelateNode && mind.onRemoveRelateNode(nodeTopic.firstElementChild.nodeObj)
      if(e.target.classList.contains('agree-icon')){
        mind.onAddRelateNode && mind.onAddRelateNode(nodeTopic.firstElementChild.nodeObj)
      }
      // if (mind.onRedirectPath) {
      //   mind.onRedirectPath(nodeTopic.firstElementChild.nodeObj)
      // }

      // mind.selectNode(e.target)
      if(e.target.classList.contains('tag')){
        const listElemnentTag =  e.target.parentElement.children
        const listTag = []
        Array.from(listElemnentTag).forEach(item => listTag.push(item.innerHTML.substring(1).trim()))
        const curTag = e.target.innerHTML.trim()
        const topic = nodeTopic.firstElementChild.textContent
        mind.onClickTag && mind.onClickTag({
          nodeObj: nodeTopic.firstElementChild.nodeObj,
          curTag,
          topic
        })
        // mind.onClickTag && mind.onClickTag(
      }
      if(mind.isTagging)
        mind.selectNode(document.querySelectorAll(`[data-nodeid=${dataId}]`)[0])
      else
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

    // const nodeTopic =  getParent(e.target, 'T') ? getParent(e.target, 'T') : getParent(e.target, 'ROOT') ? getParent(e.target, 'ROOT') : null
    
    // no allow modify root node
    const nodeTopic =  getParent(e.target, 'T') ? getParent(e.target, 'T') : null

    // define between edit and create --> edit
    let isEdit = true
    if (!mind.editable) return
    if (
      nodeTopic
    ) {
      
      mind.beginEdit(getParent(e.target, 'tpc'), isEdit,mind.isTagging)
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

  mind.map.onmousedown = function (e) {
    isPanning = true
  }

  mind.map.onmousewheel = e => {
    isPanning = true
    if (isPanning) {
      if (e.deltaY > 0) {
        // scrolling up
        if (mind.scaleVal > 1.6) return
        mind.scale((mind.scaleVal += 0.1))
      } else if (e.deltaY < 0) {
        // scrolling down
        if (mind.scaleVal < 0.6) return
        mind.scale((mind.scaleVal -= 0.1))
      }
      isPanning = false
    }
  }

  mind.map.onmouseup = function (e) {
    isPanning = false
  }

  mind.map.onmouseleave = function (e) {
    isPanning = false
  }
}
