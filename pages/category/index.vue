<template>
  <view class="container">
    <!-- 顶部图片区 -->
    <image 
      src="/static/category-back.png" 
      mode="widthFix"
      class="top-banner"
      lazy-load
    />

    <!-- 内容区 -->
    <view class="content-wrapper">
      <!-- 左侧分类 -->
      <scroll-view 
        class="category-list"
        scroll-y
        enhanced
        :show-scrollbar="false"
      >
        <view 
          v-for="(item, index) in categories"
          :key="index"
          class="category-item"
          :class="{ active: activeCategory === index }"
          @click="switchCategory(index)"
        >
          {{ item.name }}
		  <image v-if="item.isHot" class="hot-serice" src="/static/hot.gif"></image>
		  <image v-if="item.isNew" class="new-serice" src="/static/new-product.gif"></image>
        </view>
      </scroll-view>

      <!-- 右侧产品 -->
      <scroll-view
        class="product-list"
        scroll-y
        enhanced
        :show-scrollbar="false"
      >
        <view class="product-grid">
          <view 
            v-for="(product, pIndex) in currentProducts"
            :key="pIndex"
            class="product-card"
			@tap="toBindBoxPage(product)"
          >
            <image
              :src="product.image"
              mode="aspectFill"
              class="product-image"
              lazy-load
            />
            <view class="product-info">
              <text class="product-title">{{ product.title }}</text>
              <text class="product-price">¥{{ product.price }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeCategory: 0,
      categories: [
		  {name: '人气新品', type: 4,isNew: true},
		  {name: '爆款推荐', type: 5,isHot: true},
        { name: 'LABUBU系列', type: 1 },
        { name: 'Molly系列', type: 2 },
        { name: 'Skullpanda', type: 3 }
      ],
      products: {
        1: [
          { title: 'LABUBU①', price: 299, image: '/static/serice2.jpg' },
          { title: 'LABUBU②', price: 329, image: '/static/serice3.jpg' },
          // 更多产品...
        ],
        2: [
          { title: '美林甲辰', price: 399, image: '/static/serice1.jpg' },
          { title: '莫奈-睡莲', price: 459, image: '/static/serice2.jpg' },
          // 更多产品...
        ]
      }
    }
  },
  computed: {
    currentProducts() {
      const type = this.categories[this.activeCategory].type
      return this.products[type] || []
    }
  },
  methods: {
    switchCategory(index) {
      this.activeCategory = index
    },
	toBindBoxPage(item){
		uni.navigateTo({
			url:'/pages/blindBox/yifanshang'
		})
	}
  }
}
</script>

<style lang="scss" scoped>
/* 基础布局 */
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-banner {
  width: 100%;
  height: 250rpx;
  flex-shrink: 0;
}

.content-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #f8f8f8;
}

/* 左侧分类样式 */
.category-list {
  width: 30%;
  height: 100%;
  background: #fff;
  
  .category-item {
    padding: 32rpx;
	padding-right: 20rpx;
	padding-left: 20rpx;
    font-size: 28rpx;
    color: #666;
    border-bottom: 1rpx solid #eee;
    transition: all 0.2s;
	display: flex;
    
    &.active {
      color: #ff3b30;
      background: #fff5f5;
      font-weight: 500;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6rpx;
        height: 40rpx;
        background: #ff3b30;
      }
    }
	.hot-serice,.new-serice{
		width: 60rpx;
		height: 40rpx;
		max-width: 60rpx;
		max-height: 40rpx;
		margin-left: 8rpx;
	}
  }
}

/* 右侧产品列表 */
.product-list {
  width: 70%;
  padding: 20rpx;
  
  .product-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .product-card {
    width: 48%;
    margin-bottom: 20rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  }
  
  .product-image {
    width: 100%;
    height: 320rpx;
  }
  
  .product-info {
    padding: 20rpx;
    
    .product-title {
      display: block;
      font-size: 26rpx;
      color: #333;
      margin-bottom: 8rpx;
    }
    
    .product-price {
      font-size: 28rpx;
      color: #ff3b30;
      font-weight: 600;
    }
  }
}

/* 性能优化相关 */
image {
  will-change: transform;
  backface-visibility: hidden;
}
</style>