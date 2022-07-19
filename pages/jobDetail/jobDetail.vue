<template>
	<view class="content">
		<view class="navbar">
			<u-navbar title="职位详情" bgColor="#149639" leftIconColor="#fff" :placeholder="true" titleStyle="color:#fff">
				<view class="u-nav-slot" slot="left">
					<u-icon name="arrow-left" size="20" color="#fff" @click="goBack"></u-icon>
					<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
					<u-icon :name="iconName" color="#fff" size="20" @click="jobLike(workID)"></u-icon>
				</view>
			</u-navbar>
		</view>
		<view class="jobDetail">
			<view class="jobBox">
				<view class="top">
					<view class="jobName">
						{{workDetail.title}}
					</view>
					<view class="salary">
						{{workDetail.salary}}
					</view>
				</view>
				<view class="mid">
					<view class="info">
						{{workDetail.workAddress}} | {{workDetail.workRange}} | {{workDetail.education}}
					</view>
					<view class="welfare">
						<view class="welfareItem" v-for="(items,index) in workDetail.welfare" :key="index">
							{{items}}
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="companyInfo" v-for="(items,index) in workDetail.companyInfo" :key="index">
						<view class="left">
							<image :src="items.logoUrl" shape="circle"></image>
						</view>
						<view class="right">
							<view class="companyName">
								{{items.title}}
							</view>
							<view class="company">
								{{items.companyType}} | {{items.companyNumber}}
							</view>
						</view>
					</view>
					
				</view>
			</view>
			<view class="jobInfo">
				<view class="title">
					职位详情
				</view>
				<view :class="jobInfoClassName">
					<view v-for="(item,index) in workDetail.description" :key="index">
						{{item.title}}
					</view>
				</view>
				<view class="btn">
					<text @click="changeJobInfoStatus">{{jobInfoStatus?"点击收起":"点击查看更多"}}</text>
				</view>
			</view>
			<view class="jobRequest">
				<view class="title">
					任职资格
				</view>
				<view :class="jobRequestClassName">
					<view v-for="(item,index) in workDetail.works" :key="index">
						{{item.title}}
					</view>
				</view>

				<view class="btn">
					<text @click="changeJobRequestInfoStatus">{{jobRequestStatus?"点击收起":"点击查看更多"}}</text>
				</view>
			</view>
		</view>
		<view class="talkBtn">
			<view class="inside safe-padding">
				<u-button type="success" text="立即沟通" shape="circle" @click="gotoMessage(workDetail._id)"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	const myRequest = require("../../utils/request.js")
	const SiteConfig = require("../../config/site.js")
	export default {
		data() {
			return {
				workID: "",
				workDetail: {},
				jobInfoStatus: false,
				jobInfoClassName: "itemHide",
				jobRequestStatus: false,
				jobRequestClassName: "itemHide",
				iconName: "star",
				like: false,
				likeList: [],
			}
		},
		methods: {
			// 返回
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 获取岗位详情
			async getJobDetail() {
				try {
					let url = `company/work-info`;
					let res = await myRequest({
						url,
						methods: "get",
						data: {
							workid: this.workID
						}
					})
					console.log("获取岗位详情", res.data);
					this.workDetail = res.data.data;
				} catch (e) {
					console.log(e);
				}
			},
			// 点击切换职位详情
			changeJobInfoStatus() {
				this.jobInfoStatus = !this.jobInfoStatus;
				this.jobInfoClassName == "itemHide" ? this.jobInfoClassName = "itemShow" : this.jobInfoClassName =
					"itemHide";

			},
			// 点击切换任职资格
			changeJobRequestInfoStatus() {
				this.jobRequestStatus = !this.jobRequestStatus;
				this.jobRequestClassName == "itemHide" ? this.jobRequestClassName = "itemShow" : this.jobRequestClassName =
					"itemHide";
			},
			// 获取收藏列表,并判断是否已收藏
			async getLikeList() {
				// 没有登录时不执行
				if (!uni.getStorageSync(SiteConfig.CACHE_TOKEN)) {
					return;
				}
				let url = `company/company-work-fav-list`;
				let res = await myRequest({
					url,
					method: "post",
				})
				console.log("获取收藏列表", res.data);

				res.data.data.result.forEach((item) => {
					if (item._id) {
						this.likeList.push(item._id)
					}
				})

				// 判断是否已收藏
				if (this.likeList.indexOf(this.workID) == -1) {
					console.log("未收藏");
					this.like = false;
					this.isLike();
				} else {
					console.log("已收藏");
					this.like = true;
					this.isLike();
				}
			},
			// 收藏和取消收藏职务
			async jobLike(id) {
				if (this.like) {
					// 如果获取收藏状态为true的时候，执行取消收藏
					let url = `company/company-work-fav-remove`;
					let res = await myRequest({
						url,
						method: "POST",
						data: {
							workid: this.workID
						}
					})
					console.log("取消收藏情况", res.data);
					if (res.data.statusCode == 200) {
						// 修改like状态
						this.like = false;
						// 修改收藏图标
						this.isLike();
						uni.showToast({
							title: "取消收藏成功！",
							icon: "success"
						});
					} else if (res.data.statusCode == 400) {
						uni.showToast({
							title: "请先登录！",
							icon: "error"
						})
					} else {
						uni.showToast({
							title: "系统繁忙！",
							icon: "error"
						})
					}
				} else {
					// 如果获取收藏状态为false的时候，执行收藏
					let url = `company/company-work-fav-add`;
					let res = await myRequest({
						url,
						method: "POST",
						data: {
							workid: this.workID
						}
					})
					console.log("收藏情况", res.data)
					if (res.data.statusCode == 200) {
						// 修改like状态
						this.like = true;
						// 修改收藏图标
						this.isLike();
						uni.showToast({
							title: "收藏成功！",
							icon: "success"
						});
					} else if (res.data.statusCode == 403) {
						uni.showToast({
							title: "请先登录！",
							icon: "error"
						})
					} else {
						uni.showToast({
							title: "系统繁忙！",
							icon: "error"
						})
					}
				}
			},
			// 修改收藏图标
			isLike() {
				if (this.like) {
					this.iconName = 'star-fill';
				} else {
					this.iconName = 'star';
				}
			},
			// 跳转到聊天
			gotoMessage(id){
				if(!uni.getStorageSync(SiteConfig.CACHE_TOKEN)){
					uni.showToast({
						icon:'error',
						title:"请先登录！"
					})
					return;
				}
				uni.navigateTo({
					url:`/pages/messagePage/messagePage?workid=${id}`
				})
			},
		},
		onLoad(option) {
			this.workID = option.workid;
			this.getJobDetail();
			this.getLikeList();
		}
	}
</script>

<style lang="less" scoped>
	.safe-padding {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: content-box;
	}

	.content {
		.navbar {
			color: #fff;

			.u-nav-slot {
				display: flex;
				align-items: center;
				border: 1px solid #fff;
				border-radius: 20px;
				padding: 3px 7px;
			}
		}

		.jobDetail {
			margin: 0 30rpx;
			padding-bottom: 97rpx;

			.jobBox {
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

			.jobInfo {
				padding-bottom: 50rpx;
				border-bottom: 1px solid #F4F4F4;

				.title {
					font-size: 30rpx;
					font-weight: bold;
					color: #333;
					margin: 40rpx 0;
				}

				.itemHide {
					font-size: 24rpx;
					font-weight: normal;
					color: #666;
					line-height: 60rpx;
					height: 120rpx;
					overflow: hidden;
				}

				.itemShow {
					font-size: 24rpx;
					font-weight: normal;
					color: #666;
					line-height: 60rpx;
					height: auto;
				}

				.btn {
					color: #149639;
					font-size: 24rpx;

				}
			}

			.jobRequest {
				padding-bottom: 50rpx;

				.title {
					font-size: 30rpx;
					font-weight: bold;
					color: #333;
					margin: 40rpx 0;
				}

				.itemHide {
					font-size: 24rpx;
					font-weight: normal;
					color: #666;
					line-height: 60rpx;
					height: 120rpx;
					overflow: hidden;
				}

				.itemShow {
					font-size: 24rpx;
					font-weight: normal;
					color: #666;
					line-height: 60rpx;
					height: auto;
				}

				.btn {
					color: #149639;
					font-size: 24rpx;

				}
			}

		}

		.talkBtn {
			position: fixed;
			bottom: 0;
			width: 100%;
			background-color: #fff;

			.inside {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 97rpx;
				border-top: 1px solid #F4F4F4;
				margin: 0 30rpx;
			}
		}
	}
</style>
