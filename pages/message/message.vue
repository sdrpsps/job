<template>
	<view class="content">
		<view class="top">
			<view class="topMsgBox">
				<view class="left">
					<image src="../../static/image/组 18@2x.png" mode=""></image>
				</view>
				<view class="right">
					<view class="msg">
						<view class="title">热招新岗位</view>
						<view class="message">19个公司发布了新岗位</view>
					</view>
					<view class="arrow">
						<image src="../../static/image/right.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view class="msgList">
			<view class="item" v-for="item in messageList" :key="item._id" @click="gotoMessage(item._id)">
				<view class="left">
					<image :src="item.logoUrl"></image>
				</view>
				<view class="right">
					<view class="title">
						<view class="companyName">{{item.title}}</view>
						<view class="time">10:30</view>
					</view>
					<view class="msg">请问还在考虑新的工作机会吗？</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const myRequest = require("../../utils/request.js")
	const SiteConfig = require("../../config/site")
	export default {
		data() {
			return {
				messageList: [],
			}
		},
		methods: {
			gotoMessage(id) {
				uni.navigateTo({
					url: `../messagePage/messagePage?msgid=${id}`
				})
			},
			// 临时使用公司收藏列表数据
			async getMessageList() {
				if (!uni.getStorageSync(SiteConfig.CACHE_TOKEN)) {
					uni.showToast({
						icon: "error",
						title: "当前未登录!"
					})
					return;
				}
				let url = `company/company-fav-list`;
				let res = await myRequest({
					url,
					method: "post"
				})
				console.log("获取公司收藏列表", res.data)
				this.messageList = res.data.data.result;
			}
		},
		onShow() {
			this.getMessageList();

		}
	}
</script>

<style lang="less" scoped>
	page {
		background-color: #F4F4F4;
	}

	.content {
		// margin: 0 30rpx;
		padding: 0 30rpx;

		background-color: #fff;

		.top {
			padding: 30rpx 0;

			.topMsgBox {
				display: flex;
				align-items: center;
				padding: 30rpx;
				// margin: 30rpx;
				border-radius: 30rpx;
				box-shadow: 0px 0px 20px #E4EBF4;
				background-color: #fff;

				.left {
					border-radius: 50%;
					margin-right: 30rpx;

					image {
						border-radius: 50%;
						width: 80rpx;
						height: 80rpx;
					}
				}

				.right {
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;
					color: #333;

					.msg {


						.title {
							font-size: 34rpx;
							margin-bottom: 20rpx;
						}

						.message {
							font-size: 24rpx;
						}
					}

					.arrow {
						image {
							width: 28rpx;
							height: 28rpx;
						}
					}
				}
			}
		}

		.msgList {

			// background-color: #fff;
			.item {
				display: flex;
				align-items: center;
				padding: 30rpx 0;
				border-bottom: 1px solid #E5E5E5;

				.left {
					border-radius: 50%;
					margin-right: 30rpx;

					image {
						border-radius: 50%;
						border-radius: 50%;
						width: 80rpx;
						height: 80rpx;
					}
				}

				.right {
					display: flex;
					flex-direction: column;
					width: 100%;

					.title {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 20rpx;

						.companyName {
							font-size: 34rpx;
							color: #333;
						}

						.time {
							font-size: 18rpx;
							color: #999;
						}
					}

					.msg {
						font-size: 24rpx;
						color: #999;
					}
				}
			}

			.item:last-child {
				border-bottom: 0;
			}
		}

	}
</style>
