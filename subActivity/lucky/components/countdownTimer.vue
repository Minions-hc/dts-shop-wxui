<template>
  <view class="countdown-container">
    <view v-if="!isActive" class="inactive-text">活动已结束</view>
    <view v-else class="countdown-text">
      {{ days }}天{{ hours }}时{{ minutes }}分{{ seconds }}秒后开奖
    </view>
  </view>
</template>

<script>
export default {
  props: {
    endTime: {
      type: [String, Number],
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      days: 0,
      hours: '00',
      minutes: '00',
      seconds: '00',
      timer: null
    }
  },
  mounted() {
    if (this.isActive) {
      this.startCountdown()
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    startCountdown() {
      clearInterval(this.timer)
      this.calculateTime()
      this.timer = setInterval(() => {
        this.calculateTime()
      }, 1000)
    },
    
    calculateTime() {
      if (!this.isActive) return
      
      const endDate = new Date(typeof this.endTime === 'string' 
        ? this.endTime.replace(/-/g, '/') 
        : this.endTime)
      
      const now = new Date()
      const diff = endDate - now
      
      if (diff <= 0) {
        this.days = 0
        this.hours = '00'
        this.minutes = '00'
        this.seconds = '00'
        this.$emit('countdown-end')
        return
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      this.days = days
      this.hours = hours < 10 ? `0${hours}` : hours
      this.minutes = minutes < 10 ? `0${minutes}` : minutes
      this.seconds = seconds < 10 ? `0${seconds}` : seconds
    }
  },
  watch: {
    endTime() {
      if (this.isActive) {
        this.startCountdown()
      }
    },
    isActive(newVal) {
      if (newVal) {
        this.startCountdown()
      } else {
        clearInterval(this.timer)
      }
    }
  }
}
</script>

<style>
.countdown-container {
  padding: 10px;
  text-align: center;
}

.countdown-text {
  font-size: 24rpx;
  color: #4c0707;
  line-height: 150rpx;
}

.inactive-text {
  font-size: 40rpx;
  color: #ec6f4b;
  line-height: 130rpx;
  font-weight: bold;
}
</style>