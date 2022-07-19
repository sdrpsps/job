<template>
	<view class="content">
		<view class="navbar">
			<u-navbar bgColor="#149639" leftIconColor="#fff" :placeholder="true">
				<view class="u-nav-slot" slot="left">
					<u-icon name="arrow-left" size="20" color="#fff" @click="goBack"></u-icon>
					<u-line direction="column" :hairline="false" length="16" margin="0 8px"></u-line>
					<u-icon :name="iconName" size="20" color="#fff" @click="companyLike(companyid)"></u-icon>
				</view>
			</u-navbar>
		</view>
		<!-- <view class="bg"></view> -->
		<view class="company">
			<view class="bg">
				<view class="company-wrap">
					<view class="companyInfo">
						<view class="left">
							<image :src="companyInfo.logoUrl"></image>
						</view>
						<view class="right">
							<view class="companyName">
								{{companyInfo.title}}
							</view>
							<view class="companyInfos">
								{{companyInfo.companyRange }} | {{companyInfo.companyNumber}} |
								{{companyInfo.companyType}}
							</view>
							<view :class="companyDescClassName">
								{{companyInfo.description}}
							</view>
							<view class="changeCompanyDesc" @click="changeCompanyDescStatus">
								{{companyDescStatus?"点击收起":"点击查看全部"}}
							</view>
						</view>
					</view>
					<view class="workTime">
						<view class="title">
							工作时间
						</view>
						<view class="time">
							<view class="item" v-for="(item,index) in companyInfo.workTime" :key="index">
								{{item}}
							</view>
						</view>
					</view>
					<view class="welfare">
						<view class="title">
							员工福利
						</view>
						<view class="item" v-for="item in companyInfo.welfare" :key="item.descp">
							<view class="left">
								<image :src="item.img"></image>
							</view>
							<view class="right">
								<view class="welfareName">
									{{item.title}}
								</view>
								<view class="welfareDesc">
									{{item.descp}}
								</view>
							</view>
						</view>
					</view>
					<view class="webSite">
						<view class="title">
							公司官网
						</view>
						<view class="site">
							{{companyInfo.siteUrl}}
						</view>
					</view>
				</view>
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
				companyid: "",
				companyInfo: {},
				companyDescStatus: false,
				companyDescClassName: "companyDescHide",
				like: false,
				iconName: "star",
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
			// 获取公司详情
			async getCompanyInfo() {
				try {
					let url = `company/company-info`;
					let res = await myRequest({
						url,
						methods: 'get',
						data: {
							companyid: this.companyid
						}
					})
					console.log("公司详情", res);
					this.companyInfo = res.data.data;
				} catch (e) {
					//TODO handle the exception
					console.log(e);
				}
			},
			// 查看全部或收起
			changeCompanyDescStatus() {
				this.companyDescStatus = !this.companyDescStatus;
				this.companyDescClassName == "companyDescHide" ? this.companyDescClassName = "companyDescShow" :
					this.companyDescClassName = "companyDescHide";
			},
			// 获取收藏列表,并判断是否已收藏
			async getLikeList() {
				// 没有登录时不执行
				if (!uni.getStorageSync(SiteConfig.CACHE_TOKEN)) {
					return;
				}
				let url = `company/company-fav-list`;
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
				if (this.likeList.indexOf(this.companyid) == -1) {
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
			async companyLike(id) {
				if (this.like) {
					// 如果获取收藏状态为true的时候，执行取消收藏
					let url = `company/company-fav-remove`;
					let res = await myRequest({
						url,
						method: "POST",
						data: {
							companyid: this.companyid
						}
					})
					console.log("取消关注情况", res.data);
					if (res.data.statusCode == 200) {
						// 修改like状态
						this.like = false;
						// 修改收藏图标
						this.isLike();
						uni.showToast({
							title: "取消关注成功！",
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
					let url = `company/company-fav-add`;
					let res = await myRequest({
						url,
						method: "POST",
						data: {
							companyid: this.companyid
						}
					})
					console.log("关注情况", res.data)
					if (res.data.statusCode == 200) {
						// 修改like状态
						this.like = true;
						// 修改收藏图标
						this.isLike();
						uni.showToast({
							title: "关注成功！",
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
			// 修改收藏图标和文字
			isLike() {
				if (this.like) {
					this.iconName = 'star-fill';
				} else {
					this.iconName = 'star';
				}
			},
		},
		onLoad(option) {
			this.companyid = option.companyid;
			this.getCompanyInfo();
			this.getLikeList();
		}
	}
</script>

<style lang="less" scoped>
	.content {

		.navbar {
			.u-nav-slot {
				display: flex;
				align-items: center;
				border: 1px solid #fff;
				border-radius: 30rpx;
				padding: 3px 7px;

				.like {
					color: #fff;
					font-size: 24rpx;
					margin-left: 10rpx;
				}
			}
		}

		.company {
			.bg {
				height: 120rpx;
				background-color: #149639;
				position: relative;


				.company-wrap {
					position: absolute;
					top: 40rpx;
					left: 0;
					// 设置width避免页面超出
					width: 92%;
					margin: 0 30rpx;

					.companyInfo {
						display: flex;
						align-items: flex-start;


						.left {
							background-color: #fff;
							margin-right: 30rpx;
							border-radius: 20rpx;
							box-shadow: 0px 0px 10px #D8E2EF;

							image {
								display: block;
								border-radius: 20rpx;
								width: 140rpx;
								height: 140rpx;
							}
						}

						.right {
							color: #333;

							.companyName {
								font-size: 40rpx;
								color: #fff;
								margin-bottom: 60rpx;
							}

							.companyInfos {
								font-size: 20rpx;
								margin-bottom: 20rpx;
							}

							.companyDescShow {
								color: #4D4D4D;
								font-size: 18rpx;
							}

							.companyDescHide {
								color: #4D4D4D;
								font-size: 18rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 3;
								-webkit-box-orient: vertical;
							}

							.changeCompanyDesc {
								font-size: 18rpx;
								color: #149639;
							}
						}
					}

					.workTime {
						margin-top: 13rpx;

						.title {
							font-size: 30rpx;
							color: #333;
							margin-bottom: 40rpx;
						}

						.time {
							display: flex;
							padding-bottom: 40rpx;
							border-bottom: 1px solid #EEEEEE;

							.item {
								font-size: 20rpx;
								margin-right: 20rpx;
							}
						}
					}

					.welfare {
						margin-top: 40rpx;
						border-bottom: 1px solid #EEEEEE;

						.title {
							font-size: 30rpx;
							color: #333;
							margin-bottom: 40rpx;
						}

						.item {
							display: flex;
							margin-bottom: 40rpx;

							.left {
								margin-left: 30rpx;
								margin-right: 60rpx;

								image {
									display: block;
									width: 64rpx;
									height: 64rpx;
								}
							}

							.right {
								display: flex;
								flex-direction: column;

								.welfareName {
									font-size: 28rpx;
									color: #333;
									margin-bottom: 30rpx;
								}

								.welfareDesc {
									font-size: 20rpx;
									color: #666;
								}
							}
						}
					}

					.webSite {
						margin-top: 40rpx;

						.title {
							font-size: 30rpx;
							color: #333;
							margin-bottom: 40rpx;
						}

						.site {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							font-size: 24rpx;
							color: #666;
						}
					}
				}


			}
		}
	}
</style>
