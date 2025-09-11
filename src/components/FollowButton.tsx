"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Loader2Icon } from "lucide-react"
import toast from "react-hot-toast"
import { toggleFollow } from "@/actions/user.action"

function FollowButton({userId} : {userId:string}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFollow = async() => {
    setIsLoading(true)
    try {
      const res = await toggleFollow(userId)
      if(res?.success){
        toast.success("User followed successfully")
      }else{
        toast.error("Can't follow user")
      }
    } catch (error) {
      toast.error("Couldn't follow user!")
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <Button
    size={"sm"}
    variant={"secondary"}
    disabled={isLoading}
    onClick={handleFollow}
    className="w-20"
    >
      {isLoading ? <Loader2Icon className=" animate-spin size-4" /> : "Follow"}
    </Button>
  )
}

export default FollowButton
