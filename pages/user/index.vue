<template>
  <view class="user-page">
	<view class="user-image">
		<image
		  class="avatar" 
		  src="/static/avatar.png"
		  @click="navigateTo('/pages/profile/index')"
		/>
	</view>
    <!-- 顶部信息栏 -->
    <view class="user-header">
      <view class="user-info">
        <view class="wallet-info">
          <view class="wallet-item" @click="navigateTo('/pages/points/index')">
            <text class="num">10</text>
            <text class="label">积分</text>
          </view>
          <view class="wallet-item" @click="navigateTo('/pages/redpacket/index')">
            <text class="num">0</text>
            <text class="label">红包余额</text>
          </view>
		  <view class="wallet-item" @click="navigateTo('/pages/invite/index')">
		    <text class="num">2人</text>
		    <text class="label">邀请记录</text>
		  </view>
        </view>
      </view>
    </view>

    <!-- 订单状态 -->
    <view class="order-section">
      <view class="section-header">
        <text class="title">我的订单</text>
        <text 
          class="more"
          @click="navigateTo('/pages/order/list?type=all')"
        >全部订单></text>
      </view>
      <view class="order-tabs">
        <view 
          v-for="(item, index) in orderTabs" 
          :key="index"
          class="tab-item"
          @click="handleOrderTabClick(item.path)"
        >
          <image class="tab-icon" :src="item.icon"/>
          <text class="tab-text">{{item.label}}</text>
        </view>
      </view>
    </view>

    <!-- 服务工具 -->
    <view class="service-section">
      <text class="section-title">服务与工具</text>
      <view class="service-grid">
        <view 
          v-for="(item, index) in services" 
          :key="index"
          class="service-item"
          @click="handleServiceClick(item.type)"
        >
          <image class="service-icon" :src="item.icon"/>
          <text class="service-label">{{item.label}}</text>
        </view>
      </view>
    </view>
	
	  <!-- 新增功能入口 -->
	    <view class="info-list">
	      <view class="list-item" @click="navigateTo('/pages/cart/index')">
	        <image class="list-icon" src="/static/icon-cart.png"/>
	        <text class="label">购物车</text>
	        <image class="arrow" src="/static/arrow-right.png"/>
	      </view>
	
	      <view class="list-item" @click="navigateTo('/pages/address/list')">
	        <image class="list-icon" src="/static/icon-address.png"/>
	        <text class="label">收货地址</text>
	        <image class="arrow" src="/static/arrow-right.png"/>
	      </view>
	
	      <view class="list-item" @click="navigateTo('/pages/agreement/index')">
	        <image class="list-icon" src="/static/icon-agreement.png"/>
	        <text class="label">规则与协议</text>
	        <image class="arrow" src="/static/arrow-right.png"/>
	      </view>
	    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      版本: v3.9.14
    </view>
  </view>
</template>
<script>

export default {
  data() {
    return {
      orderTabs: [
        { label: '盒柜', icon: '/static/icon-locker.png', path: '/pages/box/index' },
        { label: '待发货', icon: '/static/icon-shipping.png', path: '/pages/order/list?type=pending' },
        { label: '待收货', icon: '/static/icon-receiving.png', path: '/pages/order/list?type=delivering' },
        { label: '已完成', icon: '/static/icon-completed.png', path: '/pages/order/list?type=completed' }
      ],
      services: [
        { label: '优惠券', icon: '/static/icon-coupon.png', type: 'coupon' },
        { label: '道具卡', icon: '/static/icon-card.png', type: 'card' },
        { label: '兑换码', icon: '/static/icon-code.png', type: 'code' },
        { label: '客服', icon: '/static/icon-service.png', type: 'service' }
      ]
    }
  },
  methods: {
    navigateTo(url) {
      uni.navigateTo({ url })
    },
    handleOrderTabClick(path) {
      if(path.includes('locker')) {
        uni.switchTab({ url: path })
      } else {
        uni.navigateTo({ url: path })
      }
    },
    handleServiceClick(type) {
      const map = {
        coupon: '/pages/coupon/index',
        card: '/pages/card/index',
        code: '/pages/code/index',
        service: this.handleCustomerService
      }
      if(type === 'service') return map[type]()
      uni.navigateTo({ url: map[type] })
    },
    handleCustomerService() {
      // 微信客服功能
      const contactButton = this.$refs.contactButton
      contactButton.$el.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-page {
  padding: 30rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.user-image {
	.avatar {
	  width: 120rpx;
	  height: 120rpx;
	  border-radius: 50%;
	  margin-right: 40rpx;
	}
	
}

.user-header {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;

  .user-info {
    display: flex;
    align-items: center;

    .wallet-info {
      flex: 1;
      display: flex;

      .wallet-item {
        flex: 1;
        text-align: center;
        
        .num {
          display: block;
          font-size: 36rpx;
          color: #FF4444;
          margin-bottom: 10rpx;
        }

        .label {
          font-size: 28rpx;
          color: #666;
        }
      }
    }
  }
}

.order-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;

    .title {
      font-size: 32rpx;
      font-weight: bold;
    }

    .more {
      color: #999;
      font-size: 28rpx;
    }
  }

  .order-tabs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;

    .tab-item {
      text-align: center;

      .tab-icon {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 15rpx;
      }

      .tab-text {
        display: block;
        font-size: 26rpx;
        color: #333;
      }
    }
  }
}

.service-section {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;

  .section-title {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
  }

  .service-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40rpx 20rpx;

    .service-item {
      text-align: center;

      .service-icon {
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 15rpx;
      }

      .service-label {
        font-size: 26rpx;
        color: #333;
      }
    }
  }
  
.info-list {
    // 保持原有样式
    .list-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      
      .list-icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 20rpx;
      }
      
      .label {
        flex: 1;
        font-size: 30rpx;
        color: #333;
      }
      
      .arrow {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
}

.version-info {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  padding: 40rpx 0;
}

// 隐藏的客服按钮
.contact-button {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
</style>