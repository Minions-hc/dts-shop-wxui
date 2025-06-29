<template>
	<view class="container">
		<!-- 顶部搜索栏 -->
		<view class="header">
			<view class="logo"></view>
			<view class="search-box" @click="navigateTo('/subHome/category/index')">
			</view>
		</view>

		<!-- 热销轮播 -->
		<view class="hot-swiper">
			<swiper :indicator-dots="true" :autoplay="true" circular interval="3000" :style="{height: '600rpx'}"
				class="auto-height-swiper" @change="onSwiperChange">
				<swiper-item v-for="(item, index) in hotList" :key="index">
					<image :src="getImgUrl(item,3)" mode="aspectFill" class="swiper-img" />
				</swiper-item>
			</swiper>
			<view class="go-button" @click="toSeriesPage(currentItem)"></view>
		</view>

		<!-- 踩雷赏轮播 -->
		<view class="thunder-section">
			<view class="section-header">
				<view class="section-title"></view>
				<view class="more-btn" @click="navigateTo('/subHome/category/index')">
				</view>
			</view>
			<swiper class="thunder-swiper" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="500"
				:previous-margin="10" :next-margin="10" :display-multiple-items="3" circular>
				<swiper-item v-for="(item, index) in avoidList" :key="index" class="swiper-item">
					<image class="swiper-img" :src="getImgUrl(item,2)" mode="aspectFit" @click="toSeriesPage(item)" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 产品系列Tab -->
		<view class="series-tab">
			<view v-for="(item, index) in productSeriesGroup" :key="index"
				:class="['tab-item', currentSeries === item.name ? 'active' : '']" @click="changeSeries(item)">
				{{item.name}}
				<span v-if="currentSeries === item.name"></span>
			</view>
		</view>

		<!-- 瀑布流商品展示 -->
		<view class="waterfall" v-if="productList.length > 0">
			<view v-for="(item, index) in productList" :key="index" class="product-item"
				@click="toSeriesPage(item)">
				<!-- 添加外层容器控制宽高比 -->
				<view class="image-container">
					<image :src="getImgUrl(item,1)" class="product-img" mode="aspectFill" />
				</view>
				<text class="product-name">{{item.seriesName}}</text>
				<view class="price-box">
					<text class="price">¥{{item.price}}</text>
					<text class="sales">已售{{item.purchaseCount}}</text>
				</view>
			</view>

		</view>
		<!-- 进群抽奖浮窗 -->
		<view v-if="showGroup" class="group-container">
			<image class="close-icon"
				src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/group-close.png"
				@click.stop="closeGroup" />
			<image class="group-image"
				src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/group-banner.png"
				mode="widthFix" @click="navigateToGroup" />
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
				currentTab: 0,
				currentSeries: 0,
				hotList: [],
				seriesList: [],
				avoidList: [],
				productList: [],
				productSeriesGroup: [],
				showGroup: true, // 初始显示状态
				userId: uni.getStorageSync('userId'),
				currentItem: null
			}
		},
		// 发送给朋友（默认转发）
		onShareAppMessage() {
			return {
				title: '分享给好友',
				path: '/pages/index/index?inviterId=' + this.userId,
				imageUrl: '/static/share.png'
			}
		},

		// 转发到朋友圈（需额外配置）
		onShareTimeline() {
			return {
				title: '分享到朋友圈', // 朋友圈标题
				path: '/pages/index/index?inviterId=' + this.userId,
				imageUrl: '/static/share.png'
			}
		},
		onLoad(param) {
			const {
				inviterId
			} = param;
			if (inviterId) {
				uni.setStorageSync('inviterId', inviterId)
			}
			this.initPage();
			this.loadHotProduct();
			this.loadisAvoidProduct();
			const savedState = uni.getStorageSync('groupBannerState')
			if (savedState !== '') {
				this.showGroup = savedState
			}
			
		},
		methods: {
			switchTab(index) {
				this.currentTab = index
			},
			changeSeries(item) {
				this.currentSeries = item.name
				this.productList = this.allSeries[this.currentSeries];
				// 这里请求对应系列的商品数据
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				})
			},
			onSwiperChange(e) {
				const currentIndex = e.detail.current
				this.currentItem = this.hotList[currentIndex]
			},
			toSeriesPage(item) {
				const seriesId = item.seriesId;
				let url = '/subHome/blindBox/yifanshang?userId=' + this.userId + '&seriesId=' + seriesId;
				if (item?.isAvoid) {
					url = '/subHome/blindBox/caileishang?userId=' + this.userId + '&seriesId=' + seriesId
				}
				this.navigateTo(url)
			},
			initPage() {
				get('wx/home/getWxProductSeries').then(json => {
					const result = json.data?.data;
					if (result?.items) {
						const setMap = {};
						const allProduct = []
						this.seriesList = result?.items?.map(item => {
							allProduct.concat(item.products);
							return {
								name: item.categoryName,
								seriesId: item.seriesId
							}
						}).filter(item => item);
						const keys = Object.keys(result?.productSeriesGroup);
						this.allSeries = result?.productSeriesGroup;
						this.productSeriesGroup = Object.keys(result?.productSeriesGroup).map(item => {
							return {
								name: item
							}
						})
						this.currentSeries = this.productSeriesGroup[0].name
						this.productList = result?.productSeriesGroup[this.currentSeries];
					}
				})
			},
			loadHotProduct() {
				get('wx/home/getWxProductSeries?isHot=1').then(json => {
					const result = json.data?.data;
					this.hotList = result?.items || []
					if (this.hotList.length > 0) {
						this.currentItem = this.hotList[0]
					}
				})
			},
			loadisAvoidProduct() {
				get('wx/home/getWxProductSeries?isAvoid=1').then(json => {
					const result = json.data?.data;
					this.avoidList = result?.items || []
				})
			},
			getImgUrl(series, index) {
				return series.seriesImage
			},
			// 跳转页面
			navigateToGroup() {
				uni.navigateTo({
					url: '/subActivity/group/index'
				})
			},

			// 关闭浮窗
			closeGroup() {
				this.showGroup = false
				// 持久化存储状态
				uni.setStorageSync('groupBannerState', false)
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding-bottom: 120rpx;
		min-height: 100vh;
		width: 100%;
		/* 背景图路径（图片需放在static目录） */
		background-image: url('https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/home-back.jpg');

		/* 关键样式 */
		background-size: cover;
		/* 或使用 contain 根据需求 */
		background-position: center;
		background-repeat: no-repeat;
		transition: all 0.3s ease;
		/* 添加过渡动画 */
	}

	.header {
		display: flex;
		align-items: center;
		padding: 20rpx;
		align-content: space-between;

		.logo {
			color: #FF0000;
			font-size: 40rpx;
			display: inline-block;
			width: 20%;
			height: 30px;
			background-image: url('https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/headLogo.png');
			/* 关键样式 */
			background-size: contain;
			/* 或使用 contain 根据需求 */
			background-position: center;
			background-repeat: no-repeat;
		}

		.search-box {
			width: 65%;
			height: 30px;
			line-height: 30px;
			background: #f5f5f5;
			border-radius: 50rpx;
			padding: 10rpx 20rpx;
			color: #c9c9c9;
			padding-left: 30rpx;
			/* 关键样式 */
			background-size: cover;
			/* 或使用 contain 根据需求 */
			background-position: center;
			background-repeat: no-repeat;
			background-image: url('https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/search-box.png');
			margin: auto;
		}

		.search-input {
			display: none;
		}
	}

	.hot-swiper,
	.thunder-swiper {
		position: relative;

		.swiper-img {
			width: 750rpx;
			height: 300rpx;
		}

		.go-button {
			position: absolute;
			bottom: 80rpx;
			left: 50%;
			transform: translateX(-50%);
			border-radius: 8rpx;
			width: 200rpx;
			height: 100rpx;
			background-repeat: no-repeat;
			background-size: 100%;
			/* 自定义缩放比例 */
			background-position: 100% 100%;
			/* 定位到图片特定区域 */
			background-image: url('https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/go-button.png');
		}
	}

	.hot-swiper {
		.swiper-img {
			height: 620rpx;
			max-height: 620rpx;
			max-width: 750rpx;
		}
	}

	.thunder-section {
		padding: 20rpx;
		margin: 20rpx 0;
		margin-top: 0rpx;
		border-radius: 10rpx;

		.section-header {
			display: flex;
			justify-content: space-between;
			padding: 10rpx;

			.section-title {
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA6IAAAEOCAYAAACTuao7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiZDY0NDU0MC0wYzExLTk2NGItODdlOS1kZDU4Y2Y4YTRkN2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzMwQUFBNTAxQjk3MTFGMDgyQkFGMkJEMDkwRkEyNTYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzMwQUFBNEYxQjk3MTFGMDgyQkFGMkJEMDkwRkEyNTYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI2LjIgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YjYwOGUxNDYtMDk4MS0wMjQ5LWFiNTMtZjI4ZWZjYmEzYjIzIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YjI3ZmIyZTUtMzdmMS05OTQwLTg4MjQtZmYxMmJmYTIzMTUyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+DKjMgAAAfzlJREFUeNrsnQecVNX5/t+7vTd2lyLSka4ihqZURbAgKCoaFRuxJPYSk5jE6F8xatREjV1/iUZRUREVFVFU7IqIoBQBQXpbYHvf+3+fO3eW2dmZZcv0eb6fz9mZuXd2Zu69557zPud9z3sM0zSFEEIIIYQQQggJFDE8BYQQQgghhBBCKEQJIYQQQgghhFCIEkIIIYQQQgghFKKEEEIIIYQQQihECSGEEEIIIYQQClFCCCGEEEIIIRSihBBCCCGEEEIoRAkhhBBCCCGEEApRQgghhBBCCCEUooQQQgghhBBCCIUoIYQQQgghhBAKUUIIIYQQQgghhEKUEEIIIYQQQgiFKCGEEEIIIYQQClFCCCGEEEIIIYRClBBCCCGEEEIIhSghhBBCCCGEECelpaUya9Ysc8yYMeakSZPMhx56yORZaUwcTwEhhBBCCCGEtJ29e/fKuHHjzOXLl9dvW7BggWzbts286667DJ6hA9AjSgghhBBCCCE+4IEHHmggQp38/e9/l//85z/0jFKIEkIIIYQQQohvmTNnjtd9//73v6WkpIQniUKUEEIIIYQQQnzDp59+KmvWrPG6f8mSJbJx40aeKApRQgghhBBCCGk78HQef/zxBw29ffXVVxmeSyFKCCGEEEIIIW2jpqZGLr74YrOysvKg733zzTd5wmwM06QoJ4QQQgghhIQf27dvl/Xr10tiYqIMGTJEYmIC72dbtmyZDB48uNmiSvUXs+cKPaKEEEIIIYSQMKO2tlZuv/12c9CgQeaoUaPMoUOHmr/61a/MhQsXBvy33HfffS3y7N188830BAo9ooQQQgghhJAwY8+ePdKvXz8Tj64kJyfLiy++KKeeempAvI7QUjExMS0SVL169ZIvvvjCyM3NjeprSI8oIYQQQgghJKwoKysTdxEKysvL5fTTT5fp06ebgVgqZdq0aS326q1bt04WLVoU9d5AClFCCCGEEEJIWPH99997FXII23355ZfhFTUhWP3Fm2++ac6dO7dV/3vllVdG/TWkECWEEEIIIYSEFQi/PRgffvihFb4LweiP3zBlyhSv+9q3b9+k2Ny9e7ds27aNQpQQQgghhBBCwoV58+Y1632bNm2CZ1Reeukln4rRE0880Wwq107Xrl3loYceanKearSvKUohSgghhBBCCAkrSktLW/T+Cy+8UG644YZmrfV5MH7++Wf56quvmnzPE088YYnQZ555xut7Xnnllai+hhSihBBCCCGEkLBh/vz5LfYkVlRUyP333y9HH320uWPHjjZ9/0cffWTu27fP6/6///3vcsQRR1jPp0yZYnTu3Nnj+3744QfZsmULhSghhBBCCCGEhDoffPBBq/8X4g9htcuWLWv1Z1x77bVe940cOVKuuuqq+pDcnJwcOeusszy+d+/evfL8889HbXguhSghhBBCCCEkbFi+fLnXff369Tvo/0OEDh482HzggQdMZNhtCePGjTOLi4u97r/kkkskJSWlkTg1DM/TRe+77z5paq4phSghhBBCCCGEBBnM8TxYWOy9994rmZmZB/2sm266SWbNmtVsFfj000+bH330UZPvmT59eiPFOXToUK9Ji5A994UXXohKJUohSgghhBBCCAkLINxQvJGenm7ceOONxvLly42DeUfhDf3rX/8qxxxzjLl69eom34s5ps8991yT73nwwQclNTW10fZDDz1UsrKyvP7fBRdcEJXXkkKUEEIIIYQQEhbs2bPHKp6ACMzNzbWed+nSRd5//31j0KBBB/3Mzz//XCZOnGhu3LjR63vghf3444+97p8wYQLWDfXq+Zw9e7bRlCBeu3ZtyJ/7mpoaClFCCCGEEEJIdArR8vJyj/vy8vKs4qRTp07yzTffGP/4xz8O+rlYb7R///7mQw895DFM9rzzzvMaPoswYKwZ6m0eKFCha4ljb+jvDMnw3F27diHbsDl06FBz4MCB5kUXXWSWlJRQiBJCCCGEEEKih9WrV3sVbO3atbOKK4mJiVg/1EBSoNjY2CY/GwL36quvlt///vcNvuORRx4xFy1a5PX/Jk+eLH369Dnob9fP9bpv8eLFIXWeCwoK5IorrjC7d+9u6vmDUJY1a9bIf/7zH8x59YlophAlhBBCCCGEhAUrVqzwug/zMOPj4z3uu/76642PPvrIGDx48EG/A8mOpk2bZv7yyy/y888/y6233trk+//4xz8azfntZ599tuHqsXXllVdeaXLua6BYsmQJEi5ZAvSxxx6TsrKyRu9ZtWqVXH755W0WoxSihBBCCCGEkLAAXjlv9O7du8n/PfbYYzHP0zj88MMP+j2vvfaa6PvMv/3tb6a3OanglFNOQUhvs347vLVDhgzxuA8eyOeeey4o4blYPmbu3LnmjBkzzFGjRpkvv/yyNLVEDVi5cmWbv5dClBBCCCGEEBIWwBvnjeYkJkpPTxd4Rn/zm98c9L1FRUVNZsrt0KGDNTe0Jb9/ypQpXvchBDbQIOR48uTJ5umnn24dK7IDN4euXbtSiBJCCCGEEEKiAyTP8Ub//v2bJQqzs7PliSeeMDDfEXNIWwvWLO3WrVuL/ueMM85o8jfefffdAfGKfvvttzJ+/HjzuOOOM+fPn9/i/7/pppuMtv4GClFCCCGEEEJI2NPcEFknF1xwgfH0009Lfn5+i79r6tSp1v+39P+wvEyvXr287kdIMEJl/QE+Fx7Qs846y8TaqR9++GGrPgfZgZsT3kwhSgghhBBCCAl7ECrbFK0RlOeee67x448/Gscff3yz/ychIQGZdFvtEXzwwQe97tu6dats2bLFp+etrq5OvvrqKysLLtZLnTNnjlRWVrb682677Taf/C4KUUIIIYQQQkjYC9HWAi/lm2++aYwdO7ZZ7x81apTk5OS0+vtGjhxpePPebt++XbZt2+azY8NnIQuufqf5+OOPS01NTZs/87zzzjN88dsoRAkhhBBCCCEhT0lJidd9nTp1atNnJyUlycKFC42nnnrqoPNGL7vssjbNLc3MzMRcUY/74L1855132hybu3fvXrnqqqvMfv36mVgaBp/bXLAmKry+3n57SkqKT64nhSghhBBCCCEkrIVoz5492/z5cXFxcskllxizZ8+WmBjPMuncc8+VM888s80ewdtuu81oYl+rPxcez3nz5pnDhw83H3744RZ5kbG8zEMPPYTQYcPbPNXOnTtbop1ClBBCCCGEEBIVNLW2ZY8ePXz2PaeddpqxZMkS47jjjqvfhgQ955xzDpY4MXz1PSNHjvS678Ybb2yxVxSZcIcMGWIikdLatWub/X9dunSRZ599VtavX29ceeWVxvvvv29WV1d7fO+hhx4qycnJPjn+OFZpQgghhBBCSKhTVFTkVZy1JlFRUwwePFhUkBlz5841161bJ4cddpicdNJJBgSprzj11FPl888/97gPS8v86U9/atZc1O+//17+/e9/m88//7yUlZU1+/sHDhyIzL8yY8YMw/X8wZPqje7d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');
				background-size: cover;
				/* 或使用 contain 根据需求 */
				background-position: center;
				background-repeat: no-repeat;
				height: 50px;
				width: 60%;

			}

			.more-btn {
				border-radius: 30rpx;
				padding: 10rpx 0rpx;
				background-image: url('https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/more.png');
				// background-size: cover;
				/* 或使用 contain 根据需求 */
				// background-position: center;
				background-repeat: no-repeat;
				background-size: 100%;
				/* 自定义缩放比例 */
				background-position: 100% 75%;
				/* 定位到图片特定区域 */
				width: 25%;
			}
		}

		.thunder-swiper {
			background-image: url('https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/thunder-bg.png');
			background-size: cover;
			/* 或使用 contain 根据需求 */
			background-position: center;
			background-repeat: no-repeat;

			.swiper-item {
				display: flex;
				justify-content: center;
				align-items: center;
				overflow: hidden;
				width: 33%;
			}

			.swiper-img {
				width: 80%;
				/* 图片显示宽度 */
				height: 100%;
				border-radius: 16rpx;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
				max-width: 80%;
				max-height: 100%;
			}
		}


	}

	.series-tab {
		display: flex;
		padding: 20rpx;

		.tab-item {
			margin-right: 40rpx;
			font-size: 28rpx;
			transition: all 0.3s;

			&.active {
				font-size: 32rpx;
				color: #FF4081;
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
					left: 20rpx;
					z-index: 2;
				}

			}
		}
	}

	.waterfall {
		column-count: 2;
		column-gap: 20rpx;
		padding: 20rpx;

		.product-item {
			break-inside: avoid;
			margin-bottom: 20rpx;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 15rpx;
			box-sizing: border-box;

			.image-container {
				position: relative;
				width: 100%;
				padding-bottom: 100%;
				/* 关键：创建1:1宽高比的正方形 */
				border-radius: 16rpx;
				overflow: hidden;
				/* 确保圆角生效 */

				.product-img {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
				}
			}



			.product-name {
				display: inline-block;
				font-weight: bold;
				margin: 10rpx 0;
				/* 微调间距 */
				width: 96%;
				padding: 0 2%;
				font-size: 14px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.price-box {
				display: flex;
				justify-content: space-between;
				/* 两端对齐 */
				font-size: 13px;
				width: 96%;
				padding: 0 2%;

				.price {
					font-weight: bold;
					margin-right: 10rpx;
					font-size: 14px;
				}

				.sales {
					color: #c9c9c9;
				}
			}
		}
	}

	.tab-bar {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		display: flex;
		background: white;
		border-top: 1rpx solid #eee;

		.tab-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;

			.tab-icon {
				width: 48rpx;
				height: 48rpx;
			}

			.tab-text {
				font-size: 24rpx;

				&.active {
					color: #FF4081;
				}
			}
		}
	}

	.group-container {
		position: fixed;
		right: 20rpx;
		bottom: 10rpx;
		/* 根据实际情况调整 */
		z-index: 999;
		width: 200rpx;
		height: auto;

		.group-image {
			width: 100%;
			height: auto;
			animation: float 3s ease-in-out infinite;
		}

		.close-icon {
			position: absolute;
			top: -20rpx;
			right: -20rpx;
			width: 40rpx;
			height: 40rpx;
			z-index: 1000;
		}
	}

	/* 浮动动画 */
	@keyframes float {

		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-20rpx);
		}
	}
</style>