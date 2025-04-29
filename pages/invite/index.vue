<template>
  <view class="container">
    <!-- 选项卡 -->
    <view class="tab-bar">
      <view 
        class="tab-item"
        :class="{ active: currentTab === 0 }"
        @tap="switchTab(0)"
      >
        邀请记录
      </view>
      <view 
        class="tab-item"
        :class="{ active: currentTab === 1 }"
        @tap="switchTab(1)"
      >
        分销订单
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view scroll-y class="content">
      <!-- 邀请记录列表 -->
      <view v-if="currentTab === 0" class="record-list">
		  <view class="record-item" v-for="item in recodeItems" :key="item.userId">
		  	<image
		  				class="user-avatar" 
		  				:src="item.avatar" 
		  				mode="aspectFill"
						lazy-load
		  	/>
		  	<view class="content-wrapper">
		  	<view class="code-time">
		  	  <text class="invite-code">{{item.inviteCode}}</text>
		  	  <text class="time">{{item.createTime}}</text>
		  	</view>
		  	</view>
		  </view>
      </view>

      <!-- 分销订单列表（结构相同） -->
      <view v-if="currentTab === 1" class="order-list">
        <!-- 订单项结构 -->
      </view>
    </scroll-view>
  </view>
</template>

<script>
	import {get} from "@/utils/rest-util.js"
export default {
	
	onLoad(param){
		const {userId} = param;
		this.loadData(userId)
	},
  data() {
    return {
      currentTab: 0,
	  recodeItems: []
    }
  },
  methods: {
    switchTab(index) {
      this.currentTab = index
    },
	loadData(userId){
		get('wx/invitation/getInvitationRecords?userId='+userId).then(json=>{
			const result = json.data.data;
			this.recodeItems = result.items || [];
		})
	}
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  min-height: 100vh;
  background: #f5f5f5;

  .tab-bar {
    display: flex;
    height: 100rpx;
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

    .tab-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34rpx;
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
          width: 140rpx;
          height: 4rpx;
          background: #000;
          border-radius: 2rpx;
        }
      }
    }
  }

  .content {
    height: calc(100vh - 200rpx);

    .record-item {
      background: #fff;
      border-radius: 16rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;
      display: flex;
      align-items: center; /* 垂直居中 */
      box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    
      .user-avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        margin-right: 30rpx;
        flex-shrink: 0; /* 防止被压缩 */
      }
    
      .content-wrapper {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    
        .code-time {
          .invite-code {
            font-size: 30rpx;
            color: #000;
            margin-bottom: 12rpx;
            display: block;
          }
          .time {
            font-size: 26rpx;
            color: #999;
          }
        }
      }
    }
  }
}
</style>