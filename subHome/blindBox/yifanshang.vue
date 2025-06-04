<template>
	<view class="container">
		<!-- 图片部分 -->
		<view class="image-section">
			<image :src="currentBox.image" mode="scaleToFill" class="box-image" />
		</view>

		<!-- 轮播部分 -->
		<view class="carousel-section">
			<!-- 换箱信息栏 -->
			<view class="control-bar">
				<!-- 左侧换箱按钮 -->
				<view class="left-control" @tap="showBoxPopup = true">
				</view>

				<!-- 右侧欧赏信息 -->
				<view class="right-info">
					<view class="price-info">
						{{ currentBox.pricePerDraw }}/张
					</view>
				</view>
			</view>
			<swiper :current="currentIndex" @change="onSwiperChange" class="box-swiper" disable-touch>
				<swiper-item v-for="(box, index) in boxes" :key="box.id">
					<view class="box-swiper-item">
						<!-- 换箱按钮 -->

						<!-- 切换按钮 -->
						<view class="nav-buttons">
							<!-- 上一箱按钮 -->
							<view class="nav-btn prev-btn" :disabled="currentIndex === 0" @click="switchBox('prev')">
							</view>

							<!-- 刷新按钮 -->
							<view class="refresh-btn" @click="handleRefresh">
							</view>

							<!-- 下一箱按钮 -->
							<view class="nav-btn next-btn" :disabled="currentIndex === boxes.length - 1"
								@click="switchBox('next')">
							</view>
						</view>
						<!-- 预览部分 -->
						<view class="preview-section">
							<!-- 预览标题 -->
							<view class="preview-header">
								<view class="header-left">
									<view class="title">
										预览
									</view>
									<view class="box-info">
										第{{ currentIndex + 1 }}/{{ boxes.length }}箱
										余量{{ currentBox.remain }}/{{ currentBox.total }}张
									</view>
								</view>
								<view class="header-right">
									<view class="instruction" @click="navigatorToRule()">购买说明</view>
									<view class="record" @tap="showRecods()">开赏记录</view>
								</view>
							</view>


							<!-- 产品列表 -->
							<view class="product-grid">
								<view v-for="(product, pIndex) in currentBox.products" :key="product.productId"
									class="product-card">
									<image :src="product.productImage" mode="aspectFill" class="product-image"
										lazy-load="true" />
									<view class="remain-qty">
										{{product.quantity - product.soldQuantity}}/{{product.quantity}}</view>
									<view class="product-info">
										<view class="title-row">
											<!-- 产品类型标签 -->
											<text class="product-type">{{ product.levelName }}</text>
											<!-- 产品名称（带溢出处理） -->
											<text class="product-name">{{ product.productName }}</text>
										</view>
										<text class="product-price">零售价：{{ product.productPrice }}元</text>
										<text class="product-prob">概率：{{ getProductProbaby(product,currentBox) }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>

				</swiper-item>
			</swiper>
		</view>
		<!-- 弹窗遮罩 -->
		<view v-if="showPopup" class="popup-mask" @tap="showPopup = false">
			<view class="popup-content" @tap.stop>
				<!-- 弹窗标题 -->
				<view class="popup-header">
					<text class="title">开赏记录({{records.length}})</text>
					<image src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon-close.png"
						class="close-icon" @tap="showPopup = false" />
				</view>

				<!-- 筛选标签 -->
				<view class="filter-tabs">
					<text v-for="tab in tabs" :key="tab" :class="['tab-item', activeTab === tab && 'active']"
						@tap="activeTab = tab">
						{{ tab }}
					</text>
				</view>

				<!-- 记录列表 -->
				<scroll-view class="record-list" scroll-y>
					<view v-for="(item, index) in filteredRecords" :key="item.productId" class="record-item">
						<!-- 条目头部 -->
						<view class="item-header">
							<view class="header-left">
								<image :src="item.avatar" mode="aspectFit" lazy-load="true" class="record-image"></image>
								<text class="serial">【第{{ item.number }}张】{{ item.userId }}</text>
							</view>

							<text class="time">{{ item.createdAt }}</text>
						</view>

						<!-- 奖品信息 -->
						<view class="prize-info">
							<view class="info-left">
								<image :src="item.productImage" mode="aspectFit" lazy-load="true" class="record-image"></image>
								<text class="prize-name">{{ item.productName }}</text>
							</view>
							<text class="award">{{ item.levelName }} x 1</text>
						</view>

						<!-- 分隔线 -->
						<view v-if="index < filteredRecords.length-1" class="divider"></view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 切换房间弹窗 -->
		<view v-if="showBoxPopup" class="popup-box-mask popup-mask" @tap="showBoxPopup = false">
			<view class="popup-content" @tap.stop>
				<!-- 弹窗标题 -->
				<view class="popup-header">
					<text class="title">切换房间</text>
					<image src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/icon-close.png"
						class="close-icon" @tap="showBoxPopup = false" />
				</view>

				<!-- 记录列表 -->
				<scroll-view class="box-list" scroll-y>
					<view v-for="(item, index) in boxeInfos" :key="item.id" class="box-item" @tap="changeBox(index)">
						<view class="box-img">
							<image src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/box.png"
								mode="aspectFill" class="box-image"></image>
							<text>第{{index + 1}}箱</text>
						</view>
						<view class="box-type-list-content">
							<view class="box-type-list">
								<view class="boxx-type-item" v-for="obj in item.items" :key="obj.type">
									{{obj.type}}赏{{obj.current}}/{{obj.total}}
								</view>
							</view>

						</view>
						<view class="box-total">
							剩{{item.remaining}}发
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 底部悬浮按钮 -->
		<!-- 修改后的底部悬浮按钮部分 -->
		<view class="footer-section">
			<view class="button-container">
				<!-- 四个图片按钮 -->
				<image src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/all-in.png"
					class="button-image" mode="aspectFit" @click="handleDraw(0)" />
				<image src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/pick-one.png"
					class="button-image" mode="aspectFit" @click="handleDraw(1)" />
				<image src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/pick-three.png"
					class="button-image" mode="aspectFit" @click="handleDraw(3)" />
				<image src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/pick-ten.png"
					class="button-image" mode="aspectFit" @click="handleDraw(10)" />
			</view>
		</view>
		<uni-popup ref="shopingPopup" background-color="#fff" @change="changePopup" type="bottom"
			border-radius="10px 10px 0 0">
			<view class="shopping-popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<view class="modal-container">
					<!-- 标题 -->
					<view class="modal-title">{{productSeries.seriesName}}</view>

					<!-- 内容区域 -->
					<view class="modal-content">
						<!-- 价格信息 -->
						<view class="info-item">
							<view>单价：</view>
							<view>￥{{currentBox.pricePerDraw}}</view>
						</view>
						<view class="info-item">
							<view>可用优惠券：</view>
							<view :style="{display:'flex'}" v-if="couponList.length === 0">暂无可用优惠券<uni-icons
									type="right" size="20"></uni-icons></view>
							<view :style="{display:'flex'}" v-else @tap="openCouponList">{{getCounpontContent}}<uni-icons type="right"
									size="20"></uni-icons></view>

						</view>
						<view class="info-item">
							<view>可用红包：</view>
							<view>￥0</view>
						</view>
						<view class="info-item">
							<view>积分抵扣 </view>
							<view class="">
								<text>{{currentPoints}}积分</text>
								<text class="point-class">-￥{{calcPointPrice()}}</text>
								<switch :checked="isDeduction" @change="switch1Change" class="uni-swaitch" />
							</view>

						</view>
						<view class="info-item">
							<view>是否锁箱 </view>
							<switch :checked="isLockBox" @change="switchLockBox" class="uni-swaitch" />
						</view>
						<view class="info-item">
							<view>是否开启动画 </view>
							<switch @change="switchAnimate" class="uni-swaitch" />
						</view>

						<!-- 提货说明 -->
						<view class="delivery-info">
							<view>盒柜选择提货后7天内发货</view>
							<view>盒柜提货运费12元满三件包邮，不支持7天无理由退换货</view>
						</view>
						<view class="total-parice-content">
							小计：￥{{showOrderAmount}}
						</view>
						<view class="check-desc-item">
							<view :class="['checkbox', chkDesc && 'checked']" @tap="changChk">
								<view v-if="chkDesc" class="check-icon">✓</view>
							</view>
							<text>我已满18岁，已阅读并同意《用户使用协议》</text>
						</view>
					</view>


					<!-- 操作按钮 -->
					<view class="confirm-btn" @click="handleConfirm" :class="[!chkDesc && 'disabled-confirm']">确认购买
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="couponPopup" background-color="#fff" type="bottom" border-radius="10px 10px 0 0">
			<view class="coupon-popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<view class="coupon-header">
					<view class="coupon-haeder-title">
						可用优惠券
					</view>
					<view class="close-icon">
						<uni-icons type="closeempty" size="30" @tap="closeCoupon"></uni-icons>
					</view>
				</view>
				<coupon-dialog :userId="userId" :couponList="couponList" @setCoupon="setCoupon"></coupon-dialog>
			</view>
		</uni-popup>
		<lucky-draw :dialogVisiable="dialogVisiable" :drawInfos="drawInfos" @openRecord="openRecord"
			:dialogMoreVisible="dialogMoreVisible" @closeDialog="closeDialog"></lucky-draw>

	</view>
</template>

<script>
	import {
		get,
		post
	} from "@/utils/rest-util.js"
	import {
		getRandomElements
	} from "@/utils/common.js"
	import luckyDraw from './components/luckyDraw.vue';
	import couponDialog from './components/couponDialog.vue';
	import {
		commonMixns
	} from "./index.js"
	export default {
		mixins: [commonMixns],
		onLoad(param) {
			const {
				userId,
				seriesId
			} = param;
			this.seriesId = seriesId;
			this.userId = userId;
		},
		onShow() {
			this.getProductBoxBySeriesId(null)
			this.getUserCurrentPoints();
		},
		components: {
			luckyDraw,
			couponDialog
		},
		data() {
			return {
				dialogVisiable: false,
				dialogMoreVisible: false,
				isDeduction: true,
				isLockBox: true,
				isOpenAnimate: false,
				chkDesc: true,
				currentIndex: 0,
				showMarkPopup: false,
				userId: '',
				seriesId: '',
				drawCount: 0,
				showPopup: false,
				showBoxPopup: false,
				activeTab: '全部',
				tabs: [],
				records: [],
				productInfo: {
					image: "https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/product.jpg",
					title: "高端无线蓝牙耳机",
					price: 399.00
				},
				boxes: [],
				dynamicHeight: "auto", // 初始值
				boxeInfos: [],
				productSeries: {},
				currentPoints: 0,
				drawInfos: [],
				list: [],
				couponPrice: 0,
				couponList: [],
				deductionPoints: 0,
				currentLoop: 0,
				couponId: null,
				point: null
			}
		},
		computed: {
			currentBox() {
				return this.boxes[this.currentIndex]
			},
			filteredRecords() {
				if (this.activeTab === '全部') return this.records
				return this.records.filter(item => item.levelName === this.activeTab)
			},
			showOrderAmount() {
				const orderAmount = this.getOrderAmount();
				const price = orderAmount - this.couponPrice - this.calcPointPrice();
				return price <= 0 ? 0.01 : price;
			},
			getCounpontContent(){
				return this.couponPrice != 0 ? '-￥'+ this.couponPrice :'可用优惠券';
			}
		},
		methods: {
			closeCoupon(){
				this.$refs.couponPopup.close();
			},
			getShowOrderAmount() {
				const orderAmount = this.getOrderAmount();
				const price = orderAmount - this.couponPrice - this.calcPointPrice();
				return price <= 0 ? 0.01 : price;
			},
			setCoupon(item) {
				this.couponPrice = item.couponAmount;
				this.couponId = item.couponId;
				this.$refs.couponPopup.close();
			},
			openCouponList() {
				this.$refs.couponPopup.open('bottom');
			},
			getOrderAmount() {
				const currentBox = this.boxes[this.currentIndex] || {};
				return currentBox?.pricePerDraw * this.drawCount;
			},
			openRecord() {
				this.closeDialog();
				this.showRecods()
			},
			closeDialog() {
				this.dialogVisiable = false;
				this.dialogMoreVisible = false;
			},
			changChk() {
				this.chkDesc = !this.chkDesc;
			},
			closeMask() {
				this.showMarkPopup = false;
			},
			changePopup(e) {
				this.couponPrice = 0;
				this.isDeduction = true;
				this.isOpenAnimate = false;
				this.isLockBox = true;
			},
			changeBox(index) {
				this.currentIndex = index;
				this.showBoxPopup = false;				
			},
			switch1Change(e) {
				this.isDeduction = e.detail.value
			},
			switchAnimate(e) {
				this.isOpenAnimate = e.detail.value;
			},
			switchLockBox(e) {
				this.isLockBox = e.detail.value;
			},
			switchBox(direction) {
				if (direction === 'next' && this.currentIndex === this.boxes.length - 1) {
					uni.showToast({
						title: '没有下一箱了',
						icon: 'none'
					})
				} else if (direction === 'prev' && this.currentIndex === 0) {
					uni.showToast({
						title: '没有上一箱了',
						icon: 'none'
					})
				}
				if (direction === 'prev' && this.currentIndex > 0) {
					this.currentIndex--
				} else if (direction === 'next' && this.currentIndex < this.boxes.length - 1) {
					this.currentIndex++
				}

			},
			onSwiperChange(e) {
				this.currentIndex = e.detail.current
			},
			closeCoupon() {
				this.$refs.couponPopup.close()
			},
			handleRefresh() {
				uni.showLoading({
					title: '刷新中...'
				})
				// 实际刷新逻辑
				const callBack = () => {
					uni.hideLoading()
					uni.showToast({
						title: '刷新成功',
						icon: 'none'
					})
				}
				this.getProductBoxBySeriesId(callBack)
			},
			openDrawDialog(count) {
				if (count === 1) {
					this.dialogVisiable = true
				} else {
					this.dialogMoreVisible = true;
				}
			},
			handleDraw(count) {
				if(!this.userId){
					uni.showToast({
						title:"请先登录",
						icon:"none"
					})
					setTimeout(()=>{
						uni.navigateTo({
							url:"/pages/login/index"
						})
					},500)
					return
				}
				if (count != 0 && count > this.boxes[this.currentIndex].remaining) {
					uni.showToast({
						title: '库存不足~'
					});
					return;
				}
				const callBack = (num) => {
					this.drawCount = num;
					this.getCouponList()
					this.$refs.shopingPopup.open('bottom');
				}
				if (count === 0) {
					const boxNumber = this.boxes[this.currentIndex].id;
					get(`wx/blindbox/numbers?seriesId=${this.seriesId}&boxNumber=${boxNumber}`).then(res => {
						const result = res.data.data;
						const arr = result.map(item => {
							return item.number
						})
						callBack(arr.length)
					})
				} else {
					callBack(count)
				}
			},
			navigatorToRule() {
				uni.navigateTo({
					url: '/subHome/blindBox/yifanshangRule'
				})
			},
			getProductBoxBySeriesId(callBack) {
				get('wx/series/getProductBoxBySeriesId?seriesId=' + this.seriesId).then(json => {
					const result = json.data.data;
					const groupedByBoxNumber = result.groupedByBoxNumber || {};
					const productQuantityMap = result.productQuantityMap || {};
					const remainingQuantityMap = result.remainingQuantityMap || {}
					const productBoxResultVos = result.productBoxResultVos || [];
					this.productSeries = result.productSeries;
					const keys = Object.keys(groupedByBoxNumber);
					const boxList = [];
					const boxeInfos = []
					keys.forEach(item => {
						const boxResult = productBoxResultVos.find(str => str.boxNumber == item);
						const obj = {
							id: item,
							image: groupedByBoxNumber[item]?.[0]?.productImage || '',
							remain: remainingQuantityMap[item],
							total: productQuantityMap[item],
							pricePerDraw: boxResult?.seriesPrice || '0',
							products: groupedByBoxNumber[item]
						}
						const box = {
							id: item,
							remaining: remainingQuantityMap[item],
							items: groupedByBoxNumber[item].map(str => {
								return {
									type: str.levelName,
									current: str.quantity - str.soldQuantity,
									total: str.quantity
								}
							})
						}
						boxeInfos.push(box)
						boxList.push(obj)
					})
					this.boxes = boxList;
					this.boxeInfos = boxeInfos;
					callBack && callBack()
				})
			},
			getProductProbaby(product, currentBox) {
				if (product.quantity === product.soldQuantity) {
					return '0%'
				}
				if (product.levelName === '终赏') {
					return '只赠不售'
				}
				const penson = (product.quantity - product.soldQuantity) / currentBox.remain
				return (penson * 100).toFixed(3) + '%'
			},
			prizeDraw(paymentParams) {
				setTimeout(() => {this.drawBlindBox(paymentParams)}, 1000);
			},
			drawBlindBox(paymentParams) {
				if(this.currentLoop < 3) {
					get('wx/boxproduct/getBoxProductsByWxOrderNo?wxOrderNo='+paymentParams.nonceStr).then(res => {
						const result = res.data;
						console.log("返回结果长度:"+result.data.length)
						if (result.errno === 0) {
							this.currentLoop = 0;
							this.getProductBoxBySeriesId();
							this.drawInfos = result.data;
							this.couponPrice = 0;
							this.$refs.shopingPopup.close();
							this.openDrawDialog(result.data.length)
						}else {
							this.currentLoop = this.currentLoop + 1;
							this.drawBlindBox(paymentParams);
						}
					})
				}else {
					uni.showToast({
						title: '抽赏失败，请联系客服！',
						icon: "none"
					})
				}
			},
			showRecods() {
				const boxNumber = this.boxes[this.currentIndex].id;
				get(`wx/blindbox/openRecords?seriesId=${this.seriesId}&boxNumber=${boxNumber}`).then(res => {
					const result = res.data.data
					const tabs = ['全部'];
					const groupedByLevel = result.groupedByLevel || {};
					const records = result.records || [];
					const tabKeys = Object.keys(groupedByLevel);
					this.tabs = tabs.concat(tabKeys)
					this.records = records
					this.showPopup = true
				})
			},
			async handleConfirm() {
				const addressList = await this.initAddressList();
				const pickupList = addressList.filter(item => item.pickup);
				if (pickupList.length === 0) {
					uni.showModal({
						title: '提示', // 标题
						content: '还未设置自动提货地址，是否前往设置？', // 内容
						confirmText: '确定', // 确认按钮文字
						cancelText: '取消', // 取消按钮文字
						success: (res) => {
							if (res.confirm) {
								uni.navigateTo({
									url: "/subUser/address/index?userId="+this.userId
								})
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})
					return
				}
				const count = this.drawCount
				const boxNumber = this.boxes[this.currentIndex].id;
				get(`wx/blindbox/numbers?seriesId=${this.seriesId}&boxNumber=${boxNumber}`).then(res => {
					const result = res.data.data;
					const listMap = result.map(item => {
						if (!item.soldOut) {
							return item
						}
					}).filter(item => item)
					const arr = listMap.map(item => {
						return item.number
					})
					if (count !== 0) {
						this.list = getRandomElements(arr, count)
					} else {
						this.list = arr;
					}
					// this.drawBlindBox(list,boxNumber)
					const postData = {
						userId: this.userId,
						numbers: this.list,
						boxNumber: boxNumber,
						seriesId: this.seriesId,
						activityType: '一番赏',
						orderAmount: this.getOrderAmount(),
						paymentAmount: this.getShowOrderAmount(),
						amount: this.getShowOrderAmount() * 100,
						description: this.productSeries.seriesName,
						businessType: 1,
						deductionPoints: this.deductionPoints,
						couponId: this.couponId,
						point: this.calcPointPrice() * 10
					}
					this.handleWechatPay(postData)
				})


			},
			getUserCurrentPoints() {
				if(!this.userId){
					return
				}
				get('wx/points/getUserCurrentPoints?userId=' + this.userId).then(json => {
					const result = json.data.data;
					this.currentPoints = result.currentPoints || 0;

				})
			},
			calcPointPrice() {
				// 如果不扣减积分，直接返回为0
				if(!this.isDeduction) {
					this.deductionPoints = 0;
					return 0;
				}
				
				const orderAmount = this.getOrderAmount();
				const currentPrice = orderAmount - this.couponPrice;
				// 当当前已经使用优惠券后的价格小于1块钱，就不使用积分扣减
				if (currentPrice < 1) {
					this.deductionPoints = 0;
					return 0;
				}
				
				// 如果积分大于等于当前订单价格，就只扣减当前的价格
				if (this.currentPoints / 10 >= currentPrice) {
					this.deductionPoints = currentPrice;
					return currentPrice;
				}else {
					this.deductionPoints = this.currentPoints / 10
					// 否则就全扣
					return this.currentPoints / 10
				}
			}


		}
	}
</script>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.image-section {
		height: 300rpx;
		background-color: #f5f5f5;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.image-section {
		height: 300rpx;

		.box-image {
			max-width: 100%;
			max-height: 100%;
		}


	}

	.carousel-section {
		position: relative;
		display: flex;
		min-height: 100vh;

		.box-swiper {
			min-height: 600rpx;
			max-height: 1000vh;
			overflow: visible;
			height: auto;
			flex: 1;
		}
	}

	.box-swiper-item {
		min-height: 600rpx;
		height: auto;
		overflow: auto;
	}

	.control-bar {
		position: absolute;
		top: -150rpx;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 0 20rpx 20rpx;

		.left-control {
			width: 200rpx;
			height: 150rpx;
			background-size: 100%;
			/* 或使用 contain 根据需求 */
			background-position: center;
			background-repeat: no-repeat;
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAACECAYAAABlGBWSAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAHpGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTFjZDEyZiwgMjAyNC8xMS8xMS0xOTowODo0NiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6QXR0cmliPSJodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcDpDcmVhdG9yVG9vbD0iQ2FudmEgKFJlbmRlcmVyKSBkb2M9REFHaTZiaFhta1EgdXNlcj1VQUVYTHdQMy1MZyBicmFuZD11LTE4Nzc3NiDnmoTlm6LpmJ8gdGVtcGxhdGU9IiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNS0wNC0xOFQyMzo1MjowNiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDQtMTlUMDA6MTY6MjkrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDQtMTlUMDA6MTY6MjkrMDg6MDAiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MmQ1YzJmMjQtMDgwNy05NDRkLWE3YjktZmUzYzBmYmI2MDhkIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YWFiMGI2OWItMjAzZi1hNDQ5LTk2YWMtMWQ3YTIxNTc0MTZkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZjlkNjg5YjEtMWZmYS00NzRlLWJhODctYWQ2ZmM0NTA2MTI0Ij4gPEF0dHJpYjpBZHM+IDxyZGY6U2VxPiA8cmRmOmxpIEF0dHJpYjpDcmVhdGVkPSIyMDI1LTA0LTE4IiBBdHRyaWI6RXh0SWQ9ImU0OTE2OWZhLTY5MTUtNGYxMC1hM2QyLTY1MWUzMzdiOTRkMCIgQXR0cmliOlRvdWNoVHlwZT0iMiIvPiA8L3JkZjpTZXE+IDwvQXR0cmliOkFkcz4gPGRjOnRpdGxlPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5kNWY1MWE3NWQxMzg1NTQ5YjM4ZWVjYWZjZDlkZmQ3LnBzZCAtIDI8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8ZGM6Y3JlYXRvcj4gPHJkZjpTZXE+IDxyZGY6bGk+dS0xODc3NzY8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2RjOmNyZWF0b3I+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmY5ZDY4OWIxLTFmZmEtNDc0ZS1iYTg3LWFkNmZjNDUwNjEyNCIgc3RFdnQ6d2hlbj0iMjAyNS0wNC0xOVQwMDoxNjoyOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI2LjIgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoyZDVjMmYyNC0wODA3LTk0NGQtYTdi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');
		}

		.right-info {
			width: 200rpx;
			height: 150rpx;
			position: relative;
			background-size: 100%;
			/* 或使用 contain 根据需求 */
			background-position: center;
			background-repeat: no-repeat;
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASEAAACOCAYAAAB+IL6UAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAHpGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTFjZDEyZiwgMjAyNC8xMS8xMS0xOTowODo0NiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6QXR0cmliPSJodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcDpDcmVhdG9yVG9vbD0iQ2FudmEgKFJlbmRlcmVyKSBkb2M9REFHaTZiaFhta1EgdXNlcj1VQUVYTHdQMy1MZyBicmFuZD11LTE4Nzc3NiDnmoTlm6LpmJ8gdGVtcGxhdGU9IiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNS0wNC0xOVQwMDo1ODowNCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDQtMTlUMDA6NTk6MjgrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDQtMTlUMDA6NTk6MjgrMDg6MDAiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTRmYWVlNWItNThkMy1kODQ5LTg3NTYtNTJjYTNhMjEyMGY4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MmU5ZWQ5NzktMmI3Ni0zZDQ5LTlmZjEtMjgzYzRjMWNjMzA1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZjllZGQxMDktNTdjZS0xODQ3LWFlM2UtMzg5M2E0OTZjOWY4Ij4gPEF0dHJpYjpBZHM+IDxyZGY6U2VxPiA8cmRmOmxpIEF0dHJpYjpDcmVhdGVkPSIyMDI1LTA0LTE4IiBBdHRyaWI6RXh0SWQ9ImMxMmQwNDQ3LWE1NWUtNDJiMy1iYWNkLTllMDhkMDBjNjJiYiIgQXR0cmliOlRvdWNoVHlwZT0iMiIvPiA8L3JkZjpTZXE+IDwvQXR0cmliOkFkcz4gPGRjOnRpdGxlPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5kNWY1MWE3NWQxMzg1NTQ5YjM4ZWVjYWZjZDlkZmQ3LnBzZCAtIDI8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8ZGM6Y3JlYXRvcj4gPHJkZjpTZXE+IDxyZGY6bGk+dS0xODc3NzY8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2RjOmNyZWF0b3I+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmY5ZWRkMTA5LTU3Y2UtMTg0Ny1hZTNlLTM4OTNhNDk2YzlmOCIgc3RFdnQ6d2hlbj0iMjAyNS0wNC0xOVQwMDo1OToxOCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI2LjIgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NGZhZWU1Yi01OGQzLWQ4NDktODc1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');

			.price-info {
				position: absolute;
				display: flex;
				line-height: 150rpx;
				width: 100%;
				font-size: 24rpx;
				text-align: center;
				padding-left: 20rpx;
				font-weight: bold;
				color: #ed80a0;
			}
		}
	}

	/* 导航按钮 */
	.nav-buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		padding-bottom: 0rpx;
		background-size: cover;
		/* 或使用 contain 根据需求 */
		background-position: center;
		background-repeat: no-repeat;
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA64AAACbCAYAAABiWcbxAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAHpGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTFjZDEyZiwgMjAyNC8xMS8xMS0xOTowODo0NiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6QXR0cmliPSJodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcDpDcmVhdG9yVG9vbD0iQ2FudmEgKFJlbmRlcmVyKSBkb2M9REFHaTZiaFhta1EgdXNlcj1VQUVYTHdQMy1MZyBicmFuZD11LTE4Nzc3NiDnmoTlm6LpmJ8gdGVtcGxhdGU9IiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNS0wNC0xOVQwMDoxMToxMCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDQtMTlUMDA6MTI6MzArMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDQtMTlUMDA6MTI6MzArMDg6MDAiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M2E3ZDY3OGItOTgyYS0yODQ0LTkyMjctMzk1YmI0NzdmZjkxIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZjNlNGY1N2EtOWI2Zi1mMTRkLWJjNzYtNjQ5YWE2YTdhNjI0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NmM0YmZjMGItZGE0Yi0xZTRlLTgzZjctNDkxNDA3MTg3YzljIj4gPEF0dHJpYjpBZHM+IDxyZGY6U2VxPiA8cmRmOmxpIEF0dHJpYjpDcmVhdGVkPSIyMDI1LTA0LTE4IiBBdHRyaWI6RXh0SWQ9IjljYTU4ZWJhLWQ5Y2ItNDQyOC1iZTA0LTI3NWI5NDZjOTllNSIgQXR0cmliOlRvdWNoVHlwZT0iMiIvPiA8L3JkZjpTZXE+IDwvQXR0cmliOkFkcz4gPGRjOnRpdGxlPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5kNWY1MWE3NWQxMzg1NTQ5YjM4ZWVjYWZjZDlkZmQ3LnBzZCAtIDI8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8ZGM6Y3JlYXRvcj4gPHJkZjpTZXE+IDxyZGY6bGk+dS0xODc3NzY8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2RjOmNyZWF0b3I+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZjNGJmYzBiLWRhNGItMWU0ZS04M2Y3LTQ5MTQwNzE4N2M5YyIgc3RFdnQ6d2hlbj0iMjAyNS0wNC0xOVQwMDoxMjozMCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI2LjIgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozYTdkNjc4Yi05ODJhLTI4NDQtOTIyNy0zOTViYjQ3N2ZmOTEiIHN0RXZ0OndoZW49IjIwMjUtMDQtMTlUMDA6MTI6MzArMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNi4yIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6h2RMqAAAG+0lEQVR4nO3dz+tldR3H8df3yjCjjKUcTG1SMBBmmAxFoRYjuktIqAiiReHZCBbUIqSlff4AEYpGcHciCGrVwlVUEOkm0U0T5KJhwhJFTqjjr0HEFt/v6HfGe79+f9z7Pe+ZeTzg8P1y7zmf894++Zx771qKGttwdZIbklyT5OCm46op5wIAALgMfJDk3KbjnSSvda1/d9KpFlibeoAkGdvwhST3JbknyR1JvpTkxkmHAgAAuPK8muRUkr8neS7Jn7vWvzLtSBOF69iG40nuTXJi4++tU8wBAADApzqd5K8bxzNd61/c7wH2NVzHNpxI8lCS7yT5zH7eGwAAgD17I8nvkvyqa/2z+3XTlYfr2IYDSb6X5CdZfwQYAACAS9+pJI8n+U3X+vdXeaOVhevYhuuTPJzkx0mOrOo+AAAATOq/SX6e5Kmu9W+u4gYrCdexDQ8meTLJLatYHwAAgHJeSvLDrvVPL3vhpYbr2IZbsh6sDy5zXQAAAC4ZT2c9YF9a1oJLC9exDd9M8uskh5e1JgAAAJekt5J8v2v975ex2J7DdWzDoSRPJPnB3scBAADgMnIyyaNd69/byyJ7CteN32P9bZLje1kHAACAy9Y/knyja/2/drvArsN1bMPtSf6Y5NbdrgEAAMAV4d9Jvta1/sXdXLyrcN2I1meSfG431wMAAHDFeTXJfbuJ19lOLxjb8OWIVgAAAHbmxiR/Gdtw504v3NGO69iGY0n+lOTmnd4IAAAAkryc5N6u9ae3e8G2w3Vsw21Jno1oBQAAYG9OZz1eX97Oydt6VHhsw82x0woAAMByfDHJH8Y2fH47J2/3M64nk9y265EAAADgQseT/GI7J35quI5teCTJt/Y6EQAAAFzk2xvNuaUtP+M6tuF4kr8luWZZUwEAAMAmbyf5atf6U4tOWBiuYxuuSvJckrtWMBgAAACc93ySr3St/2Dem1s9KvyjiFYAAABW7+6sN+hcc3dcxzYcSfLPJIdXNBQAAABs9laSY13r/3PxG4t2XE9GtAIAALB/Dif55bw3PrHjOrbhrqw/X7zlFzcBAADAkn2Y5J6u9S9sfnHejuvPIloBAADYf2tJHpv34kfstgIAADCxT+y6XrzjarcVAACAKa0l+enFLyRJxjYcSPK/+FImAAAApnU2Sde1/v3kwh3Xr0e0AgAAML1rs96oSS4M137fRwEAAID5vnv+n7UkGdtwOOuPCR+YaiIAAADY5GySI13rz57fcT0R0QoAAEAd1ya5O/n4UeEHppsFAAAA5ro/+Thc759sDAAAAJjvgSRZG9vw2SSvTzsLAAAAzHX9LMmxqacAAACABY7OkhydegoAAABYQLgCAABQmnAFAACgtKOzJDdNPQUAAAAscNMsyXVTTwEAAAALXCdcAQAAqEy4AgAAUNqhWZKDU08BAAAACxyaTT0BAAAAbOGgcAUAAKA04QoAAEBpwhUAAIDShCsAAAClCVcAAABKE64AAACUJlwBAAAoTbgCAABQmnAFAACgNOEKAABAacIVAACA0oQrAAAApQlXAAAAShOuAAAAlCZcAQAAKE24AgAAUJpwBQAAoDThCgAAQGnCFQAAgNKEKwAAAKUJVwAAAEoTrgAAAJQmXAEAAChNuAIAAFCacAUAAKA04QoAAEBpwhUAAIDShCsAAAClCVcAAABKE64AAACUJlwBAAAoTbgCAABQmnAFAACgNOEKAABAacIVAACA0oQrAAAApQlXAAAAShOuAAAAlCZcAQAAKE24AgAAUJpwBQAAoDThCgAAQGnCFQAAgNKEKwAAAKUJVwAAAEoTrgAAAJQmXAEAAChNuAIAAFCacAUAAKA04QoAAEBpwhUAAIDShCsAAAClCVcAAABKE64AAACUJlwBAAAoTbgCAABQmnAFAACgNOEKAABAacIVAACA0oQrAAAApQlXAAAAShOuAAAAlCZcAQAAKE24AgAAUJpwBQAAoDThCgAAQGnCFQAAgNKEKwAAAKUJVwAAAEoTrgAAAJQmXAEAAChNuAIAAFCacAUAAKA04QoAAEBpwhUAAIDShCsAAAClCVcAAABKE64AAACUJlwBAAAoTbgCAABQmnAFAACgNOEKAABAacIVAACA0oQrAAAApQlXAAAAShOuAAAAlCZcAQAAKE24AgAAUJpwBQAAoDThCgAAQGnCFQAAgNKEKwAAAKUJVwAAAEoTrgAAAJQmXAEAAChNuAIAAFCacAUAAKA04QoAAEBpwhUAAIDShCsAAAClCVcAAABKE64AAACUJlwBAAAobZbk3NRDAAAAwALnZknem3oKAAAAWOD1WZK3p54CAAAAFnh3luS1qacAAACABd6YJTkz9RQAAACwwJlZklemngIAAAAWOPN/vE273f+oWtIAAAAASUVORK5CYII=');

		.nav-btn {
			flex: 1;
			font-size: 32rpx;
			background: none;
			color: #333;
			padding: 20rpx 0;
			height: 80rpx;
			border-radius: 8rpx;
			transition: all 0.3s;
			background-size: 100%;
			/* 或使用 contain 根据需求 */
			background-position: center;
			background-repeat: no-repeat;

			&[disabled] {
				color: #ccc;
				background-color: #f0f0f0;
			}

			&.prev-btn {
				text-align: left;
				margin-right: 20rpx;
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAU8AAACECAYAAAAQlakxAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAHpGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTFjZDEyZiwgMjAyNC8xMS8xMS0xOTowODo0NiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6QXR0cmliPSJodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcDpDcmVhdG9yVG9vbD0iQ2FudmEgKFJlbmRlcmVyKSBkb2M9REFHaTZiaFhta1EgdXNlcj1VQUVYTHdQMy1MZyBicmFuZD11LTE4Nzc3NiDnmoTlm6LpmJ8gdGVtcGxhdGU9IiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNS0wNC0xOFQyMzo1NDo0NCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDQtMTlUMDA6MTQ6NDYrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDQtMTlUMDA6MTQ6NDYrMDg6MDAiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjMzMzEzYjEtODA3MS0zYTQ1LTllYjItZDMwZTE4ZjMwM2EyIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MDMwOWE0NzktMmIwMS0zZTRkLTg3ZTgtMzViZmY3ZWE0NTAzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTU4M2JmN2QtNmE5YS05OTQ1LTg2OTgtZDYxZDNiYzI2ZDM3Ij4gPEF0dHJpYjpBZHM+IDxyZGY6U2VxPiA8cmRmOmxpIEF0dHJpYjpDcmVhdGVkPSIyMDI1LTA0LTE4IiBBdHRyaWI6RXh0SWQ9ImY3ZWM4ZTI4LWQ2NTAtNGFlNS04NDBmLWU4YmM1ZWFjNjY2MyIgQXR0cmliOlRvdWNoVHlwZT0iMiIvPiA8L3JkZjpTZXE+IDwvQXR0cmliOkFkcz4gPGRjOnRpdGxlPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5kNWY1MWE3NWQxMzg1NTQ5YjM4ZWVjYWZjZDlkZmQ3LnBzZCAtIDI8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8ZGM6Y3JlYXRvcj4gPHJkZjpTZXE+IDxyZGY6bGk+dS0xODc3NzY8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2RjOmNyZWF0b3I+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmE1ODNiZjdkLTZhOWEtOTk0NS04Njk4LWQ2MWQzYmMyNmQzNyIgc3RFdnQ6d2hlbj0iMjAyNS0wNC0xOVQwMDoxNDo0NiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI2LjIgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MzMzMTNiMS04MDcxLTNhNDUtOWVi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');
			}

			&.next-btn {
				text-align: right;
				margin-left: 20rpx;
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUEAAACDCAYAAAATWak6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAHpGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTFjZDEyZiwgMjAyNC8xMS8xMS0xOTowODo0NiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6QXR0cmliPSJodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcDpDcmVhdG9yVG9vbD0iQ2FudmEgKFJlbmRlcmVyKSBkb2M9REFHaTZiaFhta1EgdXNlcj1VQUVYTHdQMy1MZyBicmFuZD11LTE4Nzc3NiDnmoTlm6LpmJ8gdGVtcGxhdGU9IiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNS0wNC0xOFQyMzo1NTowMSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDQtMTlUMDA6MTQ6MjErMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDQtMTlUMDA6MTQ6MjErMDg6MDAiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Yzg4MzAyZTctMDgwYS1hYjRjLWE3ZDYtMzUyMzhiMTRiOTM4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YTMyM2FlNjctOTVhZC1jZjRkLTgwZTItODZkMTA3YmMzNTZhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWE2OGZmZmUtMjJiNS02ZTRhLWFjNjctZWEyNmNjZWE5MTlmIj4gPEF0dHJpYjpBZHM+IDxyZGY6U2VxPiA8cmRmOmxpIEF0dHJpYjpDcmVhdGVkPSIyMDI1LTA0LTE4IiBBdHRyaWI6RXh0SWQ9IjVmODMyZWZjLTFkNmMtNDA2Mi1iNzVmLTJmZWNjOGEwMDQ3MiIgQXR0cmliOlRvdWNoVHlwZT0iMiIvPiA8L3JkZjpTZXE+IDwvQXR0cmliOkFkcz4gPGRjOnRpdGxlPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5kNWY1MWE3NWQxMzg1NTQ5YjM4ZWVjYWZjZDlkZmQ3LnBzZCAtIDI8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8ZGM6Y3JlYXRvcj4gPHJkZjpTZXE+IDxyZGY6bGk+dS0xODc3NzY8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2RjOmNyZWF0b3I+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjVhNjhmZmZlLTIyYjUtNmU0YS1hYzY3LWVhMjZjY2VhOTE5ZiIgc3RFdnQ6d2hlbj0iMjAyNS0wNC0xOVQwMDoxNDoyMSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI2LjIgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjODgzMDJlNy0wODBhLWFiNGMtYTdk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');


			}
		}

		.refresh-btn {
			width: 80rpx;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #fff;
			border-radius: 50%;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
			background-size: 100%;
			/* 或使用 contain 根据需求 */
			background-position: center;
			background-repeat: no-repeat;
			background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHkAAAB4CAYAAADWpl3sAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAHpGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTFjZDEyZiwgMjAyNC8xMS8xMS0xOTowODo0NiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6QXR0cmliPSJodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcDpDcmVhdG9yVG9vbD0iQ2FudmEgKFJlbmRlcmVyKSBkb2M9REFHaTZiaFhta1EgdXNlcj1VQUVYTHdQMy1MZyBicmFuZD11LTE4Nzc3NiDnmoTlm6LpmJ8gdGVtcGxhdGU9IiB4bXA6Q3JlYXRlRGF0ZT0iMjAyNS0wNC0xOFQyMzo1NToyMSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjUtMDQtMTlUMDA6MTM6NDIrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjUtMDQtMTlUMDA6MTM6NDIrMDg6MDAiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZDQ2YTVmOGItNDk2MS0zOTQ2LWJlZmYtOTY4ZTM2ZDk4MDE4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YzRmZDc0NGUtNTZmMi0yMzRiLTkxZWMtZTA1NTFjMGE1NjdkIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDBmM2VhOGItOGE3Ni0wNzQyLWI1NjMtNWNjYWY5MGJjNjQ0Ij4gPEF0dHJpYjpBZHM+IDxyZGY6U2VxPiA8cmRmOmxpIEF0dHJpYjpDcmVhdGVkPSIyMDI1LTA0LTE4IiBBdHRyaWI6RXh0SWQ9ImE3ODNmNmU5LTAzZjgtNDc3MS1hMWM3LTQ5ZWNjZDMxNGYyOCIgQXR0cmliOlRvdWNoVHlwZT0iMiIvPiA8L3JkZjpTZXE+IDwvQXR0cmliOkFkcz4gPGRjOnRpdGxlPiA8cmRmOkFsdD4gPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5kNWY1MWE3NWQxMzg1NTQ5YjM4ZWVjYWZjZDlkZmQ3LnBzZCAtIDI8L3JkZjpsaT4gPC9yZGY6QWx0PiA8L2RjOnRpdGxlPiA8ZGM6Y3JlYXRvcj4gPHJkZjpTZXE+IDxyZGY6bGk+dS0xODc3NzY8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2RjOmNyZWF0b3I+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQwZjNlYThiLThhNzYtMDc0Mi1iNTYzLTVjY2FmOTBiYzY0NCIgc3RFdnQ6d2hlbj0iMjAyNS0wNC0xOVQwMDoxMzo0MiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI2LjIgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkNDZhNWY4Yi00OTYxLTM5NDYtYmVm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');

			&:active {
				background: #f0f0f0;
			}
		}
	}

	/* 预览部分 */
	.preview-section {
		padding: 0rpx;

		.preview-header {
			padding: 0 20rpx;
			padding-left: 0rpx;
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			background-color: #ed80a0;

			.header-left {
				display: flex;

				.title {
					font-size: 40rpx;
					font-weight: bold;
					margin-right: 20rpx;
					line-height: 50rpx;
					background-color: #fff;
					padding: 10rpx;
					border-top-right-radius: 30rpx;
					width: 120rpx;
					text-align: center;
				}

				.box-info {
					font-size: 24rpx;
					color: #000;
					line-height: 70rpx;
					margin-left: 15rpx;
				}
			}

			.header-right {
				line-height: 70rpx;
				display: flex;

				.instruction,
				.record {
					font-size: 24rpx;
					color: #000;
					margin-left: 30rpx;
					border-radius: 30rpx;
					padding: 6rpx 12rpx;
					background-color: #f6f6f6;
					height: 42rpx;
					line-height: 42rpx;
					margin-top: 10rpx;
				}
			}
		}

		.product-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 20rpx;
			padding: 0 20rpx;

			.product-card {
				height: 320rpx;
				border-radius: 12rpx;
				overflow: hidden;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
				border: 5rpx solid #d9d9d9;
				position: relative;

				.remain-qty {
					position: absolute;
					top: 0rpx;
					left: 0rpx;
					padding: 0 16rpx;
					line-height: 32rpx;
					border-radius: 8rpx;
					background-color: #ed80a0;
					color: #fff;
					font-size: 18rpx;
				}

				.product-image {
					height: 200rpx;
					width: 100%;
				}

				.product-info {
					padding: 12rpx;

					.title-row {
						display: flex;
						align-items: center;
						margin-bottom: 8rpx;

						.product-type {
							flex-shrink: 0; // 禁止收缩
							background: #ff4c4c;
							color: white;
							font-size: 20rpx;
							padding: 4rpx 8rpx;
							border-radius: 4rpx;
							margin-right: 10rpx;
							line-height: 1.2;
						}

						.product-name {
							flex: 1;
							font-size: 24rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							color: #333;
						}
					}

					.product-price,
					.product-prob {
						font-size: 20rpx;
						color: #666;
						display: block;
					}
				}
			}
		}
	}

	/* 底部按钮 */
	// 更新后的样式
	.footer-section {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0rpx 20rpx;
		background: #ed80a0; // 粉色背景
		border-top-left-radius: 35rpx; // 左上圆角
		border-top-right-radius: 35rpx; // 右上圆角
		box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.1);
		z-index: 99;
		height: 120rpx;

		.button-container {

			.button-image {
				position: relative;
				top: -55rpx;
				width: 145rpx;
				height: 150rpx;
				margin: 0 15rpx;
				transition: transform 0.2s ease;

				&:active {
					transform: scale(0.95);
				}
			}
		}
	}

	// 弹窗样式
	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 9999;
		display: flex;
		justify-content: flex-end;
		flex-direction: column;

		.popup-content {
			background: #fff;
			border-radius: 24rpx 24rpx 0 0;
			padding: 32rpx;
			max-height: 70vh;
		}
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;

		.title {
			font-size: 38rpx;
			font-weight: 700;
			color: #333;
		}

		.close-icon {
			width: 36rpx;
			height: 36rpx;
			padding: 16rpx;
		}
	}

	.filter-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
		margin-bottom: 32rpx;

		.tab-item {
			padding: 8rpx 24rpx;
			border-radius: 32rpx;
			background: #f5f5f5;
			font-size: 24rpx;
			color: #666;

			&.active {
				background: #ff1773;
				color: #fff;
			}
		}
	}

	.record-list {
		max-height: 50vh;

		.record-item {
			padding: 24rpx 15rpx;
			border: 4rpx solid #424242;
			margin-bottom: 10rpx;

			.record-image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}


			.item-header {
				display: flex;
				justify-content: space-between;
				margin-bottom: 16rpx;

				.record-image {
					border-radius: 50%;
				}

				.header-left {
					display: inline-flex;

				}

				.serial {
					font-size: 28rpx;
					color: #333;
					font-weight: 500;
				}

				.time {
					font-size: 24rpx;
					color: #999;
				}
			}

			.prize-info {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.info-left {
					display: inline-flex;
				}

				.prize-name {
					font-size: 26rpx;
					color: #666;
					max-width: 70%;
					margin-left: 15rpx;
				}

				.award {
					font-size: 26rpx;
					color: #ff1773;
					font-weight: 500;
				}
			}

			.divider {
				height: 2rpx;
				background: #eee;
				margin-top: 24rpx;
			}
		}
	}

	/* 动画 */
	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			transform: translateY(100%);
		}

		to {
			transform: translateY(0%);
		}
	}

	.popup-box-mask {
		.box-list {
			.box-item {
				display: flex;
				align-content: space-between;
				padding: 24rpx 15rpx;
				border: 4rpx solid #424242;
				margin-bottom: 10rpx;
				position: relative;

				.box-img {
					width: 100rpx;
					text-align: center;
					padding: 15rpx;

					.box-image {
						max-width: 100%;
						max-height: 100rpx;
					}
				}

				.box-type-list-content {
					width: 70%;
					flex-shrink: 0;
					padding: 15rpx;
					margin-left: 30rpx;

					.box-type-list {

						display: flex;
						flex-wrap: wrap;
						gap: 10rpx;
						font-size: 20rpx;

						.boxx-type-item {
							margin-bottom: 10rpx;
						}
					}
				}

				.box-total {
					position: absolute;
					top: 0rpx;
					right: 5rpx;
					color: #ff4a4a;
					font-size: 24rpx;
				}

			}
		}
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.9);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;

		.popup-content {
			width: 80%;
			background: white;
			border-radius: 20rpx;
			padding: 40rpx;
			position: relative;
		}

		.product-card {
			position: relative;

			.product-image {
				width: 100%;
				height: 400rpx;
				border-radius: 12rpx;
			}

			.product-info {
				margin-top: 20rpx;

				.product-title {
					font-size: 32rpx;
					display: block;
					font-weight: bold;
				}

				.product-price {
					color: #FF4500;
					font-size: 40rpx;
					margin-top: 10rpx;
					display: block;
				}
			}
		}

		.float-gif {
			position: absolute;
			width: 200rpx;
			top: -80rpx;
			left: 50%;
			transform: translateX(-50%);
			z-index: 1000;
		}

		.action-btns {
			margin-top: 40rpx;
			display: flex;
			gap: 20rpx;

			.btn {
				flex: 1;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 28rpx;
				border-radius: 40rpx;

				&::after {
					border: none
				}
			}

			.cart-btn {
				background: #FFD700;
				color: #333;
			}

			.buy-btn {
				background: #FF4500;
				color: white;
			}
		}

		.close-icon {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			font-size: 50rpx;
			color: #666;
			width: 60rpx;
			height: 60rpx;
			text-align: center;
			line-height: 50rpx;
		}
	}

	/* 弹窗容器 */
	.modal-container {
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 32rpx;
	}

	/* 标题样式 */
	.modal-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #333333;
		text-align: center;
		margin-bottom: 32rpx;
	}

	/* 内容区域 */
	.modal-content {
		padding: 0 20rpx;
	}

	/* 信息条目 */
	.info-item {
		font-size: 28rpx;
		color: #666666;
		line-height: 50rpx;
		position: relative;
		padding-left: 20rpx;
		display: flex;
		justify-content: space-between;
		margin: 15rpx 0;

		.uni-swaitch {
			line-height: 40rpx;
			margin-left: 10rpx;
		}

		.point-class {
			color: red;
			margin-left: 10rpx;
		}
	}

	/* 提货说明 */
	.delivery-info {
		margin-top: 32rpx;
		font-size: 26rpx;
		color: #999999;
		line-height: 40rpx;
		color: red;
		font-weight: bold;
	}

	.total-parice-content {
		width: 100%;
		font-size: 28rpx;
		line-height: 40rpx;
		color: red;
		text-align: right;
		margin-top: 8rpx;
		font-weight: bold;
	}

	/* 确认按钮 */
	.confirm-btn {
		height: 88rpx;
		background: #000;
		border-radius: 44rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 24rpx;
	}

	.disabled-confirm {
		background: #999;
		color: #000;
	}

	.check-desc-item {
		display: flex;
		text-align: center;
		font-size: 24rpx;
		margin: 15rpx 0;

		.checkbox {
			width: 30rpx;
			height: 30rpx;
			border: 2rpx solid red;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-right: 10rpx;

			&.checked {
				background: red;
				border-color: red;

				.check-icon {
					color: #fff;
					font-size: 28rpx;
					transform: translateY(-2rpx);
				}
			}
		}
	}

	.coupon-popup-content {
		padding: 20rpx;

		.coupon-header {
			display: flex;
			justify-content: space-between;
			width: 100%;
			line-height: 80rpx;
			font-weight: bold;

		}
	}
</style>