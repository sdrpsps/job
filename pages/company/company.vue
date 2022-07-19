<template>
	<view class="content">
		<view class="header">
			<view class="title">公司</view>
			<view class="search" @click="gotoSearch">
				<u-search placeholder="日照香炉生紫烟" v-model="keyword" :showAction="false"></u-search>
			</view>
		</view>
		<view class="company">
			<view class="item" v-for="item in companyList" :key="item._id" @click="gotoCompanyDetail(item._id)">
				<view class="top">
					<view class="companyInfo">
						<view class="left">
							<image :src="item.logoUrl" shape="circle"></image>
						</view>
						<view class="right">
							<view class="companyName">
								{{item.title}}
							</view>
							<view class="companyInfos">
								{{item.companyType}} | {{item.companyNumber}}
							</view>
							<view class="welfare">
								<view class="welfareItem" v-for="(items,index) in item.welfare" :key="index">
									{{items.title}}
								</view>
							</view>
							<view class="hot">
								<view class="hotInfo">
									<text>热招：</text>
									<text class="workName">{{item.workInfo[0].title}}</text>
									<text>等{{item.workInfo.length}}个岗位</text>
								</view>
								<view class="arrow">
									<image class="arrowIMG" src="../../static/image/right.png" mode=""></image>
								</view>
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
				companyList: [],
				keyword: "",
				page: 1,
				size: 5,
				total: 0,
			}
		},
		methods: {
			// 获取公司列表
			async getCompanyList() {
				try {
					let url = `company/company-list`;
					let res = await myRequest({
						url,
						method: "get",
						data: {
							page: this.page,
							size: this.size
						}
					});
					console.log("公司列表", res);
					this.companyList = [...this.companyList, ...res.data.data.list];
					this.total = res.data.data.total;
				} catch (e) {
					console.log(e)
				}
			},
			// 跳转公司详情
			gotoCompanyDetail(id) {
				uni.navigateTo({
					url: `/pages/companyDetail/companyDetail?companyid=${id}`
				})
			},
			// 跳转到搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: `/pages/search/search`
				})
			},
		},
		onLoad() {
			this.getCompanyList();
		},
		// 下拉刷新
		onReachBottom() {
			if (this.companyList.length == this.total) {
				uni.showToast({
					title: "没有更多数据了",
					icon: 'error'
				});
				return;
			} else {
				this.page++;
				this.getCompanyList();
			}
		}

	}
</script>

<style lang="less" scoped>
	.content {
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 110rpx;
			background-color: #149639;

			.title {
				font-size: 38rpx;
				color: #fff;
				margin-left: 30rpx;
			}

			.search {
				width: 80%;
				margin-right: 15rpx;
			}
		}

		.company {
			margin: 0 30rpx;
			padding-bottom: 10rpx;


			.item {
				margin: 30rpx 0;
				border-radius: 20rpx;
				box-shadow: 0px 0px 20px #DBEFE1;


				.top {
					padding-top: 40rpx;

					.companyInfo {
						display: flex;

						.left {
							margin-right: 19rpx;

							image {
								margin-left: 32rpx;
								width: 80rpx;
								height: 80rpx;
								border-radius: 20rpx;
							}
						}

						.right {

							display: flex;
							flex-direction: column;
							color: #333;
							width: 100%;
							margin-right: 30rpx;

							.companyName {
								font-size: 36rpx;
								padding-bottom: 20rpx;
							}

							.companyInfos {
								font-size: 20rpx;
								padding-bottom: 20rpx;
							}

							.welfare {
								display: flex;
								font-size: 20rpx;
								padding-bottom: 30rpx;
								border-bottom: 1px solid #F4F4F4;

								.welfareItem {
									padding: 8rpx 16rpx;
									margin-right: 10rpx;
									border-radius: 10rpx;
									background-color: #F4F4F4;
								}
							}

							.hot {
								display: flex;
								justify-content: space-between;
								align-items: center;
								font-size: 24rpx;
								margin: 30rpx 0;

								.hotInfo {
									.workName {
										color: #149639;
									}
								}

								.arrow {
									.arrowIMG {
										width: 28rpx;
										height: 28rpx;
									}

								}
							}
						}
					}
				}
			}

		}
	}
</style>
