// import i18n from '../i18n'

// export default function (mind) {
//   let locale = i18n[mind.locale] ? mind.locale : 'en'
//   let createDiv = (id, name) => {
//     let div = document.createElement('div')
//     div.id = id
//     div.innerHTML = `<span>${name}</span>`
//     return div
//   }
//   let bgOrFont
//   let styleDiv = createDiv('nm-style', 'style')
//   let tagDiv = createDiv('nm-tag', 'tag')
//   let iconDiv = createDiv('nm-icon', 'icon')

//   let colorList = [
//     '#2c3e50',
//     '#34495e',
//     '#7f8c8d',
//     '#94a5a6',
//     '#bdc3c7',
//     '#ecf0f1',
//     '#8e44ad',
//     '#9b59b6',
//     '#2980b9',
//     '#3298db',
//     '#c0392c',
//     '#e74c3c',
//     '#d35400',
//     '#f39c11',
//     '#f1c40e',
//     '#17a085',
//     '#27ae61',
//     '#2ecc71',
//   ]
//   styleDiv.innerHTML = `
//       <div class="nm-fontsize-container">
//         ${['15', '24', '32']
//           .map(size => {
//             return `<div class="size"  data-size="${size}">
//         <svg class="icon" style="width: ${size}px;height: ${size}px" aria-hidden="true">
//           <use xlink:href="#icon-a"></use>
//         </svg></div>`
//           })
//           .join('')}<div class="bold"><svg class="icon" aria-hidden="true">
//   <use xlink:href="#icon-B"></use>
//   </svg></div>
//       </div>
//       <div class="nm-fontcolor-container">
//         ${colorList
//           .map(color => {
//             return `<div class="split6"><div class="palette" data-color="${color}" style="background-color: ${color};"></div></div>`
//           })
//           .join('')}
//       </div>
//       <div class="bof">
//       <span class="font">${i18n[locale].font}</span>
//       <span class="background">${i18n[locale].background}</span>
//       </div>
//   `
//   tagDiv.innerHTML = `
//       ${i18n[locale].tag}<input class="nm-tag" tabindex="-1" placeholder="${i18n[locale].tagsSeparate}" /><br>
//   `
//   iconDiv.innerHTML = `
//       ${i18n[locale].icon}<input class="nm-icon" tabindex="-1" placeholder="${i18n[locale].iconsSeparate}" /><br>
//   `

//   let menuContainer = document.createElement('nmenu')
//   menuContainer.innerHTML = `
//   <div class="button-container"><svg class="icon" aria-hidden="true">
//   <use xlink:href="#icon-close"></use>
//   </svg></div>
//   `
//   menuContainer.appendChild(styleDiv)
//   menuContainer.appendChild(tagDiv)
//   menuContainer.appendChild(iconDiv)
//   menuContainer.hidden = true

//   function clearSelect(klass, remove) {
//     var elems = document.querySelectorAll(klass)
//     ;[].forEach.call(elems, function (el) {
//       el.classList.remove(remove)
//     })
//   }

//   mind.container.append(menuContainer)
//   let sizeSelector = menuContainer.querySelectorAll('.size')
//   let bold = menuContainer.querySelector('.bold')
//   let buttonContainer = menuContainer.querySelector('.button-container')
//   let fontBtn = menuContainer.querySelector('.font')
//   let tagInput = document.querySelector('.nm-tag')
//   let iconInput = document.querySelector('.nm-icon')
//   menuContainer.onclick = e => {
//     if (!mind.currentNode) return
//     let nodeObj = mind.currentNode.nodeObj
//     if (e.target.className === 'palette') {
//       if (!nodeObj.style) nodeObj.style = {}
//       clearSelect('.palette', 'nmenu-selected')
//       e.target.className = 'palette nmenu-selected'
//       if (bgOrFont === 'font') {
//         nodeObj.style.color = e.target.dataset.color
//       } else if (bgOrFont === 'background') {
//         nodeObj.style.background = e.target.dataset.color

//         // update background node
//         if (mind.onEditNodeRequest) {
//           mind.onEditNodeRequest(nodeObj.topic, e.target.dataset.color)
//         }

//         // if want change color font then write this function for case bgOrFont === 'font'
//         const setBackgroundChild = childNode => {
//           if (childNode.children) {
//             childNode.children.map(child => {
//               child.style = {
//                 background: e.target.dataset.color,
//               }
//               setBackgroundChild(child)
//               return child
//             })
//           }
//         }

//         if (nodeObj.children && nodeObj.children.length !== 0) {
//           nodeObj.children = nodeObj.children.map(childNode => {
//             childNode.style = {
//               background: e.target.dataset.color,
//             }
//             setBackgroundChild(childNode)
//             return childNode
//           })
//         }
//       }
//       mind.updateNodeStyle(nodeObj)
//     } else if (e.target.className === 'background') {
//       clearSelect('.palette', 'nmenu-selected')
//       bgOrFont = 'background'
//       e.target.className = 'background selected'
//       e.target.previousElementSibling.className = 'font'
//       if (nodeObj.style && nodeObj.style.background)
//         menuContainer.querySelector(
//           '.palette[data-color="' + nodeObj.style.background + '"]'
//         ).className = 'palette nmenu-selected'
//     } else if (e.target.className === 'font') {
//       clearSelect('.palette', 'nmenu-selected')
//       bgOrFont = 'font'
//       e.target.className = 'font selected'
//       e.target.nextElementSibling.className = 'background'
//       if (nodeObj.style && nodeObj.style.color)
//         menuContainer.querySelector(
//           '.palette[data-color="' + nodeObj.style.color + '"]'
//         ).className = 'palette nmenu-selected'
//     }
//   }
//   Array.from(sizeSelector).map(
//     dom =>
//       (dom.onclick = e => {
//         if (!mind.currentNode.nodeObj.style) mind.currentNode.nodeObj.style = {}
//         clearSelect('.size', 'size-selected')
//         let size = e.currentTarget
//         mind.currentNode.nodeObj.style.fontSize = size.dataset.size
//         size.className = 'size size-selected'
//         mind.updateNodeStyle(mind.currentNode.nodeObj)
//       })
//   )
//   bold.onclick = e => {
//     console.log('bold', mind.currentNode)
//     if (!mind.currentNode.nodeObj.style) mind.currentNode.nodeObj.style = {}
//     if (mind.currentNode.nodeObj.style.fontWeight === 'bold') {
//       delete mind.currentNode.nodeObj.style.fontWeight
//       e.currentTarget.className = 'bold'
//       mind.updateNodeStyle(mind.currentNode.nodeObj)
//     } else {
//       mind.currentNode.nodeObj.style.fontWeight = 'bold'
//       e.currentTarget.className = 'bold size-selected'
//       mind.updateNodeStyle(mind.currentNode.nodeObj)
//     }
//   }
//   tagInput.onchange = e => {
//     console.log('tagInput', mind.currentNode)
//     if (!mind.currentNode) return
//     if (!e.target.value) {
//       mind.currentNode.nodeObj.tags = []
//     } else {
//       mind.currentNode.nodeObj.tags = e.target.value.split(',')
//     }
//     mind.updateNodeTags(mind.currentNode.nodeObj)
//   }
//   iconInput.onchange = e => {
//     if (!mind.currentNode) return
//     mind.currentNode.nodeObj.icons = e.target.value.split(',')
//     mind.updateNodeIcons(mind.currentNode.nodeObj)
//   }
//   let state = 'open'
//   buttonContainer.onclick = e => {
//     if (state === 'open') {
//       state = 'close'
//       menuContainer.className = 'close'
//       buttonContainer.innerHTML = `<svg class="icon" aria-hidden="true">
//     <use xlink:href="#icon-menu"></use>
//     </svg>`
//     } else {
//       state = 'open'
//       menuContainer.className = ''
//       buttonContainer.innerHTML = `<svg class="icon" aria-hidden="true">
//     <use xlink:href="#icon-close"></use>
//     </svg>`
//     }
//   }
//   mind.bus.addListener('unselectNode', function () {
//     menuContainer.hidden = true
//   })
//   mind.bus.addListener('selectNode', function (nodeObj) {
//     if ((nodeObj.parent && nodeObj.parent.root) || nodeObj.root) {
//       menuContainer.hidden = false
//     } else if (nodeObj.level && (nodeObj.level === 1 || nodeObj.level === 0)) {
//       menuContainer.hidden = false
//     } else {
//       menuContainer.hidden = true
//     }
//     // menuContainer.hidden = false
//     // E(nodeObj.id).scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
//     if (mind.onRedirectPath) {
//       mind.onRedirectPath(nodeObj)
//     }
//     clearSelect('.palette', 'nmenu-selected')
//     clearSelect('.size', 'size-selected')
//     clearSelect('.bold', 'size-selected')
//     bgOrFont = 'font'
//     fontBtn.className = 'font selected'
//     fontBtn.nextElementSibling.className = 'background'
//     if (nodeObj.style) {
//       if (nodeObj.style.fontSize)
//         menuContainer.querySelector(
//           '.size[data-size="' + nodeObj.style.fontSize + '"]'
//         ).className = 'size size-selected'
//       if (nodeObj.style.fontWeight)
//         menuContainer.querySelector('.bold').className = 'bold size-selected'
//       if (nodeObj.style.color)
//         menuContainer.querySelector(
//           '.palette[data-color="' + nodeObj.style.color + '"]'
//         ).className = 'palette nmenu-selected'
//     }
//     if (nodeObj.tags) {
//       tagInput.value = nodeObj.tags.join(',')
//     } else {
//       tagInput.value = ''
//     }
//     if (nodeObj.icons) {
//       iconInput.value = nodeObj.icons.join(',')
//     } else {
//       iconInput.value = ''
//     }
//   })
// }

// new Menu: pick color
import i18n from '../i18n'

const icColorOpen = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="18" cy="18" r="16" fill="white"/>
<g clip-path="url(#clip0)">
<path d="M22.715 14.5643L17.4304 9.22803L16.6662 8.43799L14.8616 10.2109C11.7767 9.77 9.5594 10.9045 8.77406 12.3C7.82061 13.9941 8.79522 15.8434 8.82579 15.8999C9.64052 17.5281 10.8115 18.5051 12.3069 18.8072C12.6349 18.8719 12.9653 18.9013 13.2944 18.9013C14.8487 18.9013 16.4029 18.2418 17.5844 17.5669C17.903 17.788 18.291 17.9185 18.706 17.9185C19.7993 17.9185 20.6881 17.0261 20.6881 15.9304C20.6881 14.8347 19.7993 13.9436 18.706 13.9436C17.6126 13.9436 16.7238 14.8347 16.7238 15.9304C16.7238 16.0398 16.7391 16.1467 16.7556 16.2526C15.5658 16.9286 13.9963 17.5646 12.6079 17.2848C11.5909 17.079 10.8056 16.3995 10.1966 15.1827C10.1907 15.171 9.58996 14.0035 10.1202 13.063C10.5669 12.2683 11.732 11.7569 13.5096 11.5641L13.2333 11.8427L10.6798 14.4056C10.7068 14.4679 10.7268 14.5055 10.728 14.5079C10.9737 14.9993 11.25 15.399 11.558 15.7188L16.1807 11.0832C16.4005 10.8634 16.6921 10.7423 17.0013 10.7423C17.3105 10.7423 17.6044 10.8634 17.8219 11.0832L23.4309 16.7111C23.8836 17.1637 23.8836 17.9032 23.4309 18.3558L16.1395 25.6695C15.7022 26.1081 14.9368 26.1081 14.4983 25.6695L8.8881 20.0417C8.66825 19.823 8.54834 19.5315 8.54834 19.2199C8.54834 18.9095 8.66825 18.6156 8.8881 18.3969L9.49356 17.788C9.14909 17.4329 8.84342 17.0073 8.5695 16.5206L7.79357 17.3001C7.28216 17.8126 7 18.4945 7 19.2199C7 19.9453 7.28216 20.6272 7.79357 21.1397L13.4038 26.7676C13.9152 27.2802 14.5935 27.5623 15.3177 27.5623C16.0396 27.5623 16.7203 27.2802 17.2317 26.7676L24.5219 19.4539L26.0515 17.9337L25.6271 17.5046C26.43 17.0661 26.7874 20.7306 26.7874 20.7306C26.7874 20.7306 27.909 29.4763 28.9059 20.7306C29.8582 12.3611 23.2875 14.3739 22.715 14.5643Z" fill="#030104"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="22" height="22" fill="white" transform="translate(7 7)"/>
</clipPath>
</defs>
</svg>
`

const icColorClose = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="18" cy="18" r="16" fill="white"/>
<rect x="8" y="17" width="20" height="2" fill="black"/>
</svg>`

export default function (mind) {
  let locale = i18n[mind.locale] ? mind.locale : 'en'
  let createDiv = (id, name) => {
    let div = document.createElement('div')
    div.id = id
    div.innerHTML = `<span>${name}</span>`
    return div
  }
  let bgOrFont
  let styleDiv = createDiv('nm-style', 'style')
  let colorList
  if (mind.colorList) {
    colorList = mind.colorList
  } else {
    colorList = [
      '#2c3e50',
      '#34495e',
      '#7f8c8d',
      '#94a5a6',
      '#bdc3c7',
      '#ecf0f1',
      '#8e44ad',
      '#9b59b6',
      '#2980b9',
      '#3298db',
      '#c0392c',
      '#e74c3c',
      '#d35400',
      '#f39c11',
      '#f1c40e',
      '#17a085',
      '#27ae61',
      '#2ecc71',
      '#70a1ff',
    ]
  }

  styleDiv.innerHTML = `
      <div class="nm-fontcolor-container">
        ${colorList
          .map(color => {
            return `<div class="split6"><div class="palette" data-color="${color}" style="background-color: ${color};"></div></div>`
          })
          .join('')}
      </div>
  `

  let menuContainer = document.createElement('nmenu')
  menuContainer.innerHTML = `
  <div class="button-hide-color">${icColorClose}</div>
  `
  menuContainer.className="nmenu-verion-2"
  menuContainer.appendChild(styleDiv)
  menuContainer.hidden = true

  function clearSelect(klass, remove) {
    var elems = document.querySelectorAll(klass)
    ;[].forEach.call(elems, function (el) {
      el.classList.remove(remove)
    })
  }

  mind.container.append(menuContainer)
  let buttonContainer = menuContainer.querySelector('.button-hide-color')
  menuContainer.onclick = e => {
    if (!mind.currentNode) return
    let nodeObj = mind.currentNode.nodeObj
    if (e.target.className === 'palette') {
      if (!nodeObj.style) nodeObj.style = {}
      clearSelect('.palette', 'nmenu-selected')
      e.target.className = 'palette nmenu-selected'
      nodeObj.style.background = e.target.dataset.color

      // update background node
      if (mind.onEditNodeRequest) {
        mind.onEditNodeRequest(nodeObj)
      }

      /*
        // if want change color font then write this function for case bgOrFont === 'font'
        // code --> change color backgrond and color link for children node
        const setBackgroundChild = childNode => {
          if (childNode.children) {
            childNode.children.map(child => {
              // if(!childNode.belongOtherMap){
                child.style = {
                  background: e.target.dataset.color,
                }
                setBackgroundChild(child)
              // }
              return child
            })
          }
        }

        if (nodeObj.root) {
          nodeObj.style = {
            background: e.target.dataset.color,
          }
        } else if (nodeObj.children && nodeObj.children.length !== 0) {
          nodeObj.children = nodeObj.children.map(childNode => {
            if(!childNode.belongOtherMap)
              childNode.style = {
                background: e.target.dataset.color,
              }
            setBackgroundChild(childNode)
            return childNode
          })
        }
      */
      mind.updateNodeStyle(nodeObj)
    }
  }

  let state = 'close'
  // set default close for node-menu
  menuContainer.classList.add("close-color");
  buttonContainer.innerHTML = icColorOpen

  // close node-menu when screen on mobile
  if (mind.container.offsetWidth <= 600) {
    state = 'close'
      menuContainer.classList.add("close-color");
      buttonContainer.innerHTML = icColorOpen
  }

  // close node-menu when screen on mobile
  window.addEventListener('resize', () => {
    if (mind.container.offsetWidth <= 600) {
      state = 'close'
      menuContainer.classList.add("close-color");
      buttonContainer.innerHTML = icColorOpen
    } else {
      if (state === 'open') {
        state = 'open'
        menuContainer.classList.remove("close-color");
        buttonContainer.innerHTML = icColorClose
      }
    }
  })
  
  buttonContainer.onclick = e => {
    e.stopPropagation()
    e.preventDefault()
    if (state === 'open') {
      state = 'close'
      menuContainer.classList.add("close-color");
      buttonContainer.innerHTML = icColorOpen
    } else {
      state = 'open'
      menuContainer.classList.remove("close-color");
      buttonContainer.innerHTML = icColorClose
    }
  }
  mind.bus.addListener('unselectNode', function () {
    menuContainer.hidden = true
  })
  mind.bus.addListener('selectNode', function (nodeObj) {
    // if(!nodeObj){
    //   menuContainer.hidden = true
    //   return
    // }
    if(mind.isTagging || nodeObj.belongOtherMap || mind.currentNode.contentEditable === 'true')
      menuContainer.hidden = true
    // if ((nodeObj.parent && nodeObj.parent.root) || nodeObj.root) {
    //   menuContainer.hidden = false
    // } else if (nodeObj.level && (nodeObj.level === 1 || nodeObj.level === 0)) {
    //   menuContainer.hidden = false
    // } else {
    //   menuContainer.hidden = true
    // }
    else
      menuContainer.hidden = false
    clearSelect('.palette', 'nmenu-selected')
    clearSelect('.size', 'size-selected')
    clearSelect('.bold', 'size-selected')
  })
}
