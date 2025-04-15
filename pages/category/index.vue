<template>
  <view class="container">
    <!-- 左侧系列列表 -->
    <scroll-view class="series-list" scroll-y>
      <view 
        v-for="(item, index) in seriesData" 
        :key="index"
        :class="['series-item', activeIndex === index ? 'active' : '']"
        @click="selectSeries(index)"
      >
        <text class="series-title">{{item.title}}</text>
        <text v-if="item.isNew" class="new-tag">NEW</text>
      </view>
    </scroll-view>

    <!-- 右侧产品展示 -->
    <scroll-view class="product-grid" scroll-y>
      <view 
        v-for="(product, pIndex) in currentProducts" 
        :key="pIndex"
        class="product-item"
        @click="navigateToBox(product.id)"
      >
        <image class="product-img" :src="product.image" mode="aspectFill"/>
        <text class="product-name">{{product.name}}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      seriesData: [
        { title: '人气新品', isNew: true },
        { title: '爆款推荐' },
        // 以下为模拟数据，实际应从接口获取
        { title: 'LABUBU新品' },
        { title: 'Skullpanda' },
        { title: 'Molly' },
        { title: 'Dimoo' },
        { title: 'Hirono小野' }
      ],
      currentProducts: [
        // 模拟产品数据
        { 
          id: 1,
          name: 'MOKOKO·携股公仔', 
          image: '/static/products/mokoko.jpg'
        },
        { 
          id: 2,
          name: 'LABUBU·情人节', 
          image: '/static/products/labubu.jpg'
        },
        // 更多产品数据...
      ]
    }
  },
  methods: {
    selectSeries(index) {
      this.activeIndex = index
      // 这里应请求对应系列的产品数据
      // this.loadProducts(this.seriesData[index].id)
    },
    navigateToBox(productId) {
      uni.navigateTo({
        url: `/pages/blindbox/index?id=${productId}`
      })
    },
    async loadProducts(seriesId) {
      // 接口请求示例
      const res = await uni.request({
        url: '/api/products',
        data: { seriesId }
      })
      this.currentProducts = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}

.series-list {
  width: 240rpx;
  background: #fff;
  padding: 20rpx 0;

  .series-item {
    position: relative;
    padding: 30rpx 20rpx;
    border-left: 6rpx solid transparent;

    &.active {
      border-left-color: #FF4444;
      background: #fff8f6;
      
      .series-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }
  }

  .series-title {
    font-size: 28rpx;
    color: #666;
    line-height: 1.4;
  }

  .new-tag {
    position: absolute;
    top: 20rpx;
    right: 10rpx;
    font-size: 20rpx;
    color: #FF4444;
    transform: scale(0.8);
  }
}

.product-grid {
  flex: 1;
  padding: 20rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;

  .product-item {
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
  }

  .product-img {
    width: 100%;
    height: 320rpx;
  }

  .product-name {
    display: block;
    padding: 20rpx;
    font-size: 26rpx;
    color: #333;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>