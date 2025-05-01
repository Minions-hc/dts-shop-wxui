<template>
	<view class="container">
		<!-- 固定头部 -->
		<view class="header">
			<view class="tabs">
				<text class="tab-item" :class="{active: activeTab === 0}" @click="switchTab(0)">中奖用户</text>
				<text class="tab-item" :class="{active: activeTab === 1}" @click="switchTab(1)">所有用户</text>
			</view>
		</view>

		<!-- 滑动内容区域 -->
		<swiper class="content-swiper" :current="activeTab" @change="onSwiperChange" :duration="300">
			<!-- 中奖用户页 -->
			<swiper-item>
				<scroll-view scroll-y class="swiper-scroll" :scroll-top="scrollTop[0]" @scroll="e => onScroll(e, 0)">
					<view class="period-tag" :style="{opacity: periodOpacity}">第 {{periodNumber}} 期</view>
					<view class="win-list">
						<view v-for="(item, index) in winners" :key="index" class="win-item">
							<image class="avatar" :src="item.avatar" />
							<view class="info">
								<text class="user-id">{{ item.userId }}</text>
								<text class="username">{{ item.username }}</text>
							</view>
							<text class="award-code">{{ item.awardCode }}</text>
						</view>
					</view>
				</scroll-view>
			</swiper-item>

			<!-- 所有用户页 -->
			<swiper-item>
				<scroll-view scroll-y class="swiper-scroll" :scroll-top="scrollTop[1]" @scroll="e => onScroll(e, 1)">
					<view class="period-tag" :style="{opacity: periodOpacity}">第 {{periodNumber}} 期</view>
					<view class="all-users-grid">
						<view v-for="(user, index) in allUsers" :key="index" class="user-item">
							<view class="avatar-wrapper">
								<image class="user-avatar" :src="user.avatar" lazy-load=""/>
								<view class="count-badge">{{ user.codeCount }}</view>
							</view>
							<text class="username">{{ user.userId }}</text>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		get,
		post
	} from "@/utils/rest-util.js"
	export default {
		onLoad(param) {
			const {
				userId,
				tab,
				activityId,
				periodNumber
			} = param;
			this.userId = userId;
			this.activeTab = Number(tab);
			this.activityId = activityId;
			this.periodNumber = periodNumber;
			if (this.activeTab === 0) {
				this.getParticipants()
			} else {
				this.geWinUser()
			}
		},
		data() {
			return {
				activeTab: 0,
				userId: '',
				activityId: '',
				periodNumber: '',
				scrollTop: [0, 0],
				periodOpacity: 1,
				winners: [],
				allUsers: []
			}
		},
		methods: {
			switchTab(index) {
				this.activeTab = index;
				if (this.activeTab === 0) {
					this.getParticipants()
				} else {
					this.geWinUser()
				}
			},
			onSwiperChange(e) {
				this.activeTab = e.detail.current
			},
			onScroll(e, index) {
				this.scrollTop.splice(index, 1, e.detail.scrollTop)
				this.periodOpacity = Math.max(0, 1 - e.detail.scrollTop / 50)
			},
			getParticipants() {
				get(`wx/luckyDraw/participants?activityId=${this.activityId}&periodNumber=${this.periodNumber}`).then(
					json => {
						const result = json.data?.data;
						this.allUsers = result || []
					})
			},
			geWinUser() {
				get(`wx/luckyDraw/winners?activityId=${this.activityId}&periodNumber=${this.periodNumber}`).then(json => {
					const result = json.data?.data;
					this.winners = result || [];
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.header {
		height: 100rpx;
		background: #fff;
		position: relative;
		z-index: 1000;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

		.tabs {
			display: flex;
			height: 100%;

			.tab-item {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				color: #ccc;
				border-bottom: 4rpx solid transparent;

				&.active {
					color: #000;
					border-color: currentColor;
				}
			}
		}
	}

	.content-swiper {
		flex: 1;
		height: calc(100vh - 100rpx);

		.swiper-scroll {
			height: 100%;

			.period-tag {
				margin: 20rpx 320rpx;
				padding: 12rpx 0;
				background: #ed80a0;
				color: #fff;
				border-radius: 32rpx;
				text-align: center;
				font-size: 28rpx;
			}

			.win-list,
			.all-users-grid {
				padding: 0 30rpx 20rpx;
			}
		}
	}

	/* 中奖用户列表样式 */
	.win-item {
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 30rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}

		.info {
			flex: 1;
			margin-right: 20rpx;

			.user-id {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 8rpx;
				display: block;
			}

			.username {
				font-size: 24rpx;
				color: #999;
				display: block;
			}
		}

		.award-code {
			font-size: 36rpx;
			color: #000;
			font-family: monospace;
			font-weight: bold;
		}
	}

	/* 所有用户网格样式 */
	.all-users-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 40rpx;

		.user-item {
			width: calc((100% - 60rpx) / 6);
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.avatar-wrapper {
			position: relative;
			width: 100rpx;
			height: 100rpx;
			margin-bottom: 12rpx;

			.user-avatar {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background: #f0f0f0;
			}

			.count-badge {
				position: absolute;
				top: -10rpx;
				right: -15rpx;
				min-width: 15rpx;
				height: 30rpx;
				padding: 0 8rpx;
				background: #ed80a0;
				color: #fff;
				font-size: 24rpx;
				border-radius: 18rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
			}
		}

		.username {
			font-size: 26rpx;
			color: #666;
			text-align: center;
			line-height: 1.4;
			max-width: 120rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
	}
</style>