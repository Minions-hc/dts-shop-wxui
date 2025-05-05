<template>
	<view class="container">
		<!-- 订单状态选项卡 -->
		<view class="order-tabs">
			<view class="tab-item" :class="{ active: activeTab === 0 }" @click="activeTab = 0">全部</view>
			<view class="tab-item" :class="{ active: activeTab === 1 }" @click="activeTab = 1">待发货</view>
			<view class="tab-item" :class="{ active: activeTab === 2 }" @click="activeTab = 2">待收货</view>
			<view class="tab-item" :class="{ active: activeTab === 3 }" @click="activeTab = 3">已完成</view>
		</view>

		<!-- 订单列表 -->
		<scroll-view scroll-y class="order-list">
			<!-- 订单项1 -->
			<view class="order-item" v-for="item in orderList" :key="item.orderId">
				<!-- 新增状态标签 -->
				<view class="order-status">{{getOrderStatus(item)}}</view>
				<!-- 上部：时间 -->
				<view class="order-header">
					<text class="order-time">{{item.createTime}}</text>
				</view>

				<!-- 中部：商品信息 -->
				<view class="order-middle" @click="navigatorToDetail()">
					<image class="product-img" :src="item.image" lazy-load/>
					<view class="product-info">
						<text class="product-name">ssss</text>
						<view class="discount-info">
							<text>可抵扣0勋章</text>
						</view>
					</view>
					<!-- 数量显示 -->
					<text class="product-quantity">×1</text>
				</view>

				<!-- 下部：支付和操作 -->
				<view class="order-footer">
					<view class="payment-section">
						<text>实付金额：</text>
						<text class="payment-amount">￥{{item.paymentAmount}}</text>
						<button class="detail-btn" @click="navigatorToDetail(item)">查看详情</button>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {get} from "@/utils/rest-util.js"
	export default {
		onLoad(param){
			const {type,userId} = param;
			this.userId = userId;
			this.activeTab = Number(type) || 0;
			
		},
		onShow(){
			this.initData(this.userId);
		},
		data() {
			return {
				activeTab: 0, // 当前选中tab
				orderList:[],
				userId:""
			}
		},
		computed:{
		},
		methods: {
			navigatorToDetail(item) {
				uni.navigateTo({
					url : `/pages/order/detail?userId=${this.userId}&orderId=${item.orderId}&orderStatus=${item.orderStatus}`
				})
			},
			initData(userId){
				get('wx/order/queryOrderList?userId='+userId).then(json=>{
					const result = json.data.data;
					this.orderList = result.items || [];
				})
			},
			getOrderStatus(item){
				let str = '待发货';
				if(item.orderStatus === 'COMPLETED'){
					str = '已完成'
				}
				if(item.orderStatus === 'SHIPPED'){
					str = '已发货'
				}
				return str;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		background: #f5f5f5;

		.order-tabs {
			display: flex;
			height: 90rpx;
			background: #fff;
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

			.tab-item {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #666;
				position: relative;

				&.active {
					color: #e4393c;
					font-weight: bold;

					&::after {
						content: '';
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						width: 80rpx;
						height: 4rpx;
						background: #e4393c;
					}
				}
			}
		}

		.order-list {
			height: calc(100vh - 90rpx);

			.order-item {
				position: relative; // 新增定位基准
				background: #fff;
				border-radius: 16rpx;
				margin-bottom: 30rpx;
				overflow: hidden;
				margin: 20rpx;

				.order-status {
					position: absolute;
					top: 0;
					right: 0;
					background: #FFB6C1;
					color: white;
					padding: 8rpx 24rpx;
					border-radius: 0 16rpx 0 16rpx;
					font-size: 24rpx;
					z-index: 1;
				}

				.order-header {
					padding: 24rpx 30rpx;
					border-bottom: 2rpx solid #f5f5f5;
					font-weight: bold;

					.order-time {
						font-size: 24rpx;
						color: #000;
					}
				}

				.order-middle {
					padding: 30rpx;
					display: flex;
					align-items: flex-start;
					position: relative;
					/* 为数量定位提供参考 */
					border-bottom: 2rpx solid #f5f5f5;

					.product-img {
						width: 160rpx;
						height: 160rpx;
						border-radius: 8rpx;
						margin-right: 20rpx;
						flex-shrink: 0;
					}

					.product-info {
						flex: 1;
						min-width: 0;

						.product-name {
							font-size: 28rpx;
							color: #333;
							line-height: 1.4;
						}

						.discount-info {
							font-size: 24rpx;
							color: #999;
							margin-top: 15rpx;
						}
					}

					.product-quantity {
						position: absolute;
						right: 30rpx;
						top: 50%;
						transform: translateY(-50%);
						font-size: 28rpx;
						color: #999;
					}
				}

				.order-footer {
					padding: 30rpx;

					.payment-section {

						text-align: right;


						.payment-amount {
							color: #e4393c;
							font-size: 32rpx;
							font-weight: bold;
							padding-right: 15rpx;
						}

						.detail-btn {
							background: #FFB6C1 !important;
							color: #fff !important;
							border: none !important;
							margin-top: 16rpx; // 增加上边距
							width: 180rpx;
							height: 60rpx;
							line-height: 60rpx;
							background: #fff;
							color: #333;
							border-radius: 40rpx;
							font-size: 26rpx;
							border: 2rpx solid #ddd;
							/* 边框与背景一致 */
						}
					}
				}
			}
		}
	}
</style>