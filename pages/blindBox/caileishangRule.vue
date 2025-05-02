<template>
	<view class="container">
		<!-- 主标题 -->
		<view class="header">
			<text class="title">《Chill赏》踩雷赏说明</text>
		</view>

		<!-- 规则正文 -->
		<view class="rule-section">
			<view class="rule-item" v-for="(item, index) in rules" :key="index">
				<text class="rule-num">{{ item.num }}.</text>
				<text class="rule-content">
					<text v-if="item.bold" class="bold-text">{{ item.bold }}</text>
					{{ item.text }}
				</text>
			</view>
		</view>

		<!-- 重要提醒 -->
		<view class="warning-box">
			<text class="warning-title">❗ 慎重提醒</text>
			<text class="warning-content">介于盲盒、抽赏的特殊性，不支持退款，请购买前充分知晓，请谨慎消费。</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rules: [{
						num: '1.1',
						bold: '踩雷赏',
						text: '构成一个赏箱，每个赏箱包含最终赏及A-G等级赏品'
					},
					{
						num: '1.2',
						text: '赏箱款式、数量详见配图介绍，页面实时更新余量'
					},
					{
						num: '1.3',
						text: '购买后赏品存入背包等待发货'
					},
					{
						num: '1.4',
						bold: '最终赏',
						text: '由赏箱最后一位开箱者获得（非随机抽取）'
					},
					{
						num: '1.5',
						text: '满3件包邮（含任意商品），邮费12元'
					},
					{
						num: '1.6',
						text: '按订单时间7日内发货，预售订单单独标注'
					},
					{
						num: '1.7',
						text: '默认状态："拆盒未拆袋"或"未拆盒"'
					},
					{
						num: '1.8',
						text: '兑换类隐藏款可能存在无卡情况'
					},
					{
						num: '1.9',
						bold: '踩雷赏',
						text: '价格随剩余数量动态变化'
					}
				]
			}
		}
	}
</script>

<style scoped>
	/* 基础容器 */
	.container {
		padding: 28rpx 32rpx;
		background: #fff;
	}

	/* 禁止复制 */
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
		font-weight: bold;
		text-align: center;
		margin-bottom: 48rpx;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	}

	/* 规则条目容器 */
	.rule-section {
		border-bottom: 1rpx solid #eee;
		padding-bottom: 32rpx;
	}

	/* 单条规则样式 */
	.rule-item {
		flex-direction: row;
		margin-bottom: 24rpx;
		align-items: flex-start;
	}

	.rule-num {
		color: #2a9d8f;
		font-size: 28rpx;
		width: 80rpx;
		flex-shrink: 0;
	}

	.rule-content {
		font-size: 28rpx;
		color: #333;
		line-height: 1.8;
		flex: 1;
	}

	.bold-text {
		font-weight: bold;
		color: #e63946;
	}

	/* 警告模块 */
	.warning-box {
		margin-top: 40rpx;
		padding: 32rpx;
		background: #fff3cd;
		border-radius: 12rpx;
		border-left: 8rpx solid #ffc107;
	}

	.warning-title {
		display: block;
		font-size: 30rpx;
		color: #856404;
		font-weight: bold;
		margin-bottom: 16rpx;
	}

	.warning-content {
		font-size: 26rpx;
		color: #856404;
		line-height: 1.6;
	}
</style>