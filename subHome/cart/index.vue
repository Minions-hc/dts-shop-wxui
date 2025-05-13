<template>
  <view class="container">
    <!-- 购物车内容 -->
    <scroll-view scroll-y class="cart-content">
      <!-- 空状态 -->
      <view v-if="cartList.length === 0" class="empty-cart">
        <image class="empty-icon" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/empty.png"/>
      </view>

      <!-- 商品列表 -->
      <view v-else class="goods-list">
        <view class="goods-item" v-for="item in cartList" :key="item.id">
          <view class="left">
            <checkbox :checked="item.checked" @click="toggleCheck(item.id)"/>
          </view>
          <image class="goods-img" :src="item.image"/>
          <view class="goods-info">
            <text class="goods-title">{{item.name}}</text>
            <text class="goods-price">￥{{item.price}}</text>
            <view class="goods-actions">
              <view class="stepper">
                <text class="btn minus" @click="changeNum(item.id, -1)">-</text>
                <text class="num">{{item.quantity}}</text>
                <text class="btn plus" @click="changeNum(item.id, 1)">+</text>
              </view>
              <text class="delete-btn" @click="deleteItem(item.id)">删除</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="footer">
      <view class="check-all">
        <checkbox :checked="isAllChecked" @click="toggleAllCheck"/>
        <text>全选</text>
      </view>
      <view class="settlement">
        <button class="btn-settle">去结算({{checkedCount}})</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cartList: [], // 模拟空数据
      // 测试数据
      // cartList: [
      //   {id:1, name:"商品名称1", price:99, quantity:1, checked:true, image:"/static/goods1.jpg"},
      //   {id:2, name:"商品名称2", price:199, quantity:2, checked:false, image:"/static/goods2.jpg"}
      // ]
    }
  },
  computed: {
    isAllChecked() {
      return this.cartList.every(item => item.checked) && this.cartList.length > 0
    },
    totalPrice() {
      return this.cartList.reduce((sum, item) => {
        return item.checked ? sum + item.price * item.quantity : sum
      }, 0).toFixed(2)
    },
    checkedCount() {
      return this.cartList.filter(item => item.checked).length
    }
  },
  methods: {
    toggleCheck(id) {
      const item = this.cartList.find(item => item.id === id)
      item.checked = !item.checked
    },
    toggleAllCheck() {
      const newState = !this.isAllChecked
      this.cartList.forEach(item => item.checked = newState)
    },
    changeNum(id, delta) {
      const item = this.cartList.find(item => item.id === id)
      item.quantity = Math.max(1, item.quantity + delta)
    },
    deleteItem(id) {
      this.cartList = this.cartList.filter(item => item.id !== id)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  .cart-content {
    flex: 1;
    padding: 30rpx 30rpx 160rpx;

    .empty-cart {
      height: 60vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .empty-icon {
        width: 300rpx;
        height: 300rpx;
        margin-bottom: 40rpx;
      }
      .empty-text {
        font-size: 28rpx;
        color: #999;
      }
    }

    .goods-list {
      .goods-item {
        display: flex;
        align-items: center;
        padding: 30rpx;
        margin-bottom: 20rpx;
        background: #fff;
        border-radius: 16rpx;
        
        .left {
          margin-right: 20rpx;
        }
        .goods-img {
          width: 180rpx;
          height: 180rpx;
          margin-right: 20rpx;
          border-radius: 8rpx;
        }
        .goods-info {
          flex: 1;
          .goods-title {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 20rpx;
            display: block;
          }
          .goods-price {
            color: #e4393c;
            font-size: 32rpx;
            font-weight: bold;
          }
          .goods-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 30rpx;
            
            .stepper {
              display: flex;
              align-items: center;
              border: 2rpx solid #eee;
              border-radius: 8rpx;
              .btn {
                width: 60rpx;
                height: 60rpx;
                line-height: 60rpx;
                text-align: center;
                font-size: 40rpx;
                color: #666;
              }
              .num {
                width: 80rpx;
                text-align: center;
                font-size: 28rpx;
              }
            }
            .delete-btn {
              color: #999;
              font-size: 26rpx;
            }
          }
        }
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120rpx;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
    border-top: 2rpx solid #eee;

    .check-all {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      checkbox {
        transform: scale(0.8);
        margin-right: 10rpx;
		border-radius: 50%;
      }
    }

    .settlement {
      display: flex;
      align-items: center;
      .total {
        color: #e4393c;
        font-size: 28rpx;
        margin-right: 30rpx;
      }
      .btn-settle {
        background: #000;
        color: #fff;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 40rpx;
        font-size: 28rpx;
        padding: 0 40rpx;
        &::after {
          border: none;
        }
      }
    }
  }
}
</style>