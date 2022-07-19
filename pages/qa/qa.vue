<template>
	<view class="content">
		<view class="faq" v-for="ele in list" :key="ele._id">
			<view class="title">
				<text>问</text>：{{ele.title}}
			</view>
			<view class="shortCut">
				<text></text> {{ele.shortCut}}
			</view>
		</view>
	</view>
</template>

<script>
	const myRequest = require("../../utils/request.js")
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad() {
			this.getlist();
		},
		methods: {
			async getlist() {
				try {
					let url = 'company/company-faq'
					let info = await myRequest({
						url,
					})
					console.log(info);
					if (info.data.statusCode == 200) {
						this.list = info.data.data.list;
					}
				} catch (e) {
					//TODO handle the exception
				}

			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		padding: 30rpx 30rpx;
		background-color: #f6f6f6;
	}

	.faq {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 30rpx;
		border-radius: 30rpx;

		.title {
			font-size: 40rpx;
			margin-bottom: 20rpx;
		}

		.shortCut {
			font-size: 30rpx;

			text {
				font-size: 40rpx;
			}
		}
	}
</style>
