import { dragMoveHelper, isMobile } from './utils/index'
import Hammer from 'hammerjs'
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
    if (touchtime == 0 || ((new Date().getTime()) - touchtime) >= 800) {
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
  manager.on('panmove', function (e) {
    if (isMobile()) {
      if (!lastX) {
        lastX = e.center.x
        lastY = e.center.y
        return
      }
      console.log('e.center.x', e.center.x, e.center.y);
      deltaX = lastX - e.center.x
      deltaY = lastY - e.center.y
      mind.container.scrollTo(
        mind.container.scrollLeft + deltaX,
        mind.container.scrollTop + deltaY
      )
      lastX = e.center.x
      lastY = e.center.y
    }
  })
  manager.on('panend', function (e) {
    lastX = null
    lastY = null
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




