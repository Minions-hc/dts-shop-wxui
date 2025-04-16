import {OssUrl,BaseUrl,Bucket,basic_env} from "@/src/utils/rest-util.js";
import {photoCompress,dataURLtoFile} from "@/src/utils/common.js"
import OSS from 'ali-oss';
import Compressor from 'compressorjs';
export const commonMixns = {
	data(){
		return {
			ExpirationTime:null
		}
	},
	methods: {
		upLoadImg(filePath, file,isSacn){
			const that = this;
			photoCompress(file,filePath,(url)=>{
				const files = dataURLtoFile(url,file.name);
				that.upImg(filePath,files,isSacn)
			})
		},
		async upImg(filePath, file,isSacn) {
			const that = this;
			if (that.credentials && that.isCredentialsExpired(that.credentials)) {
				that.putFileToClient(that.credentials, file, filePath,isSacn);
				return;
			}
			const uploadUrl = BaseUrl + '/sts/get_token_for_oss_upload';
			const Authorization =  uni.getStorageSync("token");
			uni.request({
				url: uploadUrl,
				method: 'GET',
				data: {},
				header:{
					"Authorization":Authorization
				},
				success(res) {
					if (res.statusCode !== 200) {
						// 处理错误的HTTP状态码。
						throw new Error(
							`获取STS令牌失败: ${res.statusCode} `
						);
						return;
					}
					that.ExpirationTime = new Date();
					that.credentials = res.data;
					that.putFileToClient(res.data, file, filePath,isSacn);
				}
			})
		},

		async putFileToClient(res, file, filePath,isSacn) {
			const credentials = res;
			const client = new OSS({
				// 将<YOUR_BUCKET>设置为OSS Bucket名称。
				bucket: Bucket,
				// 将<YOUR_REGION>设置为OSS Bucket所在地域，例如region: 'oss-cn-hangzhou'。
				region: "oss-cn-beijing",
				accessKeyId: credentials.accessKeyId,
				accessKeySecret: credentials.accessKeySecret,
				stsToken: credentials.securityToken,
			});
			const phoneNumber = uni.getStorageSync('phoneNumber');
			const imgPath = isSacn ? '/match_img/' : ('/head_img/' + phoneNumber + '/');
			const result = await client.put(basic_env +imgPath  + file.name, file);
			if(isSacn){
				this.matchFace( file.name)
			} else {
				this.saveFacialInfo(phoneNumber + '/' + file.name)
			}

		},
		

		isCredentialsExpired(credentials) {
			if (!credentials) {
				return true;
			}
			const expireDate = new Date(credentials.expiration);
			const now = new Date();
			// 如果有效期不足一分钟，视为过期。
			return expireDate.getTime() - now.getTime() <= 900000;
		},
		

		
	},
}
