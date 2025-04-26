<template>
  <view class="progress-container">
    <!-- 分段进度条 -->
    <view class="progress-bar">
      <view 
        v-for="(segment, index) in segments" 
        :key="index"
        class="progress-segment"
        :style="{
          width: segment.width + '%',
          backgroundColor: segment.active ? segment.color : '#eee'
        }"
      >
        <!-- 分隔圆点 -->
        <view 
          v-if="index !== segments.length - 1"
          class="divider-dot"
        ></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    current: Number,   // 当前已抽数量
    total: Number      // 总库存
  },
  computed: {
    segments() {
      const config = [
        { max: 33, price: 39, color: '#5ee902' },
        { max: 66, price: 56, color: '#ffd700' },
        { max: 100, price: 89, color: '#ff6b6b' }
      ]
      
      return config.map((item, index) => {
        const prevMax = index > 0 ? config[index-1].max : 0
        const width = ((item.max - prevMax) / this.total * 100)
        const active = index+1 === config.length 
        
        return {
          ...item,
          width,
          active
        }
      })
    },
    priceLabels() {
      return this.segments.map(seg => ({
        price: seg.price,
        position: (seg.max / this.total * 100)
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-container {
  padding: 40rpx 0;
}

.progress-bar {
  height: 16rpx;
  border-radius: 8rpx;
  overflow: visible;
  display: flex;
  position: relative;
}

.progress-segment {
  height: 100%;
  position: relative;
  transition: background-color 0.3s ease;

  .divider-dot {
    position: absolute;
    right: -8rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 16rpx;
    height: 16rpx;
    background: #fff;
    border: 2rpx solid #ddd;
    border-radius: 50%;
    z-index: 2;
  }
}

.price-labels {
  position: relative;
  height: 40rpx;
  margin-top: 20rpx;

  .price-label {
    position: absolute;
    transform: translateX(-50%);
    font-size: 24rpx;
    color: #666;
    
    &::after {
      content: '';
      display: block;
      width: 2rpx;
      height: 20rpx;
      background: #ddd;
      margin: 4rpx auto 0;
    }
  }
}
</style>