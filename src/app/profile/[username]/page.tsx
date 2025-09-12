import { getLikedPosts, getProfileByUsername, getUserPosts, isFollowing } from "@/actions/profile.action"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import ProfilePageClient from "./ProfilePageClient"

type Props = {
  params: Promise<{username: string}>
}

export const generateMetadata = async({params} : Props): Promise<Metadata> =>{
  const {username} = await params
  console.log(username)
  return{
    title: username,
  }
}

async function ProfilePageServer({params} : Props) {
  const {username} = await params

  const user = await getProfileByUsername(username);
  if(!user) notFound()

  const [ posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getLikedPosts(user.id),
    isFollowing(user.id)
  ])
  return <ProfilePageClient
  user={user}
  posts={posts}
  likedPosts = {likedPosts}
  isFollowing = {isCurrentUserFollowing}
  />

}

export default ProfilePageServer
