<template>
  <view class="container">
    <!-- 顶部产品信息 -->
    <view class="product-header">
      <image class="product-img" src="/static/product.jpg"/>
      <view class="product-info">
        <text class="title">SP·热款吊卡(10)</text>
        <text class="desc">【39元起一抽·保底6限定·222抽】</text>
        <view class="progress">
          <view class="progress-bar" :style="{width: progressWidth}"></view>
        </view>
        <text class="remaining">剩余{{remaining}}张</text>
        <view class="price-area">
          <text class="price">￥{{currentPrice}}/张</text>
          <text class="purchase-guide" @click="navigateToGuide">购买说明</text>
        </view>
      </view>
      <view class="locker-btn" @click="navigateToLocker">盒柜</view>
    </view>

    <!-- 箱体切换 -->
    <view class="box-control">
      <view class="btn prev" @click="switchBox(-1)">上一箱</view>
      <text class="box-number">第{{currentBox}}箱/共{{totalBoxes}}箱</text>
      <view class="btn next" @click="switchBox(1)">下一箱</view>
    </view>

    <!-- 选号区域 -->
    <view class="number-select">
      <view class="select-header">
        <text>指定选择：</text>
        <checkbox-group @change="toggleSelectAll">
          <checkbox :checked="isAllSelected"/>全选
        </checkbox-group>
      </view>
      <view class="number-grid">
        <view 
          v-for="num in totalNumbers" 
          :key="num"
          :class="['number-item', selectedNumbers.includes(num) ? 'selected' : '']"
          @click="toggleNumber(num)"
        >
          {{num}}
        </view>
        <view class="more-btn" @click="scrollToTreasure">更多</view>
      </view>
      <view class="selected-info">
        {{selectedNumbers.length ? selectedNumbers.join(',') : '你还没有选号！'}}
      </view>
    </view>

    <!-- 百宝箱区域 -->
    <view class="treasure-box" id="treasure">
      <view 
        v-for="(item, index) in products" 
        :key="index"
        class="treasure-item"
      >
        <image class="cover" :src="item.image"/>
        <text class="remaining">{{item.remaining}}/{{item.total}}</text>
        <view class="info">
          <text class="grade">{{item.grade}}</text>
          <text class="name">{{item.name}}</text>
          <text class="price">零售价：￥{{item.price}}</text>
          <text class="probability">概率：{{item.probability}}%</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="action-btns">
        <view class="btn" @click="randomSelect(1)">欧一发</view>
        <view class="btn" @click="randomSelect(3)">欧三发</view>
        <view class="btn" @click="randomSelect(10)">欧十发</view>
        <view class="btn refresh" @click="resetSelection">刷新</view>
      </view>
      <view class="price-info">
        <text>当前单价：￥{{currentPrice}}</text>
        <view class="buy-btn" @click="showPaymentModal">立即购买</view>
      </view>
    </view>

    <!-- 支付弹窗 -->
    <PaymentModal 
      :show="showPayment" 
      :quantity="selectedNumbers.length"
      :price="currentPrice"
      @close="showPayment = false"
      @confirm="handlePayment"
    />
  </view>
</template>

<script>
import PaymentModal from '@/components/PaymentModal'

export default {
  components: { PaymentModal },
  data() {
    return {
      currentBox: 3,
      totalBoxes: 3,
      remaining: 190,
      totalNumbers: 222,
      currentPrice: 69,
      selectedNumbers: [],
      products: [], // 产品数据
      showPayment: false
    }
  },
  computed: {
    progressWidth() {
      return `${(this.remaining / 222 * 100).toFixed(2)}%`
    },
    isAllSelected() {
      return this.selectedNumbers.length === this.totalNumbers
    }
  },
  methods: {
    toggleNumber(num) {
      const index = this.selectedNumbers.indexOf(num)
      if(index > -1) {
        this.selectedNumbers.splice(index, 1)
      } else {
        this.selectedNumbers.push(num)
      }
    },
    toggleSelectAll(e) {
      if(e.detail.value.length) {
        this.selectedNumbers = Array.from({length: this.totalNumbers}, (_,i)=>i+1)
      } else {
        this.selectedNumbers = []
      }
    },
    randomSelect(count) {
      // 随机选择逻辑
    },
    resetSelection() {
      this.selectedNumbers = []
    },
    scrollToTreasure() {
      uni.pageScrollTo({ selector: '#treasure' })
    },
    async handlePayment() {
      // 支付逻辑
    }
  }
}
</script>

<style lang="scss" scoped>
/* 详细样式实现 */
.product-header {
  display: flex;
  padding: 30rpx;
  position: relative;

  .product-img {
    width: 250rpx;
    height: 250rpx;
    border-radius: 16rpx;
  }

  .product-info {
    flex: 1;
    padding-left: 30rpx;
  }

  .locker-btn {
    position: absolute;
    right: 30rpx;
    top: 30rpx;
  }
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20rpx;

  .number-item {
    height: 80rpx;
    border: 1rpx solid #ddd;
    text-align: center;
    line-height: 80rpx;

    &.selected {
      background: #FFD700;
      border-color: #FFD700;
    }
  }
}

.action-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  padding: 20rpx;
  box-shadow: 0 -4rpx 10rpx rgba(0,0,0,0.1);
}
</style>