<template>
  <view class="address-container">
    <!-- 提示区域 -->
    <view class="notice-box">
      <image class="notice-icon" src="/static/notice.png" mode="aspectFit"/>
      <text class="notice-text">请设置自动提货地址，盒框中的A页只经预存放时间超过30天后\n将会发往该地址</text>
    </view>

    <!-- 地址卡片 -->
    <view class="address-card">
      <!-- 操作图标 -->
      <image class="icon-delete" src="/static/icon-delete.png" mode="aspectFit"/>
	  <image class="icon-edit" src="/static/icon-edit.png" mode="aspectFit" @click="navigateToDetail(this)"/>
      
      <!-- 地址头 -->
      <view class="address-header">
        <view class="icon-group">
          <image class="icon-default" src="/static/default-address.png"/>
          <image class="icon-pickup" src="/static/send-address.png"/>
        </view>
        <text class="user-name">张先生</text>
		 <text class="phone">138****1313</text>
      </view>

      <!-- 地址详情 -->
      <view class="address-content">
        <text class="address-text">广东省深圳市光明区公明街道奥园峰峦B-407</text>
      </view>
	  
    </view>
	
	<!-- 地址卡片 -->
	<view class="address-card">
	  <!-- 操作图标 -->
	  <image class="icon-delete" src="/static/icon-delete.png" mode="aspectFit"/>
	  <image class="icon-edit" src="/static/icon-edit.png" mode="aspectFit"/>
	  
	  <!-- 地址头 -->
	  <view class="address-header">
	    <view class="icon-group">
	      <image class="icon-default" src="/static/default-address.png"/>
	      <image class="icon-pickup" src="/static/send-address.png"/>
	    </view>
	    <text class="user-name">张先生</text>
		 <text class="phone">138****1313</text>
	  </view>
	
	  <!-- 地址详情 -->
	  <view class="address-content">
	    <text class="address-text">广东省深圳市光明区公明街道奥园峰峦B-407</text>
	  </view>
	  
	</view>

    <!-- 图片按钮 -->
    <view class="action-buttons">
      <image class="btn-image" src="/static/new-address.png" mode="aspectFit" @click="navigateToDetail(null)"/>
      <image class="btn-image" src="/static/import.png" mode="aspectFit" @tap="importAddress"/>
    </view>
  </view>
</template>

<script>
	export default {
		methods: {
			navigateToDetail(item) {
				uni.navigateTo({
					url: '/pages/address/detail'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.address-container {
  padding: 0rpx 30rpx 0rpx 30rpx;
  min-height: 100vh;
  background: #f5f5f5;
}

.notice-box {
  background: #000;
  border-radius: 25rpx;
  padding: 10rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: flex-start;

  .notice-icon {
    width: 40rpx;
    height: 40rpx;
    margin: 10rpx;
    flex-shrink: 0;
  }

  .notice-text {
    font-size: 22rpx;
    color: #fff;
    line-height: 1.4;
    white-space: pre-line;
  }
}

.address-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

  .icon-delete {
    width: 30rpx;
    height: 30rpx;
    position: absolute;
    top: 32rpx;
    right: 32rpx;
  }

  .icon-edit {
    width: 30rpx;
    height: 30rpx;
    position: absolute;
    bottom: 32rpx;
    right: 32rpx;
  }

  .address-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    .icon-group {
      display: flex;
      
      image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 12rpx;
      }
    }

    .user-name {
      font-size: 30rpx;
      color: #333;
      font-weight: 500;
    }
	
	.phone {
	  display: block;
	  font-size: 30rpx;
	  color: #666;
	  margin-left: 60rpx;
	}
  }

  .address-content {
    .address-text {
      font-size: 26rpx;
      color: #666;
      line-height: 1.4;
    }
  }
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  padding: 0 70rpx;
  position: fixed;
  bottom: 60rpx;
  left: 0;
  right: 0;

  .btn-image {
    width: 280rpx;
    height: 100rpx;
  }
}
</style>