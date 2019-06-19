
/*

  Copyright Olafur Palsson
  Email:   olafur.palsson2@gmail.com
  GitHUb:  olafur-palsson
  License: MIT

*/

import { loadTexture } from './textures.js'

const ObjectLoader = require('webgl-obj-loader')

const getFileFromURL = async url => {
  return new Promise((resolve, reject) => {
    var req = new XMLHttpRequest();
    req.onload = () =>  {
      resolve(req.responseText)
    }
    req.open("GET", url);
    req.onerror = () => {
      reject(url + " did not load bro")
    }
    req.send();
  })
}

const getObject = async (gl, url) => {
  const objectData = await getFileFromURL(url)  
  const object = new ObjectLoader.Mesh(objectData)
  return object
}

// Simple command to create buffers
// 'object' contains the data for the buffers
const createBuffers = (gl, object) => {
  const vertexBuffer  = gl.createBuffer()
  const indexBuffer   = gl.createBuffer()
  const textureBuffer = gl.createBuffer()
  const normalBuffer  = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.textures), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertexNormals), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW)
  
  return {
    textureBuffer,
    normalBuffer,
    vertexBuffer,
    indexBuffer
  }
}

const N_BYTES = Float32Array.BYTES_PER_ELEMENT

export default class GLObject {

  constructor () {
    this.draw = this.draw.bind(this)
  }

  static async create(gl, objectUrl, textureUrl) {
    const object = new GLObject()
    object.mesh = await getObject(gl, objectUrl)
    object.buffers = createBuffers(gl, object.mesh)
    object.texture = loadTexture(gl, textureUrl)
    object.gl = gl
    object.numItems = object.mesh.indices.length
    return object
  }

  // Set static variables for all objects
  static setProgramLocations(
    vertexPositionAttribLocation, 
    textCoordAttribLocation, 
    u_samplerUniformLocation,
    normAttribLocation
  ) {
    GLObject.posAttrLoc = vertexPositionAttribLocation
    GLObject.textcoordAttrLoc = textCoordAttribLocation
    GLObject.u_samplerUnifLoc = u_samplerUniformLocation 
    GLObject.normAttrLoc = normAttribLocation
  }

  // Draws out the object on the center of the world
  // Use translation in shader to draw in a different place
  draw () {
    // Index buffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indexBuffer)

    // Vertex position buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertexBuffer)
    this.gl.vertexAttribPointer(GLObject.posAttrLoc, 3, this.gl.FLOAT, false, 3 * N_BYTES, 0)
    this.gl.enableVertexAttribArray(GLObject.posAttrLoc)

    // Texture coordinates buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.textureBuffer)
    this.gl.vertexAttribPointer(GLObject.textcoordAttrLoc, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(GLObject.textcoordAttrLoc)

    // Vertex normals buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normalBuffer)
    this.gl.vertexAttribPointer(GLObject.normAttrLoc, 3, this.gl.FLOAT, false, 3 * N_BYTES, 0)
    this.gl.enableVertexAttribArray(GLObject.normAttrLoc)

    // Set active texture and bind it
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    this.gl.uniform1i(GLObject.u_samplerUniformLocation, 0)

    this.gl.drawElements(this.gl.TRIANGLES, this.numItems, this.gl.UNSIGNED_SHORT, 0)
  }
}


