'use client'

import dynamic from 'next/dynamic'
const Canvas3D = dynamic(() => import('@/component/Canvas3D').then((mod) => mod.Canvas3D), { ssr: false })

export default function Home() {
  return (
    <div className="bg-gray-800 w-full h-full" >
      <Canvas3D />
    </div>
  );
}

