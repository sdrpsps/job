<template>
	<view class="content">
		<view class="search">
			<u-search placeholder="日照香炉生紫烟" v-model="keyword" @custom="addItemToHistory" :actionStyle="{
            color: '#CEE6C9',
			backgroundColor:'#149639',
			padding:'15rpx 7rpx',
			borderRadius: '30rpx'
			}"></u-search>
		</view>
		<view class="hot">
			<view class="title">
				热门搜索
			</view>
			<view class="item">
				<view class="items" v-for="items in hotList" :key="items._id">{{items.kw}}</view>
			</view>
		</view>
		<view class="history">
			<view class="title">
				历史记录
			</view>
			<view class="item">
				<view class="items" v-for="items in historyList" :key="items">{{items.kw}}</view>
			</view>
		</view>
		<view class="guess">
			<view class="title">
				猜你喜欢
			</view>
			<view class="item">
				<view class="items" v-for="items in guessList" :key="items._id">{{items.kw}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const myRequest = require("../../utils/request.js")
	export default {
		data() {
			return {
				keyword: "",
				hotList: [],
				historyList: [{kw:"互联网"}],
				guessList: [],
			}
		},
		methods: {
			// 获取热门搜索
			async getHot() {
				try {
					let url = `company/history-hot`;
					let res = await myRequest({
						url,
						methods: "get",
						data: {}
					})
					console.log("热门搜索", res.data)
					this.hotList = res.data.data;
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}
			},
			// 猜你喜欢
			async getGuess() {
				try {
					let url = `company/history-guess`;
					let res = await myRequest({
						url,
						methods: "get",
						data: {}
					})
					console.log("猜你喜欢", res.data)
					this.guessList = res.data.data;
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}
			},
			// 添加到历史记录
			addItemToHistory() {
				if(!this.keyword){
					uni.showToast({
						icon:"error",
						title:"搜索内容不能为空"
					})
					return;
				}
				this.historyList.push({
					kw: this.keyword
				})
				this.keyword = "";
			},
			// 返回
			back(){
				uni.navigateBack({
					delta: 1
				});
			},
		},
		onLoad() {
			this.getHot();
			this.getGuess();
		}
	}
</script>

<style lang="less" scoped>
	.content {
		margin: 0 30rpx;
		
		.search{
			padding-top: 25rpx;
		}

		.hot {
			margin-top: 40rpx;

			.title {
				font-weight: bolder;
				font-size: 36rpx;
				color: #333;
			}

			.item {
				display: flex;
				flex-wrap: wrap;
				font-size: 24rpx;
				color: #333;

				.items {
					padding: 19rpx 26rpx;
					background-color: #f4f4f4;
					margin: 30rpx 30rpx 30rpx 0;
					border-radius: 20rpx;
				}
			}
		}

		.history {
			margin-top: 30rpx;

			.title {
				font-weight: bolder;
				font-size: 36rpx;
				color: #333;
			}

			.item {
				display: flex;
				flex-wrap: wrap;
				font-size: 24rpx;
				color: #333;

				.items {
					padding: 19rpx 26rpx;
					background-color: #f4f4f4;
					margin: 30rpx 30rpx 30rpx 0;
					border-radius: 20rpx;
				}
			}
		}

		.guess {
			margin-top: 30rpx;

			.title {
				font-weight: bolder;
				font-size: 36rpx;
				color: #333;
			}

			.item {
				display: flex;
				flex-wrap: wrap;
				font-size: 24rpx;
				color: #333;

				.items {
					padding: 19rpx 26rpx;
					background-color: #f4f4f4;
					margin: 30rpx 30rpx 30rpx 0;
					border-radius: 20rpx;
				}
			}
		}
	}
</style>
