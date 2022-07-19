<template>
	<view class="content">
		<view class="hello">
			<view class="top">
				<text>您好！</text>
			</view>
			<view class="bottom">
				<view class="left">
					<text>欢迎来到职业帮，</text>
				</view>
				<view class="right">
					<text>立即注册</text>
				</view>
			</view>
		</view>
		<view class="loginForm">
			<u--form labelPosition="left" :model="loginForm" :rules="loginFormRules" ref="loginForm">
				<u-form-item prop="phoneNum" borderBottom>
					<u-input v-model="loginForm.phoneNum" type="number" placeholder="请输入手机号码" clearable border="none">
						<u--text text="+86" margin="0 3px 0 0" slot="prefix"></u--text>
					</u-input>
				</u-form-item>
				<u-form-item prop="code" borderBottom>
					<u-input v-model="loginForm.code" type="number" placeholder="请输入验证码" border="none">
						<template slot="suffix">
							<u-code ref="uCode" @change="codeChange" seconds="20" changeText="X秒重新获取"></u-code>
							<u-button @tap="getCode" :text="codeText" type="success" size="mini" plain shape="circle">
							</u-button>
						</template>
					</u-input>

				</u-form-item>
			</u--form>
		</view>
		<view class="btn">
			<u-button text="登录" type="success" @click="login" shape="circle"></u-button>
		</view>
		<!-- 条件编译，只在微信小程序上显示微信登录 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="divider">
			<u-divider text="其他登录方式"></u-divider>
		</view>
		<view class="wechat">
			<image src="../../static/image/weixin@2x.png" class="wechat" @click="gotoWeChatLogin"></image>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	const myRequest = require("../../utils/request.js")
	const SiteConfig = require("../../config/site")
	import {genTestUserSig} from "../../debug/GenerateTestUserSig.js"
	const app = getApp();
	export default {
		data() {
			return {
				loginForm: {
					phoneNum: "",
					code: "",
				},
				loginFormRules: {
					phoneNum: [{
							type: 'number',
							required: true,
							message: '请输入手机号码',
							trigger: ['blur', 'change'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// uni.$u.test.mobile()就是返回true或者false的
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],
					code: {
						type: 'number',
						required: true,
						message: '请填写验证码',
						trigger: ['blur', 'change']
					},
				},
				codeText: "获取验证码",
			}
		},
		methods: {
			// 获取验证码按钮变化
			codeChange(text) {
				this.codeText = text;
			},
			// 获取验证码
			async getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					let _this = this;
					uni.request({
						url: "https://yw.52kfw.cn/api/user/phone-get-code",
						method: "POST",
						success(res) {
							if (res.statusCode == 200) {
								uni.hideLoading()
								uni.$u.toast('验证码已发送');
								_this.$refs.uCode.start();
							}
						}
					})
				} else {
					uni.$u.toast('倒计时结束后再发送');
				};

			},
			// 登录
			login() {
				uni.request({
					url: 'https://yw.52kfw.cn/api/user/phone-login',
					method: "POST",
					data: {
						phone: this.loginForm.phoneNum,
						code: this.loginForm.code
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					complete: (res) => {
						console.log(res.data);
						let {
							statusCode,
							message
						} = res.data;
						if (statusCode != 200) {
							uni.showToast({
								icon: "error",
								title: message,

							})
						} else {
							// 设置缓存
							uni.setStorageSync(SiteConfig.CACHE_TOKEN, res.data.data.token);
							uni.setStorageSync(SiteConfig.CACHE_USERINFO, JSON.stringify(res.data.data
								.userInfo));
							// 提示
							uni.showToast({
								icon: "success",
								title: '登录成功',
								duration: 2000,
								mask: true
							});
							// 跳转
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/mine/mine',
								});
							}, 1000)

						}
					}
				});
			},
			// 跳转微信登录
			gotoWeChatLogin() {
				// 弹窗并获取用户信息
				uni.getUserProfile({
					desc: "登录",
					success: function(infoRes) {
						console.log("用户信息", infoRes);
						// 微信登录
						uni.login({
							success: function(codeRes) {
								console.log("获取code", codeRes);
								// 请求接口
								uni.request({
									url: "https://yw.52kfw.cn/api/user/xcx-login",
									method: "POST",
									data: {
										js_code: codeRes.code
									},
									success: function(loginRes) {
										console.log("登录情况", loginRes);
										if (loginRes.data.statusCode == 200) {
											// 这里先不写入userInfo，后面获取到微信用户信息后再写
											uni.setStorageSync(SiteConfig.CACHE_TOKEN,
												loginRes.data.data.token)
											uni.showToast({
												icon: "success",
												title: "登录成功！",
												duration: 2000,
												mask: true
											})
											uni.request({
												url: "https://yw.52kfw.cn/api/user/xcx-update-userinfo",
												method: "POST",
												data: {
													nickname: infoRes.userInfo
														.nickName,
													avatarUrl: infoRes.userInfo
														.avatarUrl
												},
												header: {
													"Authorization": "Bearer " +
														uni.getStorageSync(
															SiteConfig
															.CACHE_TOKEN)
												},
												success: (
													updateProfileRes) => {
													console.log("修改用户信息",
														updateProfileRes
													);
													// 写入userInfo
													uni.setStorageSync(
														SiteConfig
														.CACHE_USERINFO,
														JSON.stringify(
															updateProfileRes
															.data.data
															.userInfo))

													// IM登录
													let info = uni.getStorageSync(SiteConfig.CACHE_USERINFO)
											
													const userID = JSON.parse(info)._id;
													
													const userSig =
														genTestUserSig(
															userID)
														.userSig;
													const SDKAppID = app
														.globalData
														.SDKAppID;

													uni.$TUIKit.login({
														userID: userID,
														userSig: userSig
													}).then((rs) => {
														console.log("=====IM登录成功======",rs);
													}).catch((
													error) => {
														console.log("======IM登录失败=====",error);
													})
												},

												fail: (err) => {
													console.log("修改用户信息出错",
														err);
												}
											})
											// 跳转回我的
											setTimeout(() => {
												uni.switchTab({
													url: "/pages/mine/mine"
												})
											}, 1000)
										}

									},
									fail: function(err) {
										console.log("请求后端-Fail", err);
									}
								})
							},
							fail: function(err) {
								console.log("微信登录-Fail", err);
							}
						})

					},
					fail(err) {
						// 拒绝登录
						console.log("获取用户信息-Fail", err);
					}
				});


			}
		},
		onReady() {
			// 设置表单校验规则 否则表单校验无效
			this.$refs.loginForm.setRules(this.loginFormRules);
		},
	}
</script>

<style lang="less" scoped>
	.content {
		margin: 0 105rpx;

		.hello {
			padding-top: 205rpx;

			.top {
				margin-bottom: 29rpx;
				font-size: 48rpx;
				font-weight: bold;
				color: #181818;
			}

			.bottom {
				display: flex;
				font-size: 36rpx;
				font-weight: lighter;

				.right {
					color: #333;
					font-weight: 400;
					border-bottom: 1px solid #333;
				}
			}
		}

		.loginForm {
			margin-top: 180rpx;
		}

		.btn {
			margin-top: 234rpx;
		}

		.divider {
			margin-top: 105rpx;
		}

		.wechat {
			margin: 0 auto;
			width: 70rpx;
			height: 57rpx;
		}
	}
</style>
