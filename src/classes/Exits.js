import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

class Exits {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader()
    this.texLoader = new THREE.TextureLoader()
  }

  init(scene, params) {
    this.scene = scene
    this.params = params.exits
    this.originGroup

    this.matCap = this.texLoader.load('assets/webGL/textures/blackMetalMatCap.png')

    this.modelLoader.load('/assets/webGL/exit.glb', (glb) => {
      glb.scene.traverse(child => {
        if (child.name == "exit") {
          this.originGroup = child
        }
      })

      this.originGroup.material = new THREE.MeshBasicMaterial()
      this.originGroup.renderOrder = 1
      this.originGroup.material.colorWrite = false

      this.originGroup.children[0].material = new THREE.MeshMatcapMaterial({
        matcap: this.matCap
      })
      this.originGroup.renderOrder = 0
      this.generateWalls()
    })
  }

  generateWalls() {
    this.wallGroup = new THREE.Group()
    for (let x = 0; x <= this.params.xCount; x++) {
      for (let y = 0; y <= this.params.yCount; y++) {
        const c = this.originGroup.clone()
        const size = 2
        const xpos = x * (size + this.params.margin) - (size + this.params.margin) * this.params.xCount / 2
        const ypos = y * (size + this.params.margin) - (size + this.params.margin) * this.params.yCount / 2
        c.position.set(0, ypos, xpos)
        this.wallGroup.add(c)
      }
    }
    const rightWalls = this.wallGroup.clone()
    this.wallGroup.position.x = -this.params.space
    rightWalls.scale.x = -1
    rightWalls.position.x = this.params.space
    this.scene.add(this.wallGroup, rightWalls)
  }

  update() {

  }

  bind() {

  }
}

const _instance = new Exits()
export default _instance