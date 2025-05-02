<template>
	<view class="container">
		<!-- 主标题 -->
		<view class="header">
			<text class="title">《Chill赏》一番赏说明</text>
		</view>

		<!-- 规则列表 -->
		<view class="rule-list">
			<view class="rule-item" v-for="(item, index) in rules" :key="index">
				<text class="rule-num">{{ item.num }}</text>
				<view class="rule-content">
					<text v-if="item.highlight" class="highlight">{{ item.highlight }}</text>
					{{ item.text }}
				</view>
			</view>
		</view>

		<!-- 重要提醒 -->
		<view class="warning-card">
			<text class="warning-icon">⚠</text>
			<text class="warning-text">介于盲盒、一番赏的特殊性，不支持退款\n请购买前充分知晓，谨慎消费</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rules: [{
						num: "1.1",
						text: "构成一个赏箱，包含最终赏及A-G等级赏品",
						highlight: "一番赏"
					},
					{
						num: "1.2",
						text: "款式数量详见配图，实时更新余量"
					},
					{
						num: "1.3",
						text: "单发/多发随机选取赏品，开赏获得对应等级"
					},
					{
						num: "1.4",
						text: "选择开赏方式后，赏品存入背包待发货"
					},
					{
						num: "1.5",
						text: "由赏箱最后一位开箱者获得（非随机）",
						highlight: "最终赏"
					},
					{
						num: "1.6",
						text: "满3件包邮（含任意商品），邮费12元"
					},
					{
						num: "1.7",
						text: "按订单时间7日内发货，预售订单单独标注"
					},
					{
						num: "1.8",
						text: "默认状态：拆盒未拆袋/未拆盒"
					},
					{
						num: "1.9",
						text: "隐藏款可能存在无卡情况"
					}
				]
			};
		}
	};
</script>

<style scoped>
	/* 基础容器 */
	.container {
		padding: 28rpx 32rpx;
		background: #ffffff;
	}

	/* 全局禁止复制 */
	.container,
	.container * {
		user-select: none;
		-webkit-user-select: none;
	}

	/* 主标题样式 */
	.title {
		display: block;
		font-size: 38rpx;
		color: #e63946;
		font-weight: 600;
		text-align: center;
		margin: 24rpx 0 48rpx;
		text-shadow: 0 2rpx 4rpx rgba(230, 57, 70, 0.1);
	}

	/* 规则条目 */
	.rule-list {
		border-bottom: 1rpx solid #f0f0f0;
		padding-bottom: 32rpx;
	}

	.rule-item {
		flex-direction: row;
		margin-bottom: 32rpx;
		align-items: flex-start;
	}

	.rule-num {
		width: 88rpx;
		color: #2a9d8f;
		font-size: 28rpx;
		font-weight: 500;
	}

	.rule-content {
		flex: 1;
		font-size: 28rpx;
		color: #333;
		line-height: 1.8;
	}

	.highlight {
		color: #e63946;
		font-weight: bold;
	}

	/* 警示模块 */
	.warning-card {
		margin-top: 48rpx;
		padding: 24rpx;
		background: #fff3cd;
		border-radius: 12rpx;
		border-left: 8rpx solid #ffc107;
		flex-direction: row;
		align-items: center;
	}

	.warning-icon {
		font-size: 36rpx;
		margin-right: 20rpx;
	}

	.warning-text {
		flex: 1;
		font-size: 26rpx;
		color: #856404;
		line-height: 1.6;
		white-space: pre-line;
	}

	/* 响应式适配 */
	@media (min-width: 768px) {
		.container {
			max-width: 750px;
			margin: 0 auto;
		}
	}
</style>