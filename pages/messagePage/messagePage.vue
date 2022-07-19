<template>
	<view class="content">
		<view class="jobBox">
			<!-- 职位收藏 -->
			<view class="item">
				<view class="top">
					<view class="jobName">
						{{jobDetail.title}}
					</view>
					<view class="salary">
						{{jobDetail.salary}}
					</view>
				</view>
				<view class="mid">
					<view class="info">
						{{jobDetail.workAddress}} | {{jobDetail.workRange}} | {{jobDetail.education}}
					</view>
					<view class="welfare">
						<view class="welfareItem" v-for="(items,index) in jobDetail.welfare" :key="index">
							{{items}}
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="talkInfo">
						8月8日 13：29 向你发起沟通
					</view>
					<view class="btn">
						<u-button type="success" :plain="true" text="投递简历" @click="sendResume"></u-button>
					</view>
				</view>
			</view>
		</view>
		<view class="message">
			<view class="in">
				<view class="avatar">
					<u-avatar src="userInfo.imageUrl" size="60rpx"></u-avatar>
				</view>
				<view class="text">您好，请问您还在找工作吗？</view>
			</view>
			<view class="out">
				<view class="avatar">
					<u-avatar :src="userInfo.imageUrl" size="60rpx"></u-avatar>
				</view>
				<view class="text">是的</view>
			</view>
			<view class="out" v-for="item in messageList" :key="item">
				<view class="avatar">
					<u-avatar :src="userInfo.imageUrl" size="60rpx"></u-avatar>
				</view>
				<view class="text">
					{{item}}
				</view>
			</view>
		</view>
		<view class="input safe-padding" style="margin-top: 15px;">
			<u-input placeholder="请输入" v-model="msg">
				<template slot="suffix">
					<u-button @tap="sendMessage" text="发送" type="success" size="mini"></u-button>
				</template>
			</u-input>

		</view>
	</view>
</template>

<script>
	const myRequest = require("../../utils/request.js")
	const SiteConfig = require("../../config/site")
	export default {
		data() {
			return {
				workID: "",
				resumeList: [],
				jobDetail: {},
				msg: "",
				messageList: [],
				userInfo: {},
			};
		},
		methods: {
			// 获取岗位信息
			async getJobDetail() {
				let url = "company/work-info";
				let res = await myRequest({
					url,
					method: "get",
					data: {
						workid: this.workID || this.msgID
					}
				})
				console.log("获取岗位详情", res.data);
				this.jobDetail = res.data.data;
			},
			// 发送消息
			async sendMessage() {
				if(this.msg == ""){
					uni.showToast({
						icon:"error",
						title:"内容不能为空！"
					})
					return;
				}
				this.messageList.push(this.msg);
				this.msg = "";
			},
			// 简历投递
			async sendResume() {
				let url = "company/company-resume-post";
				let res = await myRequest({
					url,
					method: "post",
					data: {
						resumeUrl: this.resumeList.slice(-1)[0],
						workid: this.workID
					}
				})
				console.log("投递简历", res.data);
				if (res.data.statusCode == -1) {
					uni.showToast({
						icon: "error",
						title: "该岗位已投递",
						duration: 2000
					})
				} else if (res.data.statusCode == 200) {
					uni.showToast({
						icon: "success",
						title: "投递成功",
						duration: 2000
					})
				} else {
					uni.showToast({
						icon: "error",
						title: "网络繁忙",
						duration: 2000
					})
				}
			},
			// 获取简历
			async getResumeList() {
				let url = "company/company-resume-list";
				let res = await myRequest({
					url,
					method: "post"
				});
				console.log("简历列表", res.data);
				this.resumeList = res.data.data.result;
			}

		},
		onLoad(option) {
			this.workID = option.workid;
			this.getJobDetail();
			this.userInfo = JSON.parse(uni.getStorageSync(SiteConfig.CACHE_USERINFO))
			this.getResumeList();
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F4F4F4;
	}

	.safe-padding {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: content-box;
	}

	.content {
		.jobBox {
			.item {
				display: flex;
				flex-direction: column;
				margin: 30rpx;
				padding: 20rpx 20rpx 0 20rpx;
				border-radius: 20rpx;
				box-shadow: 0px 0px 20px #D9EEDF;
				background-color: #fff;

				.top {
					display: flex;
					justify-content: space-between;
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
					border-bottom: 1px solid #F4F4F4;

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
					padding: 30rpx 0;

					.talkInfo {
						font-size: 24rpx;
						color: #333;
					}

					.btn {}
				}
			}
		}

		.message {
			margin: 0 30rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: calc(env(safe-area-inset-bottom) + 80rpx);

			.in {
				display: flex;
				align-items: center;
				padding-bottom: 30rpx;

				.avatar {
					margin-right: 30rpx;
				}

				.text {
					background-color: #fff;
					font-size: 26rpx;
					color: #333;
					padding: 25rpx;
					border-radius: 30rpx;
				}
			}

			.out {
				display: flex;
				align-items: center;
				flex-direction: row-reverse;
				padding-bottom: 30rpx;

				.avatar {
					margin-left: 30rpx;
				}

				.text {
					background-color: #fff;
					font-size: 26rpx;
					color: #333;
					padding: 25rpx;
					border-radius: 30rpx;
				}
			}

		}

		.input {
			background-color: #fff;
			width: 100%;
			position: fixed;
			bottom: 0;
		}
	}
</style>
