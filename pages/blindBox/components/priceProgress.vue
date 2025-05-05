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
		  backgroundColor: '#ebedf0'
        }"
      >
		
        <!-- 价格标签 -->
        <view v-if="currentPriceIndex(index)" class="price-label">
          ￥{{ currentPrice }}
        </view>
		<view class="segment-divider" :style="{ left: divider.position + '%' ,backgroundColor: currentPriceIndex(index) ? segment.color : ''}"></view>
      </view>
	  <view class="segment-item" :style="{
	    width: itemWidth + '%',
		left: leftValue + '%'
	  }"></view>
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
		  indexFlag: false,
		  itemWidth: 0,
		  leftValue: 0,
		  indexValue: 0
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
      const lastValidSegment = this.segments[this.segments.length - 1]
      return lastValidSegment ? lastValidSegment.end : 0
    },
	currentPriceIndex(i){
		const listWidth = []
		const total = this.getTotalRange();
		const test =  this.segments.map((item,index,arr)=>{
			const prevEnd = index > 0 ? arr[index - 1].end : 0
			const width = ((item.end - prevEnd) / total) * 100;
			listWidth.push(width)
			if(item.end >= this.currentValue && !this.flag){
				this.indexValue = index
				this.flag = true
				return
			}
		})
		let num = 0;
		let countWidth = 0
		for(let i = 0; i < this.indexValue;i++ ){
			num = num + listWidth[i];
			if(i < this.indexValue - 1){
				countWidth = countWidth + this.segments[i].end
			}
		}
		this.itemWidth = ((this.currentValue - countWidth) / total) * 100;
		this.leftValue = (num / total) * 100;
		return this.indexValue == this.segments.length - 1 ? i == this.indexValue - 1 : i == this.indexValue
	},
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
  border-radius: 8rpx !important;
  display: flex;
  position: relative;
  overflow: visible; /* 允许溢出显示分隔符 */
}

.segment {
  height: 100%;
  position: relative;
  transition: all 0.3s ease;
}
.segment-item{
	position: absolute;
	height: 100%;
	background-color: #fed1a9;
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