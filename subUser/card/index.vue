<template>
  <view class="container">
     <!-- 积分卡片 -->
        <view class="points-card">
          <view class="points-header">
            <image 
              class="user-avatar"
              src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/points-bg.png"
              mode="aspectFill"
            />
            <view class="points-info">
              <view class="points-row">  <!-- 新增横向布局容器 -->
                <text class="title">可用积分</text>
                <view class="value-wrapper">
                  <text class="value">20</text>
                  <image 
                    class="arrow-icon"
                    src="/static/enter.png"
                    mode="aspectFit"
                  />
                </view>
              </view>
            </view>
          </view>
        </view>

    <!-- 道具卡列表 -->
    <scroll-view scroll-y class="card-list" >
	  <!-- 正常状态 -->
	  <template v-if="cardList.length > 0">
		<view 
		  class="card-item"
		  v-for="(item,index) in cardList"
		  :key="index"
		>
		  <!-- 保持原有卡片结构 -->
		  <image class="card-icon" src="/static/card1.png"/>
		  <view class="card-info">
			<text class="card-name">双倍积分卡</text>
			<text class="card-count">剩余：3张</text>
		  </view>
		  <view class="card-action">
			<text class="btn-use">立即使用</text>
		</view>
		</view>
	  </template>
		
		 <!-- 空状态 -->
	  <view v-else class="empty-state">
		<image 
		  class="empty-image"
		  src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/empty.png"
		  mode="aspectFit"/>
	  </view>
      
      <!-- 更多道具卡项 -->
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cardList: [] // 模拟空数据状态
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #f5f5f5;
  min-height: 100vh;
}

.points-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 0rpx 32rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.05);
  margin: 20rpx 20rpx 0rpx 20rpx;

  /* 修改后的样式 */
  .points-header {
    display: flex;
    align-items: center; /* 确保整体垂直居中 */
  
    .user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		border: 4rpx solid #fff;
		box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
    }
  
    .points-info {
      flex: 1;
      height: 100rpx; /* 与头像高度一致 */
      display: flex;
      align-items: center; /* 垂直居中 */
  
      .points-row {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center; /* 确保内容垂直居中 */
        padding-left: 30rpx;
      }
  
      .title {
        font-size: 28rpx;
        color: #999;
        /* 移除原来的 margin-bottom */
      }
  
      .value-wrapper {
        display: flex;
        align-items: center;
        gap: 16rpx; /* 添加元素间距 */
  
        .value {
          font-size: 36rpx;
          color: #FF6B6B;
          line-height: 1; /* 避免文字间距影响对齐 */
        }
  
        .arrow-icon {
          width: 40rpx;
          height: 40rpx;
          margin-top: 4rpx; /* 微调视觉对齐 */
        }
      }
    }
  }
}

.card-list {
  .card-item {
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

    .card-icon {
      width: 120rpx;
      height: 120rpx;
      margin-right: 30rpx;
    }

    .card-info {
      flex: 1;
      .card-name {
        font-size: 34rpx;
        color: #333;
        display: block;
        margin-bottom: 16rpx;
      }
      .card-count {
        font-size: 26rpx;
        color: #999;
      }
    }

    .card-action {
      .btn-use {
        padding: 12rpx 40rpx;
        background: #FF6B6B;
        color: #fff;
        border-radius: 40rpx;
        font-size: 28rpx;
      }
    }
  }
  
  .empty-state {
    height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
  
    .empty-image {
      width: 400rpx;
      height: 300rpx;
      margin-bottom: 40rpx;
    }
  
    .empty-text {
      font-size: 32rpx;
      color: #999;
      margin-bottom: 40rpx;
    }
  
    .empty-btn {
      width: 280rpx;
      height: 80rpx;
      line-height: 80rpx;
      background: #FF6B6B;
      color: #fff;
      border-radius: 40rpx;
      font-size: 30rpx;
      
      &::after {
        border: none;
      }
    }
  }
}

</style>