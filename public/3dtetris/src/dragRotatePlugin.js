const glMatrix = require('gl-matrix')

let state = {
  clickX: 0.1,
  clickY: 0.1,
  x0: 0.1,
  y0: 0,
  x: 0,
  y: 0,
  axis: [0, 1, 0],
  radPerSec: 0,
  nextSpeed: 0,
  lastTime: performance.now(),
  staticMWorld: false,
  slowFactor: 1,
  currentAngle: 0,
  destiny: 0,
  oldDestiny: 0
}

let wait = false
setInterval(() => {
  wait = false
}, 20)

const addDragRotation = (mWorld, inverse) => {

  const oldMWorld = new Float32Array(16)
  const rotationMatrix = new Float32Array(16)
  const identityMatrix = glMatrix.mat4.identity(new Float32Array(16))

  canvas.onmousedown = e => {
    state.staticMWorld = true
    state.currentAngle = state.oldDestiny
    glMatrix.mat4.mul(oldMWorld, identityMatrix, identityMatrix)
    state.x = e.offsetX
    state.x0 = e.offsetX

    canvas.onmousemove = e => {
      state.x = e.offsetX
    }
  }

  document.onmouseup = e => {
    canvas.onmousemove = null
    state.slowFactor = 1
    state.radPerSec = state.nextSpeed
    state.staticMWorld = false
    state.oldDestiny = state.destiny
  }

  const rotate = timePassed => {
    let angle = timePassed / 20 * Math.PI
    if (state.staticMWorld) {
      state.destiny = state.oldDestiny + parseInt((state.x - state.x0) / 160)
      console.log(state.destiny)
      const offsetFromIdeal = state.destiny - state.currentAngle
      let shift = timePassed * Math.sign(offsetFromIdeal) / 100
      shift = Math.abs(offsetFromIdeal) < Math.abs(shift) ? offsetFromIdeal : shift

      state.currentAngle += shift
      glMatrix.mat4.rotate(rotationMatrix, identityMatrix, state.currentAngle * 0.5 * Math.PI, [0, 1, 0])
      glMatrix.mat4.mul(mWorld, rotationMatrix, oldMWorld)
    } else {
      state.slowFactor = Math.min(state.slowFactor / 1.002, state.slowFactor - 0.001 < 0 ? 0 : state.slowFactor - 0.001)
      const angularSpeed = angle / 17 * state.radPerSec * state.slowFactor
      glMatrix.mat4.rotate(rotationMatrix, identityMatrix, angularSpeed, state.axis)
      glMatrix.mat4.mul(mWorld, rotationMatrix, mWorld)
      glMatrix.mat4.invert(inverse, mWorld)
    }
    return state.destiny
  }

  return rotate
}

export default addDragRotation
