import {
		get,
		post
	} from "@/utils/rest-util.js"

export const commonMixns = {
	methods:{
		getCouponList(){
			const userId = uni.getStorageSync('userId');
			const orderAmount = this.getOrderAmount()
			get("wx/coupon/available?userId="+userId+"&orderAmount="+orderAmount).then(json=>{
				
				const result = json.data?.data || []
				this.couponList = result;
			})
		},
		async initAddressList(){
			const userId = uni.getStorageSync('userId');
			return get(`wx/address/list?userId=${userId}`).then(json=>{
				const result = json.data;
				return result.data || []
			})
		},
		async handleWechatPay(postData) {
		      try {

		        const userInfo = uni.getStorageSync("userInfo") || {};
		        // 2. 获取支付参数
		        const paymentParams = await this.getPaymentParams(userInfo.wxOpenId,postData)

		        // 3. 发起支付请求
		        const res = await this.requestPayment(paymentParams)

		        // 4. 处理支付结果
		        if (res[0]) {
				  this.prizeDraw(paymentParams)
		        } else {
		          this.handlePaymentError(res[1])
		        }
		      } catch (error) {
		        uni.showToast({ title: error.message, icon: 'none' })
		      }
		    },

		    // 获取支付参数
		    async getPaymentParams(wxOpenId,createData) {
		      try {
				const postData = {
					openId: wxOpenId,
					...createData
				}
				return post('wx/wxpay/create',postData).then(res=>{
					if (res.statusCode === 200) {
					  return res.data
					}
					throw new Error(res.data.message || '获取支付参数失败')
				})


		      } catch (error) {
		        throw new Error('网络请求失败')
		      }
		    },

		    // 调用支付接口
		    requestPayment(params) {
		      return new Promise((resolve) => {
		        uni.requestPayment({
		          provider: 'wxpay',
		          ...params,
		          success: (res) => resolve([true, res]),
		          fail: (err) => resolve([false, err])
		        })
		      })
		    },

		    // 检查支付状态
		    async checkPaymentStatus(orderNo) {
		      const res = await uni.request({
		        url: `/api/checkPayment?orderNo=${orderNo}`
		      })

		      if (!res.data.paid) {
		        throw new Error('支付结果验证失败')
		      }
		    },

		    // 错误处理
		    handlePaymentError(err) {
		      if (err.errMsg === 'requestPayment:fail cancel') {
		        uni.showToast({ title: '支付已取消', icon: 'none' })
		      } else {
		        uni.showToast({ title: '支付失败，请重试', icon: 'none' })
		      }
		    }
	}
}
