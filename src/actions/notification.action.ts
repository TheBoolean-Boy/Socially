"use server"
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action"

export async function getNotifications(){
  try {
    const userId = await getDbUserId();
    if(!userId) return [] // since notificatios is an array so worst case return an empty array

    const notifications = await prisma.notification.findMany({
      where:{
        userId: userId
      },
      include:{
        creator:{
          select:{
            id: true,
            username: true,
            name: true,
            image: true
          }
        },

        post:{
          select:{
            id: true,
            content:true,
            image: true
          }
        },

        comment:{
          select:{
            id: true,
            content: true,
            createdAt: true
          }
        }
      },

      orderBy:{
        createdAt: 'desc'
      }
    })

    return notifications;
  } catch (error) {
    console.log("Error is getNotifications", error)
    throw new Error ("Failed to fetch notifications")
  }
}

export async function markNotificationsAsRead(notificationID:string[]) {
  try {
    await prisma.notification.updateMany({
      where:{
        id:{
          in: notificationID
        }
      },
      data:{
        read: true
      }
    })

    return {success: true};
  } catch (error) {
    console.log("Error marking notiifcations as read", error)
    return{success: false}
  }
}

