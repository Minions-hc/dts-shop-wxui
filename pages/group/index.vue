<template>
  <view class="group-lottery-container">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-container">
      <uni-load-more status="loading" :contentText="loadingText"></uni-load-more>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error" class="error-container">
      <uni-icons type="info" size="60" color="#e74c3c"></uni-icons>
      <text class="error-text">加载失败，请重试</text>
      <button class="retry-button" @click="initPage">重试</button>
    </view>

    <!-- 内容展示 -->
    <view v-else class="content-container">
      <!-- 背景图 -->
      <image 
        class="background-image" 
        :src="backgroundImage" 
        mode="aspectFill"
        @load="handleImageLoad"
        @error="handleImageError"
      ></image>
    </view>
  </view>
</template>

<script>
import { get } from "@/utils/rest-util.js"

export default {
  data() {
    return {
      loading: true,
      error: false,
      backgroundImage: '',
      loadingText: {
        contentdown: '上拉显示更多',
        contentrefresh: '正在加载...',
        contentnomore: '没有更多数据'
      }
    }
  },
  onLoad() {
    // 禁用页面滚动
    uni.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.initPage()
  },
  methods: {
    // 初始化页面
    async initPage() {
      this.loading = true
      this.error = false
      
      try {
        const json = await get('/wx/qrcode/list')
        const result = json.data?.data
        
        if (result?.items?.length > 0) {
          const firstQrCode = result.items[0]
          
          // 确保URL是完整格式
          let imageUrl = firstQrCode.qrcodeUrl
          
          // 如果URL不是http/https开头，尝试添加基础URL
          if (!/^https?:\/\//.test(imageUrl)) {
            // 根据你的实际项目配置添加基础URL
            // imageUrl = 'https://your-domain.com' + imageUrl
          }
          
          this.backgroundImage = imageUrl
        } else {
          // 使用本地默认图片
          this.backgroundImage = '/static/default-group-bg.png'
        }
        
        // 确保图片URL不为空
        if (!this.backgroundImage) {
          throw new Error('未获取到有效图片URL')
        }
        
        this.loading = false
      } catch (err) {
        console.error('加载失败:', err)
        this.error = true
        this.loading = false
        // 使用默认图片
        this.backgroundImage = '/static/default-group-bg.png'
      }
    },

    // 图片加载成功
    handleImageLoad() {
      console.log('背景图片加载成功')
    },

    // 图片加载失败
    handleImageError() {
      console.error('背景图片加载失败，使用默认图片')
      this.backgroundImage = '/static/default-group-bg.png'
    }
  }
}
</script>

<style>
/* 确保页面不会滚动 */
page {
  overflow: hidden;
  height: 100%;
}

.group-lottery-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f8f8f8;
}

/* 错误状态样式 */
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 40rpx;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f8f8f8;
}

.error-text {
  margin: 20rpx 0;
  font-size: 32rpx;
  color: #666;
}

.retry-button {
  margin-top: 40rpx;
  background-color: #e74c3c;
  color: white;
  border-radius: 50rpx;
  padding: 0 60rpx;
  font-size: 28rpx;
}

/* 内容样式 */
.content-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  display: block;
}
</style>