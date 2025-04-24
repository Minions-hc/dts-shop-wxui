<template>
  <view class="edit-container">
    <scroll-view scroll-y class="form-wrapper">
      <!-- 收货人 -->
      <view class="form-item">
        <text class="label">收货人</text>
        <input 
          class="input" 
          placeholder="请输入收货人姓名" 
          v-model="formData.consignee"
        />
      </view>

      <!-- 手机号码 -->
      <view class="form-item">
        <text class="label">手机号码</text>
        <input
          class="input"
          type="number"
          placeholder="请输入手机号码"
          v-model="formData.phone"
        />
      </view>

      <!-- 所在地区 -->
      <view class="form-item">
        <text class="label">所在地区</text>
        <picker 
          mode="region" 
          @change="bindRegionChange"
          :value="region"
          class="region-picker"
        >
          <view class="picker-text">
            {{ regionText || "请选择省市区" }}
          </view>
        </picker>
      </view>

      <!-- 详细地址 -->
      <view class="form-item">
        <text class="label">详细地址</text>
        <textarea
          class="textarea"
          placeholder="请输入详细地址"
          v-model="formData.detail"
          auto-height
        />
      </view>

      <!-- 地址标签 -->
      <view class="form-item tag-section">
        <text class="label">标签</text>
        <view class="tag-group">
          <view 
            class="tag-item"
            :class="{ active: formData.tag === 'home' }"
            @tap="selectTag('home')"
          >
            家
          </view>
          <view 
            class="tag-item"
            :class="{ active: formData.tag === 'company' }"
            @tap="selectTag('company')"
          >
            公司
          </view>
          <view 
            class="tag-item"
            :class="{ active: formData.tag === 'school' }"
            @tap="selectTag('school')"
          >
            学校
          </view>
        </view>
      </view>

      <!-- 设置选项 -->
      <view class="form-item switch-item">
        <text>设为默认地址</text>
        <switch 
          color="#07C160" 
          :checked="formData.isDefault"
          @change="toggleDefault"
        />
      </view>

      <view class="form-item switch-item">
        <text>设为自动提货地址</text>
        <switch 
          color="#07C160" 
          :checked="formData.isAutoPickup"
          @change="toggleAutoPickup"
        />
      </view>
    </scroll-view>

    <!-- 保存按钮 -->
    <view class="save-btn" @tap="handleSave">
      保存
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        consignee: "单",
        phone: "13631273652",
        region: [],
        detail: "绿湖国际城1期1303房",
        tag: "home",
        isDefault: true,
        isAutoPickup: false
      },
      region: ["广东省", "广州市", "荔湾区"]
    }
  },
  computed: {
    regionText() {
      return this.region.join("-")
    }
  },
  methods: {
    bindRegionChange(e) {
      this.region = e.detail.value
    },
    selectTag(tag) {
      this.formData.tag = tag
    },
    toggleDefault(e) {
      this.formData.isDefault = e.detail.value
    },
    toggleAutoPickup(e) {
      this.formData.isAutoPickup = e.detail.value
    },
    handleSave() {
      // 提交保存逻辑
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-container {
  padding: 0rpx 30rpx 0rpx 30rpx;
  background: #f5f5f5;
  min-height: 100vh;
  position: relative;

  .form-item {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;

    .label {
      width: 140rpx;
      font-size: 26rpx;
      color: #333;
      flex-shrink: 0;
    }

    .input, .textarea, .picker-text {
      flex: 1;
      font-size: 26rpx;
      color: #333;
      margin-left: 20rpx;
    }

    .textarea {
      min-height: 120rpx;
      line-height: 1.4;
    }

    &.tag-section {
      align-items: flex-start;
      
      .tag-group {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
        margin-left: 20rpx;

        .tag-item {
          padding: 10rpx 40rpx;
          border-radius: 40rpx;
          background: #F5F5F5;
          color: #333;
          font-size: 22rpx;
          transition: all 0.3s;

          &.active {
            background: #07C160;
            color: #fff;
          }
        }
      }
    }

    &.switch-item {
      justify-content: space-between;
      font-size: 26rpx;
      color: #333;
    }
  }

  .save-btn {
    position: fixed;
    bottom: 40rpx;
    left: 30rpx;
    right: 30rpx;
    height: 88rpx;
    background: #000;
    color: #fff;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    box-shadow: 0 4rpx 12rpx rgba(7,193,96,0.3);
	width: 80%;
	margin: auto;
  }
}
</style>