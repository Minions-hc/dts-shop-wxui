<template>
	<view class="container">
		<!-- 用户信息区域 -->
		<view class="user-section">
			<view class="user-info" @click="navigateToUserInfo()">
				<image :src="userInfo.avatar" class="avatar" mode="aspectFit" lazy-load/>
				<text class="username">{{userInfo.userName}}</text>
			</view>
			<!-- 新增资产信息区域 -->
			<view class="assets-section">
				<view class="asset-item" v-for="(item, index) in userAssets" :key="index"
					@click="handleAssetClick(item.type)">
					<text class="value">{{ item.value }} </text>
					<text class="label">{{ item.label }}</text>
				</view>
			</view>
		</view>

		<!-- 订单状态 -->
		<view class="order-section">
			<view class="order-header" @click="navigateTo('/subUser/order/list')">
				<text class="title">我的订单</text>
				<view class="more">
					<text>全部订单</text>
					<uni-icons type="arrowright" size="16" color="#999"></uni-icons>
				</view>
			</view>

			<view class="order-status">
				<view v-for="(item, index) in orderStatus" :key="index" class="status-item"
					@click="switchOrderTab(index)">
					<!-- <<image :src="item.image"></image> -->
					<image class="icon-image" :src="item.image" mode="aspectFit"></image>
					<text class="label">{{ item.label }}</text>
				</view>
			</view>
		</view>

		<!-- 服务工具 -->
		<view class="service-section">
			<view class="service-group">
				<view class="group-title">服务与工具</view>
				<view class="service-grid">
					<view v-for="(item, index) in services" :key="index" class="service-item"
						@click="handleService(item)">
						<image class="icon-image" :src="item.image" mode="aspectFit"></image>
						<text class="name">{{ item.name }}</text>
					</view>
				</view>
			</view>

			<!-- 功能列表 -->
			<view class="func-list">
				<view class="func-item" v-for="(item, index) in functions" :key="index" @click="navigateTo(item.path)">
					<view class="left">
						<image class="icon-image" :src="item.image" mode="aspectFit"
							:class="item.icon === 'location' ? 'address-icon' :''"></image>
						<text class="label">{{ item.label }}</text>
					</view>
					<uni-icons type="arrowright" size="16" color="#999"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		get
	} from "@/utils/rest-util.js"
	export default {
		onLoad(param) {
			
		},
		onShow(){
			this.getUserInfo()
			this.getUserCurrentPoints(this.userId);
			this.getInvitationRecords(this.userId);
			// const userInfo = uni.getStorageSync("userInfo") || {};
			// this.userInfo = userInfo
		},
		data() {
			
			return {
				userId: uni.getStorageSync('userId'),
				
				activeOrderTab: 0,
				orderStatus: [{
						icon: 'shop',
						label: '盒柜',
						image: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon1.png'
					},
					{
						icon: 'paperplane',
						label: '待发货',
						image: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon2.png'
					},
					{
						icon: 'cart',
						label: '待收货',
						image: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon3.png'
					},
					{
						icon: 'checkmarkcircle',
						label: '已完成',
						image: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon4.png'
					}
				],
				services: [{
						icon: 'wallet',
						name: '优惠券',
						path: '/subUser/coupon/index',
						image: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon5.png'
					},
					{
						icon: 'compose',
						name: '道具卡',
						path: '/subUser/card/index',
						image: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon6.png'
					},
					{
						icon: 'gift',
						name: '兑换码',
						path: '/subUser/code/index',
						image: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon7.png'
					},
					{
						icon: 'headphones',
						name: '客服',
						path: '/pages/service',
						image: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon8.png'
					}
				],
				functions: [{
						icon: 'cart',
						label: '购物车',
						path: '/subHome/cart/index',
						image: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon9.png'
					},
					{
						icon: 'location',
						label: '收货地址',
						path: '/subUser/address/index',
						image: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon10.png'
					},
					{
						icon: 'paperclip',
						label: '规则与协议',
						path: '/subBox/agreement/index',
						image: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon11.png'
					}
				],
				userAssets: [{
						type: 'points',
						value: 0,
						unit: '积分',
						label: '积分'
					},
					{
						type: 'invites',
						value: 0,
						unit: '邀请记录',
						label: '邀请记录'
					}
				],
				userInfo:{}
			}
		},
		methods: {
			navigateTo(path) {
				const userId = this.userId;
				uni.navigateTo({
					url: path + '?userId=' + userId
				})
			},
			switchOrderTab(index) {
				if(index === 0){
					uni.switchTab({
						url: "/pages/box/index"
					})
					return
				}
				this.activeOrderTab = index
				const userId = this.userId
				// 实际应跳转对应订单列表页
				this.navigateTo(`/subUser/order/list?type=${index}&userId=${userId}`)
			},
			handleService(item) {
				this.navigateTo(item.path)
			},
			handleAssetClick(type) {
				const userId = this.userId
				const routeMap = {
					points: '/subUser/points/index?userId='+userId,
					invites: '/subUser/invite/index?userId='+userId
				}
				uni.navigateTo({
					url: routeMap[type]
				})
			},
			getUserCurrentPoints(userId){
				get('wx/points/getUserCurrentPoints?userId='+userId).then(json => {
					const result = json.data.data;
					const currentPoints = result.currentPoints || 0;
					const userAssets = this.userAssets
					userAssets.forEach(item=>{
						if(item.type === 'point'){
							item.value = currentPoints
						}
					})
					this.userAssets = userAssets;
				})
			},
			getInvitationRecords(userId){
				get('wx/invitation/getInvitationRecords?userId='+userId).then(json => {
					const result = json.data.data;
					const invites = result.items.length || 0
					const userAssets = this.userAssets
					userAssets.forEach(item=>{
						if(item.type === 'invites'){
							item.value = invites
						}
					})
					this.userAssets = userAssets;
					
				})
			},
			navigateToUserInfo() {
				uni.navigateTo({
					url: '/subUser/profile/index?userId='+this.userId
				})
			},
			getUserInfo(){
				get('wx/auth/userInfo/'+ this.userId).then(res=>{
					if(res.statusCode === 200){
						const result = res.data.data;
						this.userInfo = result
						uni.setStorageSync('userInfo', result)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #f5f5f5;
		min-height: 100vh;
	}

	/* 用户信息区域 */
	.user-section {
		padding: 40rpx 30rpx;
		background-image: url('https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/user-bg.png');
		/* 关键样式 */
		background-size: cover;
		/* 或使用 contain 根据需求 */
		background-position: center;
		background-repeat: no-repeat;
		transition: all 0.3s ease;

		.user-info {
			display: flex;
			align-items: center;

			.avatar {
				width: 180rpx;
				height: 180rpx;
				border-radius: 50%;
				border: 4rpx solid rgba(255, 255, 255, 0.3);
				margin-right: 30rpx;
			}

			.username {
				font-size: 36rpx;
				color: #000;
				font-weight: bold;
				text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
			}
		}

		.assets-section {
			display: flex;
			justify-content: space-between;
			border-radius: 16rpx;
			padding: 30rpx 0;
			margin: 20rpx 0;

			.asset-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;

				&:not(:last-child)::after {
					content: '';
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 1rpx;
					height: 40rpx;
					background: #eee;
				}

				.value {
					font-size: 34rpx;
					color: #333;
					font-weight: bold;
					margin-bottom: 10rpx;
				}

				.label {
					font-size: 26rpx;
					color: #666;
				}
			}
		}
	}

	/* 订单区域 */
	.order-section {
		margin: 20rpx;
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

		.order-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid #eee;

			.title {
				font-size: 32rpx;
				font-weight: 500;
			}

			.more {
				display: flex;
				align-items: center;
				color: #999;

				text {
					margin-right: 10rpx;
					font-size: 26rpx;
				}
			}
		}

		.order-status {
			display: flex;
			justify-content: space-around;
			padding: 40rpx 0;

			.status-item {
				display: flex;
				flex-direction: column;
				align-items: center;

				.label {
					margin-top: 20rpx;
					font-size: 26rpx;
					color: #666;
				}

				.icon-image {
					width: 50rpx;
					height: 50rpx;
					max-width: 50rpx;
					max-height: 50rpx;
				}

			}
		}
	}

	/* 服务区域 */
	.service-section {
		margin: 20rpx;
		background: #fff;
		border-radius: 16rpx;

		.group-title {
			padding: 30rpx;
			font-size: 30rpx;
			font-weight: 500;
			border-bottom: 1rpx solid #eee;
		}

		.service-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			padding: 30rpx 0;

			.service-item {
				display: flex;
				flex-direction: column;
				align-items: center;

				.name {
					margin-top: 15rpx;
					font-size: 24rpx;
					color: #666;
				}

				.icon-image {
					width: 50rpx;
					height: 50rpx;
					max-width: 50rpx;
					max-height: 50rpx;
				}

				.address-icon {
					height: 40rpx;
					max-height: 40rpx;
				}
			}
		}

		.func-list {
			.func-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx;
				border-bottom: 1rpx solid #eee;

				.left {
					display: flex;
					align-items: center;

					.label {
						margin-left: 20rpx;
						font-size: 28rpx;
						color: #333;
					}

					.icon-image {
						width: 40rpx;
						height: 40rpx;
						max-width: 40rpx;
						max-height: 40rpx;
					}

					.address-icon {
						height: 50rpx;
						max-height: 50rpx;
					}
				}
			}
		}
	}

	/* 交互优化 */
	.order-header,
	.status-item,
	.service-item,
	.func-item {
		transition: all 0.2s;

		&:active {
			opacity: 0.7;
			transform: scale(0.98);
		}
	}
</style>