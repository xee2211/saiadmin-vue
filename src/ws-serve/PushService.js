import Pusher from 'pusher-js'

import { Notification } from '@arco-design/web-vue'
class PushService {
  ws
  timer = null

  interval = 1500

  user_channel = null
  state = null

  constructor() {
    this.ws = new Pusher('2d4271d4d40e6f3571e8aa7ef79ebbcf', {
      cluster: 'mt1',
      wsHost: '127.0.0.1', // websocket地址
      wsPort: '3131',
      encrypted: false,
      disableStats: true,
      forceTLS: true,
      enabledTransports: ['ws']
    })

    this.ws.connection.bind('state_change', (context) => {
      if (context.current !== 'connected') {
        Notification.info({
          title: '通知',
          content: 'ws链接关闭',
          duration: 0,
          closable: true
        })
        console.log('链接关闭')

        this.state = context.current
        this.ws.disconnect()
      }
      console.log('STATE_CHANGE -> ', context) // this keeps changing from connecting to connected, and so on.
    })

    this.user_channel = this.ws.subscribe('user-1')
    console.log('ws连接成功')
  }

  //connecting
  //connecting

  on(channel, callback) {
    this.user_channel.bind('message', (data) => {
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
