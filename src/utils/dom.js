import { LEFT, RIGHT, SIDE,RIGHT_TREE } from '../const'
import vari from '../var'
import { v4 as uuidv4 } from 'uuid'
import logo from '../assets/icon/ic-logo.png'
import iconAgree from '../assets/icon/ic-agree.svg'
import iconNotAgree from '../assets/icon/ic-not-agree.svg'
import defaultUser from '../assets/icon/defaultUser.svg'

// DOM manipulation
let $d = document
const hashtagForrmat = (string,className='tag',activeTag) => {
  if(!string)
    return ''
  return string.replace(/#(\w+)/g,  (g1) => {
    if(activeTag && activeTag === g1)
      return `<span class="${className} active-tag">${g1}</span>`
    else
      return `<span class="${className}">${g1}</span>`
  })
}
export let findEle = (id, me) => {
  let scope = me ? me.mindElixirBox : $d
  return scope.querySelector(`[data-nodeid=me${id}]`)
}

const createPersonalInfo = (nodeObj) =>{
  const personalInfo  = document.createElement("div")
  personalInfo.classList.add('personal-info')
  const avatarUser = document.createElement("img")
  avatarUser.src= nodeObj.customerProfilePicture ? nodeObj.customerProfilePicture : defaultUser
  avatarUser.classList.add('avatar-user')
  const nameUser = document.createElement("div")
  nameUser.classList.add('name-user')
  nameUser.innerHTML = nodeObj.createdBy
  if(nodeObj.typeTag && nodeObj.typeTag === 'relate'){
    nameUser.classList.add('name-user-relate')
  }
  else{
    nameUser.classList.add('name-user-available')
  }
  personalInfo.appendChild(avatarUser)
  personalInfo.appendChild(nameUser)
  return personalInfo
}

const createFollowNum = (nodeObj) => {
  const followNumWrapper = document.createElement("div")
  followNumWrapper.classList.add('follow-num-wrapper')
  const followNumImg = document.createElement("img")
  followNumImg.classList.add('follow-num-img')
  followNumImg.src = logo
  const followNum = document.createElement("div")
  followNum.classList.add('follow-num')
  followNum.innerHTML= nodeObj.nodeLinkCount
  followNumWrapper.appendChild(followNumImg)
  followNumWrapper.appendChild(followNum)
  return followNumWrapper
}
export let createGroup = function (node,direction,deepFirstChild) {
  let grp = $d.createElement('GRP')
  let top = createTop(node,direction,deepFirstChild)
  grp.appendChild(top)
  if (node.children && node.children.length > 0) {
    top.appendChild(createExpander(node.expanded))
    // top.appendChild(createAddNode(direction,deepFirstChild))
    if (node.expanded !== false) {
      let children = createChildren(node.children)
      grp.appendChild(children)
    }
  }
  top.appendChild(createAddNode(direction,deepFirstChild))
  return { grp, top }
}

export let createTop = function (nodeObj,direction,deepFirstChild,isTagging) {
  let top = $d.createElement('t')
  let tpc = createTopic(nodeObj,isTagging)
  // if(direction ===RIGHT_TREE)
  top.style.marginTop = '20px'
  if(direction && direction ===RIGHT_TREE){
    if(!deepFirstChild){
      tpc.style.marginLeft = '60px'
    }
    top.style.verticalAlign = 'top'
  }
  else{
    top.style.verticalAlign = 'middle'
  }
    
  // TODO allow to add online image
  if (nodeObj.style) {
    tpc.style.color = nodeObj.style.color
    tpc.style.background = nodeObj.style.background
    tpc.style.fontSize = nodeObj.style.fontSize + 'px'
    tpc.style.fontWeight = nodeObj.style.fontWeight || 'normal'
  }
  if (nodeObj.icons && nodeObj.icons.length) {
    let iconsContainer = $d.createElement('span')
    iconsContainer.className = 'icons'
    iconsContainer.innerHTML = nodeObj.icons
      .map(icon => `<span>${icon}</span>`)
      .join('')
    tpc.appendChild(iconsContainer)
  }
  // if (nodeObj.tags && nodeObj.tags.length) {
  //   let tagsContainer = $d.createElement('div')
  //   tagsContainer.className = 'tags'
  //   tagsContainer.innerHTML = nodeObj.tags
  //     .map(tag => `<span>${tag}</span>`)
  //     .join('')
  //   tpc.appendChild(tagsContainer)
  // }
  top.appendChild(tpc)
  return top
}

export let createTopic = function (nodeObj, isTagging, first) {
  let topic = $d.createElement('tpc')
  // if(isTagging){
  //   topic.classList.add('tag-topic')
  //   if(first)
  // }
  topic.nodeObj = nodeObj
  topic.dataset.nodeid = 'me' + nodeObj.id
  topic.draggable = vari.mevar_draggable
  if(isTagging){
    topic.classList.add('tag-topic')
    if(first){
      topic.classList.add('tag-topic-root')
      topic.innerHTML  = hashtagForrmat(nodeObj.topic,'tag', nodeObj.tagActive)
    }
    else{
      topic.innerHTML= hashtagForrmat(nodeObj.topic,'tag-child')
      if(nodeObj.firstChildTag){
        topic.appendChild(createPersonalInfo(nodeObj))
        topic.appendChild(createFollowNum(nodeObj))
      }
      if(nodeObj.typeTag && nodeObj.typeTag === 'relate'){
        topic.classList.add('tag-topic-relate')
      }
      else{
        topic.classList.add('tag-topic-available')
      }
    }
  }
  else{
    
    if(nodeObj.belongOtherMap){
      topic.innerHTML = hashtagForrmat(nodeObj.topic,'tag-child')
      topic.classList.add('tag-topic-available')
      if(nodeObj.firstNodeOtherMap){
        topic.appendChild(createPersonalInfo(nodeObj))
        topic.appendChild(createFollowNum(nodeObj))
      }
      else{
        topic.draggable = false
      }
    }
    else{
      topic.innerHTML = hashtagForrmat(nodeObj.topic)
    }
    
  }
  if(nodeObj.background){
    topic.style.background = nodeObj.background;
    topic.setAttribute('isBackground', 'true');
    topic.setAttribute('data-color', nodeObj.background);
  }
  if (nodeObj.style) {
    if (nodeObj.style.background) {
      topic.style.background = nodeObj.style.background
      topic.setAttribute('isBackground', 'true');
      topic.setAttribute('data-color', nodeObj.style.background);
    }
    if (nodeObj.style.color) {
      topic.setAttribute('isBackground', 'false');
      topic.style.color = nodeObj.style.color
    }
    if (nodeObj.style.fontSize) {
      topic.style.fontSize = nodeObj.style.fontSize
    }
  }
  // let className = `insert-preview in show`
  // let insertPreviewEL = document.createElement('div')
  // insertPreviewEL.className = className
  // topic.appendChild(insertPreviewEL)
  return topic
}

export function selectText(div) {
  if ($d.selection) {
    let range = $d.body.createTextRange()
    range.moveToElementText(div)
    range.select()
  } else if (window.getSelection) {
    let range = $d.createRange()
    range.selectNodeContents(div)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
  }
}

// export function createInputDiv(tpc, isEdit) {
//   console.time('createInputDiv')
//   if (!tpc) return
//   const fakeId = uuidv4()
//   let clnTpc = tpc.cloneNode(true)
//   clnTpc.dataset.nodeid = fakeId
//   tpc.parentElement.prepend(clnTpc)
//   // tpc.style.display = "none"
//   // let div = $d.createElement('div')
//   let origin = tpc.childNodes[0].textContent
//   // console.log(tpc.childNodes[0],"[[[[[[")
//   clnTpc.contentEditable =true

  
//   // tpc.appendChild(div)
//   // div.innerHTML = origin
//   // div.contentEditable = true
//   clnTpc.spellcheck = false
//   // div.style.cssText = `min-width:${tpc.offsetWidth - 8}px;`
//   // if (this.direction === LEFT) div.style.right = 0
//   clnTpc.focus()
//   const sefl = this

//   clnTpc.addEventListener("input", function (e) {
//     if (sefl.onChangeText && typeof sefl.onChangeText == 'function') { 
//       sefl.onChangeText(e.target.textContent)
//     }
//     // sefl.linkDiv()
//   })

//   selectText(clnTpc)
//   // this.inputDiv = tpc

//   this.bus.fire('operation', {
//     name: 'beginEdit',
//     obj: tpc.nodeObj,
//   })

//   clnTpc.addEventListener('keydown', e => {
//     let key = e.keyCode
//     if (key === 8) {
//       // 不停止冒泡冒到document就把节点删了
//       e.stopPropagation()
//     } else if (key === 13 || key === 9) {
//       // enter & tab
//       // keep wrap for shift enter
//       if (e.shiftKey) return
      
//       e.preventDefault()
//       clnTpc.blur()
//       this.map.focus()
//     }
//   })
//   clnTpc.addEventListener('blur', () => {
//     if (!clnTpc) return // 防止重复blur
//     let node = tpc.nodeObj
//     let topic = clnTpc.textContent.trim()
//     console.log(topic,"kkkkkkkk")
//     if (topic === '') node.topic = origin
//     else {
//       node.topic = topic
//       origin = topic
//     }

//     // console.log('this.editable', this, this.editable)
    
//     // request API Node
//     if (!isEdit && this.onCreateNodeRequest) {
//       this.onCreateNodeRequest(topic)
//     }
//     if (isEdit && this.onEditNodeRequest) {
//       this.onEditNodeRequest(topic === '' ? origin : topic)
//     }
//     clnTpc.contentEditable = false

//     clnTpc.remove()
//     this.inputDiv = clnTpc = null
//     this.bus.fire('operation', {
//       name: 'finishEdit',
//       obj: node,
//       origin,
//     })
//     if (topic === origin) return // 没有修改不做处理
//     tpc.textContent = node.topic
//     tpc.style.display = "block"
//     this.linkDiv()
//   })
//   console.timeEnd('createInputDiv')
// }




export function createInputDiv(tpc, isEdit) {
  console.time('createInputDiv')
  const sefl = this
  sefl.isEditing = true 
  if (!tpc || tpc.contentEditable === 'true') return
  const colorTable = sefl.container.querySelector('nmenu')
  if(colorTable && !colorTable.hidden)
    colorTable.hidden = true
  // let div = $d.createElement('div')
  let origin = tpc.childNodes[0].textContent
  const fakeId = uuidv4()
  let clnTpc = tpc.cloneNode(true)
  clnTpc.nodeObj = tpc.nodeObj
  Array.from(clnTpc.querySelectorAll('.tag')).forEach(item => item.style.textDecoration ='unset')
  tpc.style.display ='none'
  clnTpc.dataset.nodeid = fakeId
  clnTpc.classList.add('fake-el')
  tpc.parentElement.prepend(clnTpc)
  clnTpc.inputmode= 'search'
  // tpc.appendChild(div)
  // div.innerHTML = origin
  clnTpc.contentEditable = true
  clnTpc.style.webkitUserSelect = 'text'
  clnTpc.spellcheck = false
  // div.style.cssText = `min-width:${tpc.offsetWidth - 8}px;`
  // if (this.direction === LEFT) div.style.right = 0
  clnTpc.focus()
  

  clnTpc.addEventListener("input", function (e) {
    if (sefl.onChangeText && typeof sefl.onChangeText == 'function') { 
      sefl.onChangeText(e.target.textContent)
    }
    sefl.linkDiv()
  })
  selectText(clnTpc)
  this.inputDiv = clnTpc
  this.bus.fire('operation', {
    name: 'beginEdit',
    obj: tpc.nodeObj,
  })
  clnTpc.addEventListener('keydown', e => {
    let key = e.keyCode
    if (key === 8) {
      // 不停止冒泡冒到document就把节点删了
      e.stopPropagation()
    } else if (key === 13 || key === 9) {
      // enter & tab
      // keep wrap for shift enter
      if (e.shiftKey) return
      e.preventDefault()
      this.inputDiv.blur()
      this.map.focus()
    }
  })
  clnTpc.addEventListener('focus', () =>{
    // const range = new Range();
    // range.setStart(clnTpc,0)
    // range.setEnd(clnTpc,10)
    // const selection = window.getSelection();
    // selection.addRange(range);
    // clnTpc.setSelectionRange(0,clnTpc.textContent.length -1)
  })
  clnTpc.addEventListener('blur', () => {
    if (!clnTpc) return // 防止重复blur
    let node = tpc.nodeObj
    let topic = clnTpc.textContent.trim()
    if(clnTpc.textContent.length > 40){
      clnTpc.focus()
      if (this.onValidateEdit) {
        this.onValidateEdit()
      }
      return
    }
    sefl.isEditing = false 
    tpc.style.display ='block'
    if (topic === '') node.topic = origin
    else node.topic = topic
    // request API Node
    if (!isEdit && this.onCreateNodeRequest) {
      this.onCreateNodeRequest(node)
    }
    if (isEdit && this.onEditNodeRequest) {
      this.onEditNodeRequest(node)
    }
    clnTpc.remove()
    this.inputDiv = clnTpc = null
    this.bus.fire('operation', {
      name: 'finishEdit',
      obj: node,
      origin,
    })
    if (topic === origin) return // 没有修改不做处理
    tpc.innerHTML = hashtagForrmat(node.topic)
    
    this.linkDiv()
  })
  console.timeEnd('createInputDiv')
}


// export function createInputDiv(tpc, isEdit) {
//   console.time('createInputDiv')
//   if (!tpc) return
//   let div = $d.createElement('div')
//   let origin = tpc.childNodes[0].textContent
//   tpc.appendChild(div)
//   div.innerHTML = origin
//   div.contentEditable = true
//   div.spellcheck = false
//   div.style.cssText = `min-width:${tpc.offsetWidth - 8}px;`
//   if (this.direction === LEFT) div.style.right = 0
//   div.focus()
//   const sefl = this
//   div.addEventListener("input", function (e) {
//     if (sefl.onChangeText && typeof sefl.onChangeText == 'function') { 
//       sefl.onChangeText(e.target.textContent)
//     }
//   })
//   selectText(div)
//   this.inputDiv = div
//   this.bus.fire('operation', {
//     name: 'beginEdit',
//     obj: tpc.nodeObj,
//   })
//   div.addEventListener('keydown', e => {
//     let key = e.keyCode
//     if (key === 8) {
//       // 不停止冒泡冒到document就把节点删了
//       e.stopPropagation()
//     } else if (key === 13 || key === 9) {
//       // enter & tab
//       // keep wrap for shift enter
//       if (e.shiftKey) return
//       e.preventDefault()
//       this.inputDiv.blur()
//       this.map.focus()
//     }
//   })
//   div.addEventListener('blur', () => {
//     if (!div) return // 防止重复blur
//     let node = tpc.nodeObj
//     let topic = div.textContent.trim()
//     if (topic === '') node.topic = origin
//     else node.topic = topic
//     console.log('this.editable', this, this.editable)
//     // request API Node
//     if (!isEdit && this.onCreateNodeRequest) {
//       this.onCreateNodeRequest(topic)
//     }
//     if (isEdit && this.onEditNodeRequest) {
//       this.onEditNodeRequest(topic)
//     }
//     div.remove()
//     this.inputDiv = div = null
//     this.bus.fire('operation', {
//       name: 'finishEdit',
//       obj: node,
//       origin,
//     })
//     if (topic === origin) return // 没有修改不做处理
//     tpc.childNodes[0].textContent = node.topic
//     this.linkDiv()
//   })
//   console.timeEnd('createInputDiv')
// }
export let createExpander = function (expanded,hidden) {
  let expander = $d.createElement('epd')
  // 包含未定义 expanded 的情况，未定义视为展开
  expander.innerHTML = expanded !== false ? '' : ''
  expander.expanded = expanded !== false ? true : false
  
  expander.className = expanded !== false ? 'minus' : 'plus'
  if(hidden)
    expander.hidden =true
  return expander
}

export let createAddNode = function (direction,first) {
  let addNode = $d.createElement('add')
  addNode.innerHTML = "+"
  addNode.className = "add"
  if(direction === RIGHT_TREE && !first)
    addNode.style.left = 'calc(50% + 30px)'
  else
    addNode.style.left = '50%'
  return addNode
}

export let createTagOption = function (){
  let wrapperOption = document.createElement('div')
  let agreeIcon = document.createElement('img')
  let disAgreeIcon = document.createElement('img')
  wrapperOption.classList.add('wrapper-option-tag')
  agreeIcon.classList.add('agree-icon')
  agreeIcon.src = iconAgree
  agreeIcon.classList.add('tag-icon')
  disAgreeIcon.classList.add('disagree-icon')
  disAgreeIcon.src = iconNotAgree
  disAgreeIcon.classList.add('tag-icon')
  wrapperOption.appendChild(agreeIcon)
  wrapperOption.appendChild(disAgreeIcon)
  return wrapperOption
}
/**
 * traversal data and generate dom structure of mind map
 * @ignore
 * @param {object} data node data object
 * @param {object} first 'the box'
 * @param {number} direction primary node direction
 * @return {ChildrenElement} children element.
 */
export function createChildren(data, first, direction,isTagging,removeAddNodeButton) {
  let chldr = $d.createElement('children') 
  if (first) {
    chldr = first
  }
  
  // let background
  if(direction && direction ===RIGHT_TREE)
    chldr.style.verticalAlign  = 'top'
  else
    chldr.style.verticalAlign = 'middle'
  for (let i = 0; i < data.length; i++) {
    let nodeObj = data[i]
    let grp = $d.createElement('GRP')
    
    if (first) {
      if (direction === LEFT) {
        grp.className = 'lhs'
      } else if (direction === RIGHT || direction === RIGHT_TREE) {
        grp.className = 'rhs'
      } else if (direction === SIDE) {
        if(isTagging){
          if( nodeObj.typeTag && nodeObj.typeTag === 'relate')
            grp.className = 'rhs'
          else
            grp.className = 'lhs'
        }
        else{
          if (nodeObj.direction === LEFT) {
            grp.className = 'lhs'
          } else if (nodeObj.direction === RIGHT) {
            grp.className = 'rhs'
          }
        }
      }
      grp.dataset.checkGrp = 'firstDeepGrp'

    }
    if(!first && nodeObj.typeTag){
      if( nodeObj.typeTag === 'relate')
        grp.classList.add('relateGrp')
      else
        grp.classList.add('availableGrp')
    }

    
    let top = createTop(nodeObj,direction,first,isTagging)
    // console.log(isTagging, nodeObj,"uuuuu")
    if(isTagging && nodeObj.typeTag === 'relate' && nodeObj.firstChildTag)
      top.appendChild(createTagOption())
    if (nodeObj.children && nodeObj.children.length > 0) {
      
      // if (nodeObj.parent && nodeObj.parent.root ) {
      //   console.log('cccccccccc', nodeObj)
      //   if (nodeObj.style && nodeObj.style.background) {
      //     background = nodeObj.style.background
      //   }
      // } else {

      // }
      // console.log('backgroundbackground', background)
      if(!isTagging){
        top.appendChild(createExpander(nodeObj.expanded))
        if(!nodeObj.belongOtherMap && !removeAddNodeButton)
          top.appendChild(createAddNode(direction,first))
      }
      else if(nodeObj.typeTag !== 'relate'){
        top.appendChild(createExpander(nodeObj.expanded))
      } else{
        top.appendChild(createExpander(nodeObj.expanded,true))
      }
      grp.appendChild(top)
      if (nodeObj.expanded !== false) {
        let children = createChildren(nodeObj.children,false,direction,isTagging,removeAddNodeButton)
        grp.appendChild(children)
        // console.log(grp,"ooooooo")
        // if(isTagging){
        //   grp.top = children[0]
        // }
        // if(!first){
          // grp.children[0].top = grp.parentNode.children[0].children[0].offsetWidth /2
        // }
        // console.log(grp.children[0].top =,"lllll")
      }
    } else {
      // top.appendChild(createAddNode())
      if(!isTagging){
        if(!nodeObj.belongOtherMap && !removeAddNodeButton)
          grp.appendChild(top).appendChild(createAddNode(direction,first))
        else
          grp.appendChild(top)
      }
      else
        grp.appendChild(top)
    }
    chldr.appendChild(grp)
    console.log(chldr.parentElement,"ooooo")

  }
  // console.log(chldr.parentElement,"lllllll")
  return chldr
}

// Set primary nodes' direction and invoke createChildren()
export function layout() {
  console.time('layout')
  this.root.innerHTML = ''
  this.box.innerHTML = ''
  let tpc = createTopic(this.nodeData,this.isTagging,this.box)
  tpc.draggable = false
  this.root.appendChild(tpc)
  
  let primaryNodes = this.nodeData.children
  if (!primaryNodes ) return
  if(!this.isTagging && !this.removeAddNodeButton)
    this.root.appendChild(createAddNode(this.direction,true))
  if (this.direction === SIDE) {
    // init direction of primary node
    let lcount = 0
    let rcount = 0
    primaryNodes.map(node => {
      if (node.direction === undefined) {
        if (lcount <= rcount) {
          node.direction = LEFT
          lcount += 1
        } else {
          node.direction = RIGHT
          rcount += 1
        }
      } else {
        if (node.direction === LEFT) {
          lcount += 1
        } else {
          rcount += 1
        }
      }
    })
  }
  if(primaryNodes.length)
    createChildren(this.nodeData.children, this.box, this.direction,this.isTagging, this.removeAddNodeButton )
  console.timeEnd('layout')
}
