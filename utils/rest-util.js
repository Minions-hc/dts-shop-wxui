const BaseUrl = 'http://huangcheng.chaoshangshiduo.com/';
const OssUrl =  '';
const WebUrl = '';
const Bucket = 'chaoshangshiduo-public-static';
const basic_env = 'https://chaoshangshiduo-public-static.oss-cn-shenzhen.aliyuncs.com/';

function get(url, config){
	let header = {}
	// 获取本地token
	if (uni.getStorageSync("token")) {
		header['Authorization'] = uni.getStorageSync("token");
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: BaseUrl + url,
			method: 'GET',
			header: header,
			success(res) {
				resolve(res);
			},
			fail(err) {				
				reject(err);
			},
			complete() {
				// 不管成功还是失败都会执行
				uni.hideLoading();
				uni.hideToast();
			}
		});
	}).catch((e) => {});
} 

function post(url, postData, config){
	let header = {
		'Content-Type': 'application/json',
	};
	// 获取本地token
	if (uni.getStorageSync("token")) {
		header['Authorization'] =  uni.getStorageSync("token");
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: BaseUrl + url,
			method: 'POST',
			header: header,
			data: postData,
			success(response) {
				resolve(response);
			},
			fail(err) {
				reject(err);
			},
			complete() {
				// 不管成功还是失败都会执行
				uni.hideLoading();
				uni.hideToast();
			}
		});
	}).catch((e) => {});
}

export {
	get,post,BaseUrl,OssUrl,WebUrl,Bucket,basic_env
}