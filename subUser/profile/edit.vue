<template>
	<view class="container">
		<!-- 头像部分 -->
		<view class="avatar-section">
			<view class="avatar-wrapper" @tap="handleAvatarEdit">
				<image class="avatar" :src="avatarUrl" mode="aspectFill" />
				<view class="avatar-mask">
					<text class="edit-text">编辑</text>
				</view>
			</view>
		</view>

		<!-- 昵称部分 -->
		<view class="nickname-section" @tap="handleNicknameEdit">
			<view class="nickname-row">
				<text class="label">昵称</text>
				<view class="content-wrapper">
					<input v-if="isEditing" v-model="nickname" class="nickname-input" placeholder="请输入新昵称" focus
						@blur="saveNickname" />
					<text v-else class="nickname-value">{{ nickname }}</text>
				</view>
			</view>
		</view>

		<!-- 确认按钮 -->
		<view class="btn-container">
			<button class="confirm-btn" @tap="handleConfirm">确认更新</button>
		</view>
	</view>
</template>

<script>
	import OSS from 'ali-oss';
	import {
		get,
		post,
		BaseUrl,
		basic_env,
		Bucket
	} from "@/utils/rest-util.js"
	export default {
		data() {
			return {
				avatarUrl: '/static/images/default_avatar.png',
				nickname: 'JFUDVTlv',
				isEditing: false,
				credentials: null,
				expirationTime: null,
				tempFiles: [], // 临时文件路径
				uploading: false, // 上传状态
				maxCount: 9, // 最大上传数量
				maxSize: 2 * 1024 * 1024, // 最大文件大小5MB
				fileList: []
			}
		},
		methods: {
			// 头像编辑
			handleAvatarEdit() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],

					success: (res) => {
						// 大小校验
						const validFiles = res.tempFiles.filter(file => {
							if (file.size > this.maxSize) {
								uni.showToast({
									title: `文件${file.name}超过2MB限制`,
									icon: 'none'
								})
								return false
							}
							return true
						})
						// 添加到文件列表并开始上传
						const newFiles = validFiles.map(file => ({
							path: file.path,
							status: 'pending',
							progress: 0
						}))

						this.fileList = [...this.fileList, ...newFiles]
						this.startUpload(newFiles)
						if (validFiles) {
							const file = res.tempFiles[0];
							const fileUrl = res.tempFilePaths[0]
							this.avatarUrl = fileUrl
						}

					}
				})
			}, // 开始上传
			async startUpload(files) {
				this.uploading = true

				try {
					await Promise.all(files.map((_, index) =>
						this.uploadFile(this.fileList.length - files.length + index)
					))
				} finally {
					this.uploading = false
				}
			},
			// 单个文件上传
			uploadFile(index) {
				return new Promise((resolve, reject) => {
					const fileItem = this.fileList[index];
					console.log(fileItem)
					fileItem.status = 'uploading'

					const uploadTask = uni.uploadFile({
						url: BaseUrl + 'wx/storage/upload',
						filePath: fileItem.path,
						name: 'file',
						header: {
							// 'Authorization': `Bearer ${uni.getStorageSync('token')}`
						},
						success: res => {
							if (res.statusCode === 200) {
								fileItem.status = 'success'
								resolve()
							} else {
								fileItem.status = 'error'
								reject(new Error('上传失败'))
							}
						},
						fail: err => {
							fileItem.status = 'error'
							reject(err)
						}
					})
				})
			},

			// 进入昵称编辑状态
			handleNicknameEdit() {
				this.isEditing = true
			},

			// 保存昵称
			saveNickname() {
				this.isEditing = false
				if (!this.nickname.trim()) {
					this.nickname = 'JFUDVTlv'
				}
			},

			// 确认更新
			handleConfirm() {
				uni.showToast({
					title: '更新成功',
					icon: 'success'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 40rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	/* 头像部分 */
	.avatar-section {
		padding: 60rpx 0;

		.avatar-wrapper {
			position: relative;
			width: 240rpx;
			height: 240rpx;
			margin: 0 auto;
			border-radius: 15rpx;
			overflow: hidden;

			.avatar {
				width: 100%;
				height: 100%;
				background-color: #ddd;
			}

			.avatar-mask {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 60rpx;
				background: rgba(0, 0, 0, 0.6);
				display: flex;
				align-items: center;
				justify-content: center;

				.edit-text {
					color: #fff;
					font-size: 28rpx;
					letter-spacing: 2rpx;
				}
			}
		}
	}

	/* 昵称部分 */
	.nickname-section {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-top: 40rpx;

		.nickname-row {
			display: flex;
			align-items: center;
			height: 88rpx;

			.label {
				color: #666;
				font-size: 28rpx;
				flex-shrink: 0;
				margin-right: 30rpx;
				width: 120rpx;
			}

			.content-wrapper {
				flex: 1;
				height: 100%;
				display: flex;
				align-items: center;

				.nickname-input {
					flex: 1;
					font-size: 32rpx;
					color: #333;
					height: 100%;
					padding: 0;
					background: transparent;
					line-height: 1.5;
				}

				.nickname-value {
					font-size: 32rpx;
					color: #333;
					line-height: 1.5;
				}
			}
		}
	}

	/* 确认按钮 */
	.btn-container {
		margin-top: 80rpx;
		padding: 0 30rpx;

		.confirm-btn {
			background: #07c160;
			color: #fff;
			border-radius: 50rpx;
			font-size: 32rpx;
			height: 88rpx;
			line-height: 88rpx;

			&::after {
				border: none;
			}
		}
	}

	/* 去除按钮默认样式 */
	button {
		background-color: transparent;
		padding: 0;
		margin: 0;

		&[type="default"] {
			background-color: transparent;
		}
	}
</style>