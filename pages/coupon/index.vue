<template>
  <view class="coupon-container">
    <!-- 选项卡 -->
    <view class="tab-bar">
      <view 
        class="tab-item"
        :class="{ active: currentTab === item.id }"
		v-for="item in currentTabs" 
		:key="item.id"
        @tap="switchTab(item.id)"
      >
        {{item.name}}
      </view>
    </view>

    <!-- 优惠券列表 -->
    <scroll-view scroll-y class="coupon-list">
      <!-- 优惠券 -->
      <view class="coupon-item" v-for="item in couponList" :key="item.couponId" :class="{used:currentTab==='useedCoupons',expired:currentTab==='expiredCoupons'}">
        <view class="left-panel">
          <text class="amount">{{item.couponAmount}}</text>
          <text class="type">优惠券</text>
        </view>
        <view class="right-panel">
          <view class="info-group">
            <text class="title">优惠券</text>
            <view class="tag-container">
              <view class="tag">通用</view>
            </view>
            <view class="detail-group">
       <!--       <text class="expiry">3天后过期</text>
              <text class="condition">满59元可用</text> -->
            </view>
          </view>
          <button class="use-btn" @tap="useCoupon(item)">立即使用</button>
        </view>
      </view>
    </scroll-view>

    <!-- 兑换按钮 -->
    <view class="exchange-btn">
      <button class="btn" @click="navigatorToCode()">兑换码兑换</button>
    </view>
  </view>
</template>

<script>
	import {get} from "@/utils/rest-util.js"
export default {
	onLoad(param) {
		const {userId} = param;
		this.userId = userId
		this.queryCouPonList()
	},
  data() {
    return {
      currentTab: 'unUseedCoupons',
	  userId:'',
	  currentTabs :[{id:'unUseedCoupons',name: '未使用'},{id:'useedCoupons',name: '已使用'},{id:'expiredCoupons',name: '已过期'}],
	  unUseedCoupons: [], // 未使用
	  useedCoupons: [], // 已使用
	  expiredCoupons: [], //已过期
	  allCouponList: {}
    }
  },
  computed:{
	couponList(){
		return this.allCouponList[this.currentTab]
	}  
  },
  methods: {
    switchTab(index) {
      this.currentTab = index
    },
	navigatorToCode() {
		uni.navigateTo({
			url : '/pages/code/index?userId='+ this.userId
		})
	},
	queryCouPonList(){
		get('wx/coupon/mylist?userId='+this.userId).then(json=>{
			const result = json.data.data
			this.unUseedCoupons = result.unUseedCoupons || [];
			this.useedCoupons = result.useedCoupons || [];
			this.expiredCoupons =  result.expiredCoupons || [];
			this.allCouponList = {
				unUseedCoupons: this.unUseedCoupons,
				useedCoupons: this.useedCoupons,
				expiredCoupons: this.expiredCoupons
			}
		})
	},
	useCoupon(item){
		if(item.status == 1){
			uni.navigateTo({
				url : '/pages/category/index'
			})
		}
	}
  }
}
</script>

<style lang="scss" scoped>
.coupon-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  .tab-bar {
    display: flex;
    height: 90rpx;
    background: #fff;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

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
          width: 100rpx;
          height: 4rpx;
          background: #000;
          border-radius: 2rpx;
        }
      }
    }
  }

  .coupon-list {
    flex: 1;
    padding: 30rpx 10rpx;
	width: 97%;

    .coupon-item {
      height: 240rpx;
      background: #fff;
      border-radius: 16rpx;
      margin-bottom: 30rpx;
      display: flex;
      box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
      position: relative;

      .left-panel {
        width: 240rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-right: 2rpx dashed #eee;
        
        .amount {
          color: #FF6B6B;
          font-size: 72rpx;
          font-weight: bold;
          line-height: 1;
          margin-bottom: 10rpx;
          position: relative;
          
          &::after {
            content: '¥';
            font-size: 28rpx;
            position: absolute;
            top: 40rpx;
            left: -18rpx;
          }
        }

        .type {
          color: #FF6B6B;
          font-size: 30rpx;
		  padding-right: 20rpx;
        }
      }

      .right-panel {
        flex: 1;
        padding: 30rpx;
        position: relative;

        .info-group {
          height: 100%;
          
          .title {
            font-size: 34rpx;
            color: #333;
            margin-bottom: 10rpx;
			display: inline-block;
          }

          .tag-container {
            margin-bottom: 10rpx;
            .tag {
              display: inline-block;
              padding: 6rpx 20rpx;
              border: 2rpx solid #FF6B6B;
              color: #FF6B6B;
              border-radius: 30rpx;
              font-size: 24rpx;
            }
          }

          .detail-group {
            .expiry {
              display: block;
              font-size: 26rpx;
              color: #666;
              margin-bottom: 10rpx;
            }

            .condition {
              display: block;
              font-size: 24rpx;
              color: #999;
            }
          }
        }

        .use-btn {
          position: absolute;
          right: 50rpx;
          top: 50%;
          transform: translateY(-50%);
          width: 180rpx;
          height: 60rpx;
          line-height: 60rpx;
          background: #FF6B6B;
          color: #fff;
          border-radius: 30rpx;
          font-size: 28rpx;
          border: none;
        }
      }

      /* 不同状态样式 */
      &.used {
        opacity: 0.6;
        .use-btn {
          background: #999;
        }
        .tag, .amount, .type {
          color: #999 !important;
          border-color: #999 !important;
        }
      }

      &.expired {
        .use-btn {
          background: #ccc;
        }
        .tag, .amount, .type {
          color: #ccc !important;
          border-color: #ccc !important;
        }
      }
    }
  }

  .exchange-btn {
    padding: 30rpx;
    background: #fff;
    box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.05);

    .btn {
      background: #000;
      color: #fff;
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 44rpx;
      font-size: 34rpx;
      border: none;
    }
  }
}
</style>