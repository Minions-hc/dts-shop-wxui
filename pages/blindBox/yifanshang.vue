<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="nav-box" @click="navigateToLocker">
        <image class="icon" src="/static/icon-locker.png"/>
        <text>盒柜</text>
      </view>
      <image class="cover" :src="currentBoxData.cover" mode="aspectFill"/>
    </view>

    <!-- 箱体控制 -->
    <view class="box-control">
      <view class="btn prev" :class="{disabled: currentBox === 1}" @click="switchBox(-1)">上一箱</view>
	  <view class="btn switch" @click="showBoxModal = true">切换房间</view>
      <view class="btn next" :class="{disabled: currentBox === 10}" @click="switchBox(1)">下一箱</view>
    </view>

    <!-- 预览信息 -->
    <view class="preview">
      <text>第{{currentBox}}/{{totalBoxes}}箱 余量{{currentBoxData.remaining}}/{{currentBoxData.total}}张</text>
      <text class="guide" @click="navigateToGuide">购买说明</text>
	  <text class="guide" @click="navigateToRecord">开赏记录</text>
    </view>

    <!-- 产品列表 -->
    <scroll-view class="product-list" scroll-y>
      <view 
        v-for="(item, index) in currentBoxData.products" 
        :key="index"
        class="product-item"
      >
        <image class="product-img" :src="item.image"/>
        <view class="product-info">
          <text class="remaining">{{item.remaining}}/{{item.total}}</text>
          <view class="detail">
            <text class="grade">{{item.grade}}</text>
            <text class="name">{{item.name}}</text>
            <text class="price">零售价: {{item.price}}元</text>
            <text class="rate">概率: {{calculateProbability(item)}}%</text>
          </view>
        </view>
      </view>
    </scroll-view>
	<!-- 操作按钮区域 -->
	    <view class="action-buttons">
	      <view 
	        v-for="(btn, index) in actionBtns"
	        :key="index"
	        class="action-btn"
	        @click="showPurchaseModal(btn.type)"
	      >
	        {{ btn.label }}
	      </view>
	    </view>
	
	    <!-- 购买弹窗 -->
	    <view class="purchase-modal" :class="{show: showModal}">
	      <view class="modal-content">
	        <!-- 弹窗头部 -->
	        <view class="modal-header">
	          <text class="title">SP·冬日乐章（2）</text>
	          <image 
	            class="close-icon" 
	            src="/static/close.png" 
	            @click="closeModal"
	          />
	        </view>
	
	        <!-- 购买信息 -->
	        <view class="purchase-info">
	          <view class="info-item">
	            <text>单价：</text>
	            <text>¥{{ currentPrice }}</text>
	          </view>
	          <view class="info-item">
	            <text>数量：</text>
	            <text>{{ currentQuantity }}</text>
	          </view>
	          <view class="coupon-select">
	            <text>暂无可用优惠券 ></text>
	            <text>¥0</text>
	          </view>
	        </view>
	
	        <!-- 协议条款 -->
	        <view class="agreement">
	          <checkbox-group @change="toggleAgreement">
	            <checkbox :checked="agreed" color="#07C160"/>
	            <text>我已满18岁，已阅读并同意《用户使用协议》</text>
	          </checkbox-group>
	        </view>
	
	        <!-- 小计和确认 -->
	        <view class="total-section">
	          <view class="notice">
	            <text>盒柜选择提货后7天内发货</text>
	            <text>盒柜提货运费12元满三件包邮，不支持7天无理由退换货</text>
	          </view>
	          <view class="total-price">
	            <text>小计：</text>
	            <text class="price">¥{{ subtotal.toFixed(2) }}</text>
	          </view>
	          <button 
	            class="confirm-btn" 
	            :disabled="!agreed" 
	            @click="handlePayment"
	          >
	            确认购买
	          </button>
	        </view>
	      </view>
	      <view class="modal-mask" @click="closeModal"></view>
	    </view>
		<!-- 切换箱子弹窗 -->
		    <view class="box-modal" :class="{show: showBoxModal}">
		      <view class="modal-content">
		        <view class="modal-header">
		          <text class="title">选择房间</text>
		          <image 
		            class="close-icon" 
		            src="/static/close.png" 
		            @click="showBoxModal = false"
		          />
		        </view>
		
		        <scroll-view class="box-list" scroll-y>
		          <view 
		            v-for="box in boxList" 
		            :key="box.id"
		            class="box-item"
		            @click="selectBox(box.id)"
		          >
		            <view class="box-header">
		              <text class="box-title">第{{box.id}}箱</text>
		              <text class="remaining">剩{{box.remaining}}发</text>
		            </view>
		
		            <view class="awards">
		              <view 
		                v-for="(award, index) in box.awards"
		                :key="index"
		                class="award-item"
		              >
		                <text class="grade">{{award.grade}}</text>
		                <text class="count">{{award.remaining}}/{{award.total}}</text>
		              </view>
		            </view>
		          </view>
		        </scroll-view>
		      </view>
		      <view class="modal-mask" @click="showBoxModal = false"></view>
		    </view>
			<!-- 开赏记录弹窗 -->
			  <view class="record-modal" :class="{show: showRecordModal}">
			    <view class="modal-content">
			      <view class="modal-header">
			        <text class="title">开赏记录({{totalRecords}})</text>
			        <image 
			          class="close-icon" 
			          src="/static/close.png" 
			          @click="showRecordModal = false"
			        />
			      </view>
			
			      <!-- 筛选按钮 -->
			      <view class="filter-btns">
			        <view 
			          v-for="(filter, index) in filters"
			          :key="index"
			          :class="['filter-btn', activeFilter === filter.type ? 'active' : '']"
			          @click="changeFilter(filter.type)"
			        >
			          {{filter.label}}
			        </view>
			      </view>
			
			      <!-- 记录列表 -->
			      <scroll-view class="record-list" scroll-y>
			        <view 
			          v-for="(record, index) in filteredRecords"
			          :key="index"
			          class="record-item"
			        >
			          <view class="header">
			            <text class="number">{{record.title}}</text>
			            <text class="time">{{record.time}}</text>
			          </view>
			          <view class="content">
			            <text class="prize-name">{{record.prize}}</text>
			            <text :class="['grade', getGradeClass(record.grade)]">{{record.grade}}</text>
			          </view>
			        </view>
			      </scroll-view>
			    </view>
			    <view class="modal-mask" @click="showRecordModal = false"></view>
			</view>
	</view>
</template>

<script>
// 模拟数据
const mockBoxData = {
  8: {
    cover: '/static/box-cover.jpg',
    remaining: 237,
    total: 249,
    products: [
      {
        image: '/static/product1.jpg',
        grade: '终赏',
        name: '隐藏款·心碎女王',
        price: 30,
        remaining: 1,
        total: 1
      },
      {
        image: '/static/product2.jpg',
        grade: 'A赏',
        name: '入宫·陪雪歌',
        price: 30,
        remaining: 5,
        total: 10
      }
    ]
  },
  9: {
    cover: '/static/box-cover2.jpg',
    remaining: 150,
    total: 200,
    products: [
      {
        image: '/static/product3.jpg',
        grade: '终赏',
        name: '星空幻想',
        price: 30,
        remaining: 2,
        total: 2
      }
    ]
  }
}	
	
export default {
  data() {
     return {
       currentBox: 8,      // 当前箱号
       totalBoxes: 10,     // 总箱数
       boxData: mockBoxData, // 模拟数据
	     // 新增操作按钮配置
	   actionBtns: [
	     { type: 'all', label: '全收' },
	     { type: 'single', label: '欧一发' },
	     { type: 'triple', label: '欧三发' },
	     { type: 'ten', label: '欧十发' }
	   ],
      showModal: false,
      currentType: '',
      currentQuantity: 1,
      agreed: false,
      boxRemaining: 237, // 当前箱子剩余数量（需从接口获取）
	  showBoxModal: false,
	boxList: [
	  {
		id: 1,
		remaining: 237,
		awards: [
		  { grade: 'A赏', remaining: 1, total: 1 },
		  { grade: 'B赏', remaining: 1, total: 1 },
		  { grade: 'B赏', remaining: 1, total: 1 },
		  { grade: 'D赏', remaining: 112, total: 119 },
		  { grade: '终赏', remaining: 1, total: 1 }
		]
	  },
	  // 更多箱子数据...
		],
		showRecordModal: false,
		      activeFilter: 'all',
		      totalRecords: 12,
		      filters: [
		        { type: 'all', label: '全部' },
		        { type: 'free', label: '免单' },
		        { type: 'A', label: 'A赏' },
		        { type: 'B', label: 'B赏' },
		        { type: 'C', label: 'C赏' }
		      ],
		      records: [
		        {
		          title: '【第238张】BUBULA',
		          time: '03/08 17:50:26',
		          prize: '可爱面包萌粒（随机发）',
		          grade: 'C赏 x1',
		          type: 'C'
		        },
		        {
		          title: '【第239张】BUBULA',
		          time: '03/08 17:49:59',
		          prize: '三丽鸥可爱萌粒（随机发）',
		          grade: 'D赏 x1',
		          type: 'D'
		        }
		        // 更多记录数据...
		      ]
     }
   },
   computed: {
     currentBoxData() {
       return this.boxData[this.currentBox] || {
         cover: '',
         remaining: 0,
         total: 0,
         products: []
       }
     },
	  currentPrice() {
	       return UNIT_PRICE
	     },
	     subtotal() {
	       return this.currentQuantity * UNIT_PRICE
	     },
		 filteredRecords() {
		       if (this.activeFilter === 'all') return this.records
		       return this.records.filter(item => item.type === this.activeFilter)
		     }
   },
   methods: {
     // 切换箱子
     async switchBox(step) {
       const newBox = this.currentBox + step
       if(newBox < 1 || newBox > this.totalBoxes) return
       
       // TODO: 替换为真实接口调用
       // const res = await uni.request({
       //   url: '/api/box/switch',
       //   data: { boxNo: newBox }
       // })
       
       // 模拟加载效果
       uni.showLoading({ title: '加载中...' })
       setTimeout(() => {
         this.currentBox = newBox
         uni.hideLoading()
       }, 500)
     },
 
     // 计算概率
     calculateProbability(item) {
       return ((item.remaining / this.currentBoxData.total) * 100).toFixed(3)
     },
	 
    navigateToLocker() {
      uni.switchTab({ url: '/pages/locker/index' })
    },
    switchBox(step) {
      // 实际应调用接口
      console.log('切换箱子:', step)
    },
    navigateToGuide() {
      uni.navigateTo({ url: '/pages/guide/index' })
    },
	navigateToRecord() {
	  uni.navigateTo({ url: '/pages/record/index' })
	},
	showPurchaseModal(type) {
	      this.currentType = type
	      this.setQuantityByType(type)
	      this.showModal = true
	    },
	
	    setQuantityByType(type) {
	      const typeMap = {
	        all: this.boxRemaining,
	        single: 1,
	        triple: 3,
	        ten: 10
	      }
	      this.currentQuantity = Math.min(typeMap[type], this.boxRemaining)
	    },
	
	    toggleAgreement(e) {
	      this.agreed = e.detail.value.length > 0
	    },
	
	    async handlePayment() {
	      if (!this.agreed) {
	        uni.showToast({ title: '请先阅读并同意协议', icon: 'none' })
	        return
	      }
	
	      try {
	        // 第一步：创建订单
	        const orderRes = await this.createOrder()
	        
	        // 第二步：调用微信支付
	        const paymentRes = await this.wxPayment(orderRes.data)
	        
	        if (paymentRes) {
	          // 第三步：执行抽奖逻辑
	          const drawResult = await this.lotteryDraw()
	          this.showResult(drawResult)
	        }
	      } catch (error) {
	        uni.showToast({ title: '支付失败', icon: 'none' })
	      }
	    },
	
	    async createOrder() {
	      return uni.request({
	        url: '/api/order/create',
	        method: 'POST',
	        data: {
	          quantity: this.currentQuantity,
	          total: this.subtotal
	        }
	      })
	    },
	
	    wxPayment(orderData) {
	      return new Promise((resolve, reject) => {
	        uni.requestPayment({
	          ...orderData,
	          success: resolve,
	          fail: reject
	        })
	      })
	    },
	
	    async lotteryDraw() {
	      return uni.request({
	        url: '/api/lottery/draw',
	        method: 'POST',
	        data: { quantity: this.currentQuantity }
	      })
	    },
	
	    showResult(result) {
	      uni.navigateTo({
	        url: `/pages/lottery/result?data=${JSON.stringify(result)}`
	      })
	      this.closeModal()
	    },
	
	    closeModal() {
	      this.showModal = false
	      this.agreed = false
	    },
		showRecordModal() {
		      this.showRecordModal = true
		    },
		    
		    changeFilter(type) {
		      this.activeFilter = type
		    },
		    
		    getGradeClass(grade) {
		      return grade.toLowerCase().replace('赏', '')
		    }
	  }
  }
  
</script>

<style lang="scss" scoped>
.container {
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  height: 400rpx;
  position: relative;
  
  .nav-box {
    position: absolute;
    left: 30rpx;
    top: 30rpx;
    z-index: 2;
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.8);
    padding: 10rpx 20rpx;
    border-radius: 40rpx;
    
    .icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
    }
  }
  
  .cover {
    width: 100%;
    height: 100%;
  }
}

.box-control {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  
  .btn {
    width: 200rpx;
    height: 80rpx;
    border: 2rpx solid #333;
    border-radius: 40rpx;
    text-align: center;
    line-height: 80rpx;
    
    &.prev {
      background: #fff;
    }
    
    &.next {
      background: #FFD700;
    }
  }
}

.preview {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #fff;
  
  .guide {
    color: #007AFF;
  }
}

.product-list {
  padding: 20rpx 30rpx;
  
  .product-item {
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 30rpx;
    overflow: hidden;
    
    .product-img {
      width: 100%;
      height: 300rpx;
      display: block;
    }
    
    .product-info {
      position: relative;
      padding: 20rpx;
      
      .remaining {
        position: absolute;
        left: 20rpx;
        top: -40rpx;
        background: rgba(0,0,0,0.7);
        color: #fff;
        padding: 6rpx 20rpx;
        border-radius: 20rpx;
      }
      
      .grade {
        color: #FF4444;
        font-size: 32rpx;
        margin-right: 20rpx;
      }
      
      .price {
        color: #666;
        display: block;
        margin: 10rpx 0;
      }
      
      .rate {
        color: #999;
      }
    }
  }
}

/* 保持原有样式不变，添加禁用状态 */
.btn.disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* 添加加载动画 */
@keyframes loading {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading {
  animation: loading 1s linear infinite;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  background: #fff;
  border-top: 1rpx solid #eee;

  .action-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    margin: 0 10rpx;
    border-radius: 40rpx;
    background: #FFD700;
    color: #333;
    font-size: 30rpx;
    font-weight: bold;

    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }

    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}

/* 调整产品列表高度 */
.product-list {
  height: calc(100vh - 840rpx); /* 根据实际布局调整 */
}

.purchase-modal {
  position: fixed;
  bottom: -100%;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  z-index: 999;

  &.show {
    bottom: 0;
  }

  .modal-content {
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    padding: 40rpx;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;

    .title {
      font-size: 36rpx;
      font-weight: bold;
    }

    .close-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    color: #666;
  }

  .coupon-select {
    display: flex;
    justify-content: space-between;
    margin-top: 40rpx;
    padding-top: 40rpx;
    border-top: 1rpx solid #eee;
  }

  .agreement {
    display: flex;
    align-items: center;
    margin: 40rpx 0;
    font-size: 28rpx;

    checkbox {
      margin-right: 20rpx;
    }
  }

  .total-section {
    .notice {
      margin-bottom: 30rpx;
      text {
        display: block;
        font-size: 24rpx;
        color: #999;
        line-height: 1.6;
      }
    }

    .total-price {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40rpx;
      .price {
        color: #FF4444;
        font-size: 36rpx;
      }
    }

    .confirm-btn {
      background: #07C160;
      color: #fff;
      height: 90rpx;
      line-height: 90rpx;
      border-radius: 45rpx;
      font-size: 32rpx;

      &[disabled] {
        background: #ccc;
      }
    }
  }
}

.box-control {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  
  .btn {
    width: 200rpx;
    height: 80rpx;
    border-radius: 40rpx;
    text-align: center;
    line-height: 80rpx;
    
    &.prev, &.next {
      border: 2rpx solid #333;
    }
    
    &.switch {
      background: #FFD700;
      color: #333;
    }
  }
}

.box-modal {
  position: fixed;
  bottom: -100%;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  z-index: 999;

  &.show {
    bottom: 0;
  }

  .modal-content {
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    padding: 40rpx;
    max-height: 70vh;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;

    .title {
      font-size: 36rpx;
      font-weight: bold;
    }

    .close-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }

  .box-list {
    .box-item {
      padding: 30rpx;
      margin-bottom: 30rpx;
      background: #f8f8f8;
      border-radius: 16rpx;

      .box-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;

        .box-title {
          font-size: 32rpx;
          font-weight: bold;
        }

        .remaining {
          color: #666;
        }
      }

      .awards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20rpx;

        .award-item {
          display: flex;
          justify-content: space-between;
          padding: 15rpx 20rpx;
          background: #fff;
          border-radius: 8rpx;

          .grade {
            color: #FF4444;
          }

          .count {
            color: #666;
          }
        }
      }
    }
  }

  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
  }
}

.record-modal {
  position: fixed;
  bottom: -100%;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  z-index: 999;

  &.show {
    bottom: 0;
  }

  .modal-content {
    background: #fff;
    border-radius: 24rpx 24rpx 0 0;
    padding: 40rpx;
    max-height: 70vh;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;

    .title {
      font-size: 36rpx;
      font-weight: bold;
    }

    .close-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }

  .filter-btns {
    display: flex;
    gap: 20rpx;
    margin-bottom: 30rpx;
    flex-wrap: wrap;

    .filter-btn {
      padding: 12rpx 30rpx;
      border-radius: 40rpx;
      background: #f5f5f5;
      color: #666;
      font-size: 28rpx;

      &.active {
        background: #FFD700;
        color: #333;
        font-weight: bold;
      }
    }
  }

  .record-list {
    max-height: 50vh;
    
    .record-item {
      padding: 30rpx 0;
      border-bottom: 1rpx solid #eee;

      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20rpx;

        .number {
          font-weight: bold;
          color: #333;
        }

        .time {
          color: #999;
          font-size: 24rpx;
        }
      }

      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .prize-name {
          color: #666;
        }

        .grade {
          padding: 6rpx 20rpx;
          border-radius: 30rpx;
          font-size: 24rpx;

          &.a { background: rgba(255,68,68,0.1); color: #FF4444; }
          &.b { background: rgba(255,193,7,0.1); color: #FFC107; }
          &.c { background: rgba(0,188,212,0.1); color: #00BCD4; }
          &.d { background: rgba(76,175,80,0.1); color: #4CAF50; }
        }
      }
    }
  }

  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
  }
}

.record-btn {
  position: fixed;
  right: 30rpx;
  bottom: 200rpx;
  padding: 16rpx 30rpx;
  background: rgba(0,0,0,0.8);
  color: #fff;
  border-radius: 40rpx;
  z-index: 100;
}
</style>