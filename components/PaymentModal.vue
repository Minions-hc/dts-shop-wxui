<!-- components/PaymentModal.vue -->
<template>
  <view class="payment-modal" :class="{show: show}">
    <view class="modal-content">
      <view class="modal-header">
        <text class="title">确认购买</text>
        <image 
			webp="true" 
			lazy-load="true"
          class="close-icon" 
          src="/static/close.png" 
          @click="$emit('close')"
        />
      </view>

      <view class="payment-info">
        <view class="info-item">
          <text>单价：</text>
          <text>￥{{price}}</text>
        </view>
        <view class="info-item">
          <text>数量：</text>
          <text>{{quantity}}</text>
        </view>
        <view class="info-item">
          <text>可用优惠券：</text>
          <text class="link">暂无可用优惠券 ></text>
        </view>
        <view class="info-item">
          <text>可用红包：</text>
          <text>￥0.00</text>
        </view>
      </view>

      <view class="agreement">
        <checkbox-group @change="toggleAgreement">
          <checkbox :checked="agreed" color="#07C160"/>
          <text>我已满18岁，已阅读并同意《用户使用协议》</text>
        </checkbox-group>
      </view>

      <view class="notice">
        <text>盒柜选择提货后7天内发货</text>
        <text>盒柜提货运费12元满三件包邮，不支持7天无理由退换货</text>
      </view>

      <view class="total-section">
        <text class="label">小计：</text>
        <text class="price">￥{{total.toFixed(2)}}</text>
      </view>

      <button 
        class="confirm-btn" 
        :disabled="!agreed" 
        @click="handleConfirm"
      >
        确认支付
      </button>
    </view>
    <view class="modal-mask" @click="$emit('close')"></view>
  </view>
</template>

<script>
export default {
  props: {
    show: Boolean,
    quantity: Number,
    price: Number
  },
  data() {
    return {
      agreed: false
    }
  },
  computed: {
    total() {
      return this.quantity * this.price
    }
  },
  methods: {
    toggleAgreement(e) {
      this.agreed = e.detail.value.length > 0
    },
    handleConfirm() {
      if (!this.agreed) return
      // 调用支付接口
      this.$emit('confirm', {
        quantity: this.quantity,
        total: this.total
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.payment-modal {
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

  .payment-info {
    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30rpx;
      color: #666;

      .link {
        color: #007AFF;
      }
    }
  }

  .agreement {
    margin: 40rpx 0;
    display: flex;
    align-items: center;
    font-size: 28rpx;

    checkbox {
      margin-right: 20rpx;
    }
  }

  .notice {
    margin-bottom: 40rpx;
    text {
      display: block;
      font-size: 24rpx;
      color: #999;
      line-height: 1.6;
    }
  }

  .total-section {
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

  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
  }
}
</style>