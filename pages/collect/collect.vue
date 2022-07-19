<template>
	<view class="content">
		<view class="tab">
			<u-tabs :list="catge" :scrollable="false" lineColor="#fff" :current="current" @change="changeShow"
				:activeStyle="{
            color: '#fff',
            fontWeight: 'bold',
			}" :inactiveStyle="{
            color: '#CEE6C9',
			}" itemStyle="width:50%; background-color: #149639; padding-bottom:10px;">
			</u-tabs>
		</view>
		<!-- 职位收藏 -->
		<view class="jobCollect" v-show="jobCollectStatus">
			<view class="item" v-for="item in jobCollectList" :key="item._id" @click="gotoJobDetail(item._id)">
				<view class="top">
					<view class="jobName">
						{{item.title}}
					</view>
					<view class="salary">
						{{item.salary}}
					</view>
				</view>
				<view class="mid">
					<view class="info">
						{{item.workAddress}} | {{item.workRange}} | {{item.education}}
					</view>
					<view class="welfare">
						<view class="welfareItem" v-for="(items,index) in item.welfare" :key="index">
							{{items}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 公司收藏 -->
		<view class="companyCollect" v-show="companyCollectStatus">
			<view class="item" v-for="item in companyCollectList" :key="item._id" @click="gotoCompanyDetail(item._id)">
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
				catge: [{
						name: '岗位收藏',
					},
					{
						name: '公司收藏',
					}
				],
				// tab滑块下标位置，0是岗位收藏，1是公司收藏
				current: 0,
				jobCollectList: [],
				companyCollectList: [],
				jobCollectStatus: false,
				// isEmpty
				companyCollectStatus: false,
			}
		},
		methods: {
			// 获取收藏列表
			async getCollectList() {
				if (this.current == 0) {
					// 获取岗位收藏列表
					let url = `company/company-work-fav-list`;
					let res = await myRequest({
						url,
						method: "post"
					})
					console.log("获取岗位收藏", res);
					this.jobCollectList = res.data.data.result;
				} else if (this.current == 1) {
					// 获取公司收藏列表
					let url = `company/company-fav-list`;
					let res = await myRequest({
						url,
						method: "post"
					})
					console.log("获取公司收藏", res);
					this.companyCollectList = res.data.data.result;
				}
			},
			// 切换tab
			changeShow(e) {
				this.current = e.index;
				// 修改v-show
				this.changeShowStatus();
				// 重新发送请求，渲染页面
				this.getCollectList();
			},
			// 切换jobCollect和companyCollect的v-show
			changeShowStatus() {
				if (this.current == 0) {
					this.jobCollectStatus = true;
					this.companyCollectStatus = false;
				} else if (this.current == 1) {
					this.jobCollectStatus = false;
					this.companyCollectStatus = true;
				}
			},
			// 跳转到职位详情
			gotoJobDetail(id) {
				uni.navigateTo({
					url: `/pages/jobDetail/jobDetail?workid=${id}`
				})
			}, // 跳转到公司详情
			gotoCompanyDetail(id) {
				uni.navigateTo({
					url: `/pages/companyDetail/companyDetail?companyid=${id}`
				})
			},
		},
		onLoad(option) {
			this.current = option.current;
			// 显示判断
			this.changeShowStatus();
		},
		onShow() {
			this.getCollectList();
		}
	}
</script>

<style lang="less" scoped>
	.content {
		.jobCollect {
			.item {
				display: flex;
				flex-direction: column;
				margin: 30rpx;
				padding: 20rpx;
				border-radius: 20rpx;
				box-shadow: 0px 0px 10px #D9EEDF;

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
				}
			}
		}

		.companyCollect {
			.item {
				margin: 30rpx;
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
						}
					}
				}
			}
		}
	}
</style>
