<template>
  <view class="container">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <image class="back-icon" src="/static/back.png" @click="navigateBack"/>
      <text class="title">物品详情</text>
    </view>

    <!-- 商品信息 -->
    <scroll-view class="content" scroll-y>
      <!-- 基础信息 -->
      <view class="info-card">
        <view class="header">
          <text class="name">【自制款】拉布布帆布袋</text>
          <view class="medal">
            <image class="medal-icon" src="/static/medal.png"/>
            <text>可抵扣4勋章 x1</text>
          </view>
        </view>

        <!-- 详细信息 -->
        <view class="detail-list">
          <view class="detail-item">
            <text class="label">物品SID</text>
            <view class="value-box">
              <text class="value">S79167</text>
              <text class="copy-btn" @click="copySID">复制</text>
            </view>
          </view>

          <view class="detail-item">
            <text class="label">活动类型</text>
            <text class="value">一番赏</text>
          </view>

          <view class="detail-item">
            <text class="label">赏类型</text>
            <text class="value">D赏</text>
          </view>

          <view class="detail-item">
            <text class="label">房间号</text>
            <text class="value">第1房间</text>
          </view>

          <view class="detail-item">
            <text class="label">物品状态</text>
            <text class="value status">{{detail.status}}</text>
          </view>

          <view class="detail-item">
            <text class="label">获得时间</text>
            <text class="value">2025-01-16 02:47:01</text>
          </view>
        </view>
      </view>

      <!-- 保险箱操作 -->
      <view class="safe-box">
        <image 
          class="safe-icon" 
          :src="isInSafeBox ? '/static/lock_active.png' : '/static/lock.png'" 
          @click="toggleSafeBox"
        />
        <text class="safe-text">{{isInSafeBox ? '已存入保险箱' : '存入保险箱'}}</text>
        <text class="safe-count">当前保险箱物品：{{safeCount}}件</text>
      </view>
    </scroll-view>

    <!-- 底部操作 -->
    <view class="bottom-action">
      <view 
        class="action-btn"
        :class="{'disabled': detail.status !== '待处理'}"
        @click="handleAction"
      >
        {{detail.status === '待处理' ? '申请发货' : '已申请发货'}}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detail: {
        status: '待处理'
      },
      isInSafeBox: false,
      safeCount: 4
    }
  },
  methods: {
    navigateBack() {
      uni.navigateBack()
    },
    
    copySID() {
      uni.setClipboardData({
        data: 'S79167',
        success: () => {
          uni.showToast({ title: '复制成功' })
        }
      })
    },
    
    toggleSafeBox() {
      this.isInSafeBox = !this.isInSafeBox
      this.safeCount += this.isInSafeBox ? 1 : -1
      uni.showToast({
        title: this.isInSafeBox ? '已存入保险箱' : '已取出',
        icon: 'none'
      })
    },
    
    handleAction() {
      if(this.detail.status !== '待处理') return
      uni.showModal({
        title: '确认申请发货',
        content: '确定要申请发货此物品吗？',
        success: res => {
          if(res.confirm) {
            this.detail.status = '已申请发货'
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background: #f5f5f5;
}

.nav-bar {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #fff;
  
  .back-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 20rpx;
  }
  
  .title {
    font-size: 36rpx;
    font-weight: bold;
  }
}

.content {
  height: calc(100vh - 200rpx);
  padding: 30rpx;
}

.info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;

  .header {
    border-bottom: 1rpx solid #eee;
    padding-bottom: 30rpx;
    margin-bottom: 30rpx;

    .name {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .medal {
      display: flex;
      align-items: center;

      .medal-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 15rpx;
      }
    }
  }

  .detail-list {
    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30rpx;

      .label {
        color: #999;
        width: 180rpx;
      }

      .value {
        flex: 1;
        text-align: right;

        &.status {
          color: #D4B483;
        }
      }

      .value-box {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .copy-btn {
          color: #007AFF;
          margin-left: 30rpx;
          padding: 8rpx 20rpx;
          border: 1rpx solid #007AFF;
          border-radius: 30rpx;
        }
      }
    }
  }
}

.safe-box {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;

  .safe-icon {
    width: 80rpx;
    height: 80rpx;
    margin-bottom: 20rpx;
  }

  .safe-text {
    display: block;
    font-size: 32rpx;
    margin-bottom: 15rpx;
  }

  .safe-count {
    color: #999;
  }
}

.bottom-action {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 30rpx;
  background: #fff;
  border-top: 1rpx solid #eee;

  .action-btn {
    background: #D4B483;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    border-radius: 45rpx;
    font-size: 32rpx;

    &.disabled {
      background: #ccc;
      color: #666;
    }
  }
}
</style>