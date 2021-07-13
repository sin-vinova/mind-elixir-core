import { dragMoveHelper, throttle } from '../utils/index'
let $d = document
var meet
export let insertPreview = function (el, insertLocation) {
  if (!insertLocation) {
    clearPreview(el)
    return el
  }
  let query = el.getElementsByClassName('insert-preview')
  let className = `insert-preview ${insertLocation} show`

  if (query.length > 0) {
    query[0].className = className
  } else {
    let insertPreviewEL = $d.createElement('div')
    insertPreviewEL.className = className
    el.appendChild(insertPreviewEL)
  }
  return el
}

export let clearPreview = function (el) {
  if (!el) {
    return el
  }
  let query = el.getElementsByClassName('insert-preview')
  for (const queryElement of query || []) {
    queryElement.remove()
  }
}

export let canPreview = function (el, dragged ) {
  let isContain = dragged.parentNode.parentNode.contains(el)
  const isChild =  !!(dragged.nodeObj 
        && dragged.nodeObj.parent
        && dragged.nodeObj.parent.id
        && el
        && el.nodeObj
        && el.nodeObj.id
        && dragged.nodeObj.parent.id === el.nodeObj.id)
  const checkMoveNodeOtherMap = !!(
        // dragged.nodeObj.belongOtherMap 
         el
        && el.nodeObj
        && el.nodeObj.belongOtherMap)
  
  return (
    
    el &&
    el.tagName === 'TPC' &&
    el !== dragged &&
    !isContain &&
    !isChild &&
    !checkMoveNodeOtherMap
    // el.nodeObj.root !== true
  )
}

export default function (mind) {
  var dragged
  var insertLocation
  let threshold = 12
  let offsetTpcMove
  let tpcRoot
  let left 
  /* events fired on the draggable target */
  mind.map.addEventListener(
    'drag',
    throttle(function (event) {
      clearPreview(meet)
      let topMeet = $d.elementFromPoint(
        event.clientX,
        event.clientY - threshold
      )
      if (canPreview(topMeet, dragged)) {
        meet = topMeet
        let y = topMeet.getBoundingClientRect().y
        // if (event.clientY > y + topMeet.clientHeight) {
        //   insertLocation = 'after'
        // } else if (event.clientY > y + topMeet.clientHeight / 2) {
        // if (event.clientY > y + topMeet.clientHeight / 2) {
        //   insertLocation = 'in'
        // }
        insertLocation = 'in'
      } else {
        let bottomMeet = $d.elementFromPoint(
          event.clientX,
          event.clientY + threshold
        )
        if (canPreview(bottomMeet, dragged)) {
          meet = bottomMeet
          let y = bottomMeet.getBoundingClientRect().y
          // if (event.clientY < y) {
          //   insertLocation = 'before'
          // } else if (event.clientY < y + bottomMeet.clientHeight / 2) {
          // if (event.clientY < y + bottomMeet.clientHeight / 2) {
          //   insertLocation = 'in'
          // }
          insertLocation = 'in'
        } else {
          insertLocation = meet = null
        }
      }
      if (meet) 
        insertPreview(meet, insertLocation)
      else
        console.log(mind.root.getBoundingClientRect())
    }, 100)
  )

  mind.map.addEventListener('dragstart', function (event) {
    // store a ref. on the dragged elem
    dragged = event.target
    dragged.parentNode.parentNode.style.opacity = 0.5
    mind.selectNode(dragged)
    mind.onRedirectPath && mind.onRedirectPath(dragged.nodeObj)
    dragMoveHelper.clear()
    const sizeEl =  event.target.getBoundingClientRect()
    const sizeElRoot = mind.root.children[0].getBoundingClientRect()
    offsetTpcMove = {
      centerX:  sizeEl.x + sizeEl.width/2  - event.clientX,
      centerY:  sizeEl.y + sizeEl.height/2 - event.clientY,
    }
    left = sizeEl.x - sizeElRoot.x > 0 ? false : true
    tpcRoot = {
      centerX:  sizeElRoot.x + sizeElRoot.width/2,
      centerY:  sizeElRoot.y + sizeElRoot.height/2,
    }
  })

  mind.map.addEventListener('dragend', async function (event) {
    // reset the transparency
    event.target.style.opacity = ''
    clearPreview(meet)
    if(meet){
      if((!mind.checkNotAllowDropNode || (mind.checkNotAllowDropNode && !mind.checkNotAllowDropNode(meet.nodeObj, dragged.nodeObj))))
      {
        let obj = dragged.nodeObj
        switch (insertLocation) {
          case 'before':
            mind.moveNodeBefore(dragged, meet)
            mind.selectNode(E(obj.id,mind))
            break
          case 'after':
            mind.moveNodeAfter(dragged, meet)
            mind.selectNode(E(obj.id,mind))
            break
          case 'in':
            mind.moveNode(dragged, meet)
            mind.OnDragNode && mind.OnDragNode(obj, meet.nodeObj)
            break
        }
      }
    }
    else if(offsetTpcMove && tpcRoot){
      if(left){
        if(offsetTpcMove.centerX + event.clientX > tpcRoot.centerX){
          // dragged.nodeObj = {...dragged.nodeObj, direction: 1}
          dragged.nodeObj.direction = 1
          mind.moveNode(dragged, mind.root.children[0])
        }
          
      }
      else{
        if(offsetTpcMove.centerX + event.clientX < tpcRoot.centerX){
          // dragged.nodeObj.direction = 0
          dragged.nodeObj.direction = 0
          mind.moveNode(dragged, mind.root.children[0])
        }
      }

    }
    dragged.parentNode.parentNode.style.opacity = 1
    dragged = null
  })

  /* events fired on the drop targets */
  mind.map.addEventListener('dragover', function (event) {
    // prevent default to allow drop
    event.preventDefault()
  })

  mind.map.addEventListener('dragenter', function (event) {
    // if (event.target.tagName == 'TPC' && event.target !== dragged) {
    //   event.target.style.opacity = 0.5
    // }
  })

  mind.map.addEventListener('dragleave', function (event) {
    // if (event.target.tagName == 'TPC' && event.target !== dragged) {
    //   event.target.style.opacity = 1
    // }
  })

  mind.map.addEventListener('drop', event => {
    event.preventDefault()
    if (event.target.tagName == 'TPC' && event.target !== dragged) {
      event.target.style.opacity = 1
      clearPreview(meet)
    }
  })
}
