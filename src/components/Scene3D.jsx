import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleField() {
  const ref = useRef()
  const count = 600
  const mouse = useRef({ x: 0, y: 0 })

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15
      // Purple / pink / cyan palette
      const r = Math.random()
      if (r < 0.4) { col[i*3]=0.55; col[i*3+1]=0.36; col[i*3+2]=0.96; }       // purple
      else if (r < 0.7) { col[i*3]=0.93; col[i*3+1]=0.28; col[i*3+2]=0.6; }    // pink
      else if (r < 0.85) { col[i*3]=0.02; col[i*3+1]=0.71; col[i*3+2]=0.83; }   // cyan
      else { col[i*3]=1; col[i*3+1]=1; col[i*3+2]=1; }                           // white
      siz[i] = Math.random() * 3 + 1
    }
    return [pos, col, siz]
  }, [])

  // Track mouse
  useMemo(() => {
    const handler = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime

    // Gentle rotation based on mouse
    ref.current.rotation.y = mouse.current.x * 0.15 + t * 0.02
    ref.current.rotation.x = mouse.current.y * 0.1 + Math.sin(t * 0.1) * 0.05

    // Animate particles
    const posArr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      posArr[i3 + 1] += Math.sin(t * 0.5 + i * 0.1) * 0.002
      posArr[i3] += Math.cos(t * 0.3 + i * 0.05) * 0.001
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function FloatingOrbs() {
  const group = useRef()

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.children.forEach((mesh, i) => {
      mesh.position.y = Math.sin(t * 0.3 + i * 2) * 2
      mesh.position.x = Math.cos(t * 0.2 + i * 1.5) * 3 + (i - 1.5) * 3
      mesh.rotation.x = t * 0.1 + i
      mesh.rotation.z = t * 0.15 + i
    })
  })

  return (
    <group ref={group}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[(i - 1.5) * 3, 0, -5]}>
          <icosahedronGeometry args={[0.8 + i * 0.2, 1]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#8b5cf6' : '#ec4899'}
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      ))}
    </group>
  )
}

function ConnectionLines() {
  const ref = useRef()
  const lineCount = 30

  const positions = useMemo(() => {
    const pos = new Float32Array(lineCount * 6)
    for (let i = 0; i < lineCount; i++) {
      const i6 = i * 6
      pos[i6] = (Math.random() - 0.5) * 16
      pos[i6 + 1] = (Math.random() - 0.5) * 16
      pos[i6 + 2] = (Math.random() - 0.5) * 10
      pos[i6 + 3] = pos[i6] + (Math.random() - 0.5) * 4
      pos[i6 + 4] = pos[i6 + 1] + (Math.random() - 0.5) * 4
      pos[i6 + 5] = pos[i6 + 2] + (Math.random() - 0.5) * 2
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.015
  })

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={lineCount * 2} array={positions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#8b5cf6" transparent opacity={0.04} />
    </lineSegments>
  )
}

export default function Scene3D() {
  return (
    <div className="three-bg">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <ambientLight intensity={0.1} />
        <ParticleField />
        <FloatingOrbs />
        <ConnectionLines />
      </Canvas>
    </div>
  )
}
