<template>
	<view class="content">
		<view class="resume">
			<view class="userInfo">
				<view class="left">
					<view class="username">
						<view class="name">
							{{userInfo.name}}
						</view>
						<view class="icon">
							<u-icon name="edit-pen"></u-icon>
						</view>
					</view>
					<view class="other">
						3年工作经验 · 25岁 · 本科
					</view>
				</view>
				<view class="right">
					<image :src="'https://yw.52kfw.cn/' + userInfo.imageUrl" mode=""></image>
				</view>
			</view>
			<view class="advantage">
				<view class="top">
					<view class="title">
						个人优势
					</view>
					<view class="icon">
						<u-icon name="edit-pen"></u-icon>
					</view>
				</view>
				<view class="bottom">
					有什么个人优势呢
				</view>
			</view>
			<view class="expectations">
				<view class="top">
					<view class="title">
						求职期望
					</view>
					<view class="icon">
						<u-icon name="edit-pen"></u-icon>
					</view>
				</view>
				<view class="bottom">
					***职业 15～20K
				</view>
			</view>
			<view class="experience">
				<view class="top">
					<view class="title">
						工作经历
					</view>
					<view class="icon">
						<u-icon name="edit-pen"></u-icon>
					</view>
				</view>
				<view class="bottom">

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const SiteConfig = require("../../config/site")
	export default {
		data() {
			return {
				userInfo: {},
			};
		},
		methods: {

		},
		onLoad() {
			this.userInfo = JSON.parse(uni.getStorageSync(SiteConfig.CACHE_USERINFO))
		}
	}
</script>

<style lang="less" scoped>
	.content {
		margin: 0 30rpx;

		.resume {
			.userInfo {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 40rpx;
				border-bottom: 1px solid #f4f4f4;

				.left {
					.username {
						display: flex;
						align-items: center;
						margin-bottom: 30rpx;

						.name {
							font-size: 40rpx;
							color: #333;
						}

						.icon {
							margin-left: 20rpx;
						}
					}

					.other {
						font-size: 24rpx;
						color: #333;
					}
				}

				.right {
					border-radius: 50%;
					box-shadow: 0px 0px 10px;

					image {
						width: 140rpx;
						height: 140rpx;
						border-radius: 50%;
					}
				}
			}

			.advantage {
				padding-bottom: 40rpx;
				border-bottom: 1px solid #f4f4f4;

				.top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 40rpx 0;

					.title {
						font-size: 30rpx;
						font-weight: bolder;
						color: 333;
					}
				}

				.bottom {
					font-size:20rpx;
				}
			}
			.expectations {
				padding-bottom: 40rpx;
				border-bottom: 1px solid #f4f4f4;
			
				.top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 40rpx 0;
			
					.title {
						font-size: 30rpx;
						font-weight: bolder;
						color: 333;
					}
				}
			
				.bottom {
					font-size:20rpx;
				}
			}
			.experience {
				padding-bottom: 40rpx;
				border-bottom: 1px solid #f4f4f4;
			
				.top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin: 40rpx 0;
			
					.title {
						font-size: 30rpx;
						font-weight: bolder;
						color: 333;
					}
				}
			
				.bottom {
					font-size:20rpx;
				}
			}
		}
	}
</style>
