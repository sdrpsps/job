<template>
	<view class="content">
		<view class="bg">
			<view class="clearfix">
				<view class="icon">
					<u-icon name="setting" size="19" color="#fff"></u-icon>
				</view>
			</view>
			<view class="userInfo-wrap">
				<view class="userInfo">
					<view class="left" @click="gotoLogin">
						<u-avatar :src="userInfo.imageUrl" size="140rpx"></u-avatar>
					</view>
					<view class="right">
						<view class="name">
							<view class="username">
								{{userInfo.name}}
							</view>
							<view class="icon" v-show="login">
								<u-icon name="edit-pen" color="#fff"></u-icon>
							</view>
						</view>
						<view class="desc">
							{{userInfo.identity}}
						</view>
					</view>
				</view>
			</view>
			<view class="menuBox">
				<view class="item" @click="goto('/pages/resumeFile/resumeFile')">
					<image src="../../static/image/jianli@2x.png"></image>
					<text>简历附件</text>
				</view>
				<view class="item" @click="goto('/pages/sentResume/sentResume')">
					<image src="../../static/image/toudi@2x.png"></image>
					<text>已投简历</text>
				</view>
				<view class="item" @click="goto('/pages/collect/collect?current=0')">
					<image src="../../static/image/shoucang@2x.png"></image>
					<text>我的收藏</text>
				</view>
			</view>
			<view class="list">
				<view class="manage">
					<u-cell-group :border="false">
						<u-cell icon="plus-circle" title="管理求职意向" value="在职-考虑机会" :border="false" :isLink="true">
						</u-cell>
					</u-cell-group>
				</view>
				<u-gap height="1" bgColor="#E5E5E5" marginTop="10" marginBottom="10"></u-gap>
				<view class="user">
					<u-cell-group :border="false">
						<u-cell icon="home" title="个人主页" :border="false" :isLink="true"
							@click="goto('/pages/onlineResume/onlineResume')"></u-cell>
						<u-cell icon="heart" title="关注公司" :border="false" :isLink="true"
							@click="goto('/pages/collect/collect?current=1')"></u-cell>
						<u-cell icon="chat" title="常见问答" :border="false" :isLink="true" @click="goto('/pages/qa/qa')">
						</u-cell>
					</u-cell-group>
				</view>
				<u-gap height="1" bgColor="#E5E5E5" marginTop="10" marginBottom="10"></u-gap>
				<view class="help">
					<u-cell-group :border="false">
						<u-cell icon="info-circle" title="帮助与反馈" :border="false" :isLink="true"></u-cell>
					</u-cell-group>
				</view>
				<view class="btn" v-show="login">
					<u-button text="退出登录" type="error" @click="showModel(true)" shape="circle"></u-button>
				</view>
			</view>
			<view class="model">
				<u-modal :show="show" :title="title" :content='content' @confirm="logout" :showCancelButton="true"
					@cancel="showModel(false)"></u-modal>
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
				userInfo: {
					name: "未登录",
					identity: "点击头像登录"
				},
				// 模态框显示状态
				show: false,
				title: '退出登录',
				content: '你即将要退出登录',
				login: false,
			}
		},
		methods: {
			// 判断是否登录,优化手动点击登录
			isLogin() {
				if (!uni.getStorageSync(SiteConfig.CACHE_TOKEN)) {
					this.login = false;

					// 强制跳转登录
					// uni.redirectTo({
					// 	url: "/pages/login/login"
					// });
				} else {
					this.login = true;
					this.userInfo = JSON.parse(uni.getStorageSync(SiteConfig.CACHE_USERINFO))
				}
			},
			// 退出登录
			logout() {
				uni.clearStorageSync();
				uni.showToast({
					icon: "success",
					title: "退出成功！",
					duration: 2000,
					mask: true,
				})
				setTimeout(() => {
					// 跳转回首页
					uni.reLaunch({
						url: "/pages/job/job",
					})
				}, 1000)
			},
			// 显示模态框
			showModel(status) {
				if (status) {
					this.show = status
				} else {
					this.show = status
				}
			},
			// 跳转到登录
			gotoLogin() {
				if (this.login) {
					uni.showToast({
						icon: "error",
						title: "你已登录，无需重复操作！"
					})
					return;
				}
				uni.redirectTo({
					url: "/pages/login/login"
				});
			},
			// 通用跳转
			goto(address) {
				if (!this.login) {
					uni.showToast({
						icon: "error",
						title: "请登录后再操作！"
					})
					return;
				}
				uni.navigateTo({
					url: address
				})
			},
			// 页面重载
			reload() {
				const pages = getCurrentPages()
				// 声明一个pages使用getCurrentPages方法
				const curPage = pages[pages.length - 1]
				// 声明一个当前页面
				curPage.onLoad(curPage.options) // 传入参数
				curPage.onShow()
				curPage.onReady()
				// 执行刷新
			},


		},
		onShow() {
			this.isLogin();
		}

	}
</script>

<style lang="less" scoped>
	.content {
		.bg {
			height: 350rpx;
			// background: rgb(124, 182, 114);
			// background: linear-gradient(114deg, rgba(124, 182, 114, 1) 0%, rgba(63, 167, 52, 1) 90%);
			background-color: #149639;
		}


		.icon {
			float: right;
			margin: 40rpx 30rpx 12rpx 0;

		}

		.userInfo-wrap {
			margin-left: 30rpx;
			margin-bottom: 40rpx;

			.userInfo {
				display: flex;

				.left {
					margin-right: 35rpx;
					width: 140rpx;
					height: 140rpx;
				}

				.right {
					display: flex;
					flex-direction: column;
					justify-content: center;

					.name {
						display: flex;
						align-items: center;
						font-size: 48rpx;
						font-weight: bolder;
						color: #fff;

						.username {
							margin-right: 20rpx;
						}

					}

					.desc {
						font-size: 24rpx;
						font-weight: lighter;
						color: #fff;
					}
				}
			}
		}

		.menuBox {
			display: flex;
			justify-content: space-around;
			background-color: #fff;
			margin: 0 30rpx;
			margin-bottom: 50rpx;
			border-radius: 20rpx;
			box-shadow: 0px 0px 20px #DBEFE1;

			.item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin: 30rpx;

				image {
					width: 50rpx;
					height: 50rpx;
					margin-bottom: 20rpx;
				}

				text {
					font-size: 26rpx;
					color: #333;
				}
			}
		}

		.list {
			margin: 0 30rpx;

			.btn {
				margin-top: 40rpx;
			}
		}

		.clearfix:after {
			content: "";
			display: block;
			height: 0;
			clear: both;
			visibility: hidden;
		}
	}
</style>
