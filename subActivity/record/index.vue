<template>
	<view class="royal-rank-container">
		<!-- 头部背景图区域 -->
		<view class="header-banner">
			<!-- 背景图 -->
			<image class="banner-bg" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/record-bg.png" mode="scaleToFill" />

			<!-- 内容容器 -->
			<view class="banner-content">
				<!-- 累计积分 -->
				<view class="integral-info">
					<text class="value">{{totalPoint}}</text>
				</view>
			</view>
		</view>
		<!-- 导航选项卡 -->
		<view class="rank-tabs">
			<view class="tab-item active" @click="activeTab = 0">
				<text>月榜</text>
				<image class="tab-underline" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/record-underline.png" />
			</view>
		</view>
		<!-- 在rank-tabs下方添加 -->
		<view class="notice-bar">
			<image class="notice-icon" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/record-notice.png" mode="widthFix" />
			<view class="notice-content">
				<view class="notice-text" :class="{ scrollable: true }">
					<text v-for="(text, index) in noticeList" :key="index">{{ text }}</text>
				</view>
			</view>
		</view>

		<!-- 榜单主体 -->
		<view class="rank-main">
			<!-- 表头 -->
			<view class="rank-header-row">
				<text class="col-rank">排名</text>
				<text class="col-user">用户</text>
				<text class="col-a">A赏</text>
				<text class="col-b">B赏</text>
				<text class="col-score">得分</text>
			</view>

			<!-- 数据行 -->
			<view class="rank-list">
				<view class="rank-item" v-for="(item, index) in rankList" :key="index">
					<view class="col-rank">
						<!-- 前三名显示奖牌 -->
						<image v-if="index < 3" class="medal-icon" :src="getMedalImage(index+1)" mode="scaleToFill" />
						<!-- 其他显示数字 -->
						<text v-else>{{ index + 1 }}</text>
					</view>
					<text class="col-user">{{ item.userName }}</text>
					<text class="col-a">{{ item.aCount }}</text>
					<text class="col-b">{{ item.bCount }}</text>
					<text class="col-score">{{ item.totalPoints }}</text>
				</view>
			</view>
		</view>

		<!-- 固定在底部的用户信息栏 -->
		<view class="user-footer">
			<!-- 背景图 -->
			<image class="footer-bg" src="https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/record-footer-bg.png" mode="scaleToFill" />

			<view class="user-info-container">
				<!-- 左侧头像 -->
				<image class="user-avatar" :src="userInfo.avatar" lazy-load/>

				<!-- 中间信息 -->
				<view class="user-center">
					<text class="user-name">{{userInfo.userName}}</text>
					<text class="progress-info">距离前{{getSortName()}}还差{{getScore()}}分</text>
				</view>

				<!-- 右侧分数 -->
				<view class="score-section">
					<text class="current-score">{{getUserTotal()}}</text>
				</view>
			</view>
		</view>
		<!-- 在页面最外层容器内添加 -->
		<view class="rule-button" @click="navigateToRule()">
			<text>查看
				规则</text>

		</view>
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
				userId
			} = param;
			this.userId = userId;
			
		},
		onShow(){
			this.queryLuckyKing();
			this.queryTotalPoint();
			this.queryUserPoint()
		},
		data() {
			return {
				userId: '',
				totalPoint: 0,
				rankList: [],
				noticeList: [
					"排名规则：A赏=10得分，B赏=1得分，系统将按最终得分排定名次，得分高者名列前次（如得分并列，优先取得得分最高者居上）"
				],
				userInfo: null
			}
		},
		methods: {
			getMedalImage(rank) {
				const medals = {
					1: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/record-first.png',
					2: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/record-second.png',
					3: 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/record-third.png'
				}
				return medals[rank]
			},
			navigateToRule() {
				uni.navigateTo({
					url: '/subActivity/record/rule'
				})
			},
			queryLuckyKing() {
				get('wx/rank/lucky-king').then(res => {
					this.rankList = res.data || []
				})
			},
			queryTotalPoint() {
				get('wx/rank/lucky-king/total-points').then(res => {
					this.totalPoint = res.data || 0
				})
			},
			queryUserPoint() {
				get('wx/rank/lucky-king/user-points?userId=' + this.userId).then(res => {
					const result = res.data;
					this.userInfo = result
				})
			},
			getUserTotal() {
				if (!this.userInfo) {
					return '0.00'
				}
				return this.userInfo.totalPoints
			},
			getScore() {
				if (!this.userInfo) {
					return '0'
				}
				return this.userInfo.distancePoints
			},
			getSortName() {
				if (!this.userInfo) {
					return ''
				}
				const sumMap = {
					1: '一',
					2: '二',
					3: '三',
					4: '四',
					5: '五',
					6: '六',
					7: '七',
					8: '八',
					9: '九',
					10: '十',
				}
				let num = 0;
				let info = null;
				this.rankList.forEach((item, index) => {
					if (item.userId === this.userId) {
						num = index;
						info = item;
					}
				})
				if (info) {
					return sumMap[num] || '一';
				} else {
					return '十'
				}

			}
		},
	}
</script>

<style lang="scss" scoped>
	.royal-rank-container {
		background: #f5f5f5;
		min-height: 100vh;

		.header-banner {
			position: relative;
			height: 600rpx;

			.banner-bg {
				width: 100%;
				height: 100%;
				z-index: 1;
			}

			.banner-content {
				position: absolute;
				z-index: 2;
				top: 445rpx;
				left: 90rpx;

			}

			.title-group {
				.sub-title {
					display: block;
					font-size: 36rpx;
					color: rgba(255, 255, 255, 0.8);
					margin-bottom: 12rpx;
				}

				.main-title {
					font-size: 56rpx;
					font-weight: bold;
					color: #fff;
					text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
				}
			}

			.integral-info {
				text-align: center;

				.value {
					font-size: 46rpx;
					font-weight: bold;
					color: #fff;
				}
			}
		}

		.notice-bar {
			margin: 30rpx 20rpx;
			background: #f0f0f0;
			border-radius: 50rpx;
			height: 70rpx;
			display: flex;
			align-items: center;
			padding: 0 25rpx;
			position: relative;
			overflow: hidden;

			.notice-icon {
				width: 50rpx;
				height: 50rpx;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.notice-content {
				flex: 1;
				position: relative;
				height: 100%;
				display: flex;
				align-items: center;
				overflow: hidden;

				&::before,
				&::after {
					content: '';
					position: absolute;
					top: 0;
					bottom: 0;
					width: 60rpx;
					z-index: 2;
				}

				&::before {
					left: 0;
					background: linear-gradient(90deg, #f0f0f0 20%, transparent);
				}

				&::after {
					right: 0;
					background: linear-gradient(270deg, #f0f0f0 20%, transparent);
				}
			}

			.notice-text {
				display: inline-flex;
				align-items: center;
				white-space: nowrap;
				animation: scroll 20s linear infinite;
				padding-left: 100%;

				text {
					margin-right: 50rpx;
					font-size: 26rpx;
					color: #000;
					font-weight: 500;
				}
			}

			.scrollable {
				animation: scroll 20s linear infinite;
			}

			@keyframes scroll {
				0% {
					transform: translateX(0);
				}

				100% {
					transform: translateX(-100%);
				}
			}
		}

		.rank-tabs {
			display: flex;
			justify-content: center;
			position: relative;

			.tab-item {
				position: relative;
				padding: 0 50rpx;
				height: 80rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				text {
					font-size: 34rpx;
					color: #666;
					position: relative;
					z-index: 1;
					transition: all 0.3s;
				}

				&.active {
					text {
						color: #000;
						font-weight: bold;
					}

					.tab-underline {
						width: 100%; // 与文字等宽
						height: 8rpx; // 高度控制
						position: absolute;
						bottom: 6rpx; // 微调位置
						left: 50%;
						transform: translateX(-50%);
						animation: underlineScale 0.3s ease;
					}
				}
			}
		}

		@keyframes underlineScale {
			0% {
				transform: translateX(-50%) scaleX(0);
			}

			100% {
				transform: translateX(-50%) scaleX(1);
			}
		}

		@keyframes iconScale {
			0% {
				transform: scale(0);
			}

			80% {
				transform: scale(1.2);
			}

			100% {
				transform: scale(1);
			}
		}

		.rank-main {
			background: #fff;
			border-radius: 20rpx;
			padding: 30rpx;

			.rank-header-row {
				display: flex;
				padding: 20rpx 0;
				border-bottom: 2rpx solid #eee;
				font-weight: bold;
				color: #333;
			}

			.rank-item {
				display: flex;
				align-items: center;
				padding: 30rpx 0;
				border-bottom: 2rpx solid #f5f5f5;

				.col-rank {
					max-width: 100rpx;
					min-width: 80rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					.medal-icon {
						width: 50rpx;
						height: 50rpx;
						animation: medalGlow 1.5s ease-in-out infinite;
					}

					text {
						font-size: 32rpx;
						color: #666;
					}
				}

				@keyframes medalGlow {

					0%,
					100% {
						filter: drop-shadow(0 0 8rpx rgba(255, 215, 0, 0.3));
						transform: scale(1);
					}

					50% {
						filter: drop-shadow(0 0 16rpx rgba(255, 215, 0, 0.6));
						transform: scale(1.05);
					}
				}
			}

			[class^="col-"] {
				flex: 1;
				text-align: center;
				font-size: 28rpx;
				front-weight: bold;

				&.col-user {
					flex: 2;
					text-align: left;
					padding-left: 30rpx;

				}

				&.col-rank {
					max-width: 100rpx;
				}
			}
		}

		.user-footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 140rpx;
			z-index: 100;

			.footer-bg {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				z-index: 1;
			}

			.user-info-container {
				position: relative;
				z-index: 2;
				height: 100%;
				display: flex;
				align-items: center;
				padding: 0 30rpx;

				.user-avatar {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					border: 4rpx solid rgba(255, 255, 255, 0.5);
					margin-right: 30rpx;
				}

				.user-center {
					flex: 1;

					.user-name {
						display: block;
						font-size: 32rpx;
						color: #000;
						margin-bottom: 12rpx;
					}

					.progress-info {
						font-size: 24rpx;
						color: rgba(0, 0, 0, 0.8);
					}
				}

				.score-section {
					min-width: 150rpx;
					text-align: right;

					.current-score {
						font-size: 44rpx;
						color: #000;
						font-weight: bold;
						text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
					}
				}
			}
		}

		.rule-button {
			position: fixed;
			right: 0rpx;
			top: 35%; // 垂直居中
			transform: translateY(-50%);
			z-index: 1000;

			background: #ed80a0;
			color: #fff;
			padding: 20rpx 30rpx;
			border-radius: 80rpx 0rpx 0rpx 80rpx;
			box-shadow: 0 8rpx 20rpx rgba(228, 57, 60, 0.3);
			font-size: 30rpx;

			display: flex;
			align-items: center;
			justify-content: center;

			&::after {
				content: '';
				position: absolute;
				width: 100%;
				height: 100%;
				border-radius: 80rpx 0rpx 0rpx 80rpx;
				left: 0;
				top: 0;
			}

			&:active {
				transform: translateY(-50%) scale(0.95);
				opacity: 0.9;
			}
		}
	}
</style>