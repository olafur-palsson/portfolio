
/*

  Copyright Olafur Palsson
  Email:   olafur.palsson2@gmail.com
  GitHUb:  olafur-palsson
  License: MIT

*/

const glMatrix = require('gl-matrix')

import { createWebGLProgram } from './easyWebGL'
import { loadTexture } from './textures'
import GLObject from './GLObject'
import addDragRotation from './dragRotatePlugin'
import { Tetris, TetrisBlock } from './tetris.js'

const vectorAdd = (v1, v2, scalar=1) => {
  let returnArray = []
  v1.forEach((_, i) => {
    returnArray.push(v1[i] + v2[i] * scalar)
  })
  return returnArray
}

let canvas, gl, program
const N_BYTES = Float32Array.BYTES_PER_ELEMENT

let oli_is_sorry = false
let maximum_disrespect = true

const start = async () => {
  canvas = document.getElementById('canvas')
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: false })
  const program = await createWebGLProgram(gl, 'src/vertexShader.glsl', 'src/fragmentShader.glsl')
  const attribs = program.getAttribLocations('vertexPosition', 'vertexColor', 'a_textcoord', 'vertexNormals')
  gl.enable(gl.DEPTH_TEST)

  gl.clearColor(0.05, 0.05, 0.05, 1.0)

  program.addUniformLocation('mWorld',      gl.uniformMatrix4fv, false)
  program.addUniformLocation('mView',       gl.uniformMatrix4fv, false)
  program.addUniformLocation('mProjection', gl.uniformMatrix4fv, false)

  // Create arrays containing the actual matrices
  const mWorld        = new Float32Array(16)
  const mWorldInverse = new Float32Array(16)
  const mView         = new Float32Array(16)
  const mProjection   = new Float32Array(16)

  // Setup the camera matrix
  const positionOfViewer       = [ 0,  20, 15]
  const pointViewerIsLookingAt = [ 0,  0,  0]
  const vectorPointingUp       = [ 0,  5,  0]

  // Set up the world
  glMatrix.mat4.identity(mWorld)
  glMatrix.mat4.lookAt(mView, positionOfViewer, pointViewerIsLookingAt, vectorPointingUp )
  glMatrix.mat4.perspective(mProjection, Math.PI * 0.25, 0.00001 + canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0)

  program.setUniforms({ mView, mWorld, mProjection })

  window.onresize = () => {
    glMatrix.mat4.perspective(mProjection, Math.PI * 0.25, 0.00001 + canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0)
    program.setUniforms({ mProjection })
  }

  // Set up GLObject 
  const u_samplerUniformLocation = gl.getUniformLocation(program.program, 'u_sampler')

  GLObject.setProgramLocations(
    attribs.vertexPosition, 
    attribs.a_textcoord, 
    u_samplerUniformLocation, 
    attribs.vertexNormals
  )
  // Enable click and draw rotation
  const rotate_wrt_time = addDragRotation(mWorld, mWorldInverse)


  // Get some uniform locations from the vertex/fragment shader
  program.addUniformLocation('translation', gl.uniform3fv)
  program.addUniformLocation('orientation', gl.uniformMatrix4fv, false)
  program.addUniformLocation('scalar', gl.uniform1f)
  program.addUniformLocation('ambientScalar', gl.uniform1f)
  program.addUniformLocation('lightPos', gl.uniform3fv)
  program.addUniformLocation('lightColor', gl.uniform3fv)
  program.addUniformLocation('viewDirection', gl.uniform3fv)
  program.addUniformLocation('mWorldInverse', gl.uniformMatrix4fv, false)
  program.addUniformLocation('color', gl.uniform3fv)

  // Set up lighting
  let lightPos = new Float32Array([-10, 0, -10])
  const viewDirection = new Float32Array(3)
  glMatrix.vec3.normalize(viewDirection, positionOfViewer)

  program.setUniforms({ 
    lightColor: new Float32Array([1, 1, 1]), 
    viewDirection,
    lightPos
  })

  const identity = glMatrix.mat4.identity(new Float32Array(9))

  const orientation = new Float32Array(16)

  // Create the objects we will draw
  const sun = await GLObject.create(gl, 'sphere.obj', 'sun.png')
  const block = await GLObject.create(gl, 'block.obj', 'moon.png')

  // Create the data to render the sun
  const sunObj = {
    objectId: -1,
    location: [-50, 0.0, 0.0],
    velocity: [0, 0, 0],
    size: 15,
    swimSeed: 0,
    swimStatus: 0,
  }
  let dblquote = 222
  let q = 81

  let currentAngle = 0

  const initialTime = performance.now()
  let sunPosition = new Float32Array([10, 10, 0])

  const updateSunpos = () => {
    let totalTime = performance.now() - initialTime
    totalTime /= 500
    let x = 300 * Math.cos(totalTime / 5)
    let y = 150 * Math.sin(totalTime / 7) + 150
    let z = 300 * Math.cos(totalTime / 6)
    // add this to cause a solar flare every now and then
    let d = 1 - Math.pow(Math.abs(Math.sin(totalTime / 30)), 10)

    sunPosition = new Float32Array([x * d, y * d, z * d])
    glMatrix.vec3.scale(lightPos, sunPosition, -1)
  }

  const text = document.getElementById('text')
  const setText = txt => {
    text.innerHTML = txt
  }

  const button = document.getElementById('reset')
  const stupidSettings = document.getElementById('stupid')
  const dvorak = document.getElementById('dvorak')


  let height = 15
  let dim = 4

  let useDvorak = false
  let tetris = new Tetris()

  dvorak.onclick = e => {
    useDvorak = e.target.checked
    tetris.bindKeys(0, useDvorak)
  }
  TetrisBlock.program = program
  TetrisBlock.GLObject = block
  tetris.startGame()
  tetris.bindKeys()



  let oli_is_sorry = false
  let maximum_disrespect = true

  const newGame = () => {
    tetris.endGame()
    tetris.setDim(height, dim)
    setTimeout(() => {
      tetris.reset()
      tetris.startGame()
      tetris.bindKeys(0, useDvorak)
    }, 5000)

  }

  let useStupidSettings = false
  // Sets whether we are going to use fun settings or not
  stupidSettings.onclick = e => {
    useStupidSettings = !e.target.checked
    height = useStupidSettings? 19 : 15
    dim = useStupidSettings? 4 : 6
    newGame()
  }

  button.onclick = () => {
    newGame()
  }
  let highscore = 8

  setInterval(() => {
    if (tetris.points > highscore)
      highscore = tetris.points
    setText(`Current level and points: ${tetris.points} 
    Highscore: ${highscore}`)
  }, 50)

  // TODO:
  //  Add simple rotation with only 
  //  Add keybindings
  let i = -10
  let lastTime = performance.now()
  const render = () => {
    // if (i++ > 0) return

    // Get the time between frames
    let currentTime = performance.now()
    let timePassed = currentTime - lastTime
    lastTime = currentTime

    if (tetris.points > 8)
      sorry = true


    // Calculate a one game tick
    let newAngle = rotate_wrt_time(timePassed)
    if (newAngle != currentAngle) tetris.bindKeys(newAngle, useDvorak)
    currentAngle = newAngle
    program.setUniforms({ mView, mWorld, mWorldInverse, ambientScalar: 0.15, scalar: 0.5 })

    // Clear and draw objects
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    tetris.render()

    // Calculate variables for the sun
    updateSunpos()
    glMatrix.mat4.targetTo(orientation, lightPos, vectorAdd(lightPos, [1,0,0]), vectorPointingUp)
    const translation = sunPosition
    const color = new Float32Array([1, 1, 1])
    program.setUniforms({ orientation, translation, scalar: 3, ambientScalar: 1.5, color, lightPos })
    sun.draw()

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

start()
