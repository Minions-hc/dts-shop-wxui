<template>
	<view class="container">
		<!-- 上半部分背景图 -->
		<view class="top-section">
			<image class="background-image"
				src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/login.png" mode="aspectFill">
			</image>
		</view>

		<!-- 下半部分操作区 -->
		<view class="bottom-section">
			<button class="login-btn" @click="onGetUserInfo">
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
	import {
		get,
		post
	} from '../../utils/rest-util';

	export default {
		data() {
			return {
				agreed: false
			}
		},
		onLoad() {
			this.initPage()
		},
		methods: {
			initPage() {
				const userId = uni.getStorageSync('userId');
				if (userId) {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			},
			// 获取用户信息
			async onGetUserInfo() {
				// if (e.detail.errMsg === 'getUserInfo:ok') {
				try {
					// 2. 获取用户信息
					const userProfile = await uni.getUserProfile({
						desc: '获取您的昵称和头像用于展示'
					});
					console.log(userProfile)
					uni.showModal({
						content: JSON.stringify(userProfile)
					})
					return
					const userInfo = userProfile.userInfo;
					// 1. 调用 uni.login 获取 code
					const loginRes = await uni.login({
						provider: 'weixin'
					});
					const postData = {
						code: loginRes.code,
					}
					try {
						// 2. 发送登录请求
						post('wx/auth/wxLogin', postData).then(res => {
							// 
							// 3. 处理登录结果
							if (res.data.code === 200) {
								uni.setStorageSync('token', res.data.token)
								uni.setStorageSync('userInfo', res.data.userInfo)
								uni.setStorageSync("userId",res.data.userInfo.userId);
								// this.toPage()
								uni.showToast({
									title: '登录成功'
								})
							}
						})
					} catch (error) {
						uni.showModal({
							content: JSON.stringify(error)
						})
					}
				} catch (error) {
					uni.showToast({
						title: '登录失败',
						icon: 'none'
					})
				}
				// } else {
				// 	uni.showToast({
				// 		title: '授权失败',
				// 		icon: 'none'
				// 	})
				// }
			},
			toPage() {
				// 登录成功后处理跳转
				const shareParams = uni.getStorageSync('shareParams');
				if (shareParams) {
					const param = JSON.parse(shareParams)
					uni.reLaunch({
						url: `/${param.path}?${this.objToQuery(param.query)}`
					});
					uni.removeStorageSync('shareParams');
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					});
				}
			},
			objToQuery(obj) {
				return Object.keys(obj)
					.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
					.join('&');
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
			// 处理登录按钮点击
			handleLogin() {
				// 检查是否已同意隐私协议
				if (!this.agreed) {
					uni.showModal({
						title: '提示',
						content: '请先阅读并同意隐私协议',
						showCancel: false
					})
				}
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