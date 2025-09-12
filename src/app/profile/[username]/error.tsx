'use client' // Error boundaries must be Client Components

import { Button } from '@/components/ui/button'
import { HomeIcon } from 'lucide-react'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong, we couldn't load the user profile</h2>
      <div className=' flex items-center gap-4 mt-3'>

        <Button
          className=' cursor-pointer '
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>

        <Button
        className=' cursor-pointer'
        >
          <a href="/" className=' flex items-center'>
          <HomeIcon  className=' mr-1'/>
          Home
          </a>
        </Button>
      </div>
    </div>
  )
}