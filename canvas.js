// https://codeburst.io/creating-and-drawing-on-an-html5-canvas-using-javascript-93da75f001c1

// https://github.com/CodeDraken/canvas-coords/blob/ae94cf92203f246362a3e4863c1361ae8d6bc482/src/Grid.js#L2

class Rectangle {

    constructor ( x = 0, y = 0, width = 0, height = 0, fillColor = '', strokeColor = '', strokeWidth = 2
      ) {
        // ensure the arguments passed in are numbers
        // a bit overkill for this tutorial
        this.x = Number(x)
        this.y = Number(y)
        this.width = Number(width)
        this.height = Number(height)
        this.fillColor = fillColor
        this.strokeColor = strokeColor
        this.strokeWidth = strokeWidth
      }

      draw (ctx) {
        // destructuring
        const { x, y, width, height, fillColor, strokeColor, strokeWidth } = this
    
        // saves the current styles set elsewhere
        // to avoid overwriting them
        ctx.save()
    
        // set the styles for this shape
        ctx.fillStyle = fillColor
        ctx.lineWidth = strokeWidth
    
        // create the *path*
        ctx.beginPath()
        ctx.strokeStyle = strokeColor
        ctx.rect(x, y, width, height)
    
        // draw the path to screen
        ctx.fill()
        ctx.stroke()
    
        // restores the styles from earlier
        // preventing the colors used here
        // from polluting other drawings
        ctx.restore()
    }
}

class Line {

  constructor (startX, startY, endX, endY, color, lineWidth = 2 ) {
    this.color = color
    this.lineWidth = lineWidth
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
  }

  draw (ctx) {
    const { startX, startY, endX, endY, color, lineWidth } = this
    
    ctx.save()

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()

    ctx.restore()
  }
}

class Text {

  constructor (text, x = 0, y = 0) {
    this.text = String(text)
    this.x = Number(x)
    this.y = Number(y)
  }

  draw (ctx) {
    const { text, x, y } = this

    ctx.save()

    ctx.textBaseline = "bottom";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 14px Arial";
    ctx.fillText(text, x, y);

    ctx.restore()
  }
}

class BarChart {

  constructor(data) {
    this.draw = this.draw.bind(this);
    this.data = data
    this.gridScale = 5
    this.gridColor = "#eeeeee"
    this.distanceBars = 50
    this.padding = {
      top: 50,
      bottom: 25,
      left: 25,
      right: 25
    }
  }

  draw () {
    requestAnimationFrame(this.draw)

    const { data, gridScale, gridColor, distanceBars, padding } = this
    
    canvas.height = document.body.clientHeight
    canvas.width  = document.body.clientWidth

    const canvasActualHeight = canvas.height - padding.top - padding.bottom
    const canvasActualWidth = canvas.width - padding.left - padding.right

    let maxValue = 0;
    for (const index in data){
      maxValue = Math.max(maxValue, data[index].value);
    }

    //drawing the grid lines
    let gridValue = 0;
    while (gridValue <= maxValue){
      var gridY = canvasActualHeight * (1 - gridValue / maxValue) + padding.top;
      const line = new Line(0, gridY, canvas.width, gridY, gridColor)
      line.draw(context)
      gridValue += gridScale;
    }

    //drawing the bars
    let barIndex = 0
    const numberOfBars = Object.keys(data).length
    const barSize = canvasActualWidth / numberOfBars

    for (const index in data){
      const value = data[index].value
      const barHeight = Math.round( canvasActualHeight * value / maxValue)
      
      const xBar = padding.left + barIndex * barSize
      const yBar = canvas.height - barHeight - padding.bottom

      const bar = new Rectangle(xBar, yBar, barSize - distanceBars, barHeight, data[index].color)
      bar.draw(context)

      const xText = barIndex * barSize + (barSize / 2)
      const yText = canvas.height - barHeight - padding.bottom + barHeight

      const text = new Text(data[index].name, xText, yText);
      text.draw(context)

      barIndex++;
    }
  }
}

let myData = [
  {
    name: "good",
    value: 7,
    color: "#00ff00"
  },
  {
    name: "bad",
    value: 3,
    color: "#ff0000"
  },
  {
    name: "unchecked",
    value: 17,
    color: "#f7f7f7"
  }
  ,
  {
    name: "total",
    value: 27,
    color: "white"
  }
]

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

const chart = new BarChart(myData)
chart.draw();