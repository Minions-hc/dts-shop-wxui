<template>
	<view class="safe-box-page">
		<!-- 产品列表 -->
		<scroll-view class="product-list" scroll-y>
			<view v-for="(item, index) in lockProducts" :key="index" class="product-info-card">
				<view class="product-item" @tap="toDetailPage(item)">
					<image class="product-img" :src="item.image" />

					<view class="product-info">
						<view class="top-section">
							<text class="name">{{ item.name }}</text>
							<text class="quantity">x{{ item.quantity }}</text>
						</view>
						<view class="meta-info">
							<text class="source">{{ item.source }}</text>
							<text class="grade">{{ item.grade }}</text>
						</view>
						<view class="medal-info">
							<text>可抵扣{{ item.medal }}勋章</text>
							<view class="status-btn">{{ showStatusWord(item) }}</view>
						</view>

					</view>
				</view>
				<view class="bottom-section bottom-section-position">
					<view class="right-bottom-wrapper">
						<view class="donate-btn pink-btn" @tap="unLockProduct(item)">解锁</view>
					</view>

				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lockProducts: []
			}
		},
		onLoad(param) {
			this.initData()
		},
		methods: {
			initData() {
				this.lockProducts = [{
					id: 1,
					image: '/static/serice2.jpg',
					name: '【自制款】拉布布帆布袋',
					quantity: 1,
					source: '一番赏',
					grade: 'D赏',
					medal: 4,
					status: 1, //'待处理',
					time: '01-16 02:47',
					checked: false
				}]
			},
			unLockProduct(item) {

			},
			showStatusWord() {
				return '锁定中'
			},
			toDetailPage(item) {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.safe-box-page {
		.product-list {
			padding: 20rpx 0rpx;
			.product-info-card{
				margin: 0 20rpx;
				margin-top: 15rpx;
				border-radius: 20rpx;
				box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
				  transition: all 0.3s ease;
			}

			.product-item {
				display: flex;
				background: #fff;
				border-top-right-radius: 16rpx;
				border-top-left-radius: 16rpx;
				margin: 0 20rpx;
				padding: 20rpx;
				padding-bottom: 0px;

				.product-img {
					width: 200rpx;
					height: 200rpx;
					border-radius: 12rpx;
					margin-right: 20rpx;
				}

				.product-info {
					flex: 1;

					.top-section {
						display: flex;
						justify-content: space-between;
						margin-bottom: 15rpx;

						.name {
							font-size: 32rpx;
							font-weight: bold;
						}

						.quantity {
							color: #666;
						}
					}

					.meta-info {
						display: flex;
						gap: 20rpx;
						font-size: 12px;
						margin-bottom: 15rpx;
						color: #666;

						text {
							display: inline-block;
							padding: 10rpx 25rpx;
							background-color: #d9d9d9;
							text-align: center;
							border-radius: 25rpx;
						}
					}

					.medal-info {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 15rpx;

						text {
							color: #ff91da;
						}

						.status-btn {
							padding: 8rpx 20rpx;
							border: 1rpx solid #D4B483;
							border-radius: 10rpx;
							background-color: #ed80a0;
							color: #fff;
							line-height: 50rpx;
							text-align: center;
							width: 150rpx;
							font-weight: bold;
						}
					}


				}
			}

			.bottom-section {
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #999;
				margin: 0 20rpx;
				background-color: #fff;
				padding: 0 20rpx;
				margin-bottom: 20rpx;
				padding-bottom: 20rpx;
				border-bottom-left-radius: 16rpx;
				border-bottom-right-radius: 16rpx;

				.donate-btn {
					padding: 8rpx 20rpx;
					background: #000;
					color: #fff;
					border-radius: 20rpx;
					width: 150rpx;
					line-height: 50rpx;
					font-weight: bold;
					text-align: center;
					word-spacing: 4rpx;
				}

				.pink-btn {
					background-color: #ed80a0;
				}

				.lock-icon {
					width: 100rpx;
					height: 50rpx;
					background-image: url('/static/lock.png');
					background-size: cover;
					/* 或使用 contain 根据需求 */
					background-position: center;
					background-repeat: no-repeat;
					margin-right: 15rpx;
					margin-top: 8rpx;
				}

				.right-bottom-wrapper {
					display: inline-flex;
				}
			}

			.bottom-section-position {
				justify-content: flex-end;
			}
		}
	}
</style>