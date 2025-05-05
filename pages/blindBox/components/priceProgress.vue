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
        <view v-if="currentPriceIndex(index)" class="price-label">
          ￥{{ currentPrice }}
        </view>
		<view class="segment-divider" :style="{ left: divider.position + '%' ,backgroundColor: index === processedSegments.length - 1 ? segment.color : ''}"></view>
      </view>
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
        normal: '#fed1a9',
        penultimate: '#fed1a9',
        last: '#50c878'
      })
    },
    currentValue: {
      type: Number,
      default: 0
    }
  },
  data(){
	  return {
		  flag: false,
		  indexFlag: false
	  }
  },
  computed: {
    processedSegments() {
      const total = this.getTotalRange()
      return this.segments.map((segment, index, arr) => {
        const prevEnd = index > 0 ? arr[index - 1].end : 0
        const width = ((segment.end - prevEnd) / total) * 10
        let color = this.colors.normal
		
        if (index === arr.length - 1) {
          color = this.colors.penultimate
        } else if (index === arr.length - 2) {
          color = this.colors.penultimate
        }

        return { ...segment, width, color }
      })
    },
    currentPrice() {
      return this.segments.find(s => this.currentValue <= s.end)?.price || 0
    },
	
  },
  methods: {
    getTotalRange() {
      const lastValidSegment = this.segments.find(s => s.end !== Infinity)
      return lastValidSegment ? lastValidSegment.end : 0
    },
	currentPriceIndex(i){
		let indexValue = 0;
		const test =  this.segments.map((item,index)=>{
			if(item.end >= this.currentValue &&  !indexValue && !this.flag){
				indexValue = index
				this.flag = true
				return
			}
		})
		return i == indexValue
	}
  }
}
</script>

<style scoped>
.price-progress-container {
  padding: 60rpx 30rpx 30rpx;
  position: relative;
}

.progress-bar {
  height: 16rpx;
  background: transparent;
  border-radius: 8rpx;
  display: flex;
  position: relative;
  overflow: visible; /* 允许溢出显示分隔符 */
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
  width: 32rpx;
  height: 32rpx;
  border: 6rpx solid #fff;
  background: #ebedf0;
  border-radius: 50%;
  box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.1);
  z-index: 2;
}

.price-label {
  position: absolute;
  top: -70rpx;
  right: 0;
  transform: translateX(50%);
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
}
</style>