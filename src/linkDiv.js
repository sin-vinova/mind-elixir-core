import { createPath, createMainPath, createLinkSvg } from './utils/svg'
import { findEle } from './utils/dom'
import {
  SIDE,
  GAP,
  RIGHT_TREE,
  TURNPOINT_R,
  PRIMARY_NODE_HORIZONTAL_GAP,
  PRIMARY_NODE_VERTICAL_GAP,
} from './const'

/**
 * functionality:
 * 1. calculate position of primary nodes
 * 2. layout primary node, generate primary link
 * 3. generate link inside primary node
 * 4. generate custom link
 * @param {object} primaryNode process the specific primary node only
 */
export default function linkDiv(primaryNode) {
  var primaryNodeHorizontalGap = this.primaryNodeHorizontalGap || PRIMARY_NODE_HORIZONTAL_GAP
  var primaryNodeVerticalGap = this.primaryNodeVerticalGap || PRIMARY_NODE_VERTICAL_GAP
  console.time('linkDiv')
  let root = this.root;
  const widthRoot = root.offsetWidth - 30;

  root.style.cssText = `top:${10000 - root.offsetHeight / 2}px;left:${10000 - root.offsetWidth / 2
    }px;`
  let primaryNodeList = this.box.children
  this.svg2nd.innerHTML = ''
  const isTagging =this.isTagging
  // 1. calculate position of primary nodes
  let totalHeight = 0
  let shortSide // side with smaller height
  let shortSideGap = 0 // balance heigt of two side
  let currentOffsetL = 0 // left side total offset
  let currentOffsetR = 0 // right side total offset
  let totalHeightL = 0
  let totalHeightR = 0
  let base
  const colorLineRoot = '#B5B5B5'
  const rootDirection = this.direction
  if (this.direction === SIDE) {
    let countL = 0
    let countR = 0
    let totalHeightLWithoutGap = 0
    let totalHeightRWithoutGap = 0
    for (let i = 0; i < primaryNodeList.length; i++) {
      let el = primaryNodeList[i]
      if (el.className === 'lhs') {
        totalHeightL += el.offsetHeight + primaryNodeVerticalGap
        totalHeightLWithoutGap += el.offsetHeight
        countL += 1
      } else {
        totalHeightR += el.offsetHeight + primaryNodeVerticalGap
        totalHeightRWithoutGap += el.offsetHeight
        countR += 1
      }
    }
    if (totalHeightL > totalHeightR) {
      base = 10000 - Math.max(totalHeightL) / 2
      shortSide = 'r'
      shortSideGap = (totalHeightL - totalHeightRWithoutGap) / (countR - 1)
    } else {
      base = 10000 - Math.max(totalHeightR) / 2
      shortSide = 'l'
      shortSideGap = (totalHeightR - totalHeightLWithoutGap) / (countL - 1)
    }
  } else {
    for (let i = 0; i < primaryNodeList.length; i++) {
      let el = primaryNodeList[i]
      totalHeight += el.offsetHeight + primaryNodeVerticalGap
    }
    base = 10000 - totalHeight / 2
  }

  // 2. layout primary node, generate primary link
  let path = ''
  
  for (let i = 0; i < primaryNodeList.length; i++) {
    let x2, y2
    let el = primaryNodeList[i]
    let elOffsetH = el.offsetHeight
    let Cy;

    if (el.className === 'lhs') { 
      el.style.top = base + currentOffsetL + 'px'
      el.style.left =
        10000 -
        root.offsetWidth / 2 -
        primaryNodeHorizontalGap -
        el.offsetWidth +
        'px'
      x2 = 10000 - root.offsetWidth / 2 - primaryNodeHorizontalGap - 15 // padding
      y2 = base + currentOffsetL + elOffsetH / 2

      let LEFT = 10000
      
      if (this.primaryLinkStyle === 2) {
        if (this.direction === SIDE) {
          LEFT = 10000 - root.offsetWidth / 6
        }
        if (y2 < 10000)
          path += `M ${LEFT} 10000
         L ${LEFT} ${y2 + 20} 
        C ${LEFT} ${y2} ${LEFT} ${y2} ${LEFT - 20} ${y2} 
          L ${x2} ${y2}`
        else
          path += `M ${LEFT} 10000
         L ${LEFT} ${y2 - 20} 
        C ${LEFT} ${y2} ${LEFT} ${y2} ${LEFT - 20} ${y2} 
          L ${x2} ${y2}`
      } else {
        let positionX = 10000;
        if(x2 < positionX) positionX += (widthRoot / 2);
        const minLeft = positionX - (widthRoot / 2);

        let xLine = positionX - Math.random() * widthRoot ;//10000 - (i * 10);
        
        do{
          xLine = positionX - Math.random() * widthRoot ;
        }while(xLine < minLeft)
        
        xLine = 10000;
        path = `M ${xLine} ${10000} C ${10000} ${10000} ${10000 + 2 * primaryNodeHorizontalGap * 0.03
          } ${y2} ${x2} ${y2}`
      }

      if (shortSide === 'l') {
        currentOffsetL += elOffsetH + shortSideGap
      } else {
        currentOffsetL += elOffsetH + primaryNodeVerticalGap
      }
    } else {
      if(this.direction === RIGHT_TREE){
        base = 10000
      }
      if(this.direction === RIGHT_TREE ){
        // - el.children[0].offsetHeight/2- el.children[0].offsetHeight/2
        const topTree = i===0 ? elOffsetH/2 -10  : -10  
        el.style.top = base + currentOffsetR + topTree+ 'px'
      }else
        el.style.top = base + currentOffsetR + 'px'
      el.style.left =
        10000 + root.offsetWidth / 2 + primaryNodeHorizontalGap + 'px'
      x2 = 10000 + root.offsetWidth / 2 + primaryNodeHorizontalGap + 15 // padding
      if(this.direction === RIGHT_TREE && i!==0){
        y2 = base + currentOffsetR
      }else
        y2 = base + currentOffsetR + elOffsetH / 2
      

      let LEFT = 10000
      if (this.primaryLinkStyle === 2) {
        if (this.direction === SIDE) {
          LEFT = 10000 + root.offsetWidth / 6
        }
        if (y2 < 10000){
          if(this.direction === RIGHT_TREE)
            path += `M ${LEFT} 10000
            L ${LEFT} ${y2 +  el.children[0].offsetHeight/2} 
           
            L ${x2} ${y2 + el.children[0].offsetHeight/2}`
          else
            path += `M ${LEFT} 10000
            L ${LEFT} ${y2 + 20} 
            C ${LEFT} ${y2} ${LEFT} ${y2} ${LEFT + 20} ${y2} 
            L ${x2} ${y2}`
        }
        else{
          if(this.direction === RIGHT_TREE)
            path += `M ${LEFT} 10000
            L ${LEFT} ${y2 + el.children[0].offsetHeight/2} 
            L ${x2} ${y2 + el.children[0].offsetHeight/2}`
          else
            path += `M ${LEFT} 10000
            L ${LEFT} ${y2 - 20} 
            C ${LEFT} ${y2} ${LEFT} ${y2} ${LEFT + 20} ${y2} 
            L ${x2} ${y2}`
          
        }
      } else {

        let positionX = 10000;
        if(x2 > positionX) positionX -= (widthRoot / 2);
        const minLeft = positionX - (widthRoot / 2);

        const minRight = positionX + (widthRoot / 2);
        let xLine = positionX + Math.random() * widthRoot ;//10000 - (i * 10);
        
        do{
          xLine = positionX + Math.random() * widthRoot ;
        }while(xLine > minRight)

        xLine = 10000;
        path = `M ${xLine} ${10000} C ${xLine} 10000 ${10000 + 2 * primaryNodeHorizontalGap * 0.03} ${y2} ${x2} ${y2}`
      }
      if (shortSide === 'r') {
        currentOffsetR += elOffsetH + shortSideGap
      } else {
        if(this.direction === RIGHT_TREE && i ===0)
          currentOffsetR += elOffsetH + primaryNodeVerticalGap +elOffsetH/2
        else
          currentOffsetR += elOffsetH + primaryNodeVerticalGap
      }
    }
    // set position of expander
    let expander = null
    console.log('check', el.children[0].children, )
    localStorage.setItem('check', el)
    if (
      el 
      && el.children 
      && el.children[0] 
      && el.children[0].children 
      && el.children[0].children.length !== 0 
      // && 'push' in el.children[0].children
    ) {
      Array.prototype.forEach.call(el.children[0].children, (element) => {
        if (element.tagName === 'EPD') {
          expander = element
        }
      })
    }
    // let expander = el.children[0].children[1]
    if (expander) {
      expander.style.top =
        (expander.parentNode.offsetHeight - expander.offsetHeight) / 2 + 'px'
      if (el.className === 'lhs') {
        expander.style.left = -10 + 'px'
      } else {
        expander.style.left = expander.parentNode.offsetWidth - 10 + 'px'
      }
    }
    const colorLine = el.children[0] && el.children[0].querySelector('t tpc') && el.children[0].querySelector('t tpc').getAttribute('data-color') || '#666'
    if(isTagging){
      if(el.className === 'lhs')
        this.svg2nd.appendChild(createMainPath(path,'#4DC8D9', '3',"5,5"))
      else
      this.svg2nd.appendChild(createMainPath(path,'#979797', '3',"10,10"))
    }
    else{
      if(rootDirection === RIGHT_TREE)
        this.svg2nd.appendChild(createMainPath(path, colorLineRoot))
      else
        this.svg2nd.appendChild(createMainPath(path, colorLine))
    }
  }
  
  // this.svg2nd.appendChild(createMainPath(path, undefined))

  // 3. generate link inside primary node
  for (let i = 0; i < primaryNodeList.length; i++) {
    let el = primaryNodeList[i]
    if (primaryNode && primaryNode !== primaryNodeList[i]) {
      continue
    }
    if (el.childElementCount) {
      let svg = createLinkSvg('svg3rd')
      // svg tag name is lower case
      if (el.lastChild.tagName === 'svg') el.lastChild.remove()
      el.appendChild(svg)
      let parent = el.children[0]
      let children = el.children[1].children
      
      loopChildren(children, parent, true)
      // console.log(el, 'primaryNodeList')
      // const colorLine = children[0] && children[0].querySelector('t tpc') && children[0].querySelector('t tpc').getAttribute('data-color') || '#555'
      // svg.appendChild(createPath(path, colorLine))
      function loopChildren(children, parent, first) {
        let path = '';
        // parent node of the child dom
        let parentOT = parent.offsetTop
        let parentOL = parent.offsetLeft
        let parentOW = parent.offsetWidth
        let parentOH = parent.offsetHeight

        for (let i = 0; i < children.length; i++) {
          let child = children[i]
          let childT = child.children[0] // t tag inside the child dom
          let childTOT = childT.offsetTop
          let childTOH = childT.offsetHeight
          let y1
          if (first) {
            y1 = parentOT + parentOH / 2
          } else {
            y1 = parentOT + parentOH / 2
          }
          let y2 = childTOT + childTOH - (childTOH / 2)
          let x1, x2, xMiddle
          let direction = child.offsetParent.className
          if (direction === 'lhs') {
            x1 = parentOL + GAP
            xMiddle = parentOL
            // x2 = parentOL - childT.offsetWidth
            x2 = parentOL - 15 // padding-left : 15
            // console.log('x1,y1,x2,y2,child',x1,y1,x2,y2,child)
            if (
              childTOT + childTOH < parentOT + parentOH / 2 + 50 &&
              childTOT + childTOH > parentOT + parentOH / 2 - 50
            ) {
              // if(children.length === 2){
              //   if(!i){
              //     // path = `M ${x1} ${y1} L ${xMiddle} ${y1} L ${xMiddle} ${y2 + TURNPOINT_R} A ${TURNPOINT_R} ${TURNPOINT_R} 0 0 0 ${xMiddle - TURNPOINT_R},${y2}  L ${x2} ${y2}`
              //   }else if(!!i){
              //     // path = `M ${x1} ${y1} L ${xMiddle} ${y1} L ${xMiddle} ${y2 - TURNPOINT_R} A ${TURNPOINT_R} ${TURNPOINT_R} 0 0 1 ${xMiddle - TURNPOINT_R},${y2}  L ${x2} ${y2}`
              //   }
              // }else{
              //   if(!i && children.length > 1){
              //     // path = `M ${x1} ${y1} L ${xMiddle} ${y1} L ${xMiddle} ${y2 + TURNPOINT_R} A ${TURNPOINT_R} ${TURNPOINT_R} 0 0 0 ${xMiddle - TURNPOINT_R},${y2}  L ${x2} ${y2}`
              //   }else{
              //     path = `M ${x1} ${y1} C ${x1 + 200} ${y1} ${x1 + 2 * 15 * 0.03} ${y2} ${x2} ${y2}`
              //     // path = `M ${x1} ${y1} L ${xMiddle} ${y1} L ${xMiddle} ${y2 } L ${x2} ${y2}`
              //   }
              // }
              path = `M ${x1} ${y1} C ${x1} ${y1} ${x1 + 2 * 15 * 0.03} ${y2} ${x2} ${y2}`
            } else if (childTOT + childTOH >= parentOT + parentOH / 2) {
              path = `M ${x1} ${y1} C ${x1} ${y1} ${x1 + 2 * 15 * 0.03} ${y2} ${x2} ${y2}`
              // 子底部高于父中点
              // path = `M ${x1} ${y1} 
              //   L ${xMiddle} ${y1} 
              //   L ${xMiddle} ${y2 - TURNPOINT_R} 
              //   A ${TURNPOINT_R} ${TURNPOINT_R} 0 0 1 
              //   ${xMiddle - TURNPOINT_R},${y2} 
              //   L ${x2} ${y2}`
            } else {
              // 子底部低于父中点
              // path = `M ${x1} ${y1} 
              // L ${xMiddle} ${y1} 
              // L ${xMiddle} ${y2 + TURNPOINT_R} 
              // A ${TURNPOINT_R} ${TURNPOINT_R} 0 0 0 
              // ${xMiddle - TURNPOINT_R},${y2} 
              // L ${x2} ${y2}`

              path = `M ${x1} ${y1} C ${x1} ${y1} ${x1 + 2 * 15 * 0.03} ${y2} ${x2} ${y2}`
            }
          } else if (direction === 'rhs') {
            x1 = parentOL + parentOW - GAP
            xMiddle = parentOL + parentOW
            // x2 = parentOL + parentOW + childT.offsetWidth
            if(rootDirection === RIGHT_TREE)
              x2 = parentOL + parentOW + 75
            else
              x2 = parentOL + parentOW + 15 

            //path for child node in RIGHT TREE MODE
            if(rootDirection === RIGHT_TREE)
              path = `M ${x1} ${y1} L ${(x1+x2)/2} ${y1} L ${(x1+x2)/2} ${y2} L ${x2} ${y2}`
            else{
              if (
                childTOT + childTOH < parentOT + parentOH / 2 + 50 &&
                childTOT + childTOH > parentOT + parentOH / 2 - 50
              ) {
                // if(children.length === 2){
                //   if(!i){
                //     path = `M ${x1} ${y1} L ${xMiddle} ${y1} L ${xMiddle} ${y2 + TURNPOINT_R} A ${TURNPOINT_R} ${TURNPOINT_R} 0 0 1 ${xMiddle + TURNPOINT_R},${y2}  L ${x2} ${y2}`
                //   }else if(!!i){
                //     path = `M ${x1} ${y1} L ${xMiddle} ${y1} L ${xMiddle} ${y2 - TURNPOINT_R} A ${TURNPOINT_R} ${TURNPOINT_R} 0 0 0 ${xMiddle + TURNPOINT_R}, ${y2}   L ${x2} ${y2}`
                //   }
                // }else{
                //   if(!i && children.length > 1){
                //     path = `M ${x1} ${y1} L ${xMiddle} ${y1} L ${xMiddle} ${y2 + TURNPOINT_R} A ${TURNPOINT_R} ${TURNPOINT_R} 0 0 1 ${xMiddle + TURNPOINT_R},${y2}  L ${x2} ${y2}`
                //   }else{
                //     path = `M ${x1} ${y1} L ${xMiddle} ${y1} L ${xMiddle} ${y2} L ${x2} ${y2}`
                //   }
                // }
                path = `M ${x1} ${y1} C ${x1} ${y1} ${x1 + 2 * 15 * 0.03} ${y2} ${x2} ${y2}`
              } else if (childTOT + childTOH >= parentOT + parentOH / 2) {
                // path = `M ${x1} ${y1} 
                //   L ${xMiddle} ${y1} 
                //   L ${xMiddle} ${y2 - TURNPOINT_R} 
                //   A ${TURNPOINT_R} ${TURNPOINT_R} 0 0 0 ${xMiddle + TURNPOINT_R
                //       },${y2} 
                //   L ${x2} ${y2}`
                  path = `M ${x1} ${y1} C ${x1} ${y1} ${x1 + 2 * 15 * 0.03} ${y2} ${x2} ${y2}`
                } else {
                  // path = `M ${x1} ${y1} 
                  // L ${xMiddle} ${y1} 
                  // L ${xMiddle} ${y2 + TURNPOINT_R} 
                  // A ${TURNPOINT_R} ${TURNPOINT_R} 0 0 1 ${xMiddle + TURNPOINT_R
                  //     },${y2} 
                  // L ${x2} ${y2}`

                  path = `M ${x1} ${y1} C ${x1} ${y1} ${x1 + 2 * 15 * 0.03} ${y2} ${x2} ${y2}`
              }
            }
          }

          const colorLine = child && child.children[0] && child.children[0].querySelector('t tpc') && child.children[0].querySelector('t tpc').getAttribute('data-color') || '#555';
          if(isTagging){
            child.className === 'relateGrp' && svg.appendChild(createPath(path,'#979797', '3',"10,10"))
          }
          else{
            if(rootDirection === RIGHT_TREE) 
              svg.appendChild(createPath(path, colorLineRoot))
            else
              svg.appendChild(createPath(path, colorLine))
          }

          // let expander = childT.children[1]
          let expander = null;
          if (childT && childT.children && childT.children.length !== 0) {
            Array.prototype.forEach.call(childT.children, (element) => {
              if (element.tagName === 'EPD') {
                expander = element
              }
            })
          }
          if (expander) {
            expander.style.top =
              (childT.offsetHeight - expander.offsetHeight) / 2 + 'px'
            if (direction === 'lhs') {
              expander.style.left = -10 + 'px'
            } else if (direction === 'rhs') {
              expander.style.left = childT.offsetWidth - 10 + 'px'
            }
            // this property is added in the layout phase
            if (!expander.expanded) continue
          } else {
            // expander not exist
            continue
          }
          // traversal
          let nextChildren = child.children[1].children
          if (nextChildren.length > 0) loopChildren(nextChildren, childT)
        }
      }
    }
  }

  // 4. generate custom link
  this.linkSvgGroup.innerHTML = ''
  for (let prop in this.linkData) {
    let link = this.linkData[prop]
    if (typeof link.from === 'string')
      this.createLink(findEle(link.from), findEle(link.to), true, link)
    else
      this.createLink(
        findEle(link.from.nodeObj.id),
        findEle(link.to.nodeObj.id),
        true,
        link
      )
  }
  console.timeEnd('linkDiv')
}