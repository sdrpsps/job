<template>
	<view class="content">
		<view class="sent">
			<view class="item" v-for="item in sentList" :key="item.workid" @click="gotoJobDetail(item.workid)">
				<view class="top">
					<view class="jobName">
						{{item.workInfo.title}}
					</view>
					<view class="salary">
						{{item.workInfo.salary}}
					</view>
				</view>
				<view class="mid">
					<view class="info">
						{{item.workInfo.workAddress}} | {{item.workInfo.workRange}} | {{item.workInfo.education}}
					</view>
					<view class="welfare">
						<view class="welfareItem" v-for="(items,index) in item.workInfo.welfare" :key="index">
							{{items}}
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="companyInfo">
						<view class="left">
							<image :src="item.companyInfo.logoUrl" shape="circle"></image>
						</view>
						<view class="right">
							<view class="companyName">
								{{item.companyInfo.title}}
							</view>
							<view class="company">
								{{item.companyInfo.companyType}} | {{item.companyInfo.companyNumber}}
							</view>
						</view>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const myRequest = require("../../utils/request.js")
	export default {
		data() {
			return {
				sentList: [],
			};
		},
		onLoad() {
			this.getSentList();
		},
		methods: {
			async getSentList() {
				let url = "company/company-resume-post-list";
				let res = await myRequest({
					url,
					method: "post",
				});
				console.log("已投递简历", res);
				this.sentList = res.data.data.result;
			},
			gotoJobDetail(id){
				uni.redirectTo({
					url:`/pages/jobDetail/jobDetail?workid=${id}`
				})
			}
		},

	}
</script>

<style lang="less">
	.content {
		margin: 0 30rpx;
		.sent {
			.item {
				display: flex;
				flex-direction: column;
				padding: 20rpx;
				margin-top: 28rpx;
				border-radius: 20rpx;
				box-shadow: 0px 0px 10px #D8E2EF;

				.top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 36rpx;

					.jobName {
						color: #333;
						margin-bottom: 20rpx;
					}

					.salary {
						color: #149639;
					}
				}

				.mid {
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					font-size: 20rpx;
					color: #333;

					.info {
						margin-bottom: 20rpx;
					}

					.welfare {
						display: flex;
						margin-bottom: 30rpx;

						.welfareItem {
							padding: 8rpx 16rpx;
							margin-right: 10rpx;
							border-radius: 10rpx;
							background-color: #F4F4F4;
						}
					}
				}

				.bottom {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 30rpx;

					.companyInfo {
						display: flex;
						align-items: center;

						.left {
							margin-right: 14rpx;

							image {
								width: 60rpx;
								height: 60rpx;
							}
						}

						.right {
							display: flex;
							flex-direction: column;
							color: #333;

							.companyName {
								font-size: 24rpx;
							}

							.company {
								font-size: 18rpx;
							}
						}
					}

					.btn {
						height: 50rpx;
					}
				}
			}
		}
	}
</style>
