<template>
	<view class="content">
		<view class="file">
			<view class="message">
				<view class="title">
					你有 {{total}} 份简历,点击文件可以预览
				</view>
				<view class="upload">
					<u-upload @afterRead="afterRead" accept="file" :maxCount="1" uploadIcon="plus">
					</u-upload>
				</view>
			</view>
			<view class="item" v-for="(item,index) in resumeList" :key="index">
				<view class="title" @click="viewResumeFile(item)">
					{{item}}
				</view>
				<view class="btn">
					<u-button text="删除" type="error" @click="modelStatus(item)"></u-button>
				</view>

			</view>

			<view class="model">
				<u-modal :show="show" :title="title" :content='content' @confirm="delResume()" @cancel="modelStatus"
					:showCancelButton="true"></u-modal>
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
				resumeList: [],
				total: 0,
				fileList: [],
				show: false,
				title: "删除简历",
				content: "删除简历",
				resumeURL: "",
			};
		},
		methods: {
			// 获取简历列表
			async getResumeList() {
				let url = `company/company-resume-list`;
				let res = await myRequest({
					url,
					method: "post"
				})
				console.log("获取简历列表", res.data)
				this.resumeList = res.data.data.result
				this.total = res.data.data.total
			},
			// 上传简历
			async afterRead(event) {
				// 声明一个——this后面上传成功后调用
				let _this = this;
				uni.uploadFile({
					url: 'https://yw.52kfw.cn/api/upload/store',
					header: {
						"Authorization": "Bearer " + uni.getStorageSync(SiteConfig.CACHE_TOKEN)
					},
					filePath: event.file.url,
					name: "cover",
					success: (uploadFileRes) => {
						console.log("上传文件", JSON.parse(uploadFileRes.data));
						uni.request({
							url: "https://yw.52kfw.cn/api/v1/company/company-resume-add",
							method: "POST",
							header: {
								"Authorization": "Bearer " + uni.getStorageSync(SiteConfig
									.CACHE_TOKEN)
							},
							data: {
								resumeUrl: "https://yw.52kfw.cn" + JSON.parse(uploadFileRes.data)
									.data.url
							},
							success: function(res) {
								console.log("新增简历", res);
								_this.getResumeList();
							}
						})

					},

				});
			},
			// 删除简历
			async delResume() {
				let url = "company/company-resume-remove";
				let res = await myRequest({
					url,
					method: "post",
					data: {
						resumeUrl: this.resumeURL
					}
				});
				console.log("删除简历", res);
				this.getResumeList();
				this.modelStatus();
			},
			// 模态框显示
			modelStatus(item) {
				this.show = !this.show;
				this.resumeURL = item
			},
			// 简历预览
			async viewResumeFile(url) {
				uni.downloadFile({
					url,
					success: (res) => {
						// 打开文档
						uni.openDocument({
							filePath: res.tempFilePath,
							showMenu: true
						});
					}
				});
			}

		},
		onLoad() {
			this.getResumeList();
		}
	}
</script>

<style lang="scss">
	.content {
		margin: 0 30rpx;

		.file {
			.message {
				margin-top: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.item {
				display: flex;
				align-items: center;
				margin: 30rpx 0;
				padding: 20rpx;
				border-radius: 20rpx;
				box-shadow: 0px 0px 20px #DBEFE1;

				.title {
					padding-right: 20rpx;
					width: 70%;
					overflow: hidden;
					word-break: break-all;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 4;
					line-clamp: 4;
					display: -webkit-box;
				}

				.btn {
					display: flex;
					width: 30%;


				}
			}
		}
	}
</style>
