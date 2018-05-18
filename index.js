import _ from 'lodash'

;(() => {
  // Tooltip 类
  class Tooltip {
    constructor() {
      this.pos = ['top', 'right', 'bottom', 'left']
      this.ele = null
      this.bind()
    }

    bind() {
      document.addEventListener('mouseover', _.debounce(this.handleMouseOver, 200).bind(this))
      document.addEventListener('mouseout', this.handleMouseOut.bind(this))
    }

    offset(el) {
      const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop
      return { 
        top: rect.top + scrollTop, 
        left: rect.left + scrollLeft,
        width: rect.width,
        height: rect.height
      }
    }

    handleMouseOver(e) {
      const text = e.target.dataset.tip
      const position = e.target.dataset.tipPosition
      const pos = this.pos.includes(position) ? position : 'top'

      // 不存在 tooptip text 的话直接返回
      if (!text) return

      const offset = this.offset(e.target)

      this.createElement({
        text,
        pos,
        ...offset
      })
    }

    handleMouseOut(e) {
      if (!this.ele) return
      this.removeElement(this.ele)
      this.ele = null
    }

    createElement(params = {}) {
      const { width, height, top, left, pos, text } = params
      this.ele = document.createElement('div')
      this.ele.innerText = text
      this.ele.style.visibility = 'hidden'
      this.ele.style.position = 'absolute'
      document.body.appendChild(this.ele)

      const eleHeight = this.ele.offsetHeight
      const eleWidth = this.ele.offsetWidth

      let x , 
        y,
        inlineStyle = `
        position: absolute;
        color: red;
        z-index: 99999;
      `
      if (pos === 'top') {
        x = left - (eleWidth - width) / 2,
        y = top - eleHeight - 5
      } else if (pos === 'bottom') {
        x = left - (eleWidth - width) / 2
        y = top + height + 5
      } else if (pos === 'left') {
        x = left - eleWidth - 5
        y = top - (eleHeight - height) / 2
      } else if (pos === 'right') {
        x = left + width + 5
        y = top - (eleHeight - height) / 2 
      }

      inlineStyle += `
          top: ${y}px;
          left: ${x}px;
        `
      this.ele.style.cssText = inlineStyle
    }

    removeElement(el) {
      if (el instanceof Element) {
        document.body.removeChild(el)        
      }
    }
  }

  // 初始化
  new Tooltip()
})()
