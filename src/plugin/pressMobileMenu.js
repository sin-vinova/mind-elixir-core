import i18n from '../i18n'

export default function (mind, manager) {
  let createLi = (id, name, keyname, icon) => {
    let li = document.createElement('li')
    li.id = id
    // li.innerHTML = `<span>${name}</span><span>${keyname}</span>`
    li.innerHTML = `<span>${name}</span>`;
    if(icon) li.innerHTML = `<i class="${icon}"></i>` + li.innerHTML;
    return li
  }
  let locale = i18n[mind.locale] ? mind.locale : 'en'

  let add_child = createLi('cm-add_child', 'Add Node', 'tab', 'iconAdd')
  let add_sibling = createLi('cm-add_sibling', 'Add Post', 'enter', 'iconEdit')
  let add_post = createLi('cm-add_post', 'Add Post', 'enter', 'iconEdit')
  let remove_child = createLi(
    'cm-remove_child',
    'Delete',
    'delete',
    'iconDelete'
  )
  let focus = createLi('cm-fucus', i18n[locale].focus, '')
  let unfocus = createLi('cm-unfucus', i18n[locale].cancelFocus, '')
  let up = createLi('cm-up', i18n[locale].moveUp, 'PgUp')
  let down = createLi('cm-down', i18n[locale].moveDown, 'Pgdn')
  let link = createLi('cm-down', i18n[locale].link, '')

  let menuUl = document.createElement('ul')
  menuUl.className = 'menu-list'
  menuUl.appendChild(add_child)
  menuUl.appendChild(add_post)
  // menuUl.appendChild(add_sibling)
  menuUl.appendChild(remove_child)
  // if (!option || option.focus) {
  //   menuUl.appendChild(focus)
  //   menuUl.appendChild(unfocus)
  // }
  // menuUl.appendChild(up)
  // menuUl.appendChild(down)
  // if (!option || option.link) {
  //   menuUl.appendChild(link)
  // }
  // if (option && option.extend) {
  //   for (let i = 0; i < option.extend.length; i++) {
  //     let item = option.extend[i]
  //     let dom = createLi(item.name, item.name, item.key || '')
  //     menuUl.appendChild(dom)
  //     dom.onclick = e => {
  //       item.onclick(e)
  //     }
  //   }
  // }

  let menuContainer = document.createElement('cmenu')
  menuContainer.appendChild(menuUl)
  menuContainer.hidden = true

  mind.container.append(menuContainer)
  let isRoot = true
  function getParent(el,query) {
    if(el.matches(query))
      return el
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
  manager.on('press',function (e) {
    console.log(e)
    e.preventDefault()
    if(e.target.classList.contains('fake-el') || mind.isEditing)
      return
    // console.log(e.pageY, e.screenY, e.center.y)
    
    let target = getParent(e.target, 'TPC') ? getParent(e.target, 'TPC') : null
    // const nodeTopic =  getParent(target, 'TPC') ? getParent(e.target, 'TPC') : null
    if (target) {
      if (target.parentElement.tagName === 'ROOT') {
        isRoot = true
      } else {
        isRoot = false
      }
      
      // value "mapPermission" : "View" || "Update" || "Owner"
      if (mind.mapPermission === 'Update' || mind.mapPermission === 'Owner') {
        mind.selectNode(target)
        add_child.className = ''
        remove_child.className = ''
        add_post.className = ''
        if (isRoot) {
          // focus.className = 'disabled'
          // up.className = 'disabled'
          // down.className = 'disabled'
          // add_sibling.className = 'disabled'
          remove_child.className = 'disabled'
          
          // allow create_post_on_node_root
          // add_post.className = 'disabled'
        }
        // } else {
        //   // focus.className = ''
        //   // up.className = ''
        //   // down.className = ''
        //   add_child.className = ''
        //   remove_child.className = ''
        //   add_post.className = ''
        // }
      } else if (mind.mapPermission === 'View') {
        add_child.className = 'disabled'
        add_post.className = 'disabled'
        remove_child.className = 'disabled'
        // up.className = 'disabled'
        // down.className = 'disabled'
        // add_sibling.className = 'disabled'
        
        // focus.className = 'disabled'
        // unfocus.className = 'disabled'
      }
      
      if( !mind.isTagging && !(target.nodeObj && target.nodeObj.belongOtherMap && !target.nodeObj.firstNodeOtherMap))
        menuContainer.hidden = false
      if(target.nodeObj.belongOtherMap && target.nodeObj.firstNodeOtherMap){
        add_child.className = 'disabled'
        add_post.className = 'disabled'
      }
      let height = menuUl.offsetHeight
      let width = menuUl.offsetWidth
      if (height + e.center.y > window.innerHeight) {
        menuUl.style.top = ''
        menuUl.style.bottom = '0px'
      } else {
        menuUl.style.bottom = ''
        menuUl.style.top = e.center.y + 15 + 'px'
      }
      if (width + e.center.x > window.innerWidth) {
        menuUl.style.left = ''
        menuUl.style.right = '0px'
      } else {
        menuUl.style.right = ''
        menuUl.style.left = e.center.x + 10 + 'px'
      }
      if (mind.onRedirectPath) {
        mind.onRedirectPath(target.nodeObj)
      }
    }
  })

  menuContainer.onclick = e => {
    if (e.target === menuContainer) menuContainer.hidden = true
  }

  add_child.onclick = e => {
    const currentNodeObj = mind.currentNode.nodeObj
    if( !mind.isTagging && !currentNodeObj.belongOtherMap){
      mind.addChild()
      menuContainer.hidden = true
    }
  }
  add_post.onclick = e => {
    // mind.addPost();
    const currentNodeObj = mind.currentNode.nodeObj
    if( !mind.isTagging && !currentNodeObj.belongOtherMap){
      mind.addPost()
      menuContainer.hidden = true
    }
  }
  add_sibling.onclick = e => {
    if (isRoot) return
    mind.insertSibling()
    menuContainer.hidden = true
  }
  remove_child.onclick = e => {
    if (isRoot) return
    // mind.removeNode()
    if (mind.onDeleteNodeRequest) {
      mind.onDeleteNodeRequest()
    }
    
    menuContainer.hidden = true
  }
  focus.onclick = e => {
    if (isRoot) return
    mind.focusNode(mind.currentNode)
    menuContainer.hidden = true
  }
  unfocus.onclick = e => {
    mind.cancelFocus()
    menuContainer.hidden = true
  }
  up.onclick = e => {
    if (isRoot) return
    mind.moveUpNode()
    menuContainer.hidden = true
  }
  down.onclick = e => {
    if (isRoot) return
    mind.moveDownNode()
    menuContainer.hidden = true
  }
  // link.onclick = e => {
  //   let from = mind.currentNode
  //   mind.map.addEventListener(
  //     'click',
  //     e => {
  //       e.preventDefault()
  //       if (
  //         e.target.parentElement.nodeName === 'T' ||
  //         e.target.parentElement.nodeName === 'ROOT'
  //       ) {
  //         mind.createLink(from, mind.currentNode)
  //       } else {
  //         console.log('取消连接')
  //       }
  //     },
  //     {
  //       once: true,
  //     }
  //   )
  // }
}
