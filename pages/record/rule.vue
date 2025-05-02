<template>
	<view class="container">
		<view class="rule-section no-copy">
			<text class="section-title">排行奖励规则</text>

			<view class="rule-item">
				<text class="rule-label">排行榜规则：</text>
				<text class="rule-content">
					A赏=10分，B赏=1分，系统将按得分排定名次，得分高者名次列前
					（如得分并列，则按照达成该得分的先后顺序进行排列），
					所获得积分可用于一番赏抽赏时抵扣。
				</text>
			</view>

			<text class="section-title">奖池分配规则说明：</text>

			<view class="pool-rules">
				<text class="notice-text">当月的奖池将会在次月的一号进行发放，具体发放比例如下：</text>

				<!-- 奖池分配比例列表 -->
				<view class="pool-list">
					<view class="pool-item" v-for="(item,index) in poolList" :key="index">
						<text class="rank">{{ item.rank }}</text>
						<text class="percentage">{{ item.percentage }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				poolList: [{
						rank: "第一名",
						percentage: "35.00%"
					},
					{
						rank: "第二名",
						percentage: "25.00%"
					},
					{
						rank: "第三名",
						percentage: "20.00%"
					},
					{
						rank: "第四名",
						percentage: "7.00%"
					},
					{
						rank: "第五名",
						percentage: "5.00%"
					},
					{
						rank: "第六名",
						percentage: "2.00%"
					},
					{
						rank: "第七名",
						percentage: "2.00%"
					},
					{
						rank: "第八名",
						percentage: "2.00%"
					},
					{
						rank: "第九名",
						percentage: "1.00%"
					},
					{
						rank: "第十名",
						percentage: "1.00%"
					}
				]
			}
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
		background: #fff;
	}

	.no-copy {
		-webkit-user-select: none;
		user-select: none;
	}

	.section-title {
		display: block;
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
		margin: 40rpx 0 20rpx;
		padding-left: 15rpx;
		border-left: 8rpx solid #ffd700;
	}

	.rule-item {
		margin: 25rpx 0;
	}

	.rule-label {
		font-size: 30rpx;
		color: #666;
		font-weight: 500;
	}

	.rule-content {
		display: block;
		font-size: 28rpx;
		color: #444;
		line-height: 1.8;
		margin-top: 15rpx;
	}

	.pool-rules {
		background: #f8f9fa;
		border-radius: 16rpx;
		padding: 25rpx;
		margin-top: 20rpx;
	}

	.notice-text {
		display: block;
		font-size: 28rpx;
		color: #666;
		margin-bottom: 30rpx;
	}

	.pool-list {
		background: #fff;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.pool-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: 1rpx solid #eee;
	}

	.pool-item:last-child {
		border-bottom: none;
	}

	.rank {
		font-size: 28rpx;
		color: #333;
	}

	.percentage {
		font-size: 28rpx;
		color: #e4393c;
		font-weight: bold;
	}
</style>