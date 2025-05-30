<template>
	<view class="coupon-container">

		<!-- 优惠券列表 -->
		<scroll-view scroll-y class="coupon-list">
			<!-- 优惠券 -->
			<view class="coupon-item" v-for="item in couponList" :key="item.couponId" :class="item.couponId === currentCouponId ? 'active-coupon' :''">
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

	</view>
</template>

<script>
	import {
		get
	} from "@/utils/rest-util.js"
	export default {
		props: {
			userId: {
				type: String,
				default: () => {
					return ''
				}
			},
			couponList:{
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				currentCouponId:''
			}
		},
		watch:{
			couponList: {
				immediate: true,
				handler(newVal) {
					console.log(this.couponList)
				}
			},
		},
		computed: {
		},
		methods: {
			navigatorToCode() {
				uni.navigateTo({
					url: '/subUser/code/index?userId=' + this.userId
				})
			},
			useCoupon(item) {
				console.log(item)
				this.currentCouponId = item.couponId
				this.$emit('setCoupon',item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.coupon-container {
		height: 70vh;
		display: flex;
		flex-direction: column;
		background: #f5f5f5;

		.tab-bar {
			display: flex;
			height: 90rpx;
			background: #fff;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

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
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
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

					.tag,
					.amount,
					.type {
						color: #999 !important;
						border-color: #999 !important;
					}
				}

				&.expired {
					.use-btn {
						background: #ccc;
					}

					.tag,
					.amount,
					.type {
						color: #ccc !important;
						border-color: #ccc !important;
					}
				}
			}
		}
	}
</style>