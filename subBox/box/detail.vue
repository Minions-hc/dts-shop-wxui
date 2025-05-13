<template>
	<view class="container">
		<!-- 导航栏 -->
		<!-- 基础信息 -->
		<view class="info-card">
			<view class="header">
				<image class="product-img" :src="productInfo.productImage" lazy-load="true" webp/>
				<view class="medal">
					<view class="name">
						{{productInfo.productName}}
					</view>
					<view class="discount-info">
						可抵扣{{productInfo.productBadge}}勋章
						<span>x1</span>
					</view>
				</view>
			</view>

			<!-- 详细信息 -->
			<view class="detail-list">
				<view class="detail-item">
					<text class="label">物品SID</text>
					<view class="value-box">
						<text class="value">{{productInfo.productId}}</text>
						<text class="copy-btn" @click="copySID">复制</text>
					</view>
				</view>

				<view class="detail-item">
					<text class="label">活动类型</text>
					<text class="value">{{productInfo.activityType}}</text>
				</view>

				<view class="detail-item">
					<text class="label">赏类型</text>
					<text class="value">{{productInfo.productLevel}}</text>
				</view>

				<view class="detail-item">
					<text class="label">房间号</text>
					<text class="value">第{{productInfo.boxNumber}}房间</text>
				</view>

				<view class="detail-item">
					<text class="label">物品状态</text>
					<text class="value status">{{statusWord()}}</text>
				</view>

				<view class="detail-item">
					<text class="label">获得时间</text>
					<text class="value">{{productInfo.createdTime}}</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		get,
		post
	} from "@/utils/rest-util.js"
	export default {
		data() {
			return {
				detail: {
					status: '待处理'
				},
				isInSafeBox: false,
				safeCount: 4,
				num: 1,
				userId: '',
				id: '',
				productInfo: {}
			}
		},
		onShow(param) {
			console.log(param);
			this.loadProductData()
		},
		onLoad(param) {
			const {userId,id} = param;
			this.userId = userId;
			this.id = id;
		},
		methods: {
			navigateBack() {
				uni.navigateBack()
			},
			loadProductData(){
				get(`wx/boxproduct/boxProductInfo?userId=${this.userId}&id=${this.id}`).then(json=>{
					const result = json.data;
					this.productInfo = result?.data || {};
				})
			},
			statusWord(){
				const json = {
					"pending":"待处理",
					"locked":"锁定中",
					"shipped":"已提货"
				}
				const status = this.productInfo.status
				return json[status] || ''
			},

			copySID() {
				const productId = this.productInfo?.productId || '';
				console.log(productId)
				uni.setClipboardData({
					data:  String(productId),
					success: () => {
						uni.showToast({
							title: '复制成功'
						})
					}
				})
			},

			toggleSafeBox() {
				this.isInSafeBox = !this.isInSafeBox
				this.safeCount += this.isInSafeBox ? 1 : -1
				uni.showToast({
					title: this.isInSafeBox ? '已存入保险箱' : '已取出',
					icon: 'none'
				})
			},

			handleAction() {
				if (this.detail.status !== '待处理') return
				uni.showModal({
					title: '确认申请发货',
					content: '确定要申请发货此物品吗？',
					success: res => {
						if (res.confirm) {
							this.detail.status = '已申请发货'
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		background: #f5f5f5;
	}

	.nav-bar {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background: #fff;

		.back-icon {
			width: 40rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}

		.title {
			font-size: 36rpx;
			font-weight: bold;
		}
	}

	.content {
		height: calc(100vh - 200rpx);
		padding: 30rpx;
	}

	.info-card {
		border-radius: 16rpx;
		margin-bottom: 30rpx;
		margin-top: 30rpx;

		.header {
			border-bottom: 1rpx solid #eee;
			padding-bottom: 30rpx;
			margin-bottom: 30rpx;
			background: #fff;
			padding: 30rpx;
			display: flex;
			.product-img {
				width: 200rpx;
				height: 200rpx;
				border-radius: 12rpx;
				margin-right: 20rpx;
			}

			.name {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.medal {
				width: calc(100% - 200rpx);
				.medal-icon {
					width: 40rpx;
					height: 40rpx;
					margin-right: 15rpx;
				}
				.discount-info{
					position: relative;
					span{
						position: absolute;
						right: 20rpx;
					}
				}
			}
		}

		.detail-list {
			background: #fff;
			padding: 30rpx;

			.detail-item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 30rpx;

				.label {
					color: #999;
					width: 180rpx;
				}

				.value {
					flex: 1;
					text-align: right;

					&.status {
						color: #D4B483;
					}
				}

				.value-box {
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;

					.copy-btn {
						color: #007AFF;
						margin-left: 30rpx;
						padding: 8rpx 20rpx;
						border: 1rpx solid #007AFF;
						border-radius: 30rpx;
					}
				}
			}
		}
	}

	.safe-box {
		background: #fff;
		border-radius: 16rpx;
		padding: 40rpx;
		text-align: center;

		.safe-icon {
			width: 80rpx;
			height: 80rpx;
			margin-bottom: 20rpx;
		}

		.safe-text {
			display: block;
			font-size: 32rpx;
			margin-bottom: 15rpx;
		}

		.safe-count {
			color: #999;
		}
	}

	.bottom-action {
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: 30rpx;
		background: #fff;
		border-top: 1rpx solid #eee;

		.action-btn {
			background: #D4B483;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			border-radius: 45rpx;
			font-size: 32rpx;

			&.disabled {
				background: #ccc;
				color: #666;
			}
		}
	}
</style>