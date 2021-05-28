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
    if(e.target.classList.contains('fake-el') || mind.isEditing)
      return
    // if (dragMoveHelper.afterMoving) return
    e.preventDefault()
    const nodeTopic =  getParent(e.target, 'T') ? getParent(e.target, 'T') : getParent(e.target, 'ROOT') ? getParent(e.target, 'ROOT') : null
    if(mind.isTagging && nodeTopic && nodeTopic.firstElementChild.nodeObj.typeTag === 'relate' && nodeTopic.firstElementChild.nodeObj.firstChildTag){
      document.querySelectorAll('.tag-topic-relate').forEach(item =>{
        if(item.nodeObj.firstChildTag && item.nodeObj.expanded)
          mind.expandNode(item,false,false)
      })
    }
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
        mind.expandNode(nodeTopic.firstElementChild,true,false)
      }
      if(e.target.classList.contains('disagree-icon'))
        mind.onRemoveRelateNode && mind.onRemoveRelateNode(nodeTopic.firstElementChild.nodeObj)
      if(e.target.classList.contains('agree-icon')){
        mind.addRelateNode(nodeTopic.firstElementChild.nodeObj)
        // mind.onAddRelateNode && mind.onAddRelateNode(nodeTopic.firstElementChild.nodeObj)
      }

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
        mind.selectNode(mind.mindElixirBox.querySelectorAll(`[data-nodeid=${dataId}]`)[0])
      else
        mind.selectNode(nodeTopic.firstChild)
      if (mind.onRedirectPath ) {
        mind.onRedirectPath(nodeTopic.firstElementChild.nodeObj)
      }
    } else if (e.target.nodeName === 'path') {
      if (e.target.parentElement.nodeName === 'g') {
        mind.selectLink(e.target.parentElement)
      }
    } else if (e.target.className === 'circle') {
      // skip circle
    } else {
      // mind.unselectNode()
      mind.hideLinkController()
    }
  })

  mind.map.addEventListener('dblclick', e => {
    if(e.target.classList.contains('fake-el') || mind.isEditing)
      return
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
    e.stopPropagation()
    e.preventDefault()
    isPanning = true
    if (isPanning) {
      console.log('e.deltaY', e.deltaY)
      if (e.deltaY > 0) {
        // scrolling up
        if (mind.scaleVal < 0.2) return
        mind.scale((mind.scaleVal -= 0.02))
      } else if (e.deltaY < 0) {
        // scrolling down
        if (mind.scaleVal > 1.6) return
        mind.scale((mind.scaleVal += 0.02))
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


  // document.querySelector("body").onload = init()

  // Zoom in mobile
  var evCache = new Array();
  var prevDiff = -1;

  function init() {
    // Install event handlers for the pointer target
    // var el=document.getElementById("target");
    // var el = document.querySelector("#map .map-container")
    var el = mind.map
    console.log('elelelel',el)
    el.onpointerdown = pointerdown_handler;
    el.onpointermove = pointermove_handler;
   
    // Use same handler for pointer{up,cancel,out,leave} events since
    // the semantics for these events - in this app - are the same.
    el.onpointerup = pointerup_handler;
    el.onpointercancel = pointerup_handler;
    el.onpointerout = pointerup_handler;
    el.onpointerleave = pointerup_handler;
  }
   
  function pointerdown_handler(ev) {
    // The pointerdown event signals the start of a touch interaction.
    // This event is cached to support 2-finger gestures
    evCache.push(ev);
    log("pointerDown", ev);
  }
   
  function pointermove_handler(ev) {
    // This function implements a 2-pointer horizontal pinch/zoom gesture.
    //
    // If the distance between the two pointers has increased (zoom in),
    // the target element's background is changed to "pink" and if the
    // distance is decreasing (zoom out), the color is changed to "lightblue".
    //
    // This function sets the target element's border to "dashed" to visually
    // indicate the pointer's target received a move event.
    log("pointerMove", ev);
    // ev.target.style.border = "dashed";
   
    // Find this event in the cache and update its record with this event
    for (var i = 0; i < evCache.length; i++) {
      if (ev.pointerId == evCache[i].pointerId) {
         evCache[i] = ev;
      break;
      }
    }

    console.log('evCache', evCache)
    // If two pointers are down, check for pinch gestures
    if (evCache.length == 2) {
      // Calculate the distance between the two pointers
      var curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
      console.log('prevDiffprevDiff', prevDiff)
      if (prevDiff > 0) {
        if (curDiff > prevDiff) {
          // The distance between the two pointers has increased
          log("Pinch moving OUT -> Zoom in", ev);
          ev.target.style.background = "pink";
          if (mind.scaleVal > 1.6) return
          mind.scale((mind.scaleVal += 0.02))
        }
        if (curDiff < prevDiff) {
          // The distance between the two pointers has decreased
          log("Pinch moving IN -> Zoom out",ev);
          ev.target.style.background = "lightblue";
          if (mind.scaleVal < 0.2) return
          mind.scale((mind.scaleVal -= 0.02))
        }
      }
   
      // Cache the distance for the next move event
      prevDiff = curDiff;
    }
  }
   
  function pointerup_handler(ev) {
    log(ev.type, ev);
    // Remove this pointer from the cache and reset the target's
    // background and border
    remove_event(ev);
    // ev.target.style.background = "white";
    // ev.target.style.border = "1px solid black";
  
    // If the number of pointers down is less than two then reset diff tracker
    if (evCache.length < 2) {
      prevDiff = -1;
    }
  }
   
  function remove_event(ev) {
    // Remove this event from the target's cache
    for (var i = 0; i < evCache.length; i++) {
      if (evCache[i].pointerId == ev.pointerId) {
        evCache.splice(i, 1);
        break;
      }
    }
  }
   
  var logEvents = false;
   
  // Logging/debugging functions
  function enableLog(ev) {
    logEvents = logEvents ? false : true;
  }
   
  function log(prefix, ev) {
    if (!logEvents) return;
    var o = document.getElementsByTagName('output')[0];
    var s = prefix + ": pointerID = " + ev.pointerId +
                  " ; pointerType = " + ev.pointerType +
                  " ; isPrimary = " + ev.isPrimary;
    o.innerHTML += s + "";
  }
   
  function clearLog(event) {
    var o = document.getElementsByTagName('output')[0];
    o.innerHTML = "";
  }
}
