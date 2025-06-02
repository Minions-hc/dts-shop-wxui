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
			<view class="swiper-indicator">{{swiperIndex + 1}}/{{productImageList.length}}</view>
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
					<image src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon-share.png" class="share-btn" @click="handleShare" />
					<text class="share-text">分享</text>
				</view>
			</view>
		</view>

		<view class="product-detail">
			<!-- 商品详情 -->
			<view class="detail-section">
				<text class="detail-title">商品详情</text>
				<view v-for="(item, index) in productDeatils" :key="item.id">
					<image :src="item.img" mode="scaleToFill" class="detail-image" />
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="footer-bar">
			<!-- 修改客服按钮布局 -->
			<view class="service-btn">
				<image src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon8.png" class="icon" />
				<text>客服</text>
			</view>
			<view class="exchange-btn" @tap="openGood">
				{{product.available ? '置换商品' : '已售罄'}}
			</view>
		</view>
		<uni-popup ref="detailPopup" background-color="#fff" type="bottom" border-radius="10px 10px 0 0">
			<view class="detail-popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<view class="popup-container">
					<view class="container-header">
						盒柜商品
					</view>
					<!-- 分类导航 -->
					<scroll-view class="nav-bar" scroll-x>
						<!-- 筛选按钮 -->
						<view class="filter-btns">
							<view v-for="(btn, index) in categories" :key="index"
								:class="['filter-btn', activeFilter === index ? 'active' : '']"
								@click="changeFilter(btn,index)">
								{{ btn }}
							</view>
						</view>
					</scroll-view>
					<!-- 产品列表 -->
					<scroll-view class="product-list" scroll-y>
						<view v-for="(item, index) in filteredProducts" :key="item.id" class="product-info">
							<view class="product-item" @tap="toDetailPage(item)">
								<image class="product-img" :src="item.productImage" lazy-load="true" />

								<view class="product-info">
									<view class="top-section">
										<text class="name">{{ item.productName }}</text>
									</view>
									<view class="meta-info">
										<text class="source">{{ item.activityType }}</text>
										<text class="grade">{{ item.productLevel }}</text>
									</view>
									<view class="medal-info">
										<text>可抵扣{{ item.productBadge }}勋章</text>
										<view class="status-btn">{{ showStatusWord(item) }}</view>
									</view>

								</view>
							</view>
							<view class="bottom-section">
								<view class="check-product">
									<view class="check-item">
										<view :class="['checkbox', item.checked && 'checked']" @tap="chkProduct(item)">
											<view v-if="item.checked" class="check-icon">✓</view>
										</view>
										<text>可选</text>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>

					<!-- 底部操作栏 -->
					<view class="action-bar">
						<view class="action-group">
							<view class="sel-all" @tap="toggleAll">
								全选
							</view>
							<view class="cancel-sel" @tap="cancelSel">
								取消
							</view>
						</view>

						<view class="sel-btn" v-if="selectItems.length > 0 && countDrage == 0" @tap="exchangeBox">
							去兑换
						</view>
						<view class="sel-btn" v-else>
							<view v-if="selectItems.length === 0">
								请选择
							</view>
							<view v-if="selectItems.length > 0 && countDrage > 0">
								还需要{{countDrage}}个勋章
							</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
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
				swiperIndex: 0,
				productId: '',
				userId: '',
				product: {},
				productImageList: [],
				productDeatils: [],
				categories: ['全部', 'A赏', 'B赏', '终赏', '其他'],
				activeCategory: 0,
				selectedItems: [],
				activeFilter: 0,
				productList: [],
				filteredProducts: []
			}
		},
		onLoad(param) {
			const {
				userId,
				productId
			} = param;
			this.productId = productId;
			this.userId = userId;

		},
		onShow() {
			this.getProductByProductId();
			this.getBoxProductList();
		},
		computed: {
			selectItems() {
				return this.filteredProducts.filter(item => item.checked)
			},
			countDrage() {
				const chkItems = this.filteredProducts.filter(item => item.checked);
				let count = 0;
				chkItems.forEach(item => {
					count = count + item.productBadge
				})
				
				if (!!this.product && count > this.product.productBadge + 3) {
					uni.showToast({ title: '您选中的勋章远大于当前产品所需勋章！！！' })
					return 0
				}
				
				if (!!this.product && count > this.product.productBadge) {
					return 0
				}

				return !!this.product ? this.product.productBadge - count : 0
			}
		},
		methods: {
			chkProduct(item) {
				item.checked = !item.checked;
			},
			fiterProduct(level) {
				if (level === '其他') {
					this.filteredProducts = this.productList.filter(item => !['A赏', 'B赏', '终赏'].some(obj => obj === item
						.productLevel))
					return
				}
				if (level === 'all') {
					this.filteredProducts = this.productList;
				} else {
					this.filteredProducts = this.productList.filter(item => item.productLevel == level)
				}

			},
			showStatusWord(item) {
				let str = '待处理';
				if (item.status === 'shipped') {
					str = '已提货';
				}
				if (item.status === 'locked') {
					str = '锁定中';
				}
				return str
			},
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
			},
			getProductByProductId(productId) {
				get('wx/market/getMarketProductByProductId?productId=' + this.productId).then(json => {
					const result = json.data?.data?.item || {};
					this.product = result;
					if (result?.productImage) {
						this.productImageList = result.productImage.split(';');
					}
					if (result?.productDetail) {
						const productDeatil = result.productDetail.split(';')
						this.productDeatils = productDeatil.map((item, index) => {
							return {
								img: item,
								id: 'product_' + index
							}
						});
					}
				})
			},
			openGood() {
				this.$refs.detailPopup.open('bottom');
			},
			getBoxProductList() {
				get('wx/market/getBoxProductList?userId=' + this.userId).then(res => {
					const result = res?.data?.data || [];
					this.productList = result.map(item => {
						return {
							...item,
							checked: false
						}
					});
					this.fiterProduct('all')
				})
			},
			changeFilter(item, index) {
				this.activeFilter = index;
				const type = index === 0 ? 'all' : item;
				this.fiterProduct(type)
			},
			toggleSelect(id) {
				const index = this.selectedItems.indexOf(id)
				if (index > -1) {
					this.selectedItems.splice(index, 1)
				} else {
					this.selectedItems.push(id)
				}
			},
			toggleAll() {
				this.filteredProducts = this.filteredProducts.map(item => {
					return {
						...item,
						checked: true
					}
				})
			},
			cancelSel() {
				this.filteredProducts = this.filteredProducts.map(item => {
					return {
						...item,
						checked: false
					}
				})
				this.$refs.detailPopup.close()
			},
			exchangeBox() {
				const chkItems = this.filteredProducts.filter(item => item.checked);
				let totalProductBadge = 0;
				const ids = chkItems.map(item => {
					totalProductBadge = totalProductBadge + item.productBadge;
					return item.id
				})
				const postData = {
					ids,
					userId: this.userId,
					productId: this.productId,
					totalProductBadge
				}
				post('wx/market/redeemProduct', postData).then(json => {
					if (json.data.errmsg === '成功') {
						uni.switchTab({
							url: '/pages/box/index'
						});
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
		z-index: 99;
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
			line-height: 80rpx;

			&.disabled {
				background: #999;
			}
		}

	}

	.popup-container {
		max-height: 70vh;
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		background-color: #fcf0f2;
		border-top-right-radius: 20rpx;
		border-top-left-radius: 20rpx;

		.container-header {
			width: 100%;
			text-align: center;
			line-height: 50rpx;
			font-size: 32rpx;
			font-weight: bold;
			padding: 20rpx;
		}
	}

	.filter-btns {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx;
		gap: 20rpx;

		.filter-btn {
			padding: 8rpx 30rpx;
			border-radius: 40rpx;
			background: #d9d9d9;
			color: #666;

			&.active {
				background: #ed80a0;
				color: #333;
			}
		}
	}

	.product-list {
		padding: 20rpx 0rpx;
		overflow-y: auto;

		.product-item {
			display: flex;
			background: #fff;
			border-top-right-radius: 16rpx;
			border-top-left-radius: 16rpx;
			margin: 0 20rpx;
			padding: 20rpx;
			padding-bottom: 0px;

			.product-img {
				width: 180rpx;
				height: 180rpx;
				border-radius: 12rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.product-info {
				flex-shrink: 0;

				.top-section {
					font-size: 32rpx;
					width: 440rpx;
					font-weight: bold;
					white-space: nowrap;
					/* 禁止文本换行 */
					overflow: hidden;
					/* 隐藏超出范围的内容 */
					text-overflow: ellipsis;
					/* 使用省略号 */
					display: -webkit-box;
					/* 将对象作为弹性伸缩盒子模型显示 */
					-webkit-box-orient: vertical;
					/* 垂直排列子元素 */
					-webkit-line-clamp: 2;
					/* 限制显示的行数为两行 */
					margin-bottom: 15rpx;
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
						font-size: 14px;
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
			margin-bottom: 20rpx;
			padding-bottom: 20rpx;
			padding-top: 10rpx;
			border-bottom-left-radius: 16rpx;
			border-bottom-right-radius: 16rpx;

			.check-product {
				padding-left: 20rpx;

				.check-item {
					display: flex;
				}

				.checkbox {
					width: 40rpx;
					height: 40rpx;
					border: 2rpx solid #ed80a0;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 10rpx;

					&.checked {
						background: #ed80a0;
						border-color: #ed80a0;

						.check-icon {
							color: #fff;
							font-size: 28rpx;
							transform: translateY(-2rpx);
						}
					}

					&.disabled {
						background: #f5f5f5 !important;
						border-color: #ddd !important;

						.check-icon {
							color: transparent !important;
						}
					}
				}
			}
		}

		.bottom-section-position {
			justify-content: flex-end;
		}
	}

	.action-bar {
		height: 200rpx;
		display: flex;
		align-items: center;
		padding: 15rpx 30rpx;
		justify-content: space-between;
		align-items: center;

		.action-group {
			flex: 1;
			display: flex;
			justify-content: space-between;
			margin-right: 15rpx;

			.sel-all,
			.cancel-sel {
				width: 45%;
				line-height: 80rpx;
				text-align: center;
				border-radius: 10rpx;
				color: #fff;
				background-color: #d9d9d9;
			}

		}

		.sel-btn {
			width: 50%;
			line-height: 80rpx;
			text-align: center;
			color: #fff;
			background-color: #000;
			border-radius: 10rpx;
			font-size: 24rpx;
		}
	}
</style>