
const glMatrix = require('gl-matrix')

const vectorAdd = (v1, v2, scalar=1) => {
  let returnArray = []
  v1.forEach((_, i) => {
    returnArray.push(v1[i] + v2[i] * scalar)
  })
  return returnArray
}


// Creates a single square block
class TetrisBlock {
  // Color is a essentially a filter for the texture should be a 3-float vector of values in [0.0; 1.0]
  // Position should be a 3-int vector of [0, 5], [0, 20], [0, 5]
  //
  // Requires: 
  //  EasyWebGL as a static variable
  //  GLObject as static variable
  constructor (color) {
    this.color = color
    this.shouldDraw = true
  }

  draw (translation) {
    const color = new Float32Array(this.color)
    // TetrisBlock.program.setUniforms(translation, color)
    TetrisBlock.program.setUniforms({ translation, color })
    if (this.shouldDraw) {
      TetrisBlock.GLObject.draw()
    }
  }
}

let uparrow = 38
let lfarrow = 37
let rgarrow = 39
let dnarrow = 40

let space = 32
let comma = 188
let semic = 59
let dot = 190
let a = 65
let o = 79
let e = 69
let q = 81
let j = 74
let h = 72
let t = 84
let n = 78
let s = 83
let u = 85
let w = 87
let r = 82
let y = 89
let d = 68

// TODO:
//  *Out of bounds function
//  *Move left
//  *Move right
//  *Move front
//  *Move back
//  *Layer is full
//  *Points
//  *Restart
//  *Speed up
//  *Rotate

let dimensions = 4
let height = 15

class Tetris {

  init() {
    // Initialize the game array with false
    // this array will be populated with GLObjects to render
    // layer = y, row = z, col = x as per normal webgl coordinates
    this.blocks = new Array(height + 2).fill(false).map(layer => 
      new Array(dimensions).fill(false).map(row =>
        new Array(dimensions).fill(false)
      )
    )
    this.render = this.render.bind(this)
    this.endGame = this.endGame.bind(this)
    this.startGame = this.startGame.bind(this)
    this.bindKeys = this.bindKeys.bind(this)
    this.identity = new Float32Array(16)
    this.rotationMatrix = new Float32Array(16)
    glMatrix.mat4.identity(this.identity)
    this.points = 0
    this.gameEnded = false
    this.reset = this.reset.bind(this)
  }


  constructor () {
    this.init()
  }

  bindKeys (currentAngle=0, useDvorak=false) {
    let moveActions = [
      () => this.moveRow(-1),
      () => this.moveCol( 1),
      () => this.moveRow( 1),
      () => this.moveCol(-1)
    ]

    let rotateActions = [
      () => this.rotateX(-0.5),
      () => this.rotateZ(-0.5),
      () => this.rotateX(+0.5),
      () => this.rotateZ(+0.5)
    ]

    currentAngle = currentAngle + 1600

    if (useDvorak)
      document.onkeydown = kbdEvent => {
        let preventDefault = true
        switch(kbdEvent.which) {
          case uparrow: moveActions[(currentAngle + 0) % 4]();   break;
          case dnarrow: moveActions[(currentAngle + 2) % 4]();   break;
          case rgarrow: moveActions[(currentAngle + 1) % 4]();   break;
          case lfarrow: moveActions[(currentAngle + 3) % 4]();   break;
          case space  : this.drop();        break;
          case comma  : rotateActions[(currentAngle + 0) % 4]();   break;
          case o      : rotateActions[(currentAngle + 2) % 4]();   break;
          case semic  : this.rotateY(+0.5); break;
          case dot    : this.rotateY(-0.5); break;
          case a      : rotateActions[(currentAngle + 3) % 4]();   break;
          case e      : rotateActions[(currentAngle + 1) % 4]();   break;
          default: preventDefault = false
        }
        if (preventDefault)
          kbdEvent.preventDefault()
      }
    else
      document.onkeydown = kbdEvent => {
        let preventDefault = true
        switch(kbdEvent.which) {
          case uparrow: moveActions[(currentAngle + 0) % 4]();   break;
          case dnarrow: moveActions[(currentAngle + 2) % 4]();   break;
          case rgarrow: moveActions[(currentAngle + 1) % 4]();   break;
          case lfarrow: moveActions[(currentAngle + 3) % 4]();   break;
          case space  : this.drop();        break;
          case w      : rotateActions[(currentAngle + 0) % 4]();   break;
          case s      : rotateActions[(currentAngle + 2) % 4]();   break;
          case q      : this.rotateY(+0.5); break;
          case e      : this.rotateY(-0.5); break;
          case a      : rotateActions[(currentAngle + 3) % 4]();   break;
          case d      : rotateActions[(currentAngle + 1) % 4]();   break;
          default: preventDefault = false
        }
        if (preventDefault)
          kbdEvent.preventDefault()
      }
 
  }

  forAll (doThis) {
    this.blocks.forEach(layer => {
      layer.forEach(row => {
        row.forEach(block => {
          if (block)
            doThis(block)
        })
      })
    })
  }

  setDim (h, dim0) {
    dimensions = dim0
    height = h
  }

  endGame () {
    console.log('You suck  lost bruuuuuuuh!')
    console.log(this.gameEnded)
    this.gameEnded = true
    this.currentBlockPositions = null
    let out = -5
    window.clearInterval(this.clockTick)

    const interval = setInterval(() => {
      if (out++ >= 0)
        window.clearInterval(interval)
      this.blink(this.blocks)
    }, 500)
  }

  canMove (desiredPositions) {
    const currentBlocks = this.getCurrentBlocks()
    let isPossible = true
    let outOfBounds = false

    desiredPositions.forEach(position => {
      const [x, y, z] = position
      if (x >= dimensions || x < 0 || y < 0 || z >= dimensions || z < 0) {
        // console.log("BLOCKED -- OUT OF BOUNDS")
        outOfBounds = true
      } else if (this.blocks[y][z][x]) {
        let isBlocked = true
        const blockingBlock = this.blocks[y][z][x]
        currentBlocks.forEach(block => { 
          if (block == blockingBlock)
            isBlocked = false
        })
        isPossible = isPossible && !isBlocked
      }
    }) 
    // console.log(desiredPositions[0], desiredPositions[1], desiredPositions[2], isPossible, !outOfBounds)
    return isPossible && !outOfBounds
  }

  currentPosPlusVector (vector) {
    return this.currentBlockPositions.map(position => vectorAdd(position, vector))
  }

  tryMove (nextPosition) {
    if (!this.canMove(nextPosition)) return false
    const blocksToMove = this.getCurrentBlocks(true)
    nextPosition.forEach((position, i) => {
      const [x, y, z] = position
      this.blocks[y][z][x] = blocksToMove[i]
    })
    this.currentBlockPositions = nextPosition
    return true
  }

  moveCol (n) {
    const vec = [n, 0, 0]
    this.tryMove(this.currentPosPlusVector(vec))
  }

  moveRow (n) {
    const vec = [0, 0, n]
    this.tryMove(this.currentPosPlusVector(vec))
  }

  drop () {
    const vec = [0, -1, 0]
    while (this.tryMove(this.currentPosPlusVector(vec)));
    this.blockFinished()
  }

  integerRotation (rotationMatrix) {
    const positions = this.currentBlockPositions.map(pos => {
      const position = pos.slice()
      position.push(0)
      return position
    })
    const center = positions[0]
    let translated = []
    positions.forEach(pos => translated.push(new Float32Array(vectorAdd(pos, center, -1))))
    translated.forEach(pos => glMatrix.mat4.mul(pos, rotationMatrix, pos))
    const unTranslated = translated.map(pos => vectorAdd(pos, center))
    const integerArray = unTranslated.map(pos => pos.map(fl => parseInt(Math.round(fl))).slice(0, 3))
    return integerArray
  }

  rotateX (piRads) {
    glMatrix.mat4.rotateX(this.rotationMatrix, this.identity, Math.PI * piRads)
    const nextPosition = this.integerRotation(this.rotationMatrix)
    this.tryMove(nextPosition)
  }

  rotateY (piRads) {
    glMatrix.mat4.rotateY(this.rotationMatrix, this.identity, Math.PI * piRads)
    const nextPosition = this.integerRotation(this.rotationMatrix)
    this.tryMove(nextPosition)
  }

  rotateZ (piRads) {
    glMatrix.mat4.rotateZ(this.rotationMatrix, this.identity, Math.PI * piRads)
    const nextPosition = this.integerRotation(this.rotationMatrix)
    this.tryMove(nextPosition)
  }

  pushLayer () {
    this.blocks.push(new Array(dimensions).fill(false).map(el => new Array(dimensions).fill(false)))
  }

  getLayersThatAreFull () {
    const fullLayers = []
    this.blocks.forEach((layer, i) => {
      let isFull = layer.reduce((bool, row) => bool && 
        row.reduce((a,b) => a && b, true), 
        true)
      if (isFull) fullLayers.push(layer)
    })
    return fullLayers
  }

  blink (layers) {
    layers.forEach(layer => {
      layer.forEach(row => {
        row.forEach(block => {
          if (block) block.shouldDraw = !block.shouldDraw
        })
      })
    })
  }

  checkIfLayerIsFull () {
    return new Promise(resolve => {
      if (this.gameEnded) 
        return resolve(null)
      let blinks = 4
      const fullLayers = this.getLayersThatAreFull()
      if (fullLayers.length == 0) 
        return resolve(null)

      const fn = () => {
        if (blinks-- < 0) {
          while (fullLayers.length) {
            let layer = fullLayers.pop()
            for (let i = 0; i < this.blocks.length; i++)
              if (layer == this.blocks[i]) {
                this.blocks.splice(i, 1)
                this.pushLayer()
              }
            this.points++
          }
          resolve(null)
        } 
        else
          this.blink(fullLayers)
      }
      let interval = setInterval(fn, 200)
    })
  }

  moveDown () {
    if (this.gameEnded) return
    const vec = [0, -1, 0]
    if (!this.tryMove(this.currentPosPlusVector(vec))) {
      this.blockFinished()
      return false
    }
    return true
  }

  reset () {
    this.init()
  }

  pause () {
    console.log(this.clockTick)
    window.clearInterval(this.clockTick)
  }

  resume () {
    if (this.gameEnded) return
    let interval = setInterval(() => {
      this.moveDown()
    }, 5000 / (10 + Math.pow(this.points, 1.2)))
    this.clockTick = interval
  }

  startGame () {
    this.createBlock()
    this.resume()
  }

  async blockFinished () {
    console.log('Block fininshed')
    this.pause()
    await this.checkIfLayerIsFull()
    this.createBlock()
    this.resume()
  }

  createBlock () {
    let n = parseInt(dimensions / 2)
    if (this.blocks[height][n][n] || this.blocks[height][n][n-1]) {
      window.clearInterval(this.clockTick)
      this.endGame()
    }
    const rand = parseInt(Math.random() * 3) + n - 1
    const x = rand
    const isStraight = x == n
    const z = isStraight ? n + 1 : n

    let color = [Math.random(), Math.random(), Math.random()];

    const blockPositions = [[n, height, n], [n, height, n - 1], [x, height, z]]
    this.currentBlockPositions = blockPositions  
    if (!this.canMove(blockPositions)) {
      console.log("Game ended")
      this.endGame()
    }
    else 
      blockPositions.forEach(position => {
        const [x, y, z] = position
        this.blocks[y][z][x] = new TetrisBlock(color)
      })
  }

  render () {
    this.blocks.forEach((layer, y) => {
      layer.forEach((row, z)=> {
        row.forEach((block, x) => {
          if (block)
            block.draw(new Float32Array([x - dimensions / 2, y - height / 2, z - dimensions / 2]))
        })
      })
    })
  }

  getCurrentBlocks (pop=false) {
    return this.currentBlockPositions.map(pos => {
      let [x, y, z] = pos
      const block = this.blocks[y][z][x]
      if (pop) 
        this.blocks[y][z][x] = false
      return block
    })
  }
}

export {
  Tetris,
  TetrisBlock
}
