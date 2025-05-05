<template>
	<view class="container">
		<!-- 产品详情区域 -->
		<view class="product-detail">
			<view class="product-image">
				<image :src="productSeries.seriesImage" mode="aspectFill" class="img" lazy-load />
			</view>
			<view class="product-info">
				<text class="product-name">{{productSeries.seriesName}}</text>
				<text class="product-desc">{{productSeries.seriesDescription}}</text>
				<view class="progress-section">
					<view class="progress-bar">
						<view class="progress-inner" :style="{width: (191/222*100)+'%'}"></view>
					</view>
					<text class="progress-text">剩余{{getBoxRemainQty}}张</text>
				</view>
				<view class="price-section">
					<view class="price-left">
						<text class="price-value">￥{{productSeries.price}}</text>
						<text class="unit-value">/张</text>
					</view>
					<view class="instruction-btn" @click="navigatorToRule()">
						购买说明
					</view>
				</view>
			</view>
		</view>

		<!-- 锁箱区域 -->
		<view class="lock-box">
			<view class="lock-header">
				<!-- 左侧状态 -->
				<view class="left-section">
					<image src="/static/unlock.png" class="status-icon" />
					<text class="status-text">目前还没有人锁箱</text>
				</view>

				<!-- 右侧记录 -->
				<view class="right-section" @tap="showPopup = true">
					<image src="/static/recode-img.png" class="record-icon" />
					<text class="record-text" @tap="showRecods()">选号记录</text>
				</view>
			</view>
			<!-- 弹窗遮罩 -->
			<view v-if="showPopup" class="popup-mask" @tap="showPopup = false">
				<view class="popup-content" @tap.stop>
					<!-- 弹窗标题 -->
					<view class="popup-header">
						<text class="title">开赏记录(88)</text>
						<image src="/static/icons/close.png" class="close-icon" @tap="showPopup = false" />
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
									<image :src="item.avatar" mode="aspectFit" lazy-load class="record-image"></image>
									<text class="serial">【第{{ item.number }}张】{{ item.userId }}</text>
								</view>
								
								<text class="time">{{ item.createdAt }}</text>
							</view>
					
							<!-- 奖品信息 -->
							<view class="prize-info">
								<view class="info-left">
									<image :src="item.productImage" mode="aspectFit" lazy-load class="record-image"></image>
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
			<view class="product-grid">
				<view v-for="(item, index) in productImages" :key="item.productId" class="grid-item">
					<image v-if="index < 7" :src="item.productImage" mode="aspectFill" class="grid-img" />
					<image v-else src="/static/more-btn.png" mode="aspectFill" class="grid-img" />
				</view>
			</view>
			<view class="box-controls">
				<view class="control-btn prev-btn" @tap="switchBox('prev')">上一箱</view>

				<view class="control-btn pagination-info" @tap="showBoxPopup = true">
					<text>第{{ formattedCurrentIndex }}箱/共{{ boxes.length }}箱</text>
				</view>
				<!-- 切换房间弹窗 -->
				<!-- 弹窗遮罩 -->
				<view v-if="showBoxPopup" class="popup-box-mask popup-mask" @tap="showBoxPopup = false">
					<view class="popup-content" @tap.stop>
						<!-- 弹窗标题 -->
						<view class="popup-header">
							<text class="title">切换房间</text>
							<image src="/static/icons/close.png" class="close-icon" @tap="showPopup = false" />
						</view>

						<!-- 记录列表 -->
						<scroll-view class="box-list" scroll-y>
							<view v-for="(item, index) in boxeInfos" :key="item.id" class="box-item" @tap="changeBox(index)">
								<view class="box-img">
									<image src="/static/box.png" mode="aspectFill" class="box-image"></image>
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
				<view class="control-btn next-btn" @tap="switchBox('next')">下一箱</view>
			</view>

		</view>

		<view class="selection-container">
			<!-- 筛选头部 -->
			<view class="filter-header">
				<text class="section-title">选择款式</text>
				<view class="check-group">
					<view class="check-item">
						<view :class="['checkbox', filters.available && 'checked']">
							<view v-if="filters.available" class="check-icon">✓</view>
						</view>
						<text>可选</text>
					</view>
					<view class="check-item disabled">
						<view class="checkbox disabled">
							<view class="check-icon">✓</view>
						</view>
						<text class="disabled-text">已售</text>
					</view>
				</view>
				<view class="check-all" @tap="toggleAll">
					<view :class="['checkbox', isAllChecked && 'checked']">
						<view v-if="isAllChecked" class="check-icon">✓</view>
					</view>
					<text>全选</text>
				</view>
			</view>
			<!-- 产品网格 -->
			<view class="product-grid">
				<view v-for="(item, index) in filteredItems" :key="index" class="grid-item"
					:class="{sold: item.soldOut,checked:item.checked}" @tap="toggleSelect(item,index)">
					<!-- 未选中覆盖层 -->
					<view v-if="!item.soldOut" class="unselected-overlay">
						<text class="serial-number">{{ index + 1 }}</text>
					</view>

					<image :src="item.image" v-if="item.soldOut" mode="aspectFill" class="product-image" />
					<image src="/static/default-image.png" v-if="!item.soldOut" mode="aspectFill"
						class="product-image" />

					<!-- 选中标记 -->
					<view v-if="item.checked && !item.soldOut" class="check-mark"></view>

					<!-- 已售遮罩 -->
					<view v-if="item.soldOut" class="sold-overlay">
						<text class="sold-text">已售</text>
					</view>
				</view>
			</view>

		</view>

		<view class="detail-container">
			<!-- 标题区域 -->
			<view class="detail-header">
				<image src="/static/icons/box.png" class="title-icon" />
				<text class="title-text">百宝箱明细</text>
			</view>

			<!-- 产品表格 -->
			<view class="product-grid">
				<view v-for="(item, index) in productImages" :key="item.productId" class="product-card">
					<!-- 库存显示 -->
					<view class="stock-indicator">
						{{ getStock(item) }}/{{ item.quantity }}
					</view>
					<!-- 产品图片 -->
					<image :src="item.productImage" mode="aspectFill" class="product-image" />

					<!-- 产品信息 -->
					<view class="product-info">
						<!-- 名称区域 -->
						<view class="name-section">
							<text class="type-tag">{{ item.levelName }}</text>
							<text class="product-name">{{ item.productName }}</text>
						</view>

						<!-- 价格信息 -->
						<text class="price-text">零售价：{{ item.productPrice }}元</text>

						<!-- 概率信息 -->
						<text class="probability-text">概率：{{ getProductProbaby(item,boxes[currentIndex - 1]) }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="default-warpper"></view>

		<!-- 底部操作栏 -->
		<view class="fixed-bottom">
			<!-- 操作按钮区域 -->
			<view class="action-section">
				<button class="action-btn primary" @tap="handleDraw(1)">欧一发</button>
				<button class="action-btn primary" @tap="handleDraw(3)">欧三发</button>
				<button class="action-btn primary" @tap="handleDraw(10)">欧十发</button>
				<button class="action-btn secondary">刷新</button>
			</view>

			<!-- 进度条区域 -->
			<view class="progress-section">
				<!-- 分段进度条 -->
				<view class="progress-container">
					<price-progress 
					    :segments="segments"
					    :currentValue="currentValue"
					  />
				</view>
				<view class="stock-info">
					<text>剩{{getBoxRemainQty}}张</text>
					<text>共{{getBoxTatalQty}}张</text>
				</view>
			</view>

			<!-- 选号购买区域 -->
			<view class="purchase-section">
				<view class="selection-info">
					<text v-if="selectedCount.length > 0">{{slectedNum}}</text>
					<text v-else class="tip-text">请先选择号码</text>
				</view>
				<button class="buy-btn">立即购买</button>
			</view>
		</view>
	</view>
</template>

<script>
	import priceProgress from './components/priceProgress.vue';
	import {
		get,
		post
	} from "@/utils/rest-util.js"
	import {
		getRandomElements
	} from "@/utils/common.js"
	export default {
		components: {
			priceProgress
		},
		onLoad(param) {
			const {
				userId,
				seriesId
			} = param;
			this.seriesId = seriesId;
			this.userId = userId;
			this.getProductBoxBySeriesId(null)
		},
		data() {
			return {
				segments:[],
				seriesId: '',
				userId: '',
				showPopup: false,
				activeTab: '全部',
				tabs: [],
				records: [],
				currentIndex: 1, // 当前箱号
				totalBoxes: 3, // 总箱数
				offsetX: 0, // 横向位移
				touchStartX: 0, // 触摸起始位置
				isAnimating: false, // 动画进行中
				currentBox: {}, // 当前箱子数据
				showBoxPopup: false,
				currentPrice: '33',
				boxes: [],
				filters: {
					available: true,
					sold: true
				},
				items: [{
						id: 1,
						image: '/static/serice2.jpg',
						sold: false,
						checked: false
					},
					{
						id: 2,
						image: '/static/serice2.jpg',
						sold: false,
						checked: false
					},
					{
						id: 3,
						image: '/static/serice2.jpg',
						sold: false,
						checked: false
					},
					{
						id: 4,
						image: '/static/serice2.jpg',
						sold: false,
						checked: false
					},
					{
						id: 5,
						image: '/static/serice2.jpg',
						sold: false,
						checked: false
					},
					{
						id: 6,
						image: '/static/serice2.jpg',
						sold: false,
						checked: false
					},
					{
						id: 7,
						image: '/static/serice2.jpg',
						sold: true,
						checked: false
					},
					{
						id: 8,
						image: '/static/serice2.jpg',
						sold: true,
						checked: false
					},
					{
						id: 2,
						image: '/static/serice2.jpg',
						sold: false,
						checked: false
					},
					{
						id: 9,
						image: '/static/serice2.jpg',
						sold: false,
						checked: false
					}
				],
				selectedCount: [], // 已选数量示例
				boxeInfos: [],
				currentX: 0,
				filteredItems: [],
				productSeries: {},
				currentValue: 0
			}
		},
		computed: {
			getBoxTatalQty(){
				const index = this.currentIndex - 1;
				return this.boxes[index]?.total || 0;
			},
			boxProductInfo() {
				const index = this.currentIndex - 1;
				return this.boxes[index];
			},
			getBoxRemainQty(){
				const index = this.currentIndex - 1;
				return this.boxes[index]?.remain || 0;
			},
			productImages() {
				const index = this.currentIndex - 1;
				return this.boxes[index]?.products || []
			},
			isAllChecked() {
				return this.filteredItems.every(item => item.checked)
			},
			availableItems() {
				return this.items.filter(item => !item.sold)
			},
			formattedCurrentIndex() {
				return this.currentIndex.toString().padStart(2, '0') // 补零显示
			},
			filteredRecords() {
				if (this.activeTab === '全部') return this.records
				return this.records.filter(item => item.award === this.activeTab)
			},
			slectedNum() {
				return this.selectedCount.join(',')
			}
		},
		methods: {
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
			getStock(item) {
				return item.quantity - item.soldQuantity
			},
			toggleFilter(type) {
				if (type === 'sold') return // 禁用已售切换
				this.filters[type] = !this.filters[type]
			},
			toggleSelect(item, index) {
				if (item.sold) return
				this.$set(item, 'checked', !item.checked)
				if (item.checked) {
					this.selectedCount.push(index + 1);
					this.selectedCount = this.selectedCount.sort((a, b) => a - b)
				} else {
					this.selectedCount = this.selectedCount.filter(obj => obj !== (index + 1));
				}
			},
			toggleAll() {
				const targetState = !this.isAllChecked;
				const selectedCount = []
				this.filteredItems.forEach((item, i) => {
					this.$set(item, 'checked', targetState);
					// if(targetState){
					// 	selectedCount.push(i+1)
					// }
				})
				this.selectedCount = this.filteredItems.map((item, i) => {
					if (item.checked) {
						return i + 1
					}
				}).filter(item => item);
			},
			// 切换箱子
			async switchBox(direction) {
				if (this.isAnimating) return

				const oldIndex = this.currentIndex
				this.currentIndex = direction === 'next' ?
					Math.min(this.currentIndex + 1, this.totalBoxes) :
					Math.max(this.currentIndex - 1, 1)

				if (oldIndex === this.currentIndex) return

				this.isAnimating = true
				// 设置动画方向
				this.offsetX = direction === 'next' ? -100 : 100

				await this.loadBoxData()

				// 触发重排确保动画生效
				this.$nextTick(() => {
					setTimeout(() => {
						this.offsetX = 0
						this.isAnimating = false
					}, 50)
				})
			},
			// 加载箱子数据
			async loadBoxData() {
				uni.showLoading({
					title: '加载中...'
				})
				try {
					// const res = await uni.request({
					//   url: `/api/boxes/${this.currentIndex}`
					// })
					// this.currentBox = res.data
					// this.totalBoxes = res.total
				} finally {
					uni.hideLoading()
				}
			},
			// 触摸事件处理
			touchStart(e) {
				this.touchStartX = e.touches[0].clientX
			},
			touchMove(e) {
				if (this.isAnimating) return
				const deltaX = e.touches[0].clientX - this.touchStartX
				this.offsetX = (deltaX / window.innerWidth) * 100
			},
			touchEnd(e) {
				if (this.isAnimating) return
				const deltaX = e.changedTouches[0].clientX - this.touchStartX
				if (Math.abs(deltaX) > 50) {
					this.switchBox(deltaX > 0 ? 'prev' : 'next')
				} else {
					this.offsetX = 0
				}
			},
			handleDraw(count) {
				this.prizeDraw(count)
				// this.showMarkPopup = true
				//    uni.showToast({
				//      title: `触发${drawMap[count]}操作`,
				//      icon: 'none'
				//    })
				// 实际抽奖逻辑...
			},
			navigatorToRule() {
				uni.navigateTo({
					url: '/pages/blindBox/caileishangRule'
				})
			},
			getProductBoxBySeriesId(callBack) {
				get('wx/series/getProductBoxBySeriesId?seriesId=' + this.seriesId).then(json => {
					const result = json.data.data;
					const groupedByBoxNumber = result.groupedByBoxNumber || {};
					const productQuantityMap = result.productQuantityMap || {};
					const remainingQuantityMap = result.remainingQuantityMap || {}
					const productBoxResultVos = result.productBoxResultVos || [];
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
					this.productSeries = result.productSeries;
					
					this.boxes = boxList;
					this.boxeInfos = boxeInfos;
					this.queryProductList()
					callBack && callBack()
				})
			},
			queryProductList() {
				const boxNumber = this.boxes[this.currentIndex - 1].id;
				get(`wx/blindbox/numbers?seriesId=${this.seriesId}&boxNumber=${boxNumber}`).then(json => {
					const result = json.data.data || [];
					this.filteredItems = result.map(item => {
						return {
							...item,
							checked: false
						}
					})
					const soldOutList = result.filter(item=>item.soldOut).map(item=> {return item.number});
					const maxNum = Math.max(soldOutList)
					this.setPressArray(maxNum)
				})
			},
			
			setPressArray(maxNum){
				const priceRanges = this.boxes[this.currentIndex]?.products?.[0]?.priceRanges || '[]'
				const priceRangesParan = JSON.parse(priceRanges)
				const segments = priceRangesParan.map?.(item=>{
					return {
						end: item.maxQuantity,
						price:item.price
					}
				})
				segments.push({
					end: Infinity,
					price: 100
				})

				this.currentValue = maxNum
				this.segments = segments;
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
			prizeDraw(count) {
				const boxNumber = this.boxes[this.currentIndex].id;
				const filteredItems = this.filteredItems.filter(item => !item.soldOut).map(item => {
					return item.number
				})
				const list = getRandomElements(filteredItems, count)
				this.filteredItems = this.filteredItems.map(item=>{
					const checked = item.soldOut ? false : (list.some(obj=> obj === item.number) ? true : false)
					return {
						...item,
						checked
					}
				})
				this.selectedCount = this.filteredItems.map((item, i) => {
					if (item.checked) {
						return i + 1
					}
				}).filter(item => item);
				

			},
			drawBlindBox(list, boxNumber) {
				const postData = {
					userId: this.userId,
					numbers: list,
					boxNumber: boxNumber,
					seriesId: this.seriesId,
					activityType: '踩雷赏'
				}
				post('wx/blindbox/drawBlindBox', postData).then(res => {
					this.getProductBoxBySeriesId()
					// this.showMarkPopup = true;
				})
			},
			changeBox(index){
				this.currentIndex = index + 1;
				this.showBoxPopup = false;				
			},
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 24rpx 24rpx 160rpx;
		background: #f8f8f8;
		min-height: 100vh;
	}

	/* 产品详情区域 */
	.product-detail {
		display: flex;
		background: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

		.product-image {
			width: 25%;
			padding-right: 20rpx;

			.img {
				width: 100%;
				height: 220rpx;
				border-radius: 12rpx;
				background: #f5f5f5;
			}
		}

		.product-info {
			width: 75%;

			.product-name {
				display: block;
				font-size: 34rpx;
				font-weight: 700;
				color: #333333;
				line-height: 1.4;
				margin-bottom: 12rpx;
			}

			.product-desc {
				display: block;
				font-size: 24rpx;
				color: #666666;
				margin-bottom: 24rpx;
			}

			.progress-section {
				margin-bottom: 16rpx;
				display: flex;
				align-content: space-between;

				.progress-bar {
					height: 16rpx;
					background: #eeeeee;
					border-radius: 8rpx;
					margin-bottom: 12rpx;
					width: 60%;
					flex-shrink: 0;
					margin-top: 10rpx;

					.progress-inner {
						height: 100%;
						background: #e17c8c;
						border-radius: 8rpx;
						transition: width 0.3s;
					}
				}

				.progress-text {
					font-size: 24rpx;
					color: #000;
					margin-left: 10rpx;
				}
			}

			.price-section {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.price-left {
					display: flex;
					align-items: baseline;

					.price-label {
						font-size: 24rpx;
						color: #666666;
						margin-right: 8rpx;
					}

					.price-value {
						font-size: 40rpx;
						color: #000;
						font-weight: 700;
					}

					.unit-value {
						font-size: 32rpx;
						color: #000;
						font-weight: 700;
					}
				}

				.instruction-btn {
					display: flex;
					align-items: center;
					padding: 12rpx 24rpx;
					background: #fff;
					border-radius: 8rpx;
					font-size: 24rpx;
					border: 5rpx solid #000;
					color: #000;
					font-weight: bold;
				}
			}
		}
	}

	/* 锁箱区域 */
	.lock-box {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 24rpx;

		.lock-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 24rpx 0;
			margin-bottom: 32rpx;
			border-bottom: 1rpx solid #eee;

			/* 左侧状态样式 */
			.left-section {
				display: flex;
				align-items: center;

				.status-icon {
					width: 36rpx;
					height: 36rpx;
					margin-right: 12rpx;
				}

				.status-text {
					font-size: 28rpx;
					color: #666;
				}
			}

			/* 右侧记录样式 */
			.right-section {
				display: flex;
				align-items: center;

				.record-icon {
					width: 32rpx;
					height: 32rpx;
					margin-right: 8rpx;
				}

				.record-text {
					font-size: 28rpx;
					color: #000;
					margin-right: 8rpx;
				}

				.arrow-icon {
					width: 24rpx;
					height: 24rpx;
				}
			}
		}

		.product-grid {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 16rpx;
			margin-bottom: 32rpx;

			.grid-item {
				aspect-ratio: 1;
				background: #f5f5f5;
				border-radius: 12rpx;
				overflow: hidden;
				position: relative;

				.grid-img {
					width: 100%;
					height: 100%;
				}

				.more-box {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: 100%;
					background: rgba(0, 0, 0, 0.4);
					color: #ffffff;
					font-size: 24rpx;
				}
			}
		}

		.box-controls {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 96rpx;

			.control-btn {
				text-align: center;
				min-width: 180rpx;
				height: 64rpx;
				line-height: 64rpx;
				font-size: 28rpx;
				color: #000;
				background: linear-gradient(90deg, #ff1773 0%, #fed1a9 100%);
				border-radius: 32rpx;
				padding: 0;
				color: #fff;
				font-weight: bold;

				&[disabled] {
					opacity: 0.5;
					color: #ccc;
					border-color: #ccc;
				}
			}

			.pagination-info {
				text-align: center;
				font-size: 28rpx;
				padding: 0 20rpx;
				width: 200rpx;

				text {
					display: inline-block;
					vertical-align: middle;
				}
			}
		}
	}



	.selection-container {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin: 24rpx 0;

		/* 筛选头部 */
		.filter-header {
			display: flex;
			align-items: center;
			margin-bottom: 32rpx;

			.section-title {
				font-size: 32rpx;
				font-weight: 700;
				color: #333;
				margin-right: 40rpx;
			}

			.check-group {
				display: flex;
				gap: 40rpx;
				flex: 1;
			}

			.check-item,
			.check-all {
				display: flex;
				align-items: center;
				gap: 8rpx;
			}

			.checkbox {
				width: 40rpx;
				height: 40rpx;
				border: 2rpx solid #000;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;

				&.checked {
					background: #000;
					border-color: #000;

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

			.check-all {
				.checkbox {
					border-radius: 0rpx;
				}
			}
		}

		/* 禁用状态 */
		.disabled {
			pointer-events: none !important;

			.disabled-text {
				color: #ccc !important;
			}
		}

		/* 产品网格 */
		.product-grid {
			display: grid;
			grid-template-columns: repeat(8, 1fr);
			gap: 16rpx;

			.grid-item {
				aspect-ratio: 1;
				border-radius: 12rpx;
				overflow: hidden;
				position: relative;
				background: #f5f5f5;
				border: 1rpx solid #333;

				.product-image {
					width: 100%;
					height: 100%;
				}



				&.sold {
					opacity: 0.6;

					.sold-overlay {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: rgba(0, 0, 0, 0.5);
						display: flex;
						align-items: center;
						justify-content: center;

						.sold-text {
							color: #fff;
							font-size: 24rpx;
							font-weight: bold;
						}
					}
				}

				&.checked {
					border: 1rpx solid #5ee902;

					.check-mark {
						&::before {
							/* 半三角背景 */
							content: '';
							position: absolute;
							top: 0;
							right: 0;
							width: 0;
							height: 0;
							border-style: solid;
							border-width: 0 36rpx 36rpx 0;
							border-color: transparent #5ee902 transparent transparent;
							z-index: 2;
						}

						&::after {
							/* 对勾图标 */
							content: '✓';
							position: absolute;
							top: 3rpx;
							right: 3rpx;
							color: #fff;
							font-size: 18rpx;
							font-weight: bold;
							transform: rotate(15deg);
							z-index: 3;
						}
					}
				}

				.check-mark {
					position: absolute;
					top: 0;
					right: 0;
					width: 36rpx;
					height: 36rpx;
					overflow: hidden;
				}

				/* 新增样式 */
				.unselected-overlay {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(255, 255, 255, 0.8);
					z-index: 2;
					display: flex;
					justify-content: center;
					align-items: center;

					.serial-number {
						font-size: 30rpx;
						font-weight: bold;
						color: #333;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
					}
				}

				/* 调整原有样式层级 */
				.product-image {
					position: relative;
					z-index: 1;
				}

				.check-mark {
					z-index: 3;
					/* 确保选中标记在最上层 */
				}

				.sold-overlay {
					z-index: 3;
					/* 已售状态在最上层 */
				}
			}
		}
	}


	.detail-container {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin: 24rpx 0;

		/* 标题区域 */
		.detail-header {
			display: flex;
			align-items: center;
			margin-bottom: 32rpx;

			.title-icon {
				width: 48rpx;
				height: 48rpx;
				margin-right: 16rpx;
			}

			.title-text {
				font-size: 34rpx;
				font-weight: 700;
				color: #333;
			}
		}

		/* 产品表格 */
		.product-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 24rpx;
		}

		/* 产品卡片 */
		.product-card {
			height: 320rpx;
			border-radius: 12rpx;
			overflow: hidden;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
			position: relative;

			.product-image {
				width: 100%;
				height: 192rpx;
				/* 60% of 320rpx */
				background: #f5f5f5;
			}

			.product-info {
				padding: 12rpx;
				background: #fff;

				.name-section {
					display: flex;
					justify-content: space-between;
					margin-bottom: 8rpx;

					.type-tag {
						font-size: 20rpx;
						color: #1890ff;
						padding: 0rpx 12rpx;
						border: 1rpx solid #1890ff;
						border-radius: 8rpx;
						line-height: 30rpx;
					}

					.product-name {
						flex: 1;
						margin-left: 12rpx;
						font-size: 26rpx;
						color: #333;
						overflow: hidden;
						font-weight: bold;
						text-overflow: ellipsis;
						white-space: nowrap;
						max-width: 150rpx;
					}
				}

				.price-text {
					display: block;
					font-size: 22rpx;
					color: #bdbdbd;
					margin-bottom: 4rpx;
				}

				.probability-text {
					display: block;
					font-size: 22rpx;
					color: #bdbdbd;
				}
			}


		}

		/* 新增库存指示器样式 */
		.stock-indicator {
			position: absolute;
			top: 0rpx;
			left: 0rpx;
			z-index: 2;
			padding: 4rpx 12rpx;
			background: rgb(225, 249, 192, 0.6);
			color: #000;
			font-size: 22rpx;
			border-top-left-radius: 8rpx;
			border-bottom-right-radius: 16rpx;
			border: 1rpx solid rgba(255, 255, 255, 0.3);
		}
	}

	.default-warpper {
		min-height: 260rpx;
		width: 100%;
	}

	/* 底部悬浮按钮 */
	.fixed-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
		padding: 24rpx;
		z-index: 999;

		/* 操作按钮区域 */
		.action-section {
			display: flex;
			gap: 20rpx;
			margin-bottom: 32rpx;

			.action-btn {
				flex: 1;
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 12rpx;
				font-size: 34rpx;
				font-weight: bold;
				background: linear-gradient(90deg, #ff1773 0%, #fed1a9 100%);

				&.primary {
					color: #000;
				}

				&.secondary {
					color: #666;
				}
			}
		}

		/* 进度条区域 */
		.progress-section {
			margin-bottom: 10rpx;

			.price-info {
				display: flex;
				justify-content: space-between;
				margin-bottom: 16rpx;

				.price-text {
					color: #ff4a4a;
					font-size: 28rpx;
				}

				.progress-text {
					color: #666;
					font-size: 26rpx;
				}
			}

			.progress-bar {
				height: 12rpx;
				background: #eee;
				border-radius: 6rpx;

				.progress-inner {
					height: 100%;
					background: #1890ff;
					border-radius: 6rpx;
					transition: width 0.3s;
				}
			}

			.stock-info {
				display: flex;
				justify-content: space-between;
				margin-top: 12rpx;
				color: #999;
				font-size: 24rpx;
			}
		}

		/* 购买区域 */
		.purchase-section {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.selection-info {
				flex: 1;
				width: 55%;
				overflow: hidden;

				.tip-text {
					color: #ff4a4a;
					font-size: 26rpx;
				}
			}

			.buy-btn {
				width: 40%;
				height: 96rpx;
				line-height: 96rpx;
				background: linear-gradient(90deg, #ff6b6b, #ff4d4f);
				color: #fff;
				font-size: 32rpx;
				border-radius: 48rpx;
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
			.record-image{
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
			
	
			.item-header {
				display: flex;
				justify-content: space-between;
				margin-bottom: 16rpx;
				.record-image{
					border-radius: 50%;
				}
				
				.header-left{
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
				.info-left{
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
</style>