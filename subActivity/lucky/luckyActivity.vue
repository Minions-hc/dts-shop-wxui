<template>
  <view class="container">
    <!-- 顶部选项卡 -->
    <view class="tabs-header">
      <view 
        class="tab-item"
        :class="{active: activeTab === 0}"
        @click="switchTab(0)"
      >
        进行中
      </view>
      <view 
        class="tab-item"
        :class="{active: activeTab === 1}"
        @click="switchTab(1)"
      >
        已结束
      </view>
    </view>

    <!-- 滑动内容区域 -->
    <swiper 
      class="content-swiper"
      :current="activeTab"
      @change="onSwiperChange"
      :duration="300"
    >
      <!-- 进行中活动 -->
      <swiper-item>
        <scroll-view scroll-y class="activity-list">
          <view 
            v-for="(item, index) in ongoingList" 
            :key="index" 
            class="activity-card"
          >
            <image class="cover" :src="item.cover" mode="aspectFill"/>
            <view class="content">
              <view class="title-row">
                <text class="title">{{item.title}}</text>
                <view class="status-tag ongoing">进行中</view>
              </view>
              <text class="time">{{item.time}}</text>
              <view class="progress-bar">
                <view 
                  class="progress" 
                  :style="{width: item.progress + '%'}"
                ></view>
                <text class="progress-text">{{item.participants}}人已参与</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>

      <!-- 已结束活动 -->
      <swiper-item>
        <scroll-view scroll-y class="activity-list">
          <view 
            v-for="(item, index) in endedList" 
            :key="index" 
            class="activity-card"
          >
            <image class="cover" :src="item.cover" mode="aspectFill"/>
            <view class="content">
              <view class="title-row">
                <text class="title">{{item.title}}</text>
                <view class="status-tag ended">已结束</view>
              </view>
              <text class="time">{{item.time}}</text>
              <view class="result-row">
                <text class="result-text">已结束·{{item.participants}}人参与</text>
                <text class="check-result">查看结果</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      ongoingList: [
        {
          cover: 'https://via.placeholder.com/350x200',
          title: 'MEGA Labubu 400% 限定抽赏',
          time: '2023.04.20 14:00 - 2023.05.20 14:00',
          participants: 2345,
          progress: 65
        },
        // 更多模拟数据...
      ],
      endedList: [
        {
          cover: 'https://via.placeholder.com/350x200',
          title: '夏日限定盲盒抽赏活动',
          time: '2023.03.01 - 2023.03.31',
          participants: 1567
        }
        // 更多模拟数据...
      ]
    }
  },
  methods: {
    switchTab(index) {
      this.activeTab = index
    },
    onSwiperChange(e) {
      this.activeTab = e.detail.current
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  background: #f5f5f5;
}

.tabs-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90rpx;
  background: #fff;
  display: flex;
  z-index: 1000;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #666;
    position: relative;

    &.active {
      color: #000;
	  font-weight: bold;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80rpx;
        height: 4rpx;
        background: #000;
      }
    }
  }
}

.content-swiper {
  height: calc(100vh - 90rpx);
  margin-top: 90rpx;
}

.activity-list {
  padding: 30rpx;
}

.activity-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

  .cover {
    width: 100%;
    height: 320rpx;
  }

  .content {
    padding: 24rpx;

    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;

      .title {
        font-size: 32rpx;
        color: #333;
        font-weight: 500;
        flex: 1;
        margin-right: 20rpx;
      }

      .status-tag {
        padding: 6rpx 20rpx;
        border-radius: 24rpx;
        font-size: 24rpx;

        &.ongoing {
          background: #4c9bff;
          color: #fff;
        }

        &.ended {
          background: #999;
          color: #fff;
        }
      }
    }

    .time {
      display: block;
      font-size: 24rpx;
      color: #999;
      margin-bottom: 24rpx;
    }

    .progress-bar {
      height: 40rpx;
      background: #f0f0f0;
      border-radius: 20rpx;
      position: relative;

      .progress {
        height: 100%;
        border-radius: 20rpx;
        background: linear-gradient(90deg, #4c9bff, #6ab1ff);
        transition: width 0.3s;
      }

      .progress-text {
        position: absolute;
        right: 20rpx;
        top: 50%;
        transform: translateY(-50%);
        font-size: 24rpx;
        color: #fff;
      }
    }

    .result-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .result-text {
        font-size: 24rpx;
        color: #999;
      }

      .check-result {
        color: #4c9bff;
        font-size: 26rpx;
      }
    }
  }
}
</style>