<template>
  <view class="order-detail">
    <!-- 商品信息区块 -->
    <view class="section">
		
		
       <view class="product-info-block" v-for="subItem in orderInfo.items" :key="subItem.id">
            <!-- 左边：产品图片 -->
            <image class="product-cover" :src="subItem.productImg" mode="aspectFill" />
      
            <!-- 中间：商品信息 -->
            <view class="product-middle">
              <text class="product-name">{{subItem.productName}}</text>
              <text class="discount-info">可抵扣{{subItem.productBadge}}勋章</text>
            </view>
      
            <!-- 右边：数量显示 -->
            <text class="product-quantity">×{{subItem.quantity}}</text>
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
          <text>积分</text>
          <text class="red-text">-¥0.00</text>
        </view>
      </view>
      <view class="cost-item">
        <text>运费</text>
        <text>+¥{{orderInfo.shippingFee}}</text>
      </view>
	  <view class="divider-line"></view>
	  <!-- 实付金额 -->
	  <view class="total-section">
	    <text>实付：</text>
	    <text class="total-amount">￥{{orderInfo.paymentAmount == undefined ? 0 : orderInfo.paymentAmount}}</text>
	  </view>
    </view>

    <!-- 订单信息 -->
    <view class="section order-info">
      <view class="info-item">
        <text>订单编号</text>
        <view class="copy-wrapper">
          <text>{{orderInfo.orderNo}}</text>
          <text class="copy-btn" @click="copyOrderNo">复制</text>
        </view>
      </view>
      <view class="info-item">
        <text>下单时间</text>
        <text>{{orderInfo.createTime}}</text>
      </view>
      <view class="info-item">
        <text>订单状态</text>
        <text class="status-tag">{{getOrderStatus}}</text>
      </view>
	  <view class="info-item" v-if="orderInfo.orderStatus === 'SHIPPED'">
	    <text>物流渠道</text>
	    <text>{{orderInfo.shippingChannel}}</text>
	  </view>
	  <view class="info-item" v-if="orderInfo.orderStatus === 'SHIPPED'">
	    <text>快递单号</text>
	    <text>{{orderInfo.trackingNumber}}</text>
	  </view>
    </view>

    <!-- 客服按钮 -->
    <view class="customer-service">
      <button class="service-btn">联系客服</button>
    </view>
  </view>
</template>

<script>
import {get} from "@/utils/rest-util.js"
export default {
	onLoad(param){
		const {orderId,userId,orderStatus} = param;
		this.userId = uni.getStorageSync('userId');
		this.orderId = orderId;
		this.orderStatus = orderStatus;
	},
	onShow(){
		this.initData();
	},
	data(){
			return {
				userId:'',
				orderId:'',
				orderStatus:'',
				orderInfo: {}
			}
	},
	computed:{
		getOrderStatus(){
			const orderStatus = this.orderInfo.orderStatus;
			const orderMap = {
				'WAIT_SHIPPING':'待发货',
				'SHIPPED':'已发货',
				'COMPLETED':'已完成'
			}
			return orderMap[orderStatus]
		},
		pointFee(){
			return this.orderInfo.pointsDeduction / 10
		}
	},
  methods: {
    copyOrderNo() {
      uni.setClipboardData({
        data: this.orderInfo.orderNo,
        success: () => {
          uni.showToast({ title: '复制成功' })
        }
      })
    },
	initData(){
		get(`wx/order/queryOrderList?userId=${this.userId}&orderId=${this.orderId}&orderStatus=${this.orderStatus}`).then(json=>{
			const result = json.data.data;
			const orderList = result.items || [];
			this.orderInfo = orderList[0]
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