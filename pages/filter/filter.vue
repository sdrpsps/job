<template>
	<view class="content">
		<view class="navbar">
			<u-navbar title="筛选" leftIcon="close" :autoBack="true"></u-navbar>
		</view>
		<view class="item" v-for="(item,index) in 3" :key="index">
			<view class="title">行业</view>
			<view class="cats">
				<view class="items active">全部</view>
				<view class="items">互联网</view>
				<view class="items">游戏</view>
				<view class="items">全部</view>
				<view class="items">互联网</view>
				<view class="items">游戏</view>
				<view class="items">全部</view>
				<view class="items">互联网</view>
			</view>
		</view>
		<view class="btn">
			<u-button text="确定" type="success" shape="circle"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="less" scoped>
	.content {
		margin: 0 30rpx;
		.navbar{
			margin-bottom: 30rpx;
		}
		.item {
			margin-bottom: 60rpx;
			.title {
				font-size: 36rpx;
				font-weight: bolder;
				color: #333;
				margin-bottom: 30rpx;
			}

			.cats {
				display: flex;
				flex-wrap: wrap;

				.items {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 70rpx;
					width: 30%;
					font-size: 30rpx;
					margin-bottom: 20rpx;
					margin-right: 30rpx;
					border-radius: 15rpx;
					background-color: #f5f5f5;
				}
				.items:nth-child(3n){
					margin-right: 0;
				}
				.active{
					color: #149639;
					background-color: #fff;
					box-shadow:0 0 10px #DCEFE1;
				}
			}
		}
		.btn{
			border-top: 1px solid #e6e6e6;
			height: 97rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
