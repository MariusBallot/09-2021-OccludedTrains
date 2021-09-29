import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

class Exits {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader()
    this.texLoader = new THREE.TextureLoader()
    this.wallGroup = new THREE.Group()
    this.rightWalls = new THREE.Group()
  }

  init(scene, params) {
    this.scene = scene
    this.params = params
    this.scene.add(this.wallGroup, this.rightWalls)

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
    this.wallGroup.clear()
    for (let x = 0; x < this.params.xCount; x++) {
      for (let y = 0; y < this.params.yCount; y++) {
        const c = this.originGroup.clone()
        const size = 2
        const xpos = x * (size + this.params.margin) - (size + this.params.margin) * (this.params.xCount - 1) / 2
        const ypos = y * (size + this.params.margin) - (size + this.params.margin) * (this.params.yCount - 1) / 2
        c.position.set(0, ypos, xpos)
        this.wallGroup.add(c)
      }
    }

    this.scene.remove(this.rightWalls)
    this.rightWalls = this.wallGroup.clone()
    this.wallGroup.position.x = -this.params.space
    this.rightWalls.scale.x = -1
    this.rightWalls.position.x = this.params.space
    this.scene.add(this.rightWalls)
  }

  guiUpdate() {
    this.generateWalls()
  }

  bind() {

  }
}

const _instance = new Exits()
export default _instance