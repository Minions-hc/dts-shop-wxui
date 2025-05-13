<template>
	<view class="container">
		<!-- 初级魂力赏 -->
		<!-- 循环生成魂力赏卡片 -->
		<view class="card" v-for="(item, index) in soulPowerList" :key="index" @click="navigatorToBlindBox(item)">
			<!-- 上半部分：动态背景图+数值 -->
			<view class="top-section">
				<image class="desc-image" :src="soulImageurl[index]" mode="scaleToFill" />
				<view class="power-info">
					<text class="value">{{ item.price }}</text>
				</view>
			</view>

			<!-- 下半部分：动态产品图 -->
			<view class="bottom-section">
				<image class="cover-image" :src="item.seriesImage" mode="aspectFill" />
			</view>
		</view>
	</view>
</template>

<script>
import {
		get,
		post
	} from "@/utils/rest-util.js"

	export default {
		onLoad() {
			this.userId = 'U10001'
		},
		onShow() {
			this.getSpiritPowerSeries ()
		},
		data() {
			return {
				soulImageurl: [
					'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/basic.png', // 初级背景
					'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/intermediate.png', // 中级背景
					'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/advanced.png' // 高级背景
				],
				soulPowerList: [],
				userId: ''
			}
		},
		methods: {
			navigatorToBlindBox(item) {
				let blindBoxurl = '/subHome/blindBox/soulPower?userId='+this.userId+'&&seriesId=' + item.seriesId;
				uni.navigateTo({
					url: blindBoxurl
				})
			},
			getSpiritPowerSeries(){
				get('wx/series/getSpiritPowerSeries').then(json=>{
					const result = json.data?.data || [];
					this.soulPowerList = result
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 20rpx;
		background-image: url('https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/soulPower-bg.jpg');
	}

	.card {
		background: #fff;
		border-radius: 16rpx;
		margin-bottom: 30rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
	}

	.top-section {
		height: 80rpx; // 总高度约为卡片1/6（假设卡片总高480rpx）
		position: relative;
		text-align: center;
		padding-top: 10rpx;

		.desc-image {
			width: 95%;
			height: 100%;
		}

		.power-info {
			position: absolute;
			right: 90rpx;
			bottom: 16rpx;
			display: flex;
			align-items: baseline;
			padding: 6rpx 16rpx;
			border-radius: 40rpx;

			.label {
				font-size: 12rpx;
				color: #ccc;
			}

			.value {
				font-size: 28rpx;
				color: #fff;
				font-weight: bold;
				margin: 0 8rpx;
			}
		}
	}

	.bottom-section {
		width: 100%;
		height: 320rpx; // 保持原有高度基准
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 8rpx 0; // 实现98%高度（400*0.98=392rpx）

		.cover-image {
			width: 95%;
			// 下半部分占主要高度
			height: 98%;
			display: block;
			border-radius: 25rpx;
		}
	}
</style>