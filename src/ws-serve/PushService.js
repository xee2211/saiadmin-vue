import Pusher from 'pusher-js'
import tool from '@/utils/tool'

import { Notification } from '@arco-design/web-vue'
class PushService {
  ws
  timer = null
  interval = 1500
  user_channel = null
  state = null

  constructor() {
    let config = tool.local.get('baseConfig')

    this.ws = new Pusher('2d4271d4d40e6f3571e8aa7ef79ebbcf', {
      cluster: 'mt1',
      wsHost: config.wsHost, // websocket地址
      wsPort: config.wsPort,
      encrypted: false,
      disableStats: true,
      forceTLS: config.ws_forceTLS,
      enabledTransports: ['ws', 'wss']
    })

    this.ws.connection.bind('state_change', (context) => {
      if (context.current !== 'connected') {
        Notification.info({
          title: '通知',
          content: 'ws链接关闭' + context.current,
          duration: 0,
          closable: true
        })
        console.log('链接关闭')

        this.state = context.current
        this.ws.disconnect()
      }
      //console.log('STATE_CHANGE -> ', context) // this keeps changing from connecting to connected, and so on.
    })

    this.user_channel = this.ws.subscribe('user-1')
    console.log('ws连接成功')
  }

  on(channel, callback) {
    //console.log(this.user_channel)
    this.user_channel.bind('message', (data) => {
      //console.log(data)
      callback(data)
    })
  }

  getMessage() {
    // this.timer = setInterval(() => {
    // 	this.pusher.send({ event: 'get_unread_message' })
    // }, this.interval)
  }
}

export default PushService
