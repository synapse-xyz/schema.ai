'use server'

import Thread, { type IThread } from '@/models/Thread'
import dbConnect from './db'

export async function createThread(userId: string, data: Partial<IThread>) {
  await dbConnect()
  const newThread = await Thread.create({
    chat_id: data.chat_id,
    user_id: userId,
    diagram: data.diagram,
    schemas: {
      sql: data.schemas?.sql,
      mongo: data.schemas?.mongo,
    },
    conversation: data.conversation,
  })
  return JSON.parse(JSON.stringify(newThread))
}

export async function getThread(chatId: string): Promise<IThread | null> {
  await dbConnect()
  const foundThread = await Thread.findOne({ chat_id: chatId })
  if (!foundThread) {
    return null
  }
  return JSON.parse(JSON.stringify(foundThread))
}

export async function updateThread(chatId: string, data: Partial<IThread>) {
  await dbConnect()
  const updatedThread = await Thread.findOneAndUpdate(
    { chat_id: chatId },
    { $set: data },
    { new: true },
  )
  if (!updatedThread) {
    return null
  }
  return JSON.parse(JSON.stringify(updatedThread))
}

export async function getThreadsByUserId(userId: string): Promise<IThread[]> {
  await dbConnect()
  const threads = await Thread.find({ user_id: userId })
  return JSON.parse(JSON.stringify(threads))
}

export async function deleteThread(chatId: string) {
  await dbConnect()
  const deletedThread = await Thread.findOneAndDelete({ chat_id: chatId })
  if (!deletedThread) {
    return null
  }
  return true
}

export async function duplicateThread(
  chatId: string,
  userId: string,
): Promise<IThread | null> {
  await dbConnect()
  const thread = await Thread.findOne({ chat_id: chatId })
  if (!thread) {
    return null
  }

  const newChatId = crypto.randomUUID()

  const newThread = await Thread.create({
    chat_id: newChatId,
    user_id: userId,
    diagram: thread.diagram,
    schemas: {
      sql: thread.schemas?.sql,
      mongo: thread.schemas?.mongo,
    },
    conversation: thread.conversation,
  })
  return JSON.parse(JSON.stringify(newThread))
}
