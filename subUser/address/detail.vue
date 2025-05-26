<template>
	<view class="edit-container">
		<scroll-view scroll-y class="form-wrapper">
			<!-- 收货人 -->
			<view class="form-item">
				<text class="label">收货人</text>
				<input class="input" placeholder="请输入收货人姓名" v-model="formData.receiverName" />
			</view>

			<!-- 手机号码 -->
			<view class="form-item">
				<text class="label">手机号码</text>
				<input class="input" type="tel" maxlength="11" placeholder="请输入手机号码" v-model="formData.phone" />
			</view>

			<!-- 所在地区 -->
			<view class="form-item">
				<text class="label">所在地区</text>
				<picker mode="region" @change="bindRegionChange" :value="formData.region" class="region-picker">
					<view class="picker-text">
						{{ regionText || "请选择省市区" }}
					</view>
				</picker>
			</view>

			<!-- 详细地址 -->
			<view class="form-item">
				<text class="label">详细地址</text>
				<textarea class="textarea" placeholder="请输入详细地址" v-model="formData.detailAddress" auto-height />
			</view>

			<!-- 地址标签 -->
			<view class="form-item tag-section">
				<text class="label">标签</text>
				<view class="tag-group">
					<view class="tag-item" :class="{ active: formData.tag == 1 }" @tap="selectTag(1)">
						家
					</view>
					<view class="tag-item" :class="{ active: formData.tag == 2 }" @tap="selectTag(2)">
						公司
					</view>
					<view class="tag-item" :class="{ active: formData.tag == 3 }" @tap="selectTag(3)">
						学校
					</view>
				</view>
			</view>

			<!-- 设置选项 -->
			<view class="form-item switch-item">
				<text>设为默认地址</text>
				<switch color="#07C160" :checked="formData.isDefault" @change="toggleDefault" />
			</view>

			<view class="form-item switch-item">
				<text>设为自动提货地址</text>
				<switch color="#07C160" :checked="formData.isPickup" @change="toggleAutoPickup" />
			</view>
		</scroll-view>

		<!-- 保存按钮 -->
		<view class="save-btn" @tap="handleSave">
			保存
		</view>
	</view>
</template>

<script>
	import {
		get,
		post
	} from "@/utils/rest-util.js";
	import {
		formatDate
	} from "@/utils/common.js"
	export default {
		onLoad(param) {
			const {
				userId,
				addressId
			} = param;
			this.userId = userId;
			this.addressId = addressId;
			
		},
		onShow(){
			if (this.addressId) {
				this.initAddressList();
			}
		},
		data() {
			return {
				formData: {
					receiverName: "",
					phone: "",
					region: ["广东省", "广州市", "荔湾区"],
					detailAddress: "",
					tag: 1,
					isDefault: true,
					isPickup: false,
					userName: ''
				},
				addressId: '',
				userId: ''
			}
		},
		computed: {
			regionText() {
				return this.formData.region.join("-")
			}
		},
		methods: {
			bindRegionChange(e) {
				this.formData.region = e.detail.value
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
				console.log(this.formData)
				if(!this.formData.receiverName){
					uni.showModal({
					  title: '',       // 标题
					  content: '请输入用户名称', // 内容
					  confirmText: '确定',     // 确认按钮文字
					  cancelText: '取消',      // 取消按钮文字
					  success: (res) => {
					    if (res.confirm) {
					      console.log('用户点击确定')
					    } else if (res.cancel) {
					      console.log('用户点击取消')
					    }
					  }
					})
					return
				}
				if(!this.formData.phone || this.formData.phone.length !== 11){
					uni.showModal({
					  title: '',       // 标题
					  content: '请输入正确的手机号', // 内容
					  confirmText: '确定',     // 确认按钮文字
					  cancelText: '取消',      // 取消按钮文字
					  success: (res) => {
					    if (res.confirm) {
					      console.log('用户点击确定')
					    } else if (res.cancel) {
					      console.log('用户点击取消')
					    }
					  }
					})
					return
				}
				if(!this.formData.detailAddress){
					uni.showModal({
					  title: '',       // 标题
					  content: '请输入详细地址', // 内容
					  confirmText: '确定',     // 确认按钮文字
					  cancelText: '取消',      // 取消按钮文字
					  success: (res) => {
					    if (res.confirm) {
					      console.log('用户点击确定')
					    } else if (res.cancel) {
					      console.log('用户点击取消')
					    }
					  }
					})
					return
				}
				const postData = {
					addressId: this.addressId || '',
					userId: this.userId,
					updateBy: this.userId,
					updateTime: formatDate(new Date()),
					userName: this.formData.userName,
					region: this.formData.region.join(','),
					receiverName: this.formData.receiverName,
					phone: this.formData.phone,
					detailAddress: this.formData.detailAddress,
					tag: this.formData.tag,
					default: this.formData.isDefault,
					pickup: this.formData.isPickup,
					createBy: this.userId,
					createTime: formatDate(new Date())


				}
				// 提交保存逻辑
				post(`wx/address/save?userId=` + this.userId, postData).then(res => {
					if(res.data.errmsg === '成功'){
						uni.showToast({ title: '保存成功' })
					}
				})
			},
			initAddressList() {
				get(`wx/address/list?userId=${this.userId}`).then(json => {
					const result = json.data;
					const addressList = result.data || [];
					const addressInfo = addressList.find(item => item.addressId == this.addressId);
					addressInfo.region = addressInfo.region.split(',')
					addressInfo.isDefault = addressInfo.default;
					addressInfo.isPickup = addressInfo.pickup;
					this.formData = addressInfo
				})
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

			.input,
			.textarea,
			.picker-text {
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
			box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.3);
			width: 80%;
			margin: auto;
		}
	}
</style>