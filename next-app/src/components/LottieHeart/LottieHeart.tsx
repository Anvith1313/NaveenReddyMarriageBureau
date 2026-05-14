'use client'

import dynamic from 'next/dynamic'
import { useRef, useEffect } from 'react'

const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then(m => m.DotLottieReact),
  { ssr: false, loading: () => <span>♡</span> }
)

interface Props {
  saved: boolean
  size?: number
}

export default function LottieHeart({ saved, size = 28 }: Props) {
  const dotLottieRef = useRef<import('@lottiefiles/dotlottie-react').DotLottie | null>(null)
  const prevSaved = useRef(saved)

  useEffect(() => {
    const player = dotLottieRef.current
    if (!player) return
    if (saved && !prevSaved.current) {
      player.play()
    } else if (!saved && prevSaved.current) {
      player.stop()
    }
    prevSaved.current = saved
  }, [saved])

  return (
    <DotLottieReact
      src="/Assets/LikeButton.lottie"
      dotLottieRefCallback={ref => { dotLottieRef.current = ref }}
      autoplay={saved}
      loop={false}
      style={{ width: size, height: size }}
    />
  )
}
