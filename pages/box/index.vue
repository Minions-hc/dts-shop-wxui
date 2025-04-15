<template>
  <view class="container">
    <!-- 顶部Tab -->
    <view class="main-tab">
      <view 
        v-for="(item, index) in mainTabs" 
        :key="index"
        :class="['tab-item', currentMainTab === index ? 'active' : '']"
        @click="switchMainTab(index)"
      >
        {{item}}
      </view>
    </view>

    <!-- 子Tab -->
    <view class="sub-tab">
      <view 
        v-for="(item, index) in subTabs" 
        :key="index"
        :class="['sub-item', currentSubTab === index ? 'active' : '']"
        @click="switchSubTab(index)"
      >
        {{item}}
      </view>
      <image 
        class="lock-icon" 
        src="/static/lock.png"
        @click="navigateTo('/pages/safe/index')"
      />
    </view>
	<view class="tips-bar">
		<text class="tips">i盒框提货运费12元满三件包邮，不支持7天无理由退换货</text>	
	</view>

    <!-- 商品展示 -->
    <view class="product-grid">
      <view 
        v-for="(item, index) in productList" 
        :key="index"
        class="product-item"
        @click="toggleSelect(item.id)"
      >
        <image 
          v-if="selectedIds.includes(item.id)"
          class="check-icon" 
          src="/static/checked.png"
        />
        <image class="product-img" :src="item.image"/>
        <text class="product-name">{{item.name}}</text>
        <text class="product-price">¥{{item.price}}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="operation-bar">
      <view class="btn-group">
        <view 
          class="btn ship-btn"
          :class="{active: selectedIds.length}"
          :style="{backgroundColor: selectedIds.length ? '#FFD700' : '#CCCCCC'}"
          @click="handleShip"
        >
          选择发货
        </view>
        <view 
          class="btn market-btn"
          @click="navigateTo('/pages/market/index')"
        >
          集市换娃
        </view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      mainTabs: ['待处理', '已提货', '全部'],
      currentMainTab: 0,
      subTabs: ['全部', 'A赏', 'B赏', '终赏', '其它'],
      currentSubTab: 0,
      selectedIds: [],
      productList: [
        // 示例数据
        {id: 1, image: '/static/product1.jpg', name: '森林精灵', price: 89},
        {id: 2, image: '/static/product2.jpg', name: '太空旅人', price: 129},
        // ...更多商品数据
      ]
    }
  },
  methods: {
    switchMainTab(index) {
      this.currentMainTab = index
      // 这里应请求对应数据
    },
    switchSubTab(index) {
      this.currentSubTab = index
      // 这里应请求对应数据
    },
    toggleSelect(id) {
      if (this.selectedIds.includes(id)) {
        this.selectedIds = this.selectedIds.filter(item => item !== id)
      } else {
        this.selectedIds = [...this.selectedIds, id]
      }
    },
    handleShip() {
      if (!this.selectedIds.length) return
      uni.showModal({
        title: '确认发货',
        content: `已选择${this.selectedIds.length}件商品`
      })
    },
    navigateTo(url) {
      uni.navigateTo({ url })
    }
  }
}
</script>

<style lang="scss">
.main-tab {
  display: flex;
  padding: 30rpx 0;
  border-bottom: 2rpx solid #eee;
  
  .tab-item {
    flex: 1;
    text-align: center;
    font-size: 32rpx;
    color: #666;
    
    &.active {
      font-weight: bold;
      color: #000;
    }
  }
}

.sub-tab {
  display: flex;
  align-items: center;
  padding: 20rpx;
  position: relative;
  
  .sub-item {
    padding: 10rpx 20rpx;
    margin-right: 30rpx;
    font-size: 28rpx;
    position: relative;
    
    &.active {
      font-weight: bold;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 10rpx;
        background: #D4B483;
        border-radius: 10rpx;
      }
    }
	.tips {
	  display: block;
	  color: #999;
	  font-size: 24rpx;
	  margin-bottom: 30rpx;
	}
  }
  
  .lock-icon {
    position: absolute;
    right: 30rpx;
    width: 40rpx;
    height: 40rpx;
  }
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  padding: 30rpx;
  
  .product-item {
    position: relative;
    text-align: center;
    
    .check-icon {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      width: 40rpx;
      height: 40rpx;
      z-index: 2;
    }
    
    .product-img {
      width: 160rpx;
      height: 160rpx;
      border-radius: 16rpx;
    }
    
    .product-name {
      display: block;
      font-size: 24rpx;
      margin: 10rpx 0;
    }
    
    .product-price {
      color: #FF4444;
      font-size: 26rpx;
    }
  }
}

.operation-bar {
  padding: 30rpx;
  
  .btn-group {
    display: flex;
    gap: 30rpx;
    
    .btn {
      flex: 1;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30rpx;
      
      &.ship-btn {
        color: #666;
        
        &.active {
          color: #333;
        }
      }
      
      &.market-btn {
        background: #FFF;
        border: 2rpx solid #D4B483;
        color: #D4B483;
      }
    }
  }
}
</style>