<template>
	<view class="activity-page">
    <!-- 顶部区域 -->
    <view class="top-section">
      <text class="title">活动中心</text>
      <view class="points-box">
        <view class="points-left">
          <text class="points-num">0</text>
          <image class="coin-icon" src="/static/coin.png"></image>
        </view>
        <text class="points-label">积分</text>
      </view>
      <text class="tips">连续签到即可获得奖励~</text>
    </view>

    <!-- 签到区域 -->
    <view class="sign-section">
      <!-- 签到日历 -->
      <view class="sign-calendar">
        <!-- 第一排 -->
        <view class="calendar-row">
          <view v-for="day in 4" :key="day" class="day-item">
            <image class="heart-bg" src="/static/heart-bg.png"></image>
            <text class="day-text">DAY{{day+1}}</text>
            <image class="coin-small" src="/static/coin-small.png"></image>
            <text class="points-add">+{{getAddPoints(day)}}</text>
          </view>
        </view>
        <!-- 第二排 -->
        <view class="calendar-row">
          <view v-for="day in 3" :key="day" class="day-item">
            <image class="heart-bg" src="/static/heart-bg.png"></image>
            <text class="day-text">DAY{{day+5}}</text>
            <image class="coin-small" src="/static/coin-small.png"></image>
            <text class="points-add">+30</text>
          </view>
        </view>
      </view>

      <!-- 签到按钮 -->
      <view class="sign-btn">
        <text>签到得奖励</text>
      </view>
    </view>

    <!-- 活动区域 -->
    <view class="activity-grid">
      <view 
        v-for="(item, index) in 4" 
        :key="index"
        class="activity-item"
        :style="{ backgroundImage: `url(${item.bg})` }"
      >
        <!-- 活动内容 -->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 活动数据示例
      activities: [
        { bg: '/static/activity1.jpg' },
        { bg: '/static/activity2.jpg' },
        { bg: '/static/activity3.jpg' },
        { bg: '/static/activity4.jpg' }
      ]
    }
  },
  methods: {
	  getAddPoints(day) {
		  let str = 0;
		 switch(day) {
			 case 0 : 
				str = 10;
				break;
			  case 1 : 
				  str = (day+1)*10;
				  break;
		     case 2 :
				str = (day+1)*10;
				break;
			 default :
				str = 30;
				break;	
		 }
		  return str;
	  }
  }
}
</script>

<style lang="scss">
.activity-page {
  padding: 30rpx;
  background: #FFF5F3;
}

.top-section {
  position: relative;
  padding: 40rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

  .title {
    color: #D4A89A; // 粉褐色
    font-size: 36rpx;
    font-weight: bold;
  }

  .points-box {
    margin-top: 40rpx;
    display: flex;
    align-items: flex-end;
    
    .points-left {
      position: relative;
      .points-num {
        color: #FF4081; // 粉红色
        font-size: 80rpx;
        line-height: 1;
      }
      .coin-icon {
        position: absolute;
        right: -50rpx;
        bottom: 10rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
    
    .points-label {
      color: #D4A89A;
      font-size: 28rpx;
      margin-left: 20rpx;
      padding-bottom: 8rpx;
    }
  }

  .tips {
    display: block;
    margin-top: 20rpx;
    color: #D4A89A;
    font-size: 24rpx;
  }
}

.sign-section {
  margin-top: 40rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;

  .sign-calendar {
    .calendar-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30rpx;

      .day-item {
        position: relative;
        width: 160rpx;
        height: 200rpx;

        .heart-bg {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .day-text {
          position: absolute;
          top: 30rpx;
          left: 50%;
          transform: translateX(-50%);
          color: #333;
          font-size: 28rpx;
		  z-index:2;
        }

        .coin-small {
          position: absolute;
          top: 90rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 40rpx;
        }

        .points-add {
          position: absolute;
          bottom: 30rpx;
          left: 50%;
          transform: translateX(-50%);
          color: #333;
          font-size: 24rpx;
        }
      }
    }
  }

  .sign-btn {
    margin-top: 40rpx;
    background: #FF4081;
    border-radius: 12rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    text {
      color: #B32D5F; // 深一个色号
      font-size: 32rpx;
      font-weight: bold;
    }
  }
}

.activity-grid {
  margin-top: 40rpx;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  padding: 0 10rpx;

  .activity-item {
    height: 100rpx;
    background-size: cover;
    border-radius: 12rpx;
  }
}
</style>