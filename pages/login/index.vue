<template>
	<view class="container">
		<!-- 上半部分背景图 -->
		<view class="top-section">
			<image class="background-image" src="/static/login.png" mode="aspectFill"></image>
		</view>

		<!-- 下半部分操作区 -->
		<view class="bottom-section">
			<button class="login-btn" open-type="getUserInfo" @getuserinfo="onGetUserInfo">
				授权登录
			</button>

			<view class="skip-section" @click="handleSkip">
				<text class="skip-text">暂不登录</text>
			</view>

			<!-- 协议条款 -->
			<view class="agreement" @click="toggleAgreement">
				<view class="radio-wrapper">
					<view class="radio-icon" :class="{ checked: agreed }">
						<view v-if="agreed" class="radio-inner"></view>
					</view>
				</view>
				<text>我已满18岁，已阅读并同意</text>
				<text class="protocol" @click.stop="openProtocol">《用户使用协议》</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				agreed: false
			}
		},
		methods: {
			onGetUserInfo(e) {
				// 处理授权逻辑
				console.log('用户信息:', e.detail.userInfo)
				uni.showToast({
					title: '登录成功'
				})
			},
			handleSkip() {
				uni.showModal({
					title: '提示',
					content: '部分功能需要登录后才能使用',
					showCancel: false,
					confirm: true,
					success: function() {
						uni.switchTab({
							url: '/pages/index/index'
						});
					}
				})
			},
			toggleAgreement() {
				console.log(this.agreed)
				this.agreed = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.top-section {
		height: 50vh;
		position: relative;
	}

	.background-image {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.bottom-section {
		flex: 1;
		padding: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.login-btn {
		width: 90%;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 50rpx;
		background-color: #ed80a0;
		color: #fff;
		font-size: 32rpx;
		margin-top: 60rpx;
	}

	.skip-section {
		margin-top: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.skip-text {
		color: #000;
		font-size: 28rpx;
	}

	.tip-text {
		margin-top: 20rpx;
		color: #999;
		font-size: 24rpx;
	}

	.agreement {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #666;
		line-height: 1.6;
		margin-top: 40rpx;

		.radio-wrapper {
			margin-right: 12rpx;
		}

		.radio-icon {
			width: 32rpx;
			height: 32rpx;
			border: 2rpx solid #ccc;
			border-radius: 50%;
			position: relative;
			transition: all 0.3s;

			&.checked {
				border-color: #07c160;
				background-color: #07c160;
			}

			.radio-inner {
				position: absolute;
				top: 50%;
				left: 50%;
				width: 16rpx;
				height: 16rpx;
				background: #fff;
				border-radius: 50%;
				transform: translate(-50%, -50%);
			}
		}

	}

	.protocol {
		color: #07c160;
		margin-left: 6rpx;
	}
</style>