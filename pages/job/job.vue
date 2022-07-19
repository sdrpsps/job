<template>
	<view class="content">
		<view class="header">
			<view class="city" @click="showPicker">
				<text class="cityName">{{cityName}}</text>
				<u-icon name="arrow-down-fill" color="#fff" size="16"></u-icon>
				<u-picker :show="pickerStatus" :columns="cityList" @cancel="showPicker" @confirm="confirmPicker">
				</u-picker>
			</view>
			<view class="search" @click="gotoSearch">
				<u-search placeholder="日照香炉生紫烟" v-model="keyword" :showAction="false"></u-search>
			</view>
		</view>
		<view class="swiper-wrap">
			<u-swiper :list="bannerList" indicator indicatorMode="line" circular imgMode="widthFix" height="300rpx"
				radius="0" :autoplay="false"></u-swiper>
		</view>
		<view class="tab">
			<view class="left">
				<u-tabs :list="tabList" @click="changeTab" lineColor="#149639" :scrollable="false"></u-tabs>
			</view>
			<view class="right">
				<view class="btn" @click="gotoFilter">筛选</view>
			</view>
		</view>
		<view class="jobList">
			<u-empty mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png" v-if="jobList == '' ">
			</u-empty>
			<view class="item" v-for="item in jobList" :key="item._id" v-else>
				<view class="top" @click="gotoJobDetail(item._id)">
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
				<view class="bottom">
					<view class="companyInfo" @click="gotoCompanyDetail(item.companyInfo[0]._id)">
						<view class="left">
							<image :src="item.companyInfo[0].logoUrl" shape="circle"></image>
						</view>
						<view class="right">
							<view class="companyName">
								{{item.companyInfo[0].title}}
							</view>
							<view class="company">
								{{item.companyInfo[0].companyType}} | {{item.companyInfo[0].companyNumber}}
							</view>
						</view>
					</view>
					<view class="btn">
						<u-button size="mini" type="success" :plain="true" text="立即沟通" shape="circle"
							@click="gotoMessage(item.companyInfo[0]._id)"></u-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const myRequest = require('../../utils/request.js');
	const SiteConfig = require("../../config/site")
	export default {
		data() {
			return {
				// 搜索关键词
				keyword: "",
				// 城市选择器
				pickerStatus: false,
				// 城市列表
				cityList: [],
				// 当前选中城市
				cityName: "广州",
				// 轮播图列表
				bannerList: [],
				// tab列表
				tabList: [{
					name: '推荐',
				}, {
					name: '最新',
				}],
				// tab下标️，判断推荐还是最新
				tabIndex: 0,
				page: 1,
				size: 5,
				isRecommend: 1,
				isNews: 0,
				// 岗位列表
				jobList: [],
				total: 0,
			}
		},
		onLoad() {
			this.getCityList();
			this.getBannerList();
			this.getJobList();
			// 判断是否自动登录IM
			let token = uni.getStorageSync(SiteConfig.CACHE_TOKEN)
			let userInfo = uni.getStorageSync(SiteConfig.CACHE_USERINFO)
			if (token && userInfo) {
				this.$store.dispatch('autoLoginIM', userInfo)
			}
		},
		methods: {
			// 获取城市列表
			async getCityList() {
				try {
					let url = `company/city-list`;
					let res = await myRequest({
						url,
						method: "get",
					})
					console.log("获取城市列表", res.data)
					this.cityList.push(res.data.data)
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}
			},
			// 获取轮播图
			async getBannerList() {
				try {
					let url = `banner/bypos`;
					let res = await myRequest({
						url,
						method: 'get',
						data: {
							id: "62a6f7e1e30a2c5a126f93e3"
						}
					});
					console.log("获取轮播图", res.data)
					let {
						banners
					} = res.data.data.info
					banners.forEach((item) => {
						this.bannerList.push(item.imageUrl)
					})
				} catch (e) {
					//TODO handle the exception
					console.log(e)
				}
			},
			// 城市选择器显示
			showPicker() {
				this.pickerStatus = !this.pickerStatus
			},
			// 城市选择器确认
			confirmPicker(e) {
				this.cityName = e.value.toString()
				this.pickerStatus = !this.pickerStatus
				this.getJobList();
			},
			// tab切换
			changeTab() {
				this.isRecommend == 1 ? this.isRecommend = 0 : this.isRecommend = 1;
				this.isNews == 0 ? this.isNews = 1 : this.isNews = 0;
				this.page = 1;
				this.total = 0;
				this.jobList = '';
				this.getJobList();
			},
			// 获取岗位
			async getJobList() {
				try {
					let url = `company/work-list`;
					let res = await myRequest({
						url,
						method: "GET",
						data: {
							page: this.page,
							size: this.size,
							kw: this.keyword,
							isRecommend: this.isRecommend,
							isNews: this.isNews,
							location: this.cityName,
						}
					})
					console.log("获取岗位", res);
					if (res.data.data.total == 0) {
						uni.showToast({
							title: "该城市没有数据",
							icon: 'error'
						});
						this.jobList = [];
					}
					this.jobList = [...this.jobList, ...res.data.data.list];
					this.total = res.data.data.total;
				} catch (e) {
					console.log(e);
				}
			},
			// 跳转到筛选
			gotoFilter() {
				uni.navigateTo({
					url: '/pages/filter/filter'
				});
			},
			// 跳转到岗位详情
			gotoJobDetail(id) {
				uni.navigateTo({
					url: `/pages/jobDetail/jobDetail?workid=${id}`
				})
			},
			// 跳转到公司详情
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
			// 跳转到聊天
			gotoMessage(id) {
				if (!uni.getStorageSync(SiteConfig.CACHE_TOKEN)) {
					uni.showToast({
						icon: 'error',
						title: "请先登录！"
					})
					return;
				}
				uni.navigateTo({
					// url: `/pages/messagePage/messagePage?workid=${id}`
					url:`/TUI-sub/TUI-Chat/chat?conversationID=C2C${id}`
				})
			},

		},
		// 下拉触底
		onReachBottom() {
			if (this.jobList.length == this.total) {
				uni.showToast({
					title: "没有更多数据了",
					icon: 'error'
				});
				return;
			} else {
				this.page++;
				this.getJobList();
			}
		},
	}
</script>

<style lang="less" scoped>
	.content {

		.status_bar {
			height: var(--status-bar-height);
			width: 100%;
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 96rpx;
			background-color: #149639;

			.city {
				display: flex;
				color: #fff;

				// font-size: 36rpx;
				.cityName {
					margin-left: 30rpx;
					margin-right: 20rpx;
				}
			}

			.search {
				width: 70%;
				margin: 0 30rpx;
			}
		}

		.swiper-wrap {
			height: 300rpx;
		}

		.tab {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.left {}

			.right {
				font-size: 24rpx;
				color: #333;
				padding: 14rpx 26rpx;
				margin-right: 30rpx;
				border-radius: 10rpx;
				background-color: #f5f5f5;
			}
		}

		.jobList {
			margin: 0 30rpx;

			.item {
				display: flex;
				flex-direction: column;
				margin-top: 28rpx;
				border-bottom: 1px solid #bbb;

				.top {
					display: flex;
					justify-content: space-between;
					// align-items: center;
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

			.item:first-child {
				margin-top: 40rpx;
			}

			.item:last-child {
				border-bottom: 0;
			}
		}
	}
</style>
