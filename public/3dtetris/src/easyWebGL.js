
/*

  Copyright Olafur Palsson
  Email:   olafur.palsson2@gmail.com
  GitHUb:  olafur-palsson
  License: MIT

*/

const glMatrix = require('gl-matrix')

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

class EasyWebGL {

  constructor () {
    this.setUniforms = this.setUniforms.bind(this)
  }

  async init (webglContext, vertexShaderUrl, fragmentShaderUrl) {
    this.gl = webglContext
    this.vtxShaderText = await getFileFromURL(vertexShaderUrl)
    this.frgShaderText = await getFileFromURL(fragmentShaderUrl)
    this.shaderLoc = {}
    await this.initProgram()
    this.gl.useProgram(this.program)
  }

  getAttribLocations(...arrayOfAttribNames) {
    let attribs = {}
    arrayOfAttribNames.forEach(
      name => attribs[name] = this.gl.getAttribLocation(this.program, name)
    )
    return attribs
  }

  addUniformLocation(name, setter, thirdArg) {
    const location = this.gl.getUniformLocation(this.program, name)
    setter = setter.bind(this.gl)
    let createSetter = () => {
      if (typeof thirdArg != "undefined") {
        return value => {
          setter(location, thirdArg, value) 
        }
      }
      else
        return value => {
          setter(location, value)
        }
    }

    this.shaderLoc[name] = {
      location,
      setter: createSetter()
    }
  }

  getUniformLocations () {
    uniforms = {}
    for (let key in this.shaderLoc) 
      uniforms[key] = this.shaderLoc[key].location
    return uniforms
  }

  setUniforms (objectOfVars) {
    for (let key in objectOfVars) {
      this.shaderLoc[key].setter(objectOfVars[key])
    }
  }

  // This is how you get the compile errors of a shader displayed in console
  verifyShaderCompilation (gl, shader) {
    const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if ( !ok )
    throw "ShaderCompileError: \n" + gl.getShaderInfoLog(shader)
  }

  // This is how you get the linking errors of the program displayed in console
  verifyProgramLinking (gl, program) {
    const ok = gl.getProgramParameter(program, gl.LINK_STATUS)
    if ( !ok )
    throw "ProgramLinkingError: \n" + gl.getProgramInfoLog(program)
  }

  initProgram () {

    // Set the background or null color and clear
    this.gl.clearColor(0, 0, 0, 1)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    // Create shader
    this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
    this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)

    // Set the source code for the shader
    this.gl.shaderSource(this.vertexShader, this.vtxShaderText)
    this.gl.shaderSource(this.fragmentShader, this.frgShaderText)

    // Compile
    this.gl.compileShader(this.vertexShader)
    this.gl.compileShader(this.fragmentShader)

    // Get shader compile errors displayed in console
    this.verifyShaderCompilation(this.gl, this.vertexShader)
    this.verifyShaderCompilation(this.gl, this.fragmentShader)

    // Create and link the program
    this.program = this.gl.createProgram()
    this.gl.attachShader(this.program, this.vertexShader)
    this.gl.attachShader(this.program, this.fragmentShader)
    this.gl.linkProgram(this.program)

    // Get linking errors
    this.verifyProgramLinking(this.gl, this.program)
    return this.program
  }

  setupUniformMatrices (aspectRatio, positionOfViewer, pointViewerIsLookingAt, vectorPointingUp) {
    const mWorld = new Float32Array(16);
    const mView = new Float32Array(16);
    const mProj = new Float32Array(16);

    const {
      matWorldUniformLocation,
      matViewUniformLocation,
      matProjUniformLaction
    } = this.getUniformLocations()

    glMatrix.mat4.identity(mWorld)
    glMatrix.mat4.lookAt(mView, positionOfViewer,  pointViewerIsLookingAt, vectorPointingUp)
    glMatrix.mat4.perspective(mProj, Math.PI * 0.25, aspectRatio, 0.1, 1000.0)

    this.gl.uniformMatrix4fv(matViewUniformLocation, this.gl.FALSE, mView)
    this.gl.uniformMatrix4fv(matWorldUniformLocation, this.gl.FALSE, mWorld)
    this.gl.uniformMatrix4fv(matProjUniformLaction, this.gl.FALSE, mProj)

    return { mWorld, mView, mProj }
  }
}

let createWebGLProgram = async (webglContext, vertexShaderUrl, fragmentShaderUrl) => {
  let obj = new EasyWebGL()
  await obj.init(webglContext, vertexShaderUrl, fragmentShaderUrl)
  return obj
}

export {
  createWebGLProgram
}

