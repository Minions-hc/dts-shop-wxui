<template>
	<view class="container">
		<!-- 顶部背景图 -->
		<view class="header-banner">
			<image src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/market-bg.png"
				mode="widthFix" class="banner-img" />
			<view class="medal-count">总勋章：{{totalMedal}}</view>
		</view>

		<!-- 消息滚动条 -->
		<view class="notice-container">
			<view class="notice-bar">
				<image class="notice-icon"
					src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/record-notice.png"
					mode="widthFix" />
				<view class="notice-content">
					<view class="notice-text" :class="{ scrollable: true }">
						<text v-for="(text, index) in noticeList" :key="index">{{ text }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 系列横向滚动 -->
		<scroll-view class="series-scroll" scroll-x :show-scrollbar="false">
			<view v-for="(item, index) in marketSeriesGroup" :key="index"
				:class="['series-item',currentSeries === item.name ? 'active' : '']" @click="changeSeries(item)">
				{{item.name}}
				<span v-if="currentSeries === item.name"></span>
			</view>
		</scroll-view>

		<!-- 产品网格 -->
		<view class="product-grid">
			<view v-for="(item, index) in productList" :key="index" class="product-item" @click="toProductPage(item)">
				<image :src="getProductImage(item)" class="product-image" />
				<view class="product-info">
					<text class="product-name">{{item.productName}}</text>
					<text class="product-status" :style="{color: item.available ? '#ff4c4c' : '#999'}">
						{{item.available ? `需${item.productBadge}勋章` : '找客服咨询改价'}}
					</text>
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
				totalMedal: 0,
				noticeList: ['【重要通知】如果在集市中没有找到想要的赏品或者赏品已售罄，请联系客服或加入社群咨询'],
				currentSeries: 0,
				marketSeriesGroup: [],
				productList: []
			}
		},
		onShow() {
			this.initPage();
		},
		methods: {
			changeSeries(item) {
				this.currentSeries = item.name
				this.productList = this.allSeries[this.currentSeries];
				// 这里请求对应系列的商品数据
			},
			toProductPage(item) {
				let str = '/subHome/market/detail?productId=' + item.productId;
				uni.navigateTo({
					url: str
				})
			},
			initPage() {
				this.getMarketSeries();
				this.getTotalMedal();
			},
			getMarketSeries() {
				get('wx/market/getWxMarketSeries').then(json => {
					const result = json.data?.data;
					if (result?.items) {
						const setMap = {};
						const allProduct = []
						this.productList = result?.items?.map(item => {
							allProduct.concat(item.products);
							return {
								name: item.productSeriesName,
								productId: item.productId
							}
						}).filter(item => item);
						const keys = Object.keys(result?.marketProductGroup);
						this.allSeries = result?.marketProductGroup;
						this.marketSeriesGroup = Object.keys(result?.marketProductGroup).map(item => {
							return {
								name: item
							}
						})
						this.currentSeries = this.marketSeriesGroup[0].name;
						this.productList = result?.marketProductGroup[this.currentSeries];
					}
				})
			},
			getTotalMedal() {
				const userId = uni.getStorageSync('userId');
				get('wx/market/getBoxProductList?userId=' + userId).then(res => {
					const result = res?.data?.data || [];
					let total = 0;
					result.filter(item => !isNaN(Number(item.productBadge)) && item.productBadge > 0).forEach(
						item => {
							total = total + item.productBadge;
						});
					this.totalMedal = total;
				})
			},
			getProductImage(item) {
				let productImageStr = item.productImage;
				let productImage;
				if (productImageStr) {
					productImage = productImageStr.split(';')[0];
				}
				return productImage;
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		background: #f5f5f5;
		min-height: 100vh;
	}

	.header-banner {
		height: 460rpx;
		position: relative;

		.banner-img {
			width: 100%;
			height: 420rpx;
		}

		.medal-count {
			position: absolute;
			left: 40rpx;
			bottom: 20rpx;
			color: #000;
			padding: 8rpx 24rpx;
			border-radius: 24rpx;
			font-size: 36rpx;
			font-weight: bold;
		}
	}

	.notice-bar {
		margin: 30rpx 20rpx;
		border-radius: 50rpx;
		height: 90rpx;
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;

		.notice-icon {
			width: 70rpx;
			height: 70rpx;
			margin-right: 20rpx;
			flex-shrink: 0;
		}

		.notice-content {
			flex: 1;
			position: relative;
			height: 100%;
			display: flex;
			align-items: center;
			overflow: hidden;

			&::before,
			&::after {
				content: '';
				position: absolute;
				top: 0;
				bottom: 0;
				width: 60rpx;
				z-index: 2;
			}

			&::before {
				left: 0;
				background: linear-gradient(90deg, #f0f0f0 20%, transparent);
			}
		}

		.notice-text {
			display: inline-flex;
			align-items: center;
			white-space: nowrap;
			animation: scroll 20s linear infinite;
			padding-left: 100%;

			text {
				margin-right: 50rpx;
				font-size: 30rpx;
				color: #000;
				font-weight: 500;
			}
		}

		.scrollable {
			animation: scroll 20s linear infinite;
		}

		@keyframes scroll {
			0% {
				transform: translateX(0);
			}

			100% {
				transform: translateX(-100%);
			}
		}
	}

	@keyframes marquee {
		0% {
			transform: translateX(100%);
		}

		100% {
			transform: translateX(-150%);
		}
	}

	.series-scroll {
		white-space: nowrap;
		padding: 20rpx;

		.series-item {
			display: inline-block;
			padding: 12rpx 30rpx;
			margin-right: 20rpx;
			color: #000;
			font-size: 28rpx;

			&.active {
				font-size: 32rpx;
				color: #ed80a0;
				font-weight: bold;
				position: relative;

				span {
					display: inline-block;
					position: absolute;
					width: 90rpx;
					height: 50rpx;
					background-image: url('https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/circe.png');
					background-size: cover;
					/* 或使用 contain 根据需求 */
					background-position: 100% 100%;
					background-repeat: no-repeat;
					top: 0rpx;
					left: 10rpx;
					z-index: 2;
				}
			}
		}
	}

	.product-grid {
		padding: 30rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		/* 关键修改：使用空间分布 */

		.product-item {
			width: calc(50% - 15rpx);
			/* 更精确的宽度计算 */
			margin-bottom: 30rpx;
			/* 增加底部间距 */
			background: #fff;
			border-radius: 16rpx;
			overflow: hidden;
			box-sizing: border-box;
			/* 关键：包含内边距和边框 */

			.product-image {
				width: 100%;
				height: 320rpx;
				background: #eee;
				display: block;
				/* 消除图片底部间隙 */
			}

			.product-info {
				padding: 20rpx;
				box-sizing: border-box;

				/* 包含内边距 */
				.product-name {
					font-size: 28rpx;
					color: #333;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					margin-bottom: 12rpx;
					line-height: 1.4;
					/* 更好的行高 */
				}

				.product-status {
					font-size: 24rpx;
					display: block;
				}
			}
		}
	}
</style>