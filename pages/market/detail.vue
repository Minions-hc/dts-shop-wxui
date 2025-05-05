<template>
	<view class="container">
		<!-- 商品轮播 -->
		<view class="swiper-container">
			<!-- 添加autoplay实现自动轮播 -->
			<swiper :current="swiperIndex" @change="onSwiperChange" class="product-swiper" :autoplay="3000">
				<swiper-item v-for="(img, index) in productImageList" :key="index">
					<image :src="img" mode="widthFix" class="swiper-image" />
				</swiper-item>
			</swiper>
			<view class="swiper-indicator">{{swiperIndex + 1}}/{{product.productImageList.length}}</view>
		</view>

		<!-- 商品信息 -->
		<view class="product-describe">
			<!-- 状态及勋章 -->
			<view v-if="product.available" class="status-section">
				<text class="medal-text">{{product.productBadge}}个勋章可兑换</text>
			</view>

			<view v-if="!product.available" class="status-section">
				<text class="medal-text">联系客户咨询改价</text>
			</view>

			<!-- 商品属性 -->
			<view class="spec-section">
				<text class="product-name">{{product.productName}}</text>
				<!-- 修改分享按钮布局 -->
				<view class="share-wrapper">
					<image src="/static/icon-share.png" class="share-btn" @click="handleShare" />
					<text class="share-text">分享</text>
				</view>
			</view>
		</view>

		<view class="product-detail">
			<!-- 商品详情 -->
			<view class="detail-section">
				<text class="detail-title">商品详情</text>
				<image v-for="(img, index) in productDeatils" :key="'detail'+index" :src="img" mode="widthFix"
					class="detail-image" />
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="footer-bar">
			<!-- 修改客服按钮布局 -->
			<view class="service-btn">
				<image src="/static/icon8.png" class="icon" />
				<text>客服</text>
			</view>
			<view class="exchange-btn">
				{{product.availble ? '置换商品' : '已售罄'}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperIndex: 0,
				productId: '',
				userId : '',
				product: {},
				productImageList:[],
				productDeatils: []
			}
		},
		onLoad(param) {
			const {userId, productId}=param;
			this.productId = productId;
			this.userId = userId;
			this.getProductByProductId();
		},
		methods: {
			onSwiperChange(e) {
				this.swiperIndex = e.detail.current
			},
			handleShare() {
				uni.share({
					provider: 'weixin',
					type: 0,
					scene: 'WXSceneSession',
					title: this.product.name,
					success: res => console.log('分享成功', res)
				})
			},getProductByProductId(productId) {
				get('wx/market/getMarketProductByProductId?productId='+this.productId).then(json=>{
					const result = json.data?.data?.item;
					this.product = result;
					if (result?.productImage) {
						this.productImageList = result.productImage.split[';'];
					}
					if (result?.productDeatil) {
						this.productDeatils = result.productDeatil.split[';'];
					}
				})
			} 
		}
	}
</script>

<style scoped lang="scss">
	.container {
		padding-bottom: 120rpx;
		background: #fff;
	}

	.swiper-container {
		position: relative;
		height: 750rpx;

		.product-swiper {
			height: 100%;

			.swiper-image {
				width: 100%;
				height: 750rpx;
			}
		}

		.swiper-indicator {
			position: absolute;
			right: 30rpx;
			bottom: 30rpx;
			background: rgba(0, 0, 0, 0.6);
			color: #fff;
			padding: 8rpx 24rpx;
			border-radius: 24rpx;
			font-size: 28rpx;
		}
	}

	.product-describe {
		padding: 30rpx;

		.status-section {
			.medal-text {
				display: block;
				font-size: 36rpx;
				color: #ff4c4c;
				font-weight: bold;
				margin-bottom: 20rpx;
			}
		}

		.spec-section {
			position: relative;
			margin-bottom: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.product-name {
				font-size: 32rpx;
				color: #333;
				font-weight: 500;
				flex: 1;
			}

			.share-wrapper {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding-left: 30rpx;

				.share-btn {
					width: 40rpx;
					height: 40rpx;
					margin-bottom: 10rpx;
				}

				.share-text {
					font-size: 24rpx;
					color: #666;
				}

				/* 添加虚线边框 */
				&::after {
					content: '';
					position: absolute;
					right: 80rpx;
					top: 50%;
					transform: translateY(-50%);
					height: 60rpx;
					border-left: 2rpx dashed #ddd;
				}
			}
		}
	}

	.detail-section {
		.detail-title {
			display: block;
			font-size: 32rpx;
			color: #333;
			font-weight: bold;
			margin-bottom: 30rpx;
			text-align: center;
		}

		.detail-image {
			width: 100%;
			margin-bottom: 30rpx;
			border-radius: 16rpx;
		}
	}

	.footer-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		background: #fff;
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		z-index: 1000;
		width: 100%;
		justify-content: space-between;

		.service-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: auto;
			color: #fff;

			.icon {
				width: 40rpx;
				height: 40rpx;
				margin-bottom: 8rpx;
			}

			text {
				color: #000;
				font-size: 24rpx;
			}
		}

		.exchange-btn {
			text-align: center;
			border-radius: 40rpx;
			background-color: #000;
			color: #fff;
			width: 70%;
			margin: auto;
			line-height: 60rpx;

			&.disabled {
				background: #999;
			}
		}

	}
</style>