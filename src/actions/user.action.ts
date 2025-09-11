import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"
import { error } from "console";

export const syncUser = async () => {
  try {
    const {userId} = await auth();
    const user =  await currentUser();

    if(!userId || !user)return

    //check if user exists
    const existingUser = await prisma.user.findUnique({
      where:{
        clerkId: userId
      }
    })

    if(existingUser){
      return existingUser
    }

    const dbUser = await prisma.user.create({
      data:{
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl
      }
    })

    return dbUser;

  } catch (error) {
    console.log("Error is syncUser of user action", error)
  }
}

export const getUserByClerkId = async (clerkId: string) => {
  return await prisma.user.findUnique({
    where:{
      clerkId:clerkId
    },
    include:{
      _count:{
        select:{
          followers:true,
          following:true,
          posts: true
        }
      }
    }
  })
}

export async function getDbUserId() {
  const { userId:clerkId } = await auth();
  if(!clerkId)throw new Error ("Unauthorized");

  const user = await getUserByClerkId(clerkId);
  if(!user)throw new Error ("User not found");

  return user.id;
}

export async function getRandomUsers() {
  try {
    const userId = await getDbUserId()

    const randomUsers = await prisma.user.findMany({
      where:{
        AND:[ // I am using and here bcz I want to exclude suggestion from 2 condition. 1. Can't recommend self 2. Can't recommend following
          {
            NOT: {id: userId}
          },
          {
            NOT:{
              followers:{
                some:{
                  followerId: userId
                }
              }
            }
          }

        ]
      },
      select:{
        id:true,
        
      }
    })

    
  } catch (error) {
    
  }
}