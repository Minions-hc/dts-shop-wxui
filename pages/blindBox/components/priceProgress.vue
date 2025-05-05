<template>
  <view class="price-progress-container">
    <!-- 进度条主体 -->
    <view class="progress-bar">
      <!-- 分段进度 -->
      <view 
        v-for="(segment, index) in processedSegments" 
        :key="index"
        class="segment"
        :style="{
          width: segment.width + '%',
          backgroundColor: segment.color
        }"
      >
        <!-- 价格标签 -->
        <view v-if="index === processedSegments.length - 1" class="price-label">
          {{ currentPrice }}
        </view>
      </view>

      <!-- 区间分隔线（空心圆） -->
      <view 
        v-for="(divider, index) in dividers" 
        :key="'divider-'+index"
        class="segment-divider"
        :style="{ left: divider.position + '%' }"
      />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    segments: {
      type: Array,
      default: () => [
        { end: 100, price: 5 },
        { end: 200, price: 4 },
        { end: Infinity, price: 3 }
      ]
    },
    colors: {
      type: Object,
      default: () => ({
        normal: '#ebedf0',
        penultimate: '#4a90e2',
        last: '#50c878'
      })
    },
    currentValue: {
      type: Number,
      default: 0
    }
  },
  computed: {
    processedSegments() {
      const total = this.getTotalRange()
      return this.segments.map((segment, index, arr) => {
        const prevEnd = index > 0 ? arr[index - 1].end : 0
        const width = ((segment.end - prevEnd) / total) * 100
        
        let color = this.colors.normal
        if (index === arr.length - 1) {
          color = this.colors.last
        } else if (index === arr.length - 2) {
          color = this.colors.penultimate
        }

        return { ...segment, width, color }
      })
    },
    currentPrice() {
      return this.segments.find(s => this.currentValue <= s.end)?.price || 0
    },
    // 计算分隔符位置
    dividers() {
      const total = this.getTotalRange()
      return this.segments
        .slice(0, -1) // 排除最后一个区间
        .map((s, index) => {
          const endPosition = this.segments[index].end
          return {
            position: (endPosition / total) * 100
          }
        })
    }
  },
  methods: {
    getTotalRange() {
      const lastValidSegment = this.segments.find(s => s.end !== Infinity)
      return lastValidSegment ? lastValidSegment.end : 0
    }
  }
}
</script>

<style scoped>
.price-progress-container {
  padding: 60rpx 30rpx 20rpx;
}

.progress-bar {
  height: 16rpx;
  background: transparent;
  border-radius: 8rpx;
  display: flex;
  position: relative;
}

.segment {
  height: 100%;
  position: relative;
  transition: all 0.3s ease;
}

.segment-divider {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 24rpx;
  height: 24rpx;
  border: 4rpx solid #fff;
  background: #ebedf0;
  border-radius: 50%;
  box-shadow: 0 2rpx 4rpx rgba(0,0,0,0.1);
  z-index: 2;
}

.price-label {
  position: absolute;
  top: -80rpx;
  right: 0;
  transform: translateX(50%);
  background: #fff;
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}
</style>