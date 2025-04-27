<template>
  <view class="order-detail">
    <!-- 商品信息区块 -->
    <view class="section">
       <view class="product-info-block">
            <!-- 左边：产品图片 -->
            <image class="product-cover" src="/static/product1.jpg" mode="aspectFill" />
      
            <!-- 中间：商品信息 -->
            <view class="product-middle">
              <text class="product-name">MOKOKO•甜心乐园(5)</text>
              <text class="discount-info">可抵扣0勋章</text>
            </view>
      
            <!-- 右边：数量显示 -->
            <text class="product-quantity">×1</text>
          </view>

      <view class="divider-line"></view>

      <!-- 费用明细 -->
      <view class="cost-item">
        <text>优惠券</text>
        <text>-¥0.00</text>
      </view>
      <view class="cost-item">
        <text>红包</text>
        <text>-¥0.00</text>
      </view>
      <view class="cost-item">
        <text>积分抵扣</text>
        <view class="integral">
          <text>10积分</text>
          <text class="red-text">-¥1.00</text>
        </view>
      </view>
      <view class="cost-item">
        <text>运费</text>
        <text>+¥0.00</text>
      </view>
	  <view class="divider-line"></view>
	  <!-- 实付金额 -->
	  <view class="total-section">
	    <text>实付：</text>
	    <text class="total-amount">￥38.00</text>
	  </view>
    </view>

    <!-- 订单信息 -->
    <view class="section order-info">
      <view class="info-item">
        <text>订单编号</text>
        <view class="copy-wrapper">
          <text>A041922520313591132</text>
          <text class="copy-btn" @click="copyOrderNo">复制</text>
        </view>
      </view>
      <view class="info-item">
        <text>下单时间</text>
        <text>2025-04-19 22:52:03</text>
      </view>
      <view class="info-item">
        <text>订单状态</text>
        <text class="status-tag">已完成</text>
      </view>
    </view>

    <!-- 客服按钮 -->
    <view class="customer-service">
      <button class="service-btn">联系客服</button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    copyOrderNo() {
      uni.setClipboardData({
        data: 'A041922520313591132',
        success: () => {
          uni.showToast({ title: '复制成功' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-detail {
  padding: 30rpx;
  background: #f5f5f5;
  min-height: 100vh;

  .section {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;

    .product-info-block {
      display: flex;
      align-items: center;
      gap: 30rpx;
      position: relative;
      padding-right: 120rpx; // 为数量预留空间
    
      .product-cover {
        width: 160rpx;
        height: 160rpx;
        border-radius: 12rpx;
        flex-shrink: 0;
      }
    
      .product-middle {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 15rpx;
    
        .product-name {
          font-size: 32rpx;
          color: #333;
          font-weight: bold;
          line-height: 1.4;
        }
    
        .discount-info {
          font-size: 26rpx;
          color: #999;
        }
      }
    
      .product-quantity {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        font-size: 32rpx;
        color: #666;
        padding-right: 30rpx;
      }
    }

    .divider-line {
      height: 2rpx;
      background: #f5f5f5;
      margin: 30rpx 0;
    }

    .cost-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      font-size: 28rpx;
      color: #666;

      .integral {
        display: flex;
        gap: 30rpx;
        align-items: center;
        .red-text {
          color: #e4393c;
        }
      }
    }
  }

  .total-section {
    background: #fff;
    border-radius: 16rpx;
    padding: 0rpx 30rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 32rpx;
    .total-amount {
      color: #e4393c;
      font-weight: bold;
      margin-left: 20rpx;
    }
  }

  .order-info {
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 20rpx 0;
      font-size: 28rpx;
      color: #666;
      
      .copy-wrapper {
        display: flex;
        gap: 20rpx;
        align-items: center;
        .copy-btn {
          color: #e4393c;
          padding: 8rpx 20rpx;
          border-radius: 8rpx;
          border: 1rpx solid #e4393c;
        }
      }

      .status-tag {
        background: #FFB6C1;
        color: #fff;
        padding: 8rpx 24rpx;
        border-radius: 8rpx;
        font-size: 24rpx;
      }
    }
  }

  .customer-service {
    position: fixed;
    bottom: 60rpx;
    left: 30rpx;
    right: 30rpx;
    .service-btn {
      background: #FFB6C1;
      color: #fff;
      border-radius: 50rpx;
      font-size: 32rpx;
      height: 90rpx;
      line-height: 90rpx;
      &::after { border: none; }
    }
  }
}
</style>