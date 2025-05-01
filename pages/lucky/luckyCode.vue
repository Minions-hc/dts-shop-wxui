<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="nav-tabs">
      <text 
        class="tab-item"
        :class="{active: activeTab === 0}"
        @click="switchTab(0)"
      >抽奖码({{codeList.length}})</text>
      <text 
        class="tab-item"
        :class="{active: activeTab === 1}"
        @click="switchTab(1)"
      >已中奖({{winList.length}})</text>
      <text 
        class="tab-item"
        :class="{active: activeTab === 2}"
        @click="switchTab(2)"
      >助力记录({{helpList.length}})</text>
    </view>

    <!-- 滑动区域 -->
    <swiper 
      class="content-swiper"
      :current="activeTab"
      @change="onSwiperChange"
      :duration="300"
    >
      <!-- 抽奖码列表 -->
      <swiper-item>
        <scroll-view scroll-y class="list-container">
          <view 
            v-for="(item, index) in codeList" 
            :key="index" 
            class="code-item"
          >
            <view class="top-section">
              <view class="left-info">
                <view class="code-row">
                  <text class="code">{{item.code}}</text>
                  <view class="status-tag" :class="item.status">
                    {{getStatusText(item)}}
                  </view>
                </view>
                <view class="meta-row">
                  <text class="time">{{item.createTime}}</text>
                  <view class="helper" v-if="item.helper">
                    <image :src="item.helper.avatar" class="helper-avatar"/>
                    <text class="helper-name">{{item.helper.name}} 助力</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="bottom-section">
              <text class="activity">{{item.activityName}}</text>
              <view class="period-tag">第{{item.periodNumber}}期</view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>

      <!-- 已中奖列表 -->
      <swiper-item>
        <scroll-view scroll-y class="list-container">
          <view 
            v-for="(item, index) in winList" 
            :key="index" 
            class="code-item"
          >
            <!-- 结构相同，样式差异通过class控制 -->
            <view class="top-section">
              <view class="left-info">
                <view class="code-row">
                  <text class="code">{{item.code}}</text>
                  <view class="status-tag win-status">
                    已中奖
                  </view>
                </view>
                <view class="meta-row">
                  <text class="time">{{item.time}}</text>
                </view>
              </view>
            </view>
            <view class="bottom-section">
              <text class="activity">{{item.activity}}</text>
              <view class="period-tag">第{{item.period}}期</view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>

      <!-- 助力记录列表 -->
      <swiper-item>
        <scroll-view scroll-y class="list-container">
          <view 
            v-for="(item, index) in helpList" 
            :key="index" 
            class="help-item"
          >
            <image :src="item.helperAvatar" class="help-avatar"/>
            <view class="center-info">
              <text class="username">{{item.helperName}}</text>
              <text class="help-time">{{item.helpTime}}</text>
            </view>
            <view class="right-info">
              <text class="plus">+</text>
              <text class="count">{{item.activityName}}</text>
              <text class="text">抽奖码</text>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
	import {
		get,
		post
	} from "@/utils/rest-util.js"
export default {
	onLoad(param) {
		const {userId} =  param;
		this.userId = userId;
		this.queryUserCodes();
		this.queryHelpList()
	},
  data() {
    return {
      activeTab: 0,
	  userId:'',
	  userCodesList:[],
      // 模拟接口数据
      codeList: [],
      helpList: []
    }
  },
  computed:{
	 winList(){
		 return this.codeList.filter(item=>item.status === 'WIN')
	 } 
  },
  methods: {
	  getStatusText(item){
		  let str = '待开奖';
		  if(item.status == 'NOT_WIN'){
			  str = '未中奖'
		  }
		  if(item.status == 'NOT_WIN'){
			  str = '已中奖'
		  }
		  return str
	  },
    switchTab(index) {
      this.activeTab = index
    },
    onSwiperChange(e) {
      this.activeTab = e.detail.current
    },
	queryUserCodes(){
		get(`wx/luckyDraw/userCodes?userId=${this.userId}`).then(json=>{
			const result = json.data?.data;
			this.codeList = result || []
		})
	},
	queryHelpList(){
		get(`wx/luckyDraw/helpRecords/${this.userId}`).then(json=>{
			const result = json.data?.data;
			this.helpList = result || []
		})
	}
  }
}
</script>

<style scoped lang="scss">
/* 公共样式 */
.container {
  height: 100vh;
  background: #f5f5f5;
}

.nav-tabs {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 90rpx;
  background: #fff;
  display: flex;
  z-index: 1000;
  border-bottom: 1rpx solid #eee;

  .tab-item {
    flex: 1;
    text-align: center;
    line-height: 90rpx;
    font-size: 30rpx;
    color: #666;
    
    &.active {
      color: #ff4c4c;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80rpx;
        height: 4rpx;
        background: #ff4c4c;
      }
    }
  }
}

.content-swiper {
  height: calc(100vh - 90rpx);
  margin-top: 90rpx;
}

.list-container {
  padding: 30rpx 0rpx;
}

/* 抽奖码列表优化样式 */
.code-item {
  background: #fff;
  border-radius: 16rpx;
  margin: 0 30rpx;
  margin-bottom: 20rpx;
  padding: 24rpx;
  
  
  .top-section {
    .left-info {
      .code-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;

        .code {
          font-size: 34rpx;
          color: #333;
          font-weight: 500;
        }

        .status-tag {
          padding: 8rpx 24rpx;
          border-radius: 24rpx;
          font-size: 24rpx;
          
          &.PENDING {
            background: #ccc;
            color: #fff;
          }
          &.NOT_WIN {
            background: #999;
            color: #fff;
          }
          &.WIN {
            background: #ff4c4c;
            color: #fff;
          }
        }
      }

      .meta-row {
        display: flex;
        align-items: center;
        gap: 20rpx;

        .time {
          font-size: 24rpx;
          color: #999;
        }

        .helper {
          display: flex;
          align-items: center;
          &-avatar {
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
            margin-right: 10rpx;
          }
          &-name {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }
  }

  .bottom-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #eee;

    .activity {
      font-size: 26rpx;
      color: #666;
      flex: 1;
      margin-right: 20rpx;
    }

    .period-tag {
      background: #999;
      color: #fff;
      padding: 6rpx 20rpx;
      border-radius: 24rpx;
      font-size: 24rpx;
    }
  }
}

/* 助力记录优化样式 */
.help-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin: 0 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;

  .help-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }

  .center-info {
    flex: 1;
    
    .username {
      font-size: 30rpx;
      color: #333;
      margin-bottom: 8rpx;
    }
    
    .help-time {
      font-size: 24rpx;
      color: #999;
    }
  }

  .right-info {
    text-align: right;
    .plus {
      font-size: 24rpx;
      color: #ff4c4c;
      vertical-align: text-top;
    }
    .count {
      font-size: 36rpx;
      color: #ff4c4c;
      margin: 0 4rpx;
    }
    .text {
      font-size: 24rpx;
      color: #666;
    }
  }
}
</style>