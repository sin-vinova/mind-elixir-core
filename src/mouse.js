import { dragMoveHelper, isMobile,throttle } from './utils/index'
import * as nodeDraggable from "./plugin/nodeDraggable";
import Hammer from 'hammerjs'
let $d = document
function checkElementFromPoint(x,y, notSameNode){
  let elements = [];
  let display = [];
  let item = $d.elementFromPoint(x, y);
  let lastItem;
  while (item && item !== lastItem && item !== document.body && item !== document && item !== document.documentElement && !item.classList.contains('map-canvas')) {
      elements.push(item);
      // save current style.display value
      display.push(item.style.display);
      // temporarily hide this element so we can see what's underneath it
      item.style.display = "none";
      // prevent possible infinite loop by remembering this item
      lastItem = item;
      item = document.elementFromPoint(x, y);
  }
  // restore display property
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = display[i];
  }
  for (var i = 0; i < elements.length; i++) {
    if(elements[i]!==notSameNode && elements[i].tagName === 'TPC')
      return elements[i]
  }
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
  var touchtime = 0
  mind.map.addEventListener('click', function(e) {
    if(e.target.classList.contains('fake-el') || mind.isEditing)
      return
    // if (dragMoveHelper.afterMoving) return
    e.preventDefault()
    if (touchtime == 0 || ((new Date().getTime()) - touchtime) >= 200) {
      // set first click
      touchtime = new Date().getTime();
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
    } else {
      touchtime = 0;
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
  });
  // mind.map.addEventListener('click', e => {
    
  // })

  // mind.map.addEventListener('dblclick', e => {
  //   if(e.target.classList.contains('fake-el') || mind.isEditing)
  //     return
  //   e.preventDefault()

  //   // const nodeTopic =  getParent(e.target, 'T') ? getParent(e.target, 'T') : getParent(e.target, 'ROOT') ? getParent(e.target, 'ROOT') : null
    
  //   // no allow modify root node
    
  // })

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
  const functionWheelZoom = (e) =>{
    e.preventDefault()
    e.stopPropagation()
    
    isPanning = true
    if (isPanning) {
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
  mind.map.onwheel = functionWheelZoom
  

  mind.map.onmouseup = function (e) {
    isPanning = false
  }

  mind.map.onmouseleave = function (e) {
    isPanning = false
  }

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
  // var Rotate = new Hammer.Rotate();

  Pinch.recognizeWith([Pan]);

  manager.add(Pan);
  // manager.add(Rotate);
  manager.add(Pinch);

  var deltaX = 0
  var deltaY = 0
  let lastX = null;
  let lastY = null;
  var currentScale = mind.scaleVal || 1;
  var moveNode = undefined
  var dragged
  var insertLocation
  let threshold = 12
  var meet
  let linksRelateNode =[]
  var nodesLink
  manager.on('panstart',function (e) {
    moveNode =  getParent(e.target,'T')
    if(moveNode){
      dragged = moveNode.children[0]
      mind.selectNode(dragged)
      mind.onRedirectPath && mind.onRedirectPath(dragged.nodeObj)
      dragMoveHelper.clear()
    }
    
  })
  manager.on('panmove', function (e) {
    if (isMobile()) {
      nodeDraggable.clearPreview(meet)
      if(moveNode && moveNode.children[0] 
        && moveNode.children[0].tagName === 'TPC' 
        && moveNode.children[0].nodeObj 
        && (!moveNode.children[0].nodeObj.belongOtherMap || (moveNode.children[0].nodeObj.belongOtherMap 
        && moveNode.children[0].nodeObj.firstNodeOtherMap))){
        let curTpc= moveNode.children[0]
        let curNodeObj = curTpc.nodeObj
        moveNode.parentElement.style.transform = `translate(${e.deltaX}px,${e.deltaY}px)`
        moveNode.parentElement.style.zIndex = '100000000'
        let topMeet  = checkElementFromPoint(e.center.x,e.center.y - threshold, moveNode.children[0] )
        if(!curNodeObj.parent.root){
          nodesLink =getParent(moveNode,'grp[data-check-grp="firstDeepGrp"').lastChild
          // nodesLink.style.zIndex = '100000000'
          moveNode.parentElement.style.position ='relative'
          for(let i=0; i< nodesLink.children.length; i++){
            if(nodesLink.children[i].dataset.idOfParentNode === curNodeObj.id){
              linksRelateNode.push(nodesLink.children[i])
              nodesLink.children[i].style.transform = `translate(${e.deltaX}px,${e.deltaY}px)`
            }
          }
        }
        if(topMeet){
          if (nodeDraggable.canPreview(topMeet, dragged)){
            meet = topMeet
            insertLocation = 'in'
          }
          else {
            let bottomMeet = checkElementFromPoint(e.center.x,e.center.y + threshold, moveNode.children[0])
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
        console.log('e.center.x', e);
        deltaX = lastX - e.center.x
        deltaY = lastY - e.center.y
        mind.container.scrollTo(
          mind.container.scrollLeft + deltaX,
          mind.container.scrollTop + deltaY
        )
        lastX = e.center.x
        lastY = e.center.y
      }
    }
  })
  manager.on('panend', function (e) {
    lastX = null
    lastY = null
    if(isMobile()){
      if(dragged){
        nodeDraggable.clearPreview(meet)
        moveNode.parentElement.style.transform = `unset`
        moveNode.parentElement.style.zIndex = 'unset'
        // if(nodesLink){
        //   // nodesLink.style.zIndex = 'unset'
          
        // }
        if(meet){
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
        else{
          if(dragged.nodeObj.parent.root)
            moveNode.parentElement.style.position = 'absolute'
          else
            moveNode.parentElement.style.position = 'unset'
        }
        

        
        for(let i=0; i< linksRelateNode.length; i++){
          linksRelateNode[i].style.transform = 'unset'
        }
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
        
        linksRelateNode = []
        moveNode= null
        dragged = null
        nodesLink = null

      }
    }
    
  })

  function getRelativeScale(scale) {
    return scale * currentScale;
  }
  manager.on('pinchmove', function(e) {
    // do something cool
    var scale = getRelativeScale(e.scale);
    // stage.style.transform = 'scale('+ scale +') translate(' + deltaX + 'px, ' + deltaY + 'px)'
    stage.style.transform = 'scale('+ scale +')'
    // mind.scale(scale)
  });
  manager.on('pinchend', function(e) {
    // cache the scale
    currentScale = getRelativeScale(e.scale);
    // liveScale = currentScale;
  });

  // mc.on('rotate', function(e) {
  //   // do something cool
  //   var rotation = Math.round(e.rotation);    
  //   stage.style.transform = 'rotate('+rotation+'deg)';
  // });
}






// $(".target").on("click", function() {
//     if (touchtime == 0) {
//         // set first click
//         touchtime = new Date().getTime();
//     } else {
//         // compare first click to this click and see if they occurred within double click threshold
//         if (((new Date().getTime()) - touchtime) < 800) {
//             // double click occurred
//             alert("double clicked");
//             touchtime = 0;
//         } else {
//             // not a double click so set as a new first click
//             touchtime = new Date().getTime();
//         }
//     }
// });




