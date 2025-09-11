"use server"

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action"
import { revalidatePath } from "next/cache";

export async function createPost(content:string, imageUrl:string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    const post = await prisma.post.create({
      data: {
        authodId: userId,
        content: content,
        image: imageUrl
      }
    })

    revalidatePath("/")
    return { success: true, post }
  } catch (error) {
    console.error("Failed to create post", error)
    return { success: false, error: "Failed to create post" }
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        },

        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: "asc"
          }
        },

        likes: {
          select: {
            userId: true
          }
        },

        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })

    return posts
  } catch (error) {
    console.log("Error in getPosts server actions", error)
    throw new Error("Failed to fetch posts")
  }
}

export async function toggleLike(postId:string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    })

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      select: {
        authodId: true
      }
    })

    if (!post) throw new Error("Post not found")

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      })
    } else {
      await prisma.$transaction([

        // Update likes table
        prisma.like.create({
          data: {
            postId,
            userId
          }
        }),

        // Update notification table
        // spread op spread from another array if the query succeeds the result array would be inserted into the main transaction array
        ... (post.authodId !== userId ? [
          prisma.notification.create({
            data: {
              type: 'LIKE',
              userId: post.authodId,
              creatorId: userId,
              postId
            }
          })
        ] : [])

      ])

      revalidatePath("/")
      return {success: true}
    }
  } catch (error) {
    console.log("Error in toggleLike server action", error)
    return {success:false, error:"failed to operation toggleLike"}
  }
}

export async function createComment(postId:string, content:string) {
  try {
    const userId = await getDbUserId()

    if(!userId)return
    if(!content) throw new Error("Content is required")
    
    const post = await prisma.post.findUnique({
      where:{ id: postId },
      select:{ authodId: true }
    })

    if(!post)throw new Error("Post not found");

    const [comment] = await prisma.$transaction( async(tx) => {

      const newComment = await tx.comment.create({
        data:{
          content: content,
          authorId: userId,
          postId: postId
        }
      });

      if(userId !== post.authodId){
        await tx.notification.create({
          data:{
            type: 'COMMENT',
            userId: post.authodId,
            creatorId: userId,
            postId: postId,
            commentId: newComment.id
          }
        })
      }

      return [newComment]
    })

    revalidatePath("/")
    return {success: true, comment}

  } catch (error) {
    console.log("Failed to create comment", error)
    return {
      success: false, error: "Failed to create comment"
    }
  }
}

export async function deletePost(postId:string) {
  try {
    const userId = await getDbUserId();

    const post = await prisma.post.findUnique({
      where:{
        id: postId
      },
      select:{
        authodId: true
      }
    })

    if(!post)throw new Error("Post not found")
    if(post.authodId !== userId)throw new Error("Unauthorized - permission denied")
    
    await prisma.post.delete({
      where:{ id: postId}
    })

    revalidatePath("/")
    return {success: true};
  } catch (error) {
    console.log("Error deleting Post", error)
    return{ success: false, error: "Couldn't delete post"}
  }
}