"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";


export async function getProfileByUsername(username:string) {
  try {
    const user = await prisma.user.findUnique({
      where:{
        username: username
      },
      select:{
        id: true,
        username: true, 
        name: true,
        image:true,
        bio: true,
        location: true,
        website: true,
        createdAt: true,
        _count:{
          select:{
            followers: true,
            following: true,
            posts: true
          }
        }
      }
    })

    return user;
  } catch (error) {
    console.log("Error in getProfileByUsername server action", error)
    throw new Error ("failed to fetch profile")
  }
}

export async function getUserPosts(userId:string) {
  try {
    const posts = await prisma.post.findMany({
      where:{
        authodId: userId
      },
      include:{
        author:{
          select:{
            id: true,
            username: true,
            image: true,
            name: true
          }
        },
        comments:{
          include:{
            author:{
              select:{
                id: true,
                username: true,
                name: true,
                image: true
              }
            }
          },
          orderBy:{
            createdAt:"asc"
          }
        },
        likes:{
          select:{
            userId: true
          }
        },
        _count:{
          select:{
            likes:true,
            comments: true
          }
        }
      },
      orderBy:{
        createdAt:"desc"
      }
    })

    return posts
  } catch (error) {
    console.log("Error in getUserPosts", error)
    throw new Error("Failed to get posts by the user")
  }
}

export async function getLikedPosts(userId:string) {
  try {
    const likePosts = await prisma.post.findMany({
      where:{
        likes:{
          some:{
            userId:userId
          }
        }
      },
      include:{
        author:{
          select:{
            id: true,
            username: true,
            image: true,
            name: true
          }
        },
        comments:{
          include:{
            author:{
              select:{
                id: true,
                username: true,
                name: true,
                image: true
              }
            }
          },
          orderBy:{
            createdAt:"asc"
          }
        },
        likes:{
          select:{
            userId: true
          }
        },
        _count:{
          select:{
            likes:true,
            comments: true
          }
        }
      },
      orderBy:{
        createdAt:"desc"
      }
    })

    return likePosts
  } catch (error) {
    console.log("Error in getLikedPosts", error)
    throw new Error("Failed to get liked posts by the user")
  }
}

export async function updateProfile(formData:FormData){
  try {
    const {userId: clerkId} = await auth();
    if(!clerkId)throw new Error("Unauthorized")
    
    const name = formData.get("name") as string
    const bio = formData.get("bio") as string
    const website = formData.get("website") as string
    const location = formData.get("location") as string

    const user = await prisma.user.update({
      where:{
        clerkId: clerkId
      },
      data:{
        name: name, // can also be written as name only but I am just being clear here
        bio: bio,
        website: website,
        location: location
      }
    })

    revalidatePath("/profile")
    return{ success:true, user}
  } catch (error) {
    console.log("Error updating profile", error)
    return{success: false, error:"Failed to update profile"}
  }
}

export async function isFollowing(userId: string){
  try {
    const currentUserId = await getDbUserId();
    if(!currentUserId) return false;

    const follow  = await prisma.follows.findUnique({
      where:{
       followerId_followingId:{
         followerId: currentUserId,
         followingId: userId
       }
      }
    })

    // !!{} => means true
    // !!null => means false

    return !!follow
  } catch (error) {
    console.log("Error is isFollowing server action", error)
    return false
  }
}
