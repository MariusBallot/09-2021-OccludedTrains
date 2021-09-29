import * as THREE from "three"

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CamParallax from './CamParallax'

import RAF from '../utils/RAF'
import config from '../utils/config'
import MyGUI from '../utils/MyGUI'

import Exits from './Exits'
import Trains from './Trains'

class MainThreeScene {
    constructor() {
        this.bind()
        this.camera
        this.scene
        this.renderer
        this.controls
    }

    init(container) {
        //RENDERER SETUP
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.debug.checkShaderErrors = true
        container.appendChild(this.renderer.domElement)

        //MAIN SCENE INSTANCE
        this.scene = new THREE.Scene()

        //CAMERA AND ORBIT CONTROLLER
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.set(0, 0, 70)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = false
        this.controls.maxDistance = 1500
        this.controls.minDistance = 0

        CamParallax.init(this.camera)


        const params = {
            xCount: 5,
            yCount: 5,
            margin: 0.2,
            space: 15,
            speed: 1,
        }

        Exits.init(this.scene, params)
        Trains.init(this.scene, params)


        MyGUI.add(params, "speed", 0, 5).step(0.01).onChange(() => {
            Trains.speedFactor = params.speed
        })

        MyGUI.add(params, "space", 3, 20).step(0.01).onChange(() => {
            Exits.guiUpdate()
            Trains.guiUpdate()
        })

        MyGUI.add(params, "margin", 0.001, 4).step(0.01).onChange(() => {
            Exits.guiUpdate()
            Trains.guiUpdate()
        })
        MyGUI.add(params, "xCount", 1, 20).step(1).onChange(() => {
            Exits.guiUpdate()
            Trains.guiUpdate()
        })
        MyGUI.add(params, "yCount", 1, 20).step(1).onChange(() => {
            Exits.guiUpdate()
            Trains.guiUpdate()
        })

        MyGUI.hide()
        if (config.myGui)
            MyGUI.show()

        //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
        window.addEventListener("resize", this.resizeCanvas)
        RAF.subscribe('threeSceneUpdate', this.update)
    }

    update() {
        Trains.update()
        CamParallax.update()
        this.scene.rotateX(0.01)
        this.renderer.render(this.scene, this.camera);
    }

    resizeCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }
}

const _instance = new MainThreeScene()
export default _instance