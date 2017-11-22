const gui = require('nw.gui')
const win = gui.Window.get()
win.setAlwaysOnTop(true)
if (gui.App.manifest.debug) {
  win.showDevTools() // 打开调试口
}
export default {
  win: win
}
