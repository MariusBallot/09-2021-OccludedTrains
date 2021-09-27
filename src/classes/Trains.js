import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import trainFrag from '../shaders/train.frag'
import trainVert from '../shaders/train.vert'

class Trains {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader()
    this.texLoader = new THREE.TextureLoader()
  }

  init(scene, params) {
    this.scene = scene
    this.params = params
    this.trainGroup = new THREE.Group()
    this.speeds = []
    this.sizes = []


    const box = new THREE.BoxGeometry(1, 1.8, 1.8, 50)
    this.originMesh

    this.matCap = this.texLoader.load("/assets/webGL/textures/metalMatCap.png")

    this.modelLoader.load('/assets/webGL/train.glb', (glb) => {
      glb.scene.traverse(child => {
        if (child instanceof THREE.Mesh) {
          this.originMesh = child
        }
      })
      this.generateTrains()
    })


  }

  generateTrains() {
    for (let x = 0; x <= this.params.exits.xCount; x++) {
      for (let y = 0; y <= this.params.exits.yCount; y++) {

        const size = 2
        const xpos = -15 - Math.random() * 10
        const zpos = x * (size + this.params.exits.margin) - (size + this.params.exits.margin) * this.params.exits.xCount / 2
        const ypos = y * (size + this.params.exits.margin) - (size + this.params.exits.margin) * this.params.exits.yCount / 2
        const xsize = Math.random() * 5 + 1
        const xspeed = Math.random() * 0.5 + 0.01
        this.sizes.push(xsize)
        this.speeds.push(xspeed)


        const c = new THREE.Mesh(this.originMesh.geometry.clone(), new THREE.ShaderMaterial({
          vertexShader: trainVert,
          fragmentShader: trainFrag,
          uniforms: {
            uTime: {
              value: 0,
            },
            uPos: {
              value: xpos,
            },
            uSize: {
              value: xsize,
            },
            uSpeed: {
              value: xspeed,
            },
            uSpace: {
              value: this.params.exits.space,
            },
            uMatCap: {
              value: this.matCap,
            },
          }
        }))
        c.renderOrder = 1

        c.scale.set(xsize, 0.9, 0.9)
        c.position.set(xpos, ypos, zpos)


        this.trainGroup.add(c)
      }
    }

    this.scene.add(this.trainGroup)
  }

  update() {

    let i = 0;
    while (i < this.trainGroup.children.length) {
      const c = this.trainGroup.children[i]
      c.translateX(this.speeds[i])
      if (c.position.x >= this.params.exits.space + this.sizes[i]) {
        c.position.x = -this.params.exits.space - this.sizes[i]
      }

      c.material.uniforms.uTime.value += 1
      c.material.uniforms.uPos.value = c.position.x
      i++
    }

  }

  bind() {

  }
}

const _instance = new Trains()
export default _instance