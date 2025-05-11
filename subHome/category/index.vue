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
          :key="item.id"
          class="category-item"
          :class="{ active: activeCategory === index }"
          @click="switchCategory(item,index)"
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
            v-for="product in currentProducts"
            :key="product.seriesId"
            class="product-card"
			@click="toBindBoxPage(product)"
          >
            <image
              :src="product.seriesImage"
              mode="aspectFill"
              class="product-image"
              lazy-load
            />
            <view class="product-info">
              <text class="product-title">{{ product.seriesName }}</text>
              <text class="product-price">¥{{ product.price }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
	import {
		get,
		post
	} from "@/utils/rest-util.js"
export default {
	onLoad(){
		
		this.userId = 'U10001';
	},
	onShow() {
		this.loadAllData()
		this.loadCateData();
		this.queryPopularNew();
	},
  data() {
    return {
      activeCategory: 0,
	  userId:'',
      categories: [
		  {name: '人气新品', id: -1,isNew: true},
		  {name: '爆款推荐', id: -2,isHot: true},
      ],
	  currentProducts: [],
	  allItems: []
    }
  },
  computed: {
    
  },
  methods: {
    switchCategory(item,index) {
      this.activeCategory = index
	  if(item.isHot) {
		  this.queryPopularNew();
			return;
	  }
	  if(item.isNew){
		  this.queryHotRecommend();
		  return;
	  }
	  this.currentProducts = this.allItems.filter(obj=>obj.categoryId === item.id);
    },
	toBindBoxPage(product){
		if(product?.isAvoid){
			uni.navigateTo({
				url:'/subHome/blindBox/caileishang?userId='+ this.userId + '&seriesId='+ product.seriesId
			})
			return
		}
		uni.navigateTo({
			url:'/subHome/blindBox/yifanshang?userId='+ this.userId + '&seriesId='+ product.seriesId
		})
	},
	queryPopularNew(){
		get('wx/home/getWxProductSeries?isHotRecommend=1').then(json => {
			const result = json.data?.data;
			this.currentProducts = result.items || []
			
		})
	},
	queryHotRecommend(){
		get('wx/home/getWxProductSeries?isPopularNew=1').then(json => {
			const result = json.data?.data;
			this.currentProducts = result.items || []
			
		})
	},
	loadCateData(){
		get('wx/home/getWxCategoryNames').then(json => {
			const result = json.data?.data;
			const items = result.items;
			const categories = this.categories
			items.forEach(item=>{
				categories.push({
					name: item.categoryName,
					id: item.categoryId,
					isHot: false,
					isNew: false
				})
			})
			this.categories = categories;
			
		})
	},
	loadAllData(){
		get('wx/home/getWxProductSeries').then(json => {
			const result = json.data?.data;
			this.allItems = result.items || []
			
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