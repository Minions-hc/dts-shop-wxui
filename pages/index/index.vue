<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="header">
      <text class="logo">潮赏士多</text>
      <view class="search-box">
        <input class="search-input" placeholder="搜索潮玩" @click="navigateTo('/pages/category/index')"/>
      </view>
    </view>

    <!-- 热销轮播 -->
    <view class="hot-swiper">
      <swiper :indicator-dots="true" :autoplay="true" circular>
        <swiper-item v-for="(item, index) in hotList" :key="index">
          <image :src="item.image" mode="aspectFill" class="swiper-img"/>
        </swiper-item>
      </swiper>
      <view class="go-button">即刻前往</view>
    </view>

    <!-- 踩雷赏轮播 -->
    <view class="thunder-section">
      <view class="section-header">
        <text class="section-title">踩雷消消乐</text>
        <view class="more-btn">MORE</view>
      </view>
      <swiper class="thunder-swiper">
        <!-- 轮播内容 -->
      </swiper>
    </view>

    <!-- 产品系列Tab -->
    <view class="series-tab">
      <view 
        v-for="(item, index) in seriesList" 
        :key="index"
        :class="['tab-item', currentSeries === index ? 'active' : '']"
        @click="changeSeries(index)"
      >
        {{item.name}}
      </view>
    </view>

    <!-- 瀑布流商品展示 -->
    <view class="waterfall">
      <view 
        v-for="(item, index) in productList" 
        :key="index"
        class="product-item"
		@click="navigateTo('/pages/blindBox/caileishang')"
      >
        <image :src="item.image" class="product-img"/>
        <text class="product-name">{{item.name}}</text>
        <view class="price-box">
          <text class="price">¥{{item.price}}</text>
          <text class="sales">已售{{item.sales}}</text>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <!-- <view class="tab-bar">
      <view 
        v-for="(item, index) in tabList" 
        :key="index"
        class="tab-item"
        @click="switchTab(index)"
      >
        <image 
          :src="currentTab === index ? item.selectedIcon : item.icon" 
          class="tab-icon"
        />
        <text :class="['tab-text', currentTab === index ? 'active' : '']">
          {{item.text}}
        </text>
      </view>
    </view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      currentSeries: 0,
      hotList: [{image: '/static/hot1.jpg'}, {image: '/static/hot2.jpg'}],
      seriesList: [{name: 'Molly'}, {name: 'Pucky'}, {name: 'Dimoo'}],
      productList: [{/* 商品数据 */}],
      tabList: [
        {text: '首页', icon: '/static/home.png', selectedIcon: '/static/home-active.png'},
        {text: '盒柜', icon: '/static/box.png', selectedIcon: '/static/box-active.png'},
        {text: '活动', icon: '/static/event.png', selectedIcon: '/static/event-active.png'},
        {text: '我的', icon: '/static/user.png', selectedIcon: '/static/user-active.png'}
      ]
    }
  },
  methods: {
    switchTab(index) {
      this.currentTab = index
    },
    changeSeries(index) {
      this.currentSeries = index
      // 这里请求对应系列的商品数据
    },
	navigateTo(url) {
	  uni.navigateTo({ url })
	}
  }
}
</script>

<style lang="scss">
.container {
  padding-bottom: 120rpx;
}

.header {
  display: flex;
  align-items: center;
  padding: 20rpx;
  .logo {
    color: #FF0000;
    font-size: 40rpx;
    font-family: 'YouYuan'; // 需要加载泡泡玛特风格字体
    margin-right: 30rpx;
  }
  .search-box {
    flex: 1;
    background: #f5f5f5;
    border-radius: 50rpx;
    padding: 10rpx 20rpx;
  }
}

.hot-swiper {
  position: relative;
  .swiper-img {
    width: 750rpx;
    height: 300rpx;
  }
  .go-button {
    position: absolute;
    bottom: 60rpx;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10rpx 40rpx;
    border-radius: 8rpx;
  }
}

.thunder-section {
  padding: 20rpx;
  .section-header {
    display: flex;
    justify-content: space-between;
    .more-btn {
      background: #eee;
      border-radius: 30rpx;
      padding: 5rpx 20rpx;
    }
  }
}

.series-tab {
  display: flex;
  padding: 20rpx;
  .tab-item {
    margin-right: 40rpx;
    font-size: 28rpx;
    transition: all 0.3s;
    &.active {
      font-size: 32rpx;
      color: #FF4081;
      font-weight: bold;
    }
  }
}

.waterfall {
  column-count: 2;
  column-gap: 20rpx;
  padding: 20rpx;
  .product-item {
    break-inside: avoid;
    margin-bottom: 20rpx;
    .product-img {
      width: 100%;
      height: 400rpx;
      border-radius: 16rpx;
    }
  }
}

.tab-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100rpx;
  display: flex;
  background: white;
  border-top: 1rpx solid #eee;
  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .tab-icon {
      width: 48rpx;
      height: 48rpx;
    }
    .tab-text {
      font-size: 24rpx;
      &.active {
        color: #FF4081;
      }
    }
  }
}
</style>