import {Clock, Vector3, AnimationMixer, GridHelper, 
    Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, 
    SpotLight, PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide, Color} 
from 'https://cdn.jsdelivr.net/npm/three@0.126.1/build/three.module.js'

import {GLTFLoader} 
from 'https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/loaders/GLTFLoader.js'

import {OrbitControls}
from 'https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/controls/OrbitControls.js'

import {AxesHelper} 
from 'https://cdn.jsdelivr.net/npm/three@0.126.1/build/three.module.js'

const clock = new Clock()
const scene = new Scene()
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100)

// scene.background = new Color(0x808080)

// Axes Helper

// const axesHelper = new AxesHelper(1)
// scene.add(axesHelper)

const renderer = new WebGLRenderer()
renderer.antialias = true
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.scene = scene
window.camera = camera

const controls = new OrbitControls(camera, renderer.domElement)
controls.minDistance = 1.5
controls.maxDistance = 3
controls.minPolarAngle = Math.PI / 2.8
controls.maxPolarAngle = Math.PI / 2.2

window.controls = controls
controls.update()

const loader = new GLTFLoader()

const light = new AmbientLight(0x404040)
scene.add(light)

const spotlight = new SpotLight(0xffffff)
spotlight.position.set(0, 10, 0)
spotlight.castShadow = true

const spotlight2 = new SpotLight(0xffffff)
spotlight2.position.set(-10, 5, -10)
spotlight2.castShadow = true

scene.add(spotlight)
scene.add(spotlight2)

const floorGeo = new PlaneGeometry(50, 50)
const floorMat = new MeshBasicMaterial( {color: 0xcecece, side: DoubleSide})
const floor = new Mesh(floorGeo, floorMat)
floor.position.y = -0.05
floor.receiveShadow = true
floor.rotateX(Math.PI / 2)
scene.add(floor)

const grid = new GridHelper(50, 25, 0x444444, 0x444444)
scene.add(grid)

loader.load('model/box.gltf', (box) => {
    const boxScene = box.scene
    scene.add(boxScene)

    console.log(boxScene)
    loader.load('model/Boston.121.gltf', (gltf) => {

        const spine = gltf.scene.children[0].children[0]

        const animate = () => {
            requestAnimationFrame(animate)
            const delta = clock.getDelta()
            mixer.update(delta)
            
            //console.log(spine.position)
            //camera.position.set(spine.position.x + 1, spine.position.y, spine.position.z + 1)
            controls.target = spine.position
            //console.log(controls.getPolarAngle())
            controls.update()
            renderer.render(scene, camera)
        }
        

        const gltfScene = gltf.scene
        const animationClip = gltf.animations[0]

        const skel = gltf.scene.children[0].children[0]

        const mixer = new AnimationMixer(gltfScene)
        const action = mixer.clipAction(animationClip)
        action.play()

        scene.add(gltfScene)
        window.gltf = gltf

        scene.traverse((object) => {
            object.frustumCulled = false
        })

        animate()
    })

})




