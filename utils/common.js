function dataURLtoFile(dataurl, filename) {
	var arr = dataurl.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	const date = new Date();
	const newTime = date.getTime()
	const name = newTime + '.' + filename.split('.')[1]
	return new File([u8arr], name, {
		type: mime
	});
}

function photoCompress(file, url, call) {
	var ready = new FileReader();
	ready.readAsDataURL(file);
	ready.onload = function() {
		canvasDataURL(url, call)
	}
}

function canvasDataURL(path, callback) {
	var img = new Image();
	img.src = path;
	var objCompressed = {}
	const scale = 0.5;
	img.onload = function() {
		var that = this;
		var h = parseInt((img.height * scale).toFixed(0)); // 默认按质量比例压缩
		var w = parseInt((img.width * scale).toFixed(0));
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var width = document.createAttribute("width");
		width.nodeValue = w;
		var height = document.createAttribute("height");
		height.nodeValue = h;
		canvas.setAttributeNode(width);
		canvas.setAttributeNode(height);
		ctx.drawImage(that, 0, 0, w, h);
		var base64 = canvas.toDataURL('image/jpeg', scale); //压缩比例
		// 回调函数返回base64的值
		callback(base64);
	}
}

function getUrlParam(name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
	let url = window.location.href.split('#')[0]
	let search = url.split('?')[1]
	if (search) {
		var r = search.substr(0).match(reg)
		if (r !== null)
			return unescape(r[2])
		return null
	} else
		return null
}

function initJsdk(callBack) {
	const url = 'https://prod.h5.skynet.baobeishouhu.com/' //window.location.href.split('#')[0];
	const nonceStr = GenerateMixed(16);
	const timestamp = GetDateNums(10);
	post('/wechat/initJSSDKConfigInfo?url=' + url, {}, {}).then(json => {
		const data = json.data
		if (data) {
			wx.config({
				debug: true, // 开启调试模式,
				appId: data.appId, // 必填，企业号的唯一标识
				timestamp: data.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.nonceStr, // 必填，生成签名的随机串
				signature: data.signature, // 必填，签名
				jsApiList: ['scanQRCode'], // 必填，需要使用的JS接口列表
			});
			wx.ready(() => {
				console.log('成功')
				callBack()
			})
			wx.error(function(res) {
				console.log('出错了：hhh' + res.errMsg); //wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
			});
		}
	})
}

function formatDate(value) {
	const data = new Date(value);
	let month = data.getMonth() + 1;
	month = month < 10 ? '0' + month : month;
	let day = data.getDate();
	day = day < 10 ? '0' + day : day;

	const year = data.getFullYear();
	let hours = data.getHours();
	hours = hours < 10 ? '0' + hours : hours;
	let minutes = data.getMinutes();
	minutes = minutes < 10 ? '0' + minutes : minutes;
	let seconds = data.getSeconds();
	seconds = seconds < 10 ? '0' + seconds : seconds;
	const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	return formattedTime;

}

function dateCompare(a, b) {
	var flag = false;
	var arr = a.split(" ")[0];
	var starttime = new Date(arr);
	var starttimes = starttime.getTime();
	var arrs = b.split(" ")[0];
	var endTime = new Date(arrs);
	var endTimes = endTime.getTime();
	// 进行日期比较
	if (endTimes === starttimes) {
		flag = true;
	} else {
		flag = false;
	}
	return flag;
}

// 随机抽奖
function getRandomElements(arr, n) {
	// 边界条件处理
	if (!Array.isArray(arr) || n <= 0 || arr.length === 0) {
		return [];
	}

	// 实际可获取的最大数量
	const max = Math.min(n, arr.length);

	// 创建数组副本避免修改原数组
	const copy = [...arr];

	// Fisher-Yates 洗牌算法
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}

	return copy.slice(0, max);
}

async function requestPayment(prepayData) {
	// 2. 发起微信支付
	const paymentRes = await uni.requestPayment({
		provider: 'wxpay',
		timeStamp: prepayData.timeStamp,
		nonceStr: prepayData.nonceStr,
		package: prepayData.package,
		signType: 'MD5',
		paySign: prepayData.paySign,
	});
	return paymentRes
}

export {
	photoCompress,
	dataURLtoFile,
	getUrlParam,
	initJsdk,
	formatDate,
	dateCompare,
	getRandomElements,
	requestPayment
}