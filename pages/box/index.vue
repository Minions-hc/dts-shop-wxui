<template>
  <view class="container">
    <!-- 顶部菜单 -->
    <view class="top-menu">
      <view 
        v-for="(item, index) in menus"
        :key="index"
        :class="['menu-item', activeMenu === index ? 'active' : '']"
        @click="changeMenu(index)"
      >
        {{ item }}
      </view>
    </view>

    <!-- 筛选按钮 -->
    <view class="filter-btns">
      <view 
        v-for="(btn, index) in filters"
        :key="index"
        :class="['filter-btn', activeFilter === index ? 'active' : '']"
        @click="changeFilter(index)"
      >
        {{ btn }}
      </view>
    </view>

    <!-- 保险箱入口 -->
    <view class="safe-box-btn" @click="navigateToSafeBox">
      <image class="lock-icon" src="/static/lock.png"/>
      <text class="count">{{ safeBoxCount }}</text>
    </view>

    <!-- 发货提示 -->
    <view class="shipping-tips">
      <image class="tip-icon" src="/static/tip.png"/>
      <text>盒柜提货运费12元满三件包邮，不支持7天无理由退换货</text>
    </view>

    <!-- 产品列表 -->
    <scroll-view class="product-list" scroll-y>
      <view 
        v-for="(item, index) in filteredProducts"
        :key="index"
        class="product-item"
        @click="navigateToDetail(item.id)"
      >
        <image class="product-img" :src="item.image"/>
        
        <view class="product-info">
          <view class="top-section">
            <text class="name">{{ item.name }}</text>
            <text class="quantity">x{{ item.quantity }}</text>
          </view>
          
          <view class="meta-info">
            <text class="source">{{ item.source }}</text>
            <text class="grade">{{ item.grade }}</text>
          </view>

          <view class="medal-info">
            <text>可抵扣{{ item.medal }}勋章</text>
            <view class="status-btn">{{ item.status }}</view>
          </view>

          <view class="bottom-section">
            <text class="time">{{ item.time }}</text>
            <view class="actions">
              <image class="action-icon" src="/static/lock_gray.png"/>
              <view class="donate-btn">赠送</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作 -->
    <view class="bottom-action">
      <view 
        class="ship-btn"
        :class="{disabled: selectedCount === 0}"
        @click="handleShip"
      >
        选择发货
      </view>
		<view class="btn market-btn"
		@click="navigateTo('/pages/market/index')"
		>
		集市换娃
		</view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      menus: ['待处理', '已提货', '全部'],
      filters: ['全部', 'A赏', 'B赏', '终赏', '其他'],
      activeMenu: 0,
      activeFilter: 0,
      safeBoxCount: 4,
      products: [
        {
          id: 1,
          image: '/static/product1.jpg',
          name: '【自制款】拉布布帆布袋',
          quantity: 1,
          source: '一番赏',
          grade: 'D赏',
          medal: 4,
          status: '待处理',
          time: '01-16 02:47'
        }
        // 更多产品数据...
      ]
    }
  },
  computed: {
    filteredProducts() {
      return this.products.filter(item => {
        const menuMatch = this.activeMenu === 0 ? item.status === '待处理' :
          this.activeMenu === 1 ? item.status === '已提货' : true
        
        const filterMatch = this.activeFilter === 0 ? true :
          item.grade === this.filters[this.activeFilter]
        
        return menuMatch && filterMatch
      })
    },
    selectedCount() {
      return this.products.filter(item => item.selected).length
    }
  },
  methods: {
    changeMenu(index) {
      this.activeMenu = index
    },
    changeFilter(index) {
      this.activeFilter = index
    },
    navigateToSafeBox() {
      uni.navigateTo({ url: '/pages/safe/index' })
    },
    handleShip() {
      if (this.selectedCount === 0) return
      // 处理发货逻辑
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 120rpx;
}

.top-menu {
  display: flex;
  padding: 30rpx;
  border-bottom: 2rpx solid #eee;

  .menu-item {
    flex: 1;
    text-align: center;
    font-size: 32rpx;
    padding: 20rpx 0;
    
    &.active {
      color: #D4B483;
      font-weight: bold;
      border-bottom: 4rpx solid #D4B483;
    }
  }
}

.filter-btns {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  gap: 20rpx;

  .filter-btn {
    padding: 12rpx 30rpx;
    border-radius: 40rpx;
    background: #f5f5f5;
    color: #666;

    &.active {
      background: #D4B483;
      color: #333;
    }
  }
}

.safe-box-btn {
  position: fixed;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 120rpx;
  height: 160rpx;
  background: #D4B483;
  border-radius: 60rpx 60rpx 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  z-index: 100;

  .lock-icon {
    width: 60rpx;
    height: 60rpx;
    margin-bottom: 10rpx;
  }

  .count {
    color: #fff;
    font-size: 28rpx;
  }
}

.shipping-tips {
  background: #D4B483;
  padding: 20rpx;
  margin: 20rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;

  .tip-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 15rpx;
  }
}

.product-list {
  padding: 20rpx;

  .product-item {
    display: flex;
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;

    .product-img {
      width: 200rpx;
      height: 200rpx;
      border-radius: 12rpx;
      margin-right: 20rpx;
    }

    .product-info {
      flex: 1;

      .top-section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15rpx;

        .name {
          font-size: 32rpx;
          font-weight: bold;
        }

        .quantity {
          color: #666;
        }
      }

      .meta-info {
        display: flex;
        gap: 20rpx;
        margin-bottom: 15rpx;
        color: #666;
      }

      .medal-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15rpx;

        .status-btn {
          padding: 8rpx 20rpx;
          border: 1rpx solid #D4B483;
          border-radius: 30rpx;
          color: #D4B483;
        }
      }

      .bottom-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #999;

        .actions {
          display: flex;
          align-items: center;
          gap: 20rpx;

          .action-icon {
            width: 40rpx;
            height: 40rpx;
          }

          .donate-btn {
            padding: 8rpx 20rpx;
            background: #eee;
            border-radius: 30rpx;
          }
        }
      }
    }
  }
}

.bottom-action {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 20rpx;
  background: #fff;
  border-top: 1rpx solid #eee;

  .ship-btn {
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
  
   &.market-btn {
          background: #FFF;
          border: 2rpx solid #D4B483;
          color: #D4B483;
        }

}
</style>