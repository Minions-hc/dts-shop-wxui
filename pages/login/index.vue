<template>
	<view class="container">
		<!-- 上半部分背景图 -->
		<view class="top-section">
			<image class="background-image" src="/static/login.png" mode="aspectFill"></image>
		</view>

		<!-- 下半部分操作区 -->
		<view class="bottom-section">
			<button class="login-btn" open-type="getUserInfo" @getuserinfo="onGetUserInfo" @click="handleLogin">
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
			const userCode = uni.getStorageSync('userCode');
			if (userCode) {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		},
		methods: {
			async handleAuth(e) {
				try {
					// 处理用户信息
					if (e.type === 'getuserinfo') {
						if (e.detail.errMsg !== 'getUserInfo:ok') return
						this.loginParams.userInfo = e.detail.userInfo
						const loginRes = await uni.login({
							provider: 'weixin'
						})
						this.loginParams.code = loginRes.code
					}

					// 处理手机号
					if (e.type === 'getphonenumber') {
						if (e.detail.errMsg !== 'getphonenumber:ok') return
						this.loginParams.iv = e.detail.iv
						this.loginParams.encryptedData = e.detail.encryptedData

						// // 提交完整数据
						// const res = await uni.request({
						// 	url: 'https://your-domain.com/api/wechat/fullAuth',
						// 	method: 'POST',
						// 	data: this.loginParams
						// })

						// if (res.data.code === 0) {
						// 	uni.setStorageSync('token', res.data.data.token)
						// 	uni.reLaunch({
						// 		url: '/pages/index/index'
						// 	})
						// }
					}
				} catch (error) {
					uni.showToast({
						title: '授权失败',
						icon: 'none'
					})
				}
			},
			// 获取用户信息
			async onGetUserInfo(e) {
				if (e.detail.errMsg === 'getUserInfo:ok') {
					try {
						// 1. 获取code
						const loginRes = await uni.login({
							provider: 'weixin'
						})

						uni.setStorageSync('userCode', loginRes.code)
						const postData = {
							code: loginRes.code,
							rawData: e.detail.rawData,
							signature: e.detail.signature,
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv
						}

						this.toPage()
						// 2. 发送登录请求
						post('wx/auth/wxLogin', postData).then(res => {
							// 3. 处理登录结果
							if (res.data.code === 0) {
								uni.setStorageSync('token', res.data.data.token)
								uni.setStorageSync('userInfo', res.data.data.userInfo)
								uni.showToast({
									title: '登录成功'
								})
							}
						})
					} catch (error) {
						uni.showToast({
							title: '登录失败',
							icon: 'none'
						})
					}
				} else {
					uni.showToast({
						title: '授权失败',
						icon: 'none'
					})
				}
			},
			toPage() {
				// 登录成功后处理跳转
				const shareParams = JSON.parse(uni.getStorageSync('shareParams'));
				if (shareParams) {
					uni.reLaunch({
						url: `/${shareParams.path}?${this.objToQuery(shareParams.query)}`
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