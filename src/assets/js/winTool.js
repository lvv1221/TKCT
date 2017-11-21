const gui = require('nw.gui')
const win = gui.Window.get()
win.showDevTools() // 打开调试口
export default {
  win: win
}
