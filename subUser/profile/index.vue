<template>
	<view class="profile-page">
		<!-- 头像区域 -->
		<view class="avatar-section" @click="navigateToEdit">
			<image class="avatar" :src="userInfo.avatar" mode="aspectFill" lazy-load="true" />
			<text class="tip">点击修改头像</text>
		</view>

		<!-- 个人信息列表 -->
		<view class="info-list">
			<view class="list-item" @click="navigateToEdit">
				<text class="label">姓名</text>
				<view class="right-box">
					<text class="value">{{userInfo.userName}}</text>
				</view>
			</view>

			<view class="list-item">
				<text class="label">用户ID</text>
				<view class="right-box">
					<text class="value">{{userInfo.userId}}</text>
					<text class="copy-btn" @click="copyText(userInfo.uid)">复制</text>
				</view>
			</view>
			<view class="list-item">
				<text class="label">邀请码</text>
				<view class="right-box">
					<text class="value">{{userInfo.inviterId}}</text>
					<text class="copy-btn" @click="copyText(userInfo.inviteCode)">复制</text>
				</view>
			</view>

			<view class="list-item">
				<text class="label">我的上级</text>
				<view class="right-box">
					<text class="value">{{userInfo.superior || ''}}</text>
					<text class="copy-btn" @click="copyText(userInfo.superior || '')">复制</text>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-btns">
			<view class="btn delete-btn" @click="showDeleteConfirm">注销账号</view>
			<view class="btn logout-btn" @click="showLogoutConfirm">退出登录</view>
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
				userInfo: {},
				userId: uni.getStorageSync('userId'),
			}
		},
		onShow() {
			// this.userInfo = uni.getStorageSync("userInfo") || {};
			this.getUserInfo();
		},
		methods: {
			// 跳转编辑页
			navigateToEdit() {
				uni.navigateTo({
					url: '/subUser/profile/edit'
				})
			},

			// 通用复制方法
			copyText(text) {
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({
							title: '复制成功'
						})
					}
				})
			},

			// 显示注销确认
			showDeleteConfirm() {
				uni.showModal({
					title: '确定要删除账号吗？',
					content: '删除账号后所有账号资料将无法找回，请谨慎操作!',
					confirmColor: '#07C160',
					cancelColor: '#999',
					confirmText: '仍然删除',
					success: res => {
						if (res.confirm) {
							this.deleteAccount()
						}
					}
				})
			},

			// 显示退出确认
			showLogoutConfirm() {
				uni.showModal({
					title: '确定要退出吗？',
					confirmColor: '#07C160',
					cancelColor: '#999',
					confirmText: '退出登录',
					success: res => {
						if (res.confirm) {
							this.logout()
						}
					}
				})
			},
			getUserInfo() {
				get('wx/auth/userInfo/' + this.userId).then(res => {
					if (res.statusCode === 200) {
						const result = res.data.data;
						this.userInfo = result;
						uni.setStorageSync('userInfo', result)
					}
				})
			},

			// 注销账号
			async deleteAccount() {
				try {
					const userId = uni.getStorageSync('userId')
					// 调用后端接口
					post('wx/auth/delete/' + userId, {}).then(json => {
						uni.showToast({
							title: '账号已注销'
						})
						// 清理本地数据
						uni.removeStorageSync('token')
						uni.removeStorageSync('userInfo')
						uni.removeStorageSync('userId')
						uni.reLaunch({
							url: '/pages/login/index'
						})
					})
				} catch (error) {
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					})
				}
			},

			// 退出登录
			async logout() {
				try {
					// 调用微信取消授权
					// await uni.authorize({ scope: 'scope.userInfo' })
					const postData = {
						userId: uni.getStorageSync('userId')
					}
					// 调用后端接口
					post('wx/auth/logout', postData).then(json => {
						// 清理本地数据
						uni.removeStorageSync('token')
						uni.removeStorageSync('userInfo')
						uni.removeStorageSync('userId')
						uni.reLaunch({
							url: '/pages/login/index'
						})
					})

				} catch (error) {
					uni.showToast({
						title: '退出失败',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.profile-page {
		background: #f5f5f5;
		min-height: 100vh;
	}

	.avatar-section {
		padding: 60rpx 0;
		background: #fff;
		/* 核心修改：使用flex列布局 */
		display: flex;
		flex-direction: column;
		align-items: center;

		/* 水平居中 */
		.avatar {
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
			margin-bottom: 20rpx;
			/* 保留底部间距 */
		}

		.tip {
			color: #999;
			font-size: 24rpx;
		}
	}

	.info-list {
		margin: 30rpx;
		background: #fff;
		border-radius: 16rpx;
		overflow: hidden;

		.list-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid #eee;

			&:last-child {
				border-bottom: none;
			}

			.label {
				font-size: 30rpx;
				color: #333;
			}

			.right-box {
				display: flex;
				align-items: center;

				.value {
					color: #666;
					margin-right: 20rpx;
				}

				.arrow {
					width: 32rpx;
					height: 32rpx;
				}

				.copy-btn {
					color: #07C160;
					font-size: 26rpx;
					padding: 8rpx 20rpx;
					border: 1rpx solid #07C160;
					border-radius: 30rpx;
				}
			}
		}
	}

	.action-btns {
		margin: 60rpx 30rpx;

		.btn {
			height: 90rpx;
			border-radius: 45rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			margin-bottom: 30rpx;

			&.delete-btn {
				background: #fff;
				color: #FF4444;
				border: 1rpx solid #FF4444;
			}

			&.logout-btn {
				background: #07C160;
				color: #fff;
			}
		}
	}
</style>