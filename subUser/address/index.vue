<template>
  <view class="address-container">
    <!-- 提示区域 -->
    <view class="notice-box">
      <image class="notice-icon" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/notice.png" mode="aspectFit" webp="true" lazy-load="true"/>
      <text class="notice-text">请设置自动提货地址，盒框中的A页只经预存放时间超过30天后\n将会发往该地址</text>
    </view>

    <!-- 地址卡片 -->
    <view class="address-card" v-for="item in addressList" :key="item.addressId">
      <!-- 操作图标 -->
      <image class="icon-delete" webp="true" lazy-load="true" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon-delete.png" mode="aspectFit" @tap="delAddress(item)"/>
	  <image class="icon-edit" webp="true" lazy-load="true" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon-edit.png" mode="aspectFit" @click="navigateToDetail(item)"/>
      
      <!-- 地址头 -->
      <view class="address-header">
        <view class="icon-group">
          <image class="icon-default" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/default-address.png" webp="true" lazy-load="true"/>
          <image class="icon-pickup" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/send-address.png" webp="true" lazy-load="true"/>
        </view>
        <text class="user-name">{{item.receiverName}}</text>
		 <text class="phone">{{getShowNumber(item.phone)}}</text>
      </view>

      <!-- 地址详情 -->
      <view class="address-content">
        <text class="address-text">{{item.detailAddress}}</text>
      </view>
	  
    </view>

    <!-- 图片按钮 -->
    <view class="action-buttons">
      <image class="btn-image" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/new-address.png" mode="aspectFit" @click="navigateToDetail(null)" webp="true" lazy-load="true"/>
      <image class="btn-image" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/import.png" mode="aspectFit" @tap="importAddress" webp="true" lazy-load="true"/>
    </view>
  </view>
</template>

<script>
	import {get,post} from "@/utils/rest-util.js"
	export default {
		onLoad(param) {
			const {userId} = param;
			this.userId = userId;
		},
		onShow(){
			this.initAddressList()
		},
		data(){
				return {
					userId:'',
					addressList:[]
				}
		},
		methods: {
			getShowNumber(phoneNumber){
				return phoneNumber.replace(phoneNumber.substring(3,7),'****')
			},
			navigateToDetail(item) {
				const addressUrl = item ? '&addressId='+item.addressId : ''
				uni.navigateTo({
					url: '/subUser/address/detail?userId='+this.userId+addressUrl
				})
			},
			initAddressList(){
				get(`wx/address/list?userId=${this.userId}`).then(json=>{
					const result = json.data;
					this.addressList = result.data || [];
				})
			},
			delAddress(item){
				const postData = {
					userId:this.userId,
					addressId:item.addressId
				}
				post(`wx/address/delete`,postData).then(json=>{
					if(json.data.errmsg === '成功') {
						uni.showToast({ title: '删除成功' })
						this.initAddressList()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.address-container {
  padding: 0rpx 30rpx 0rpx 30rpx;
  min-height: 100vh;
  background: #f5f5f5;
}

.notice-box {
  background: #000;
  border-radius: 25rpx;
  padding: 10rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: flex-start;

  .notice-icon {
    width: 40rpx;
    height: 40rpx;
    margin: 10rpx;
    flex-shrink: 0;
  }

  .notice-text {
    font-size: 22rpx;
    color: #fff;
    line-height: 1.4;
    white-space: pre-line;
  }
}

.address-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 20rpx;
  position: relative;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);

  .icon-delete {
    width: 30rpx;
    height: 30rpx;
    position: absolute;
    top: 32rpx;
    right: 32rpx;
  }

  .icon-edit {
    width: 30rpx;
    height: 30rpx;
    position: absolute;
    bottom: 32rpx;
    right: 32rpx;
  }

  .address-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    .icon-group {
      display: flex;
      
      image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 12rpx;
      }
    }

    .user-name {
      font-size: 30rpx;
      color: #333;
      font-weight: 500;
    }
	
	.phone {
	  display: block;
	  font-size: 30rpx;
	  color: #666;
	  margin-left: 60rpx;
	}
  }

  .address-content {
    .address-text {
      font-size: 26rpx;
      color: #666;
      line-height: 1.4;
    }
  }
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  padding: 0 70rpx;
  position: fixed;
  bottom: 60rpx;
  left: 0;
  right: 0;

  .btn-image {
    width: 280rpx;
    height: 100rpx;
  }
}
</style>