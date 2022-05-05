import { BrowserRouter } from 'react-router-dom'
import zhCN from 'antd/lib/locale/zh_CN'
import { ConfigProvider, message } from '@osui/ui'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'

import { CONTAINER_DOM_ID } from '../constant'
import { getContainerDOM } from '../utils'

import store from '../store'
import RouterByUseRoutes from './RouterByUseRoutes'

const App: React.FC = () => {
  useEffect(() => {
    message.config({
      getContainer: getContainerDOM
    })
    return () => {
      message.destroy()
    }
  }, [])
  return (
        <Provider store={store}>
            <ConfigProvider
                getPopupContainer={() => {
                  const node = getContainerDOM()
                  if (node != null) {
                    return node
                  }
                  return document.body
                }}
                locale={zhCN}
            >
                <div
                    data-theme='osui'
                    id={CONTAINER_DOM_ID}
                    className='osc-noah'
                    style={{ height: '100%', maxHeight: '100vh', overflow: 'auto' }}
                >
                    <BrowserRouter>
                        <RouterByUseRoutes/>
                    </BrowserRouter>
                </div>
            </ConfigProvider>
        </Provider>
  )
}

export default App
