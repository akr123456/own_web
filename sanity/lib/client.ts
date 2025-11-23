import { createClient, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../env'

// 创建原始客户端
const rawClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  timeout: 30000, // 增加超时时间到30秒
  // perspective: 'published',
})

// 创建错误处理包装器
class SafeClient {
  private client: SanityClient
  
  constructor(client: SanityClient) {
    this.client = client
  }
  
  // 包装fetch请求
  async fetch<T = any>(query: string, params?: any): Promise<T | null> {
    try {
      return await this.client.fetch<T>(query, params)
    } catch (error) {
      console.warn('Sanity连接失败，跳过请求:', error)
      return null
    }
  }
  
  // 包装其他可能使用的方法
  async getDocument<T = any>(id: string): Promise<T | null> {
    try {
      return await this.client.getDocument<T>(id)
    } catch (error) {
      console.warn('Sanity连接失败，跳过获取文档:', error)
      return null
    }
  }
  
  // 转发其他未包装的方法
  [key: string]: any
}

// 创建安全客户端实例
const safeClient = new SafeClient(rawClient)

// 转发所有未包装的方法
for (const prop in rawClient) {
  if (!(prop in safeClient) && typeof (rawClient as any)[prop] === 'function') {
    safeClient[prop] = async function(...args: any[]) {
      try {
        return await (rawClient as any)[prop].apply(rawClient, args)
      } catch (error) {
        console.warn(`Sanity方法${prop}调用失败，跳过请求:`, error)
        return null
      }
    }
  }
}

export const client = safeClient
