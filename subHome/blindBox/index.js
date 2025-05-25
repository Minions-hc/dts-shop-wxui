import {
		get,
		post
	} from "@/utils/rest-util.js"

export const commonMixns = {
	methods:{
		async handleWechatPay(amount,seriesName) {
		      try {
		        // 1. 获取用户code
		        const loginRes = await this.getWxCode()
		        
		        // 2. 获取支付参数
		        const paymentParams = await this.getPaymentParams(loginRes.code,amount,seriesName)
		        
		        // 3. 发起支付请求
		        const res = await this.requestPayment(paymentParams)
		        
		        // 4. 处理支付结果
		        if (res[0]) {
		          await this.checkPaymentStatus(paymentParams.out_trade_no)
				  this.prizeDraw()
		          // uni.showToast({ title: '支付成功' })
		        } else {
		          this.handlePaymentError(res[1])
		        }
		      } catch (error) {
		        uni.showToast({ title: error.message, icon: 'none' })
		      }
		    },
		
		    // 获取微信code
		    getWxCode() {
		      return new Promise((resolve, reject) => {
		        uni.login({
		          provider: 'weixin',
		          success: resolve,
		          fail: reject
		        })
		      })
		    },
		
		    // 获取支付参数
		    async getPaymentParams(code,amount,seriesName) {
		      try {
				const postData = {
					openId: code,
					amount: amount, // 金额（单位：分）
					description: seriesName
				}
				return post('wx/wxpay/create',postData).then(res=>{
					console.log(res)
					if (res.statusCode === 200) {
					  return res.data.data
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