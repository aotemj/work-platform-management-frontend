import React from 'react'
import ReactDOM, { render } from 'react-dom'
import singleSpaReact from 'single-spa-react'

import App from './routes/App'
// ⻚⾯挂载点, 写死是这个id
const rootElementId = 'spa-mount-point'

// 获取挂载元素的⽅法
function domElementGetter (): HTMLElement {
// 组件挂载饿根结点
  let el = document.getElementById(rootElementId)
  if (el == null) {
    el = document.createElement('div')
    el.id = rootElementId
    document.body.appendChild(el)
  }
  return el
}

function renderDOM (): void {
  render(<App />, domElementGetter())
}

// 通过⼯具库辅助⽣成的spa⽣命周期
const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  domElementGetter,
  errorBoundary () {
    // 错误出来函数
    return (
      <div>This
        renders
        when
        a
        catastrophic
        error
        occurs
      </div>
    )
  }
})
// 在没有spa环境的环境下渲染DOM
if (window.singleSpaNavigate === null) {
  renderDOM()
  // store.subscribe(renderDOM);
}
// 暴露spa⽣命周期
export const { bootstrap, mount, unmount } = reactLifecycles
export default reactLifecycles
