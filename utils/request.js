const SiteConfig = require("../config/site")

const myRequest = (options) => {
	return new Promise((resolve, reject) => {
		// 判断是否存在CACHE_TOKEN
		let CACHE_TOKEN = uni.getStorageSync(SiteConfig.CACHE_TOKEN);
		let header_tmp = CACHE_TOKEN == "" ? {} : {
			"Authorization": "Bearer " + CACHE_TOKEN
		};
		// 发送请求
		uni.request({
			url: SiteConfig.URL_PREFIX + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: header_tmp,
			success: (res) => {
				if (res.statusCode !== 200 && res.statusCode !== 201) {
					return uni.showToast({
						icon: "error",
						title: "网络错误，请检查"
					})
				};
				resolve(res)
			},
			fail: (err) => {
				return uni.showToast({
					icon: "error",
					title: "请求接口失败"
				})
				reject(err)
			},


		})
	})

}

module.exports = myRequest;
