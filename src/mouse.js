import { dragMoveHelper, isMobile,throttle } from './utils/index'
import * as nodeDraggable from "./plugin/nodeDraggable";
import pressMbileMenu from './plugin/pressMobileMenu'
import interact from 'interactjs'
import $ from 'jquery';


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
        mind.hideLinkController()
      }
  });
  // mind.map.addEventListener('click', e => {
    
  // })

  const doubleClickFn = (e) => {
    if(e.target.classList.contains('fake-el') || mind.isEditing)
      return
    e.preventDefault()    
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
   * drag, move, zoom, scroll zoom
   */
  if(isMobile()){
    mind.eventMove = interact('TPC')
    // drag and move for mobile
    if(mind.draggable){
      const position = { x: 0, y: 0 }
      let moveNode
      let dragged
      let meet
      let insertLocation
      let linksRelateNode =[]
      let nodesLink

      function preventDefaultAction (e){
        e.preventDefault()
      }


      function panstartFn (e){
        position.x = 0
        position.y = 0
        moveNode =  getParent(e.target,'T')
        mind.onRedirectPath && mind.onRedirectPath(e.target.nodeObj)
        mind.selectNode(e.target)
        if(moveNode){
          dragged = moveNode.children[0]
          dragMoveHelper.clear()  
        }

      }

      function panmoveFn (e) {
        nodeDraggable.clearPreview(meet)
        if(dragged ){
          console.log(dragged)
          if(!dragged.nodeObj.belongOtherMap || (dragged.nodeObj.belongOtherMap && dragged.nodeObj.firstNodeOtherMap)){
            let curTpc= dragged
            let curNodeObj = curTpc.nodeObj
            position.x = position.x + e.dx/mind.scaleVal
            position.y = position.y + e.dy/mind.scaleVal
            moveNode.parentElement.style.transform = `translate(${position.x}px, ${position.y}px)`
            
            moveNode.parentElement.style.zIndex = '100000000'
            let topMeet  = checkElementFromPoint(e.client.x,e.client.y , dragged)
            if(!curNodeObj.parent.root){
              nodesLink =getParent(moveNode,'grp[data-check-grp="firstDeepGrp"').lastChild
              moveNode.parentElement.style.position ='relative'
              for(let i=0; i< nodesLink.children.length; i++){
                if(nodesLink.children[i].idsOfParentNode.includes(curNodeObj.id)){
                  linksRelateNode.push(nodesLink.children[i])
                  nodesLink.children[i].style.transform = `translate(${position.x}px, ${position.y}px)`
                }
              }
            }
            if(topMeet){
              if (nodeDraggable.canPreview(topMeet, dragged)){
                meet = topMeet
                insertLocation = 'in'
              }
              else {
                let bottomMeet = checkElementFromPoint(e.client.x,e.client.y , dragged)
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
          }
        }      
      }

      function panendFn (e){
        nodeDraggable.clearPreview(meet)
        if(moveNode){
          moveNode.parentElement.style.transform = `translate(0px, 0px)`
          moveNode.parentElement.style.zIndex = 'unset'
          for(let i=0; i< linksRelateNode.length; i++){
            linksRelateNode[i].style.transform = `translate(0px, 0px)`
          }
        }
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
        else if(moveNode){
          if(dragged.nodeObj.parent.root)
            moveNode.parentElement.style.position = 'absolute'
          else
            moveNode.parentElement.style.position = 'unset'
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

      //drag move node event on mobile
      mind.eventMove.draggable({
        listeners: {
          start (event) {
            mind.map.addEventListener('touchmove', preventDefaultAction)
            panstartFn(event)
          },
          move (event) {
            panmoveFn(event)
          },
          end(event){
            panendFn(event)
            mind.map.removeEventListener('touchmove', preventDefaultAction)
          }
        }
      })
    }
    //dbtap node for editable
    if(mind.editable)
      mind.eventMove.on('doubletap',doubleClickFn)
    // long hold node for display context menu
    if(mind.contextMenu){
      pressMbileMenu(mind,mind.eventMove)
    }
    //zooming
    let lastScale = 0
    let startZoomPos
    mind.map.addEventListener('gesturestart', function(e){
      e.preventDefault()
    });
    interact(mind.map).gesturable({
      listeners: {
        start (event) {
          lastScale = event.scale * mind.scaleVal
          startZoomPos = {
            x: event.client.x,
            y: event.client.y
          }
        },
        move (event) {
          var currentScale = event.scale * mind.scaleVal
          if(Math.abs(currentScale - lastScale) > 0.01 && currentScale <=4 && currentScale >=0.3 ){   
            if(currentScale> lastScale)           
            mind.map.style.transform =  "scale(" +
                                        currentScale +
                                        ") translate(" +
                                        ((currentScale/lastScale - 1) * (startZoomPos.x/currentScale))/2 +
                                        "px," +
                                        0 +
                                        "px)"
            else
            mind.map.style.transform =  "scale(" +
                                        currentScale +
                                        ") translate(" +
                                        -((currentScale/lastScale - 1) * (startZoomPos.x/currentScale))/2 +
                                        "px," +
                                        0 +
                                        "px)"
            lastScale = currentScale
            
          }
            
          // }
          
        },
        end (event) {
          mind.scaleVal = lastScale  
        }
      }
    })
  }
  else{
    //drag and move for desktop
    let positionMoveMb = []
    function momentumDesktop(e) {
      let lastPos = {
        pageX: e.clientX,
        pageY: e.clientY,
        time: Date.now(),
      }
      let i = positionMoveMb.length
      let now = Date.now()
      while (i--) {
        if (now - positionMoveMb[i].time > 150) {
          break
        }
        lastPos = positionMoveMb[i]
      }
      let xOffset = lastPos.pageX - e.clientX
      let yOffset = lastPos.pageY - e.clientY
      let timeOffset = (Date.now() - lastPos.time) / 12
      let decelX = xOffset / timeOffset
      let decelY = yOffset / timeOffset
      if (timeOffset) {
        let timer = Date.now()
        let myVar = setInterval(momentum, 7)
        function momentum() {
          if (Math.abs(decelX) < 0.01) decelX = 0
          if (Math.abs(decelY) < 0.01) decelY = 0
          if ((decelY === 0 && decelX === 0) || Date.now() - timer > 700) {
            clearInterval(myVar)
            return
          } else {
            if (decelX < 0 && decelY > 0) {
              decelX *= 0.87
              decelY *= 0.95
            } else if (decelX > 0 && decelY < 0) {
              decelX *= 0.95
              decelY *= 0.87
            } else {
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
    mind.map.addEventListener('mousemove', e => {
      // click trigger mousemove in windows chrome
      // the 'true' is a string
      if (e.target.contentEditable !== 'true') {
        dragMoveHelper.onMove(e, mind.container)
      }
      positionMoveMb.push({
        pageX: e.clientX,
        pageY: e.clientY,
        time: Date.now(),
      })
    })
    mind.map.addEventListener('mousedown', e => {
      if (e.target.contentEditable !== 'true') {
        dragMoveHelper.afterMoving = false
        dragMoveHelper.mousedown = true
      }
      positionMoveMb = []
    })
    mind.map.addEventListener('mouseup', e => {
      dragMoveHelper.clear()
      momentumDesktop(e)
    })
    mind.map.addEventListener('mouseleave', e => {
      dragMoveHelper.clear()
    })


    //zoom desktop
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
    // mind.map.onwheel = functionWheelZoom

    console.log('mind.map', mind.map)

    $(document).ready(function () {
      var scroll_zoom = new ScrollZoom($('.map-container'), 4, 0.05)
    })

    function ScrollZoom(container, max_scale, factor) {
      let target = container.children().first()
      let size = { w: 20000, h: 20000 }
      let pos = { x: 0, y: 0 }
      let zoom_target = { x: 0, y: 0 }
      let zoom_point = { x: 0, y: 0 }
      let scale = 1
      let zoomIntensity = 0.2
      target.css('transform-origin', '0 0')
      target.on('mousewheel DOMMouseScroll', scrolled)

      function scrolled(e) {

        var root = container.children().first().children().first()
        // var offset = container.offset()
        var offset = container.children().first().offset()

        zoom_point.x = e.pageX - (-root[0].offsetLeft)
        zoom_point.y = e.pageY - (-root[0].offsetTop)
        // zoom_point.x = e.pageX - offset.left
        // zoom_point.y = e.pageY - offset.top


        e.preventDefault()
        var delta = e.delta || e.originalEvent.wheelDelta
        if (delta === undefined) {
          //we are on firefox
          delta = e.originalEvent.detail
        }
        delta = Math.max(-1, Math.min(1, delta)) // cap the delta to [-1,1] for cross browser consistency
        
        // determine the point on where the slide is zoomed in
        zoom_target.x = (zoom_point.x - pos.x) / scale
        zoom_target.y = (zoom_point.y - pos.y) / scale

        // apply zoom
        scale += delta * factor * scale

        // prevent scale
        console.log('min(scale)', Math.min(max_scale, scale))
        scale = Math.max(1, Math.min(max_scale, scale))

        // calculate x and y based on zoom
        pos.x = -zoom_target.x * scale + zoom_point.x
        pos.y = -zoom_target.y * scale + zoom_point.y

        // console.log('scale', scale, pos)
        
        // if (scale > max_scale) {
        //   scale = max_scale
        // }
        // if (scale < 0.5) {
        //   scale = 0.5
        // }

        // if (pos.x < 6000) {
        //   pos.x = -size.w * (scale - 1)
        // }
        // if (pos.y < 6000) {
        //   pos.y = -size.h * (scale - 1)
        // }

        // const wheel = e.deltaY < 0 ? 1 : -1;

        // // Compute zoom factor.
        // const zoom = Math.exp(wheel * factor);
        

        // pos.x -= zoom_target.x/(scale*zoom) - zoom_target.x/scale;
        // pos.y -= zoom_target.y/(scale*zoom) - zoom_target.y/scale;
        // scale *= zoom;

        // console.log('scale', scale, pos)

        // pos.x = -pos.x
        // pos.y = -pos.y
    

        // Make sure the slide stays in its container area when zooming out
        if (pos.x > 0) pos.x = 0
        if (pos.x + size.w * scale < size.w) pos.x = -size.w * (scale - 1)
        if (pos.y > 0) pos.y = 0
        if (pos.y + size.h * scale < size.h) pos.y = -size.h * (scale - 1)

        // console.log('transform', pos)

        update()
        
      }

      function update() {
        target.css(
          'transform',
          'translate(' +
            pos.x +
            'px,' +
            pos.y +
            'px) scale(' +
            scale +
            ',' +
            scale +
            ')'
        )
      }
    }
  }
}
