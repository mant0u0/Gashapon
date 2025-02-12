class ArrowPointer {
  constructor() {
    this.root = document.body
    this.cursor = document.querySelector(".curzr")
    this.position = {
      pointerX: 0,
      pointerY: 0,
    }
    this.cursorSize = 20 // 在這裡可以設定固定旋轉角度（度數）
    this.rotationAngle = -45  // 您可以修改這個值來改變旋轉角度

    this.cursorStyle = {
      boxSizing: 'border-box',
      position: 'fixed',
      top: `${-this.cursorSize / 2}px`,
      left: `${-this.cursorSize / 2}px`,
      zIndex: '2147483647',
      width: `${this.cursorSize}px`,
      height: `${this.cursorSize}px`,
      transition: '100ms',
      userSelect: 'none',
      pointerEvents: 'none'
    }
    this.init(this.cursor, this.cursorStyle)
  }

  init(el, style) {
    Object.assign(el.style, style)
    this.cursor.removeAttribute("hidden")
    document.body.style.cursor = 'none'
    document.body.querySelectorAll("button, label, input, textarea, select, a").forEach((el) => {
      el.style.cursor = 'inherit'
    })
  }

  move(event) {
    this.position.pointerX = event.pageX + this.root.getBoundingClientRect().x
    this.position.pointerY = event.pageY + this.root.getBoundingClientRect().y
    this.cursor.style.transform = `translate3d(${this.position.pointerX}px, ${this.position.pointerY}px, 0) rotate(${this.rotationAngle}deg)`
  }

  // 新增方法：動態調整旋轉角度
  setRotation(angle) {
    this.rotationAngle = angle
  }

  remove() {
    this.cursor.remove()
  }
}

(() => {
  const cursor = new ArrowPointer()
  if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.onmousemove = function (event) {
      cursor.move(event)
    }
  } else {
    cursor.remove()
  }
})()