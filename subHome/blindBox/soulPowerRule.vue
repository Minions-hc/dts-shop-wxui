<template>
	<view class="container">
		<!-- 规则内容区域 -->
		<view class="rule-content">
			<view class="title">《Chill赏》魂力赏玩法</view>

			<!-- 规则列表 -->
			<view class="rule-list">
				<view class="rule-item">1.1、魂力赏有别于一番赏，魂力赏中只有A赏；</view>
				<view class="rule-item">1.2、魂力赏只能通过消耗“魂力”抽取；</view>
				<view class="rule-item">1.3、当在一番赏中抽取到C-G赏时会获得魂力；</view>
				<view class="rule-item">1.4、单发或多发随机开赏获取相应赏品；</view>
				<view class="rule-item">1.5、选中开赏方式，开赏得到赏品后，赏品将会放入背包等待用户发货；</view>
				<view class="rule-item">1.6、部分特殊的派对赏赠品，每满3个商品即可享受包邮（包括其任意商品在内），邮费12元；</view>
				<view class="rule-item">1.7、我们根据订单时间顺序来发货，发货时间为3-10天以内发货，预售订单会有预售发货时间提示；</view>
				<view class="rule-item">1.8、获得的赏品默认为“拆盒未拆袋”或“未拆盒”；</view>
				<view class="rule-item">1.9、兑换类型的隐藏款可能会存在无卡的情况。</view>
			</view>

			<!-- 重点提醒 -->
			<view class="warning-box">
				<text class="warning-title">慎重提醒：</text>
				<text class="warning-text">
					盲盒抽奖活动具有一定的概率性，不支持七天无理由退货，请谨慎消费，未成年禁止在平台消费
				</text>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
	.container {
		padding: 40rpx 30rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
		/* 禁止长按复制 */
		user-select: none;
		-webkit-user-select: none;
	}

	.rule-content {
		background: #fff;
		border-radius: 16rpx;
		padding: 40rpx 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);

		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 40rpx;
			text-align: center;
		}

		.rule-list {
			.rule-item {
				font-size: 28rpx;
				color: #666;
				line-height: 1.8;
				margin-bottom: 30rpx;
				padding-left: 20rpx;
				position: relative;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 12rpx;
					width: 8rpx;
					height: 8rpx;
					background: #666;
					border-radius: 50%;
				}
			}
		}

		.warning-box {
			background: #fff9f9;
			border-left: 8rpx solid #ff4c4c;
			padding: 30rpx;
			margin-top: 40rpx;
			border-radius: 8rpx;

			.warning-title {
				display: block;
				font-size: 30rpx;
				color: #ff4c4c;
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.warning-text {
				font-size: 26rpx;
				color: #ff4c4c;
				line-height: 1.6;
			}
		}
	}
</style>