<template>
  <view class="container">
    <!-- 标题区域 -->
    <view class="header">
      <view class="title-wrapper">
              <text 
                class="title" 
                @click="navigatorToCodeDatail()"
              >兑换记录</text>
		</view>
    </view>

    <!-- 兑换主体内容 -->
    <view class="content">
      <text class="tip-text">输入兑换码查看可兑换的物品</text>
      
      <!-- 输入框区域 -->
      <view class="input-box">
        <input
          class="input"
          placeholder="点击输入兑换码"
          placeholder-class="placeholder"
          v-model="code"
        />
      </view>

      <!-- 兑换按钮 -->
      <button class="submit-btn" @tap="handleSubmit">兑换</button>
    </view>
  </view>
</template>

<script>
	import {get,post} from "@/utils/rest-util.js"
export default {
	onLoad(param) {
		const {userId} = param;
		this.userId = userId;
	},
  data() {
    return {
      code: '', // 绑定兑换码输入
	  userId:''
    }
  },
  methods: {
    handleSubmit() {
      // 兑换逻辑
      if (!this.code) {
        uni.showToast({ title: '请输入兑换码', icon: 'none' })
        return
      }
	  const postData = {
		  userId:this.userId,
		  redemptionCode: this.code
	  }
	  post('wx/redemptionCode/exchange',postData).then(json=>{
		  
	  })
      // 提交兑换请求...
    },
	navigatorToCodeDatail() {
		uni.navigateTo({
			url: '/pages/code/detail'
		})
	},
	
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
  min-height: 100vh;
  background: #f5f5f5;

  .header {
    padding: 20rpx 0;
    .title-wrapper {
        display: flex;
        justify-content: flex-end; /* 保持右对齐 */
    
        .title {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
          display: inline-block;
          position: relative;
          padding-bottom: 8rpx; /* 为下划线留出空间 */
    
          &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2rpx;
            background: #000;
            border-radius: 1rpx;
          }
        }
      }
  }

  .content {
    background: #fff;
    border-radius: 24rpx;
    padding: 60rpx 40rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

    .tip-text {
      display: block;
      font-size: 28rpx;
      color: #999;
      text-align: center;
      margin-bottom: 60rpx;
    }

    .input-box {
      margin-bottom: 80rpx;
      .input {
        height: 100rpx;
        border: 2rpx solid #eee;
        border-radius: 16rpx;
        padding: 0 30rpx;
        font-size: 32rpx;
        color: #333;
        
        &:focus {
          border-color: #FF6B6B;
        }
      }
      .placeholder {
        color: #ccc;
        font-size: 32rpx;
      }
    }

    .submit-btn {
      background: #FF6B6B;
      color: #fff;
      height: 96rpx;
      line-height: 96rpx;
      border-radius: 48rpx;
      font-size: 34rpx;
      transition: all 0.3s;
      
      &:active {
        opacity: 0.9;
        transform: scale(0.98);
      }
      
      &::after {
        border: none;
      }
    }
  }
}
</style>