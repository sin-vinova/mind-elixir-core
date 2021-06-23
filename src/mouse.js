import { dragMoveHelper, isMobile,throttle } from './utils/index'
import * as nodeDraggable from "./plugin/nodeDraggable";
import Hammer from 'hammerjs'
import pressMbileMenu from './plugin/pressMobileMenu'
let $d = document
function sleepFor( sleepDuration ){
  var now = new Date().getTime();
  while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

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
  // var touchtime = 0
  mind.map.addEventListener('click', function(e) {
    if(e.target.classList.contains('fake-el') || mind.isEditing)
      return
    // if (dragMoveHelper.afterMoving) return
    e.preventDefault()
    // if (touchtime == 0 || ((new Date().getTime()) - touchtime) >= 800) {
      // set first click
      // touchtime = new Date().getTime();
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
    // } else {
      // touchtime = 0;
      // const nodeTopic =  getParent(e.target, 'T') ? getParent(e.target, 'T') : null

      // // define between edit and create --> edit
      // let isEdit = true
      // if (!mind.editable) return
      // if (
      //   nodeTopic
      // ) {
        
      //   mind.beginEdit(getParent(e.target, 'tpc'), isEdit,mind.isTagging)
      // }
    // }
  });
  // mind.map.addEventListener('click', e => {
    
  // })

  const doubleClickFn = (e) => {
    if(e.target.classList.contains('fake-el') || mind.isEditing)
      return
    e.preventDefault()
    
    // const nodeTopic =  getParent(e.target, 'T') ? getParent(e.target, 'T') : getParent(e.target, 'ROOT') ? getParent(e.target, 'ROOT') : null
    const nodeTopic =  getParent(e.target, 'T') ? getParent(e.target, 'T') : null
    // define between edit and create --> edit
    let isEdit = true
    if (!mind.editable) return
    if (
      nodeTopic
    ) {
      
      mind.beginEdit(getParent(e.target, 'tpc'), isEdit,mind.isTagging)
    }
  }

  mind.map.addEventListener('dblclick', doubleClickFn)

  function checkElementFromPoint (x,y,notSameNode) {
    let tpcs = mind.map.querySelectorAll('TPC')
    for(let i =0; i< tpcs.length; i++){
      if(tpcs[i] !== notSameNode){
        let rec = tpcs[i].getBoundingClientRect()
        if(rec.y < y && rec.y + rec.height > y && rec.x < x && rec.x +rec.width > x)
          return tpcs[i]
      }
    }
  }

  /**
   * drag and move
   */
  var positionMove = []
  // mind.map.addEventListener('mousemove', e => {
  //   // click trigger mousemove in windows chrome
  //   // the 'true' is a string
  //   if (e.target.contentEditable !== 'true') {
  //     positionMove.push({
  //       pageX: e.pageX,
  //       pageY: e.pageY,
  //       time: Date.now()
  //     })
  //     dragMoveHelper.onMove(e, mind.container)
  //   }
  // })
  // mind.map.addEventListener('mousedown', e => {
  //   if (e.target.contentEditable !== 'true') {
  //     dragMoveHelper.afterMoving = false
  //     dragMoveHelper.mousedown = true
  //     positionMove = []
  //     positionMove.push({
  //       pageX: e.pageX,
  //       pageY: e.pageY,
  //       time: Date.now()
  //     })
  //   }
  // })
  // mind.map.addEventListener('mouseleave', e => {
  //   dragMoveHelper.clear()
  // })
  // mind.map.addEventListener('mouseup', e => {
  //   if (e.target.contentEditable !== 'true') {
  //     let lastPos = {
  //       pageX: e.pageX,
  //       pageY: e.pageY,
  //       time: Date.now()
  //     }
  //     let i = positionMove.length
  //     let now = Date.now();
  //     while ( i-- ) {
  //       if ( now - positionMove[i].time > 150 ) { break; }
  //       lastPos = positionMove[i];
  //     }
  //     let xOffset = lastPos.pageX -e.pageX
	// 		let yOffset = lastPos.pageY -e.pageY
	// 		let timeOffset = ( Date.now() - lastPos.time ) / 12
  //     let decelX = ( xOffset / timeOffset )
  //     let decelY = ( yOffset / timeOffset )
  //     if(timeOffset){ 
  //       let timer = Date.now()
  //       let myVar = setInterval(momentum, 10)
  //       function momentum() {
  //         console.log(decelY, decelX)
  //         if(Math.abs(decelX) < 0.01)
  //           decelX = 0
  //         if(Math.abs(decelY) < 0.01)
  //           decelY = 0
  //         if(decelY === 0||  decelX ===0 || Date.now() - timer > 700){
  //           clearInterval(myVar)
  //           return 
  //         }
  //         else{
  //           decelX *= 0.95
  //           decelY *= 0.95
  //           mind.container.scrollTo({
  //             left: mind.container.scrollLeft + decelX,
  //             top: mind.container.scrollTop + decelY,
  //             // behavior: 'smooth'
  //           })
  //         }
  //       }
  //     }
  //   }
  //   dragMoveHelper.clear()
  // })

  // mind.map.onmousedown = function (e) {
  //   isPanning = true
  // }
  
  

  // mind.map.onmouseup = function (e) {
  //   isPanning = false
  // }

  // mind.map.onmouseleave = function (e) {
  //   isPanning = false
  // }

  // zoom and transion on mobile
  function log(event, currentScale) {
    var o = document.getElementsByTagName('output')[0];
    var s = event.scale
    // var s = "event.scale = " + event.scale +
    //               " ; currentScale = " + currentScale;
    o.innerHTML += s + " aa ";
  }


  //ref https://codepen.io/runspired/pen/ZQBGWd
  var stage = document.querySelector('.map-canvas');
  // let $stage = jQuery(stage);

  var manager = new Hammer.Manager(stage);

  var Pan = new Hammer.Pan();
  var Pinch = new Hammer.Pinch();
  var DoubleTap = new Hammer.Tap({
    event: 'doubletap',
    taps: 2
  });
  var Press = new Hammer.Press({
    time: 500
  });
  // var Rotate = new Hammer.Rotate();

  Pinch.recognizeWith([Pan]);

  manager.add(Pan);
  // manager.add(Rotate);
  manager.add(Pinch);
  manager.add(DoubleTap);
  manager.add(Press)
  // var currentScale = mind.scaleVal || 1;
  var moveNode = undefined
  var dragged
  var insertLocation
  var meet
  let linksRelateNode =[]
  var nodesLink
  let positionMoveMb = []
  var currentLeft = 0
  var currentTop = 0
  var checkPan = true
  var deltaX = 0
  var deltaY = 0
  let lastX = null;
  let lastY = null;
  function panstartFn (e){
    if(mind.draggable){
      console.log(mind.draggable,"kkkkkk")
      moveNode =  getParent(e.target,'T')
      if(moveNode){
        dragged = moveNode.children[0]
        mind.selectNode(dragged)
        mind.onRedirectPath && mind.onRedirectPath(dragged.nodeObj)
        dragMoveHelper.clear()
      }
      else{
        positionMoveMb.push({
          pageX: e.center.x,
          pageY: e.center.y,
          time: Date.now()
        })
      }
    }
  }

  function panmoveFn (e) {
    if (isMobile()) {
      nodeDraggable.clearPreview(meet)
      if(moveNode && moveNode.children[0] 
        && moveNode.children[0].tagName === 'TPC' 
        && moveNode.children[0].nodeObj 
        && (!moveNode.children[0].nodeObj.belongOtherMap || (moveNode.children[0].nodeObj.belongOtherMap 
        && moveNode.children[0].nodeObj.firstNodeOtherMap))){
        let curTpc= moveNode.children[0]
        let curNodeObj = curTpc.nodeObj
        moveNode.parentElement.style.transform = `translate(${e.deltaX/mind.scaleVal}px,${e.deltaY/mind.scaleVal}px)`
        moveNode.parentElement.style.zIndex = '100000000'
        let topMeet  = checkElementFromPoint(e.center.x,e.center.y , moveNode.children[0] )
        if(!curNodeObj.parent.root){
          nodesLink =getParent(moveNode,'grp[data-check-grp="firstDeepGrp"').lastChild
          // nodesLink.style.zIndex = '100000000'
          moveNode.parentElement.style.position ='relative'
          for(let i=0; i< nodesLink.children.length; i++){
            if(nodesLink.children[i].idsOfParentNode.includes(curNodeObj.id)){
              linksRelateNode.push(nodesLink.children[i])
              nodesLink.children[i].style.transform = `translate(${e.deltaX/mind.scaleVal}px,${e.deltaY/mind.scaleVal}px)`
            }
          }
        }
        if(topMeet){
          if (nodeDraggable.canPreview(topMeet, dragged)){
            meet = topMeet
            insertLocation = 'in'
          }
          else {
            let bottomMeet = checkElementFromPoint(e.center.x,e.center.y , moveNode.children[0])
            if(bottomMeet){
              if (nodeDraggable.canPreview(bottomMeet, dragged)) {
                meet = bottomMeet
                insertLocation = 'in'
              }
              else
                insertLocation = meet = null
            }
            else
              insertLocation = meet = null
          }
        }
        else
          insertLocation = meet = null
        if (meet) nodeDraggable.insertPreview(meet, insertLocation)

        // let topMeet = $d.elementFromPoint(
        //   e.center.x,
        //   e.center.y - threshold
        // )
        // console.log(topMeet,"jjjjj")

      }
      else{
        
        if (!lastX) {
          lastX = e.center.x
          lastY = e.center.y
          return
        }
        deltaX = lastX - e.center.x
        deltaY = lastY - e.center.y
        mind.container.scrollTo(
          mind.container.scrollLeft + deltaX,
          mind.container.scrollTop + deltaY
        )
        lastX = e.center.x
        lastY = e.center.y
        // manager.on('panend', function (e) {
        //   lastX = null
        //   lastY = null
        // })
        positionMoveMb.push({
          pageX: e.center.x,
          pageY: e.center.y,
          time: Date.now()
        })
          
          // mind.map.style.transform =
          //   "scale(" +
          //   mind.scaleVal +
          //   ") translate(" +
          //   (currentLeft + e.deltaX / mind.scaleVal) +
          //   "px," +
          //   (currentTop + e.deltaY / mind.scaleVal) +
          //   "px)"
      }   
    }
    else{
      positionMoveMb.push({
        pageX: e.center.x,
        pageY: e.center.y,
        time: Date.now()
      })
      if (!lastX) {
        lastX = e.center.x
        lastY = e.center.y
        return
      }
      deltaX = lastX - e.center.x
      deltaY = lastY - e.center.y
      mind.container.scrollTo(
        mind.container.scrollLeft + deltaX,
        mind.container.scrollTop + deltaY
      )
      lastX = e.center.x
      lastY = e.center.y
      // mind.map.style.transform =
      //   "scale(" +
      //   mind.scaleVal +
      //   ") translate(" +
      //   (currentLeft + e.deltaX / mind.scaleVal) +
      //   "px," +
      //   (currentTop + e.deltaY / mind.scaleVal) +
      //   "px)"
    }
  }

  function panendFn (e){
    if(isMobile()){
      if(dragged && moveNode){
        nodeDraggable.clearPreview(meet)
        moveNode.parentElement.style.transform = `unset`
        moveNode.parentElement.style.zIndex = 'unset'
        // if(nodesLink){
        //   // nodesLink.style.zIndex = 'unset'
          
        // }
        if(meet){
          if(!mind.checkNotAllowDropNode || (mind.checkNotAllowDropNode && !mind.checkNotAllowDropNode(meet.nodeObj, dragged.nodeObj))){
            if(meet.nodeObj && meet.nodeObj.root){
              moveNode.parentElement.style.position = 'absolute'
            }
            else{
              moveNode.parentElement.style.top = 'unset'
              moveNode.parentElement.style.left = 'unset'
              moveNode.parentElement.removeAttribute('data-check-grp')
              moveNode.parentElement.style.position = 'unset'
            }
          }
          
        }
        else{
          if(dragged.nodeObj.parent.root)
            moveNode.parentElement.style.position = 'absolute'
          else
            moveNode.parentElement.style.position = 'unset'
        }
        

        
        for(let i=0; i< linksRelateNode.length; i++){
          linksRelateNode[i].style.transform = 'unset'
        }
        if(meet && (!mind.checkNotAllowDropNode || (mind.checkNotAllowDropNode && !mind.checkNotAllowDropNode(meet.nodeObj, dragged.nodeObj)))){
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
        linksRelateNode = []
        moveNode= null
        dragged = null
        nodesLink = null

      }
      else{
        lastX = null
        lastY = null
        currentLeft = currentLeft + e.deltaX / mind.scaleVal;
        currentTop = currentTop + e.deltaY / mind.scaleVal;
        if(checkPan){
          let lastPos = {
            pageX: e.center.x,
            pageY: e.center.y,
            time: Date.now()
          }
          let i = positionMoveMb.length
          let now = Date.now();
          while ( i-- ) {
            if ( now - positionMoveMb[i].time > 150 ) { break; }
            lastPos = positionMoveMb[i];
          }
          let xOffset = lastPos.pageX - e.center.x
          let yOffset = lastPos.pageY - e.center.y
          let timeOffset = ( Date.now() - lastPos.time ) / 12
          let decelX = ( xOffset / timeOffset )
          let decelY = ( yOffset / timeOffset ) 
          if(timeOffset){
            let timer = Date.now()
            let myVar = setInterval(momentum, 7)
            function momentum() {
              if(Math.abs(decelX) < 0.01)
                decelX = 0
              if(Math.abs(decelY) < 0.01)
                decelY = 0
              if((decelY === 0 &&  decelX ===0) || Date.now() - timer > 700 ){
                clearInterval(myVar)
                return 
              }
              else{
                if(decelX < 0 && decelY > 0){
                  decelX *= 0.87
                  decelY *= 0.95
                }
                else if(decelX > 0 && decelY < 0){
                  decelX *= 0.95
                  decelY *= 0.87
                }
                else{
                  decelX *= 0.95
                  decelY *= 0.95
                }
                mind.container.scrollTo({
                  left: mind.container.scrollLeft + decelX,
                  top: mind.container.scrollTop + decelY,
                  // behavior: 'smooth'
                })
              }
            }
          }
        }
        else{
          checkPan = true
        }
      }
    }
    else{
      lastX = null
      lastY = null
      currentLeft = currentLeft + e.deltaX / mind.scaleVal;
      currentTop = currentTop + e.deltaY / mind.scaleVal;
      if(checkPan){
        let lastPos = {
          pageX: e.center.x,
          pageY: e.center.y,
          time: Date.now()
        }
        let i = positionMoveMb.length
        let now = Date.now();
        while ( i-- ) {
          if ( now - positionMoveMb[i].time > 150 ) { break; }
          lastPos = positionMoveMb[i];
        }
        let xOffset = lastPos.pageX - e.center.x
        let yOffset = lastPos.pageY - e.center.y
        let timeOffset = ( Date.now() - lastPos.time ) / 12
        let decelX = ( xOffset / timeOffset )
        let decelY = ( yOffset / timeOffset ) 
        if(timeOffset){
          let timer = Date.now()
          let myVar = setInterval(momentum, 10)
          function momentum() {
            console.log(decelY, decelX)
            if(Math.abs(decelX) < 0.01)
              decelX = 0
            if(Math.abs(decelY) < 0.01)
              decelY = 0
            if((decelY === 0 &&  decelX ===0) || Date.now() - timer > 700 ){
              clearInterval(myVar)
              return 
            }
            else{
              if(decelX < 0 && decelY > 0){
                decelX *= 0.87
                decelY *= 0.95
              }
              else if(decelX > 0 && decelY < 0){
                decelX *= 0.95
                decelY *= 0.87
              }
              else{
                decelX *= 0.95
                decelY *= 0.95
              }
              mind.container.scrollTo({
                left: mind.container.scrollLeft + decelX,
                top: mind.container.scrollTop + decelY,
                // behavior: 'smooth'
              })
            }
          }
        }
      }
      else{
        checkPan =true
      }
      
    }
  }
  manager.on('panstart',function (e) {
    panstartFn(e)    
  })
  manager.on('panmove', function (e) {
    panmoveFn(e)
  })
  manager.on('panend', function (e) {
    panendFn(e)
  })

  function getRelativeScale(scale) {
    return scale * mind.scaleVal;
  }
  var lastScale = null
  manager.on("pinchstart", function(e) {
    lastScale = e.scale
  })
  manager.on('pinchmove', function(e) {
    if(Math.abs(e.scale - lastScale) > 0.012){
      var scale = getRelativeScale(e.scale);
      if(scale > 3 || scale < 0.3)
        return
      
      mind.map.style.transform =
        "scale(" +
        scale +
        ") translate(" +
        (e.deltaX/2/scale)+
        "px," +
        (e.deltaY/2/scale)+
        "px)";
    }
    lastScale=e.scale
  })
  const delay = ms => new Promise(res => setTimeout(res, ms));
  manager.on('pinchend', function(e) {
    mind.scaleVal = getRelativeScale(e.scale);
    checkPan = false
  });

  manager.on('doubletap', doubleClickFn);


  const functionWheelZoom = (e) =>{
    e.preventDefault()
    e.stopPropagation()
    if (e.deltaY < 0) {
      // scrolling up
      if (mind.scaleVal > 3) return
      mind.scaleVal = mind.scaleVal +0.1
    } else if (e.deltaY > 0) {
      // scrolling down
      if (mind.scaleVal < 0.3) return
      mind.scaleVal = mind.scaleVal - 0.1
    }
    mind.map.style.transform =
      "scale(" +
      mind.scaleVal 
      ")"
    
  }
 
  mind.map.onwheel = functionWheelZoom
  if(isMobile() && mind.contextMenu)
    pressMbileMenu(mind,manager)
}


