/**
 * This file is where I built the main 3D environment for the project.
 * I used React Three Fiber to create two connected rooms and added
 * animations, lighting, camera controls, and interactive elements.
 */

"use client"
// importing core react hooks and three.js utilities
import { useRef, useState, Suspense, createContext, useContext } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

//This interface defines what data and functions we want to share accross components for controlling the room lights

interface LightContextType {
  livingRoomLight: boolean
  bedroomLight: boolean
  toggleLivingRoomLight: () => void
  toggleBedroomLight: () => void
}
// creating global context so we can easily  control lights from diff component without passing props everywhere
const LightContext = createContext<LightContextType>({
  livingRoomLight: true,
  bedroomLight: true,
  toggleLivingRoomLight: () => {},
  toggleBedroomLight: () => {},
})

// Reusable materials

// Wall material - plain light walls
const WallMaterial = () => <meshStandardMaterial color="#e8dcc8" roughness={0.95} metalness={0} />

// Floor material - wooden looking floor
const FloorMaterial = () => <meshStandardMaterial color="#b8860b" roughness={0.6} metalness={0.05} />

// Ceiling material - off-white ceiliing
const CeilingMaterial = () => <meshStandardMaterial color="#faf8f5" roughness={1} metalness={0} />

// Dark wood material - for furniture
const DarkWoodMaterial = () => <meshStandardMaterial color="#3d2314" roughness={0.4} metalness={0.1} />

// Blue fabric material - for sofa and bed
const BlueFabricMaterial = () => <meshStandardMaterial color="#2c5aa0" roughness={0.85} metalness={0} />

const PurpleFabricMaterial = () => <meshStandardMaterial color="#5c3d6e" roughness={0.85} metalness={0} />

const GrayFabricMaterial = () => <meshStandardMaterial color="#a8a8a8" roughness={0.9} metalness={0} />

// Lamp material when the light is turned on
const LampShadeMaterial = ({ isOn = true }: { isOn?: boolean }) => (
  <meshStandardMaterial
    color="#fffbe6"
    roughness={0.3}
    emissive={isOn ? "#ffdd88" : "#222222"}
    emissiveIntensity={isOn ? 0.8 : 0}
    transparent
    opacity={0.9}
  />
)

// Metal material for handles and lamp stands
const MetalMaterial = () => <meshStandardMaterial color="#8b7355" roughness={0.25} metalness={0.9} />

// Glass material - for windows
const GlassMaterial = () => (
  <meshStandardMaterial color="#a8d4e6" roughness={0.1} metalness={0.1} transparent opacity={0.3} />
)

// Orange carpet
const OrangeRugMaterial = () => <meshStandardMaterial color="#d4530e" roughness={0.9} metalness={0} />


/**
 * CeilingFan - Animated rotating ceiling fan with lights
 * Uses useFrame hook for continuous rotation animation
 */
function CeilingFan({ position }: { position: [number, number, number] }) {
  const bladesRef = useRef<THREE.Group>(null)
  const { livingRoomLight } = useContext(LightContext)

  // rotating the fan blades every frame so it appears spinning
  useFrame((_, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.y += delta * 3
    }
  })

  return (
    <group position={position}>
      {/* Motor housing part of the fan */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.15, 16]} />
        <MetalMaterial />
      </mesh>

      {/* rod holding the fan */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
        <MetalMaterial />
      </mesh>

      {/* main motor body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.25, 24]} />
        <MetalMaterial />
      </mesh>

      {/* Rotating blade assembly */}
      <group ref={bladesRef} position={[0, -0.1, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} rotation={[0, ((Math.PI * 2) / 5) * i, 0]}>
            {/* Blade arm */}
            <mesh position={[0.4, 0, 0]} castShadow>
              <boxGeometry args={[0.6, 0.02, 0.08]} />
              <MetalMaterial />
            </mesh>
            {/* actual fan blade */}
            <mesh position={[0.95, -0.02, 0]} rotation={[0.05, 0, 0]} castShadow>
              <boxGeometry args={[0.7, 0.015, 0.18]} />
              <DarkWoodMaterial />
            </mesh>
          </group>
        ))}
      </group>

      {/* Light globe under the fan  */}
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <LampShadeMaterial isOn={livingRoomLight} />
      </mesh>

      {/* Actual light source of the fan */}
      <pointLight
        position={[0, -0.3, 0]}
        color="#fff5e0"
        intensity={livingRoomLight ? 0.6 : 0}
        distance={8}
        castShadow
      />
    </group>
  )
}

/**
 * SwingingDoor - Animated door that swings back and forth
 * Uses sinusoidal motion for smooth oscillation
 */
function SwingingDoor({ position }: { position: [number, number, number] }) {
  const doorRef = useRef<THREE.Group>(null) // reference to the whole door so we can rotate ir during animation
  const timeRef = useRef(0) // this ref keeps track of time manually so it looks smooth

  // Animate door swing using sine function to create a natural back and forth motion
  useFrame((_, delta) => {
    if (doorRef.current) {
      timeRef.current += delta
      doorRef.current.rotation.y = Math.sin(timeRef.current * 0.8) * 0.5 + 0.3
    }
  })

  return (
    <group ref={doorRef} position={position}>
      {/* Door panel made using nox geometry*/}
      <mesh position={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.08, 2.6, 0.8]} />
        <DarkWoodMaterial />
      </mesh>

      {/* Door handle made using a cylinder geometry */}
      <mesh position={[0.05, 0, -0.1]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
        <MetalMaterial />
      </mesh>
    </group>
  )
}

/**
 * Sofa - Living room sofa with cushions and throw pillows
 */
function Sofa({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Wooden baseframe of sofa */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.15, 1.3]} />
        <DarkWoodMaterial />
      </mesh>

      {/* main seat cushion */}
      <mesh position={[0, 0.4, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[2.9, 0.35, 1.1]} />
        <BlueFabricMaterial />
      </mesh>

      {/* back cushion */}
      <mesh position={[0, 0.75, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[2.9, 0.6, 0.35]} />
        <BlueFabricMaterial />
      </mesh>

      {/* Armrest */}
      <mesh position={[-1.45, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.45, 1.2]} />
        <BlueFabricMaterial />
      </mesh>

      <mesh position={[1.45, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.45, 1.2]} />
        <BlueFabricMaterial />
      </mesh>

      {/* Throw pillow left */}
      <mesh position={[-1, 0.65, 0.1]} rotation={[0.1, 0.2, 0.1]} castShadow>
        <boxGeometry args={[0.4, 0.35, 0.12]} />
        <GrayFabricMaterial />
      </mesh>

      {/* Throw pillow right */}
      <mesh position={[1, 0.65, 0.1]} rotation={[0.1, -0.2, -0.1]} castShadow>
        <boxGeometry args={[0.4, 0.35, 0.12]} />
        <GrayFabricMaterial />
      </mesh>
    </group>
  )
}

/**
 * CoffeeTable
 */
function CoffeeTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* coffee table parts */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.08, 0.9]} />
        <DarkWoodMaterial />
      </mesh>


      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.05, 0.7]} />
        <DarkWoodMaterial />
      </mesh>

      {/* 4 table legs */}
      {[
        [-0.8, -0.35],
        [0.8, -0.35],
        [-0.8, 0.35],
        [0.8, 0.35],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.22, z]} castShadow>
          <boxGeometry args={[0.06, 0.44, 0.06]} />
          <DarkWoodMaterial />
        </mesh>
      ))}
    </group>
  )
}

/**
 * DiningTable with 4 legs
 */
function DiningTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Table top */}
      <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.08, 1]} />
        <DarkWoodMaterial />
      </mesh>

      {/* Table legs */}
      {[
        [-0.95, -0.4],
        [0.95, -0.4],
        [-0.95, 0.4],
        [0.95, 0.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.42, z]} castShadow>
          <boxGeometry args={[0.08, 0.84, 0.08]} />
          <DarkWoodMaterial />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Chair - Dining chair with cushioned seat and back
 */
function Chair({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.06, 0.45]} />
        <BlueFabricMaterial />
      </mesh>

      {/* Seat cushion */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.42, 0.05, 0.42]} />
        <BlueFabricMaterial />
      </mesh>

      {/* Chair back */}
      <mesh position={[0, 0.85, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.55, 0.06]} />
        <BlueFabricMaterial />
      </mesh>

      {/* Chair legs */}
      {[
        [-0.18, -0.18],
        [0.18, -0.18],
        [-0.18, 0.18],
        [0.18, 0.18],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.25, z]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
          <DarkWoodMaterial />
        </mesh>
      ))}
    </group>
  )
}

/**
 * FloorLamp - Standing lamp with shade
 */
function FloorLamp({ position }: { position: [number, number, number] }) {
  const { livingRoomLight } = useContext(LightContext)

  return (
      // grouping all lamp parts
    <group position={position}>
      {/* Circular base */}
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.06, 24]} />
        <MetalMaterial />
      </mesh>

      {/* Pole */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.7, 12]} />
        <MetalMaterial />
      </mesh>

      {/* Lamp shade */}
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.35, 24, 1, true]} />
        <LampShadeMaterial isOn={livingRoomLight} />
      </mesh>

      {/* Point light stimulates the actual light coming from the lamp  */}
      <pointLight
        position={[0, 1.85, 0]}
        color="#fff5e0"
        intensity={livingRoomLight ? 1.0 : 0}
        distance={6}
        castShadow
      />
    </group>
  )
}

/**
 * Bed - Double bed with headboard, mattress, pillows, and comforter
 */
function Bed({ position }: { position: [number, number, number] }) {
  return (
      // grouping the entire bed and positioning inside the bedroom
    <group position={position}>
      {/* Bed wooden frame  */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.2, 2.8]} />
        <DarkWoodMaterial />
      </mesh>

      {/* Mattress on top of bed frame  */}
      <mesh position={[0, 0.45, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.3, 2.6]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
      </mesh>

      {/* Comforter for realistic look  */}
      <mesh position={[0, 0.62, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[2.15, 0.08, 1.9]} />
        <PurpleFabricMaterial />
      </mesh>

      {/* Headboard */}
      <mesh position={[0, 0.85, -1.35]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.1, 0.12]} />
        <DarkWoodMaterial />
      </mesh>

      {/* Left pillow */}
      <mesh position={[-0.55, 0.72, -0.95]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.65, 0.18, 0.45]} />
        <GrayFabricMaterial />
      </mesh>

      {/* Right pillow */}
      <mesh position={[0.55, 0.72, -0.95]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.65, 0.18, 0.45]} />
        <GrayFabricMaterial />
      </mesh>
    </group>
  )
}

/**
 * Nightstand - Bedside table with drawer and lamp
 */
function Nightstand({ position }: { position: [number, number, number] }) {
  const { bedroomLight } = useContext(LightContext)

  return (
    <group position={position}>
      {/* Main wooden cabinet body */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.55, 0.45]} />
        <DarkWoodMaterial />
      </mesh>

      {/* front face of drawer */}
      <mesh position={[0, 0.25, 0.23]} castShadow>
        <boxGeometry args={[0.48, 0.18, 0.02]} />
        <DarkWoodMaterial />
      </mesh>

      {/* handle for drawer */}
      <mesh position={[0, 0.25, 0.26]} castShadow>
        <boxGeometry args={[0.12, 0.02, 0.02]} />
        <MetalMaterial />
      </mesh>

      {/* Lamp base */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
        <MetalMaterial />
      </mesh>

      {/* Lamp body */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.32, 12]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.7} />
      </mesh>

      {/* Lamp shade */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.2, 24, 1, true]} />
        <LampShadeMaterial isOn={bedroomLight} />
      </mesh>

      {/* Lamp light */}
      <pointLight position={[0, 1.0, 0]} color="#fff5e0" intensity={bedroomLight ? 0.5 : 0} distance={4} />
    </group>
  )
}

/**
 * Wardrobe - Double door wardrobe with handles
 */
function Wardrobe({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main body */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 2.2, 0.55]} />
        <DarkWoodMaterial />
      </mesh>

      {/* door panels */}
      <mesh position={[-0.35, 1.1, 0.28]} castShadow>
        <boxGeometry args={[0.68, 2.1, 0.03]} />
        <DarkWoodMaterial />
      </mesh>

      <mesh position={[0.35, 1.1, 0.28]} castShadow>
        <boxGeometry args={[0.68, 2.1, 0.03]} />
        <DarkWoodMaterial />
      </mesh>

      {/* handles */}
      <mesh position={[-0.1, 1.1, 0.31]} castShadow>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <MetalMaterial />
      </mesh>

      <mesh position={[0.1, 1.1, 0.31]} castShadow>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <MetalMaterial />
      </mesh>
    </group>
  )
}

/**
 * Bookshelf for the living room
 */
function Bookshelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Back panel */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2, 0.05]} />
        <DarkWoodMaterial />
      </mesh>

      {/* Shelves */}
      {[0.1, 0.6, 1.1, 1.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0.15]} castShadow>
          <boxGeometry args={[1.1, 0.05, 0.35]} />
          <DarkWoodMaterial />
        </mesh>
      ))}

      {/* Side panels */}
      <mesh position={[-0.55, 1, 0.15]} castShadow>
        <boxGeometry args={[0.05, 2, 0.35]} />
        <DarkWoodMaterial />
      </mesh>
      <mesh position={[0.55, 1, 0.15]} castShadow>
        <boxGeometry args={[0.05, 2, 0.35]} />
        <DarkWoodMaterial />
      </mesh>

      {/* Books */}
      <mesh position={[-0.3, 0.35, 0.15]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.22]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      <mesh position={[0.2, 0.85, 0.15]} castShadow>
        <boxGeometry args={[0.35, 0.25, 0.2]} />
        <meshStandardMaterial color="#2F4F4F" roughness={0.8} />
      </mesh>
      <mesh position={[-0.2, 1.35, 0.15]} castShadow>
        <boxGeometry args={[0.3, 0.35, 0.18]} />
        <meshStandardMaterial color="#800020" roughness={0.8} />
      </mesh>
    </group>
  )
}

/**
 * TV Stand - Entertainment center with TV
 */
function TVStand({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* cabinet base which holds the TV */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.6, 0.5]} />
        <DarkWoodMaterial />
      </mesh>

      {/* screen of TV */}
      <mesh position={[0, 1.1, 0.1]} castShadow>
        <boxGeometry args={[1.8, 1, 0.08]} />
        <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.5} />
      </mesh>

      {/* farme of tv with border  */}
      <mesh position={[0, 1.1, 0.05]} castShadow>
        <boxGeometry args={[1.9, 1.1, 0.05]} />
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  )
}

/**
 * CameraController - Handles smooth camera transitions between preset views
 * Uses linear interpolation (lerp) for smooth movement
 */
function CameraController({
  targetPosition,
  targetLookAt,
}: { targetPosition: THREE.Vector3; targetLookAt: THREE.Vector3 }) {
  const { camera } = useThree() // camera access three.js
  const controlsRef = useRef<any>(null) // refrence for teh orbit so we can manually upadte the target

  useFrame(() => {
    // moving the camera from iss current position towards the target position
    camera.position.lerp(targetPosition, 0.02)

    // Update the point that the camera is looking at
      controlsRef.current.target.lerp(targetLookAt, 0.02)
      controlsRef.current.update()
    }
)

  return (
      // orbit allows mouse interation and camera orbiting
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={3}
      maxDistance={25}
      maxPolarAngle={Math.PI / 2.1}
    />
  )
}

/**
 * useCollisionBounds - Custom hook for camera collision detection
 * Prevents camera from passing through walls, floor, and ceiling
 */
function useCollisionBounds() {
    // difining the boundries of thr room
  const bounds = {
    minX: -9.8,
    maxX: 9.8,
    minZ: -3.8,
    maxZ: 3.8,
    minY: 0.5,
    maxY: 3.8,
    // center wall that seperates the room
    centerWallX: 0,
    // doorway gap in the wall
    doorwayMinZ: -1.2,
    doorwayMaxZ: 1.2,
  }
// camera never leaves the room so clamping it
  const clampPosition = (pos: THREE.Vector3): THREE.Vector3 => {
    const clamped = pos.clone()

    // lock the camera inside the outer room
    clamped.x = Math.max(bounds.minX, Math.min(bounds.maxX, clamped.x))
    clamped.y = Math.max(bounds.minY, Math.min(bounds.maxY, clamped.y))
    clamped.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, clamped.z))

    // Handling collison with the wall in center
    if (Math.abs(clamped.x) < 0.5) {
      if (clamped.z < bounds.doorwayMinZ || clamped.z > bounds.doorwayMaxZ) {
        clamped.x = pos.x > 0 ? 0.5 : -0.5
      }
    }

    return clamped
  }

  return { bounds, clampPosition }
}

/**
 * Scene - Main 3D scene containing all room geometry, furniture, and lighting
 */
function Scene({ cameraTarget, lookAtTarget }: { cameraTarget: THREE.Vector3; lookAtTarget: THREE.Vector3 }) {
  const { clampPosition } = useCollisionBounds()
  const { camera } = useThree()

  // Apply collision detection on each frame
  useFrame(() => {
    const clampedPos = clampPosition(camera.position)
    if (!camera.position.equals(clampedPos)) {
      camera.position.copy(clampedPos)
    }
  })

  // dimensions of the room
  const roomWidth = 10
  const roomDepth = 8
  const roomHeight = 4

  return (
    <>
      {/*lighting*/}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 12, 8]} intensity={2.0} castShadow shadow-mapSize={[2048, 2048]} />
      <spotLight position={[-12, 3, 0]} angle={0.6} penumbra={0.5} intensity={2.5} color="#b4d7ff" />
      <spotLight position={[12, 3, 0]} angle={0.6} penumbra={0.5} intensity={2.5} color="#b4d7ff" />

      {/* floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[roomWidth * 2 + 0.2, 0.1, roomDepth]} />
        <FloorMaterial />
      </mesh>

      {/* ceiling */}
      <mesh position={[0, roomHeight, 0]}>
        <boxGeometry args={[roomWidth * 2 + 0.2, 0.1, roomDepth]} />
        <CeilingMaterial />
      </mesh>

      {/* walls */}

      {/* back wall */}
      <mesh position={[0, roomHeight / 2, -roomDepth / 2]} receiveShadow>
        <boxGeometry args={[roomWidth * 2 + 0.2, roomHeight, 0.2]} />
        <WallMaterial />
      </mesh>

      {/* Front wall */}
      <mesh position={[-roomWidth * 0.75, roomHeight / 2, roomDepth / 2]} receiveShadow>
        <boxGeometry args={[roomWidth / 2, roomHeight, 0.2]} />
        <WallMaterial />
      </mesh>
      <mesh position={[roomWidth * 0.75, roomHeight / 2, roomDepth / 2]} receiveShadow>
        <boxGeometry args={[roomWidth / 2, roomHeight, 0.2]} />
        <WallMaterial />
      </mesh>

      {/* wondow left wall */}

      {/* Bottom section */}
      <mesh position={[-roomWidth, roomHeight * 0.15, 0]} receiveShadow>
        <boxGeometry args={[0.2, roomHeight * 0.3, roomDepth]} />
        <WallMaterial />
      </mesh>

      <mesh position={[-roomWidth, roomHeight * 0.85, 0]} receiveShadow>
        <boxGeometry args={[0.2, roomHeight * 0.3, roomDepth]} />
        <WallMaterial />
      </mesh>

      <mesh position={[-roomWidth, roomHeight / 2, -roomDepth * 0.35]} receiveShadow>
        <boxGeometry args={[0.2, roomHeight * 0.4, roomDepth * 0.3]} />
        <WallMaterial />
      </mesh>

      <mesh position={[-roomWidth, roomHeight / 2, roomDepth * 0.35]} receiveShadow>
        <boxGeometry args={[0.2, roomHeight * 0.4, roomDepth * 0.3]} />
        <WallMaterial />
      </mesh>

      <mesh position={[-roomWidth + 0.05, roomHeight / 2, 0]}>
        <boxGeometry args={[0.02, roomHeight * 0.4, roomDepth * 0.4]} />
        <GlassMaterial />
      </mesh>

      {/* right wall window  */}

      <mesh position={[roomWidth, roomHeight * 0.15, 0]} receiveShadow>
        <boxGeometry args={[0.2, roomHeight * 0.3, roomDepth]} />
        <WallMaterial />
      </mesh>

      <mesh position={[roomWidth, roomHeight * 0.85, 0]} receiveShadow>
        <boxGeometry args={[0.2, roomHeight * 0.3, roomDepth]} />
        <WallMaterial />
      </mesh>

      <mesh position={[roomWidth, roomHeight / 2, -roomDepth * 0.35]} receiveShadow>
        <boxGeometry args={[0.2, roomHeight * 0.4, roomDepth * 0.3]} />
        <WallMaterial />
      </mesh>

      <mesh position={[roomWidth, roomHeight / 2, roomDepth * 0.35]} receiveShadow>
        <boxGeometry args={[0.2, roomHeight * 0.4, roomDepth * 0.3]} />
        <WallMaterial />
      </mesh>

      <mesh position={[roomWidth - 0.05, roomHeight / 2, 0]}>
        <boxGeometry args={[0.02, roomHeight * 0.4, roomDepth * 0.4]} />
        <GlassMaterial />
      </mesh>

      {/* center wall divider */}

      <mesh position={[0, roomHeight / 2, -roomDepth * 0.325]} receiveShadow>
        <boxGeometry args={[0.2, roomHeight, roomDepth * 0.35]} />
        <WallMaterial />
      </mesh>

      <mesh position={[0, roomHeight / 2, roomDepth * 0.325]} receiveShadow>
        <boxGeometry args={[0.2, roomHeight, roomDepth * 0.35]} />
        <WallMaterial />
      </mesh>

      <mesh position={[0, roomHeight * 0.875, 0]} receiveShadow>
        <boxGeometry args={[0.2, roomHeight * 0.25, roomDepth * 0.3]} />
        <WallMaterial />
      </mesh>

      {/* animated elements */}

      {/* door b/w walls */}
      <SwingingDoor position={[0, 1.3, 0.4]} />

      {/* fan in living room  */}
      <CeilingFan position={[-5, roomHeight - 0.1, 0]} />

      {/* furniture- living room  */}

      <Sofa position={[-5.5, 0, -2.2]} />
      <CoffeeTable position={[-5.5, 0, 0]} />
      <DiningTable position={[-3, 0, 2]} />
      <Chair position={[-3, 0, 0.9]} rotation={0} />
      <Chair position={[-3, 0, 3.1]} rotation={Math.PI} />
      <Chair position={[-4.3, 0, 2]} rotation={Math.PI / 2} />
      <Chair position={[-1.7, 0, 2]} rotation={-Math.PI / 2} />
      <FloorLamp position={[-8.5, 0, 1.5]} />
      <Bookshelf position={[-8.5, 0, -3.5]} />
      <TVStand position={[-7.5, 0, 3.5]} />

      {/* The rug in living room  */}
      <mesh position={[-5.5, 0.06, -2]} receiveShadow>
        <boxGeometry args={[5, 0.1, 4]} />
        <OrangeRugMaterial />
      </mesh>

      {/* Furniture- Bedroom  */}

      <Bed position={[6, 0, -1.5]} />
      <Nightstand position={[7.8, 0, -3.2]} />
      <Wardrobe position={[4, 0, -3.3]} rotation={0} />

      {/* rug in bedroom */}
      <mesh position={[6, 0.06, 1]} receiveShadow>
        <boxGeometry args={[3, 0.1, 2.5]} />
        <OrangeRugMaterial />
      </mesh>

      {/* shadow and camera */}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={25} blur={2} far={4} />

      <CameraController targetPosition={cameraTarget} targetLookAt={lookAtTarget} />
    </>
  )
}

// Camera Preset

const ROOM_VIEWS = {
  overview: {
    position: new THREE.Vector3(0, 6, 14),
    lookAt: new THREE.Vector3(0, 1.5, 0),
  },
  livingRoom: {
    position: new THREE.Vector3(-5, 3, 8),
    lookAt: new THREE.Vector3(-5, 2, 0),
  },
  bedroom: {
    position: new THREE.Vector3(6, 3, 8),
    lookAt: new THREE.Vector3(6, 1, 0),
  },
  topDown: {
    position: new THREE.Vector3(0, 12, 0.1),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
}

/**
 * Scene3D - Main exported component that sets up the 3d env.
 Handles
 *1. camera view switching
 *2. Light toggliing for living room and bedroom
 *3. rendering the canvas
 */
export default function Scene3D() {
  // current Camera view state
  const [currentView, setCurrentView] = useState<keyof typeof ROOM_VIEWS>("overview")

  // Light toggle states for interactivity
  const [livingRoomLight, setLivingRoomLight] = useState(true)
  const [bedroomLight, setBedroomLight] = useState(true)

  return (
    <LightContext.Provider
      value={{
        livingRoomLight,
        bedroomLight,
        toggleLivingRoomLight: () => setLivingRoomLight(!livingRoomLight),
        toggleBedroomLight: () => setBedroomLight(!bedroomLight),
      }}
    >
      <div className="relative w-full h-full bg-sky-400">
        {/* Three.js Canvas */}
        <Canvas camera={{ position: [0, 6, 14], fov: 60 }} shadows>
          <color attach="background" args={["#87ceeb"]} />
          <Suspense fallback={null}>
            <Scene cameraTarget={ROOM_VIEWS[currentView].position} lookAtTarget={ROOM_VIEWS[currentView].lookAt} />
          </Suspense>
        </Canvas>

        {/* Info Panel - Top Left */}
        <div className="absolute top-3 left-3 bg-black/75 text-white p-2.5 rounded-md max-w-[180px] text-xs backdrop-blur-sm">
          <h2 className="text-sm font-bold mb-1">3D Architecture Tour</h2>
          <div className="space-y-0.5">
            <p className="font-semibold">Controls:</p>
            <p>• Left Mouse: Rotate</p>
            <p>• Right Mouse: Pan</p>
            <p>• Scroll: Zoom</p>
          </div>
          <div className="space-y-0.5 mt-2">
            <p className="font-semibold">Features:</p>
            <p>• 2 Rooms (Living & Bed)</p>
            <p>• Animated ceiling fan</p>
            <p>• Swinging door</p>
            <p>• Multiple materials</p>
            <p>• Collision detection</p>
          </div>
        </div>

        {/* Light Toggle Panel - Top Right */}
        <div className="absolute top-3 right-3 bg-black/75 text-white p-2.5 rounded-md text-xs backdrop-blur-sm">
          <p className="font-semibold mb-2">Light Controls:</p>
          <div className="space-y-2">
            <button
              onClick={() => setLivingRoomLight(!livingRoomLight)}
              className={`block w-full px-2 py-1 rounded text-xs ${
                livingRoomLight ? "bg-yellow-500 text-black" : "bg-gray-600 text-white"
              }`}
            >
              Living Room: {livingRoomLight ? "ON" : "OFF"}
            </button>
            <button
              onClick={() => setBedroomLight(!bedroomLight)}
              className={`block w-full px-2 py-1 rounded text-xs ${
                bedroomLight ? "bg-yellow-500 text-black" : "bg-gray-600 text-white"
              }`}
            >
              Bedroom: {bedroomLight ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Navigation Buttons, Bottom Center */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {(["overview", "livingRoom", "bedroom", "topDown"] as const).map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                currentView === view ? "bg-white text-black" : "bg-black/60 text-white hover:bg-black/80"
              }`}
            >
              {view === "livingRoom"
                ? "Living Room"
                : view === "topDown"
                  ? "Top Down"
                  : view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </LightContext.Provider>
  )
}
