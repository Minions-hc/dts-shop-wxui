<template>
  <view class="container">
    <!-- 头像部分 -->
    <view class="avatar-section">
      <view class="avatar-wrapper" @tap="handleAvatarEdit">
        <image 
          class="avatar" 
          :src="avatarUrl" 
          mode="aspectFill"
        />
        <view class="avatar-mask" >
          <text class="edit-text">编辑</text>
        </view>
      </view>
    </view>

    <!-- 昵称部分 -->
    <view class="nickname-section" @tap="handleNicknameEdit">
      <view class="nickname-row">
        <text class="label">昵称</text>
        <view class="content-wrapper">
          <input 
            v-if="isEditing"
            v-model="nickname"
            class="nickname-input"
            placeholder="请输入新昵称"
            focus
            @blur="saveNickname"
          />
          <text v-else class="nickname-value">{{ nickname }}</text>
        </view>
      </view>
    </view>

    <!-- 确认按钮 -->
    <view class="btn-container">
      <button class="confirm-btn" @tap="handleConfirm">确认更新</button>
    </view>
  </view>
</template>

<script>
import OSS from 'ali-oss';
	import {
		get,post,BaseUrl
	} from "@/utils/rest-util.js"
export default {
  data() {
    return {
      avatarUrl: '/static/images/default_avatar.png',
      nickname: 'JFUDVTlv',
      isEditing: false,
	  credentials:null,
	  expirationTime:null,
	  
    }
  },
  methods: {
    // 头像编辑
    handleAvatarEdit() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
			const file = res.tempFiles[0];
			const fileUrl = res.tempFilePaths[0]
			this.avatarUrl = fileUrl
        }
      })
    },
	async upImg(filePath, file) {
		const that = this;
		if (that.credentials && that.isCredentialsExpired(that.credentials)) {
			that.putFileToClient(that.credentials, file, filePath);
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
				that.credentials = res.data;
				that.expirationTime = new Date()
				that.putFileToClient(res.data, file, filePath);
			}
		})
	},
	
	async putFileToClient(res, file, filePath) {
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
		const result = await client.put(basic_env +"/head_img/" + this.phoneNumber + '/' + file.name, file);
	
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

    // 进入昵称编辑状态
    handleNicknameEdit() {
      this.isEditing = true
    },

    // 保存昵称
    saveNickname() {
      this.isEditing = false
      if (!this.nickname.trim()) {
        this.nickname = 'JFUDVTlv'
      }
    },

    // 确认更新
    handleConfirm() {
      uni.showToast({
        title: '更新成功',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 头像部分 */
.avatar-section {
  padding: 60rpx 0;
  .avatar-wrapper {
    position: relative;
    width: 240rpx;
    height: 240rpx;
    margin: 0 auto;
    border-radius: 15rpx;
    overflow: hidden;
    
    .avatar {
      width: 100%;
      height: 100%;
      background-color: #ddd;
    }
    
    .avatar-mask {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60rpx;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      
      .edit-text {
        color: #fff;
        font-size: 28rpx;
        letter-spacing: 2rpx;
      }
    }
  }
}

/* 昵称部分 */
.nickname-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-top: 40rpx;

  .nickname-row {
    display: flex;
    align-items: center;
    height: 88rpx;

    .label {
      color: #666;
      font-size: 28rpx;
      flex-shrink: 0;
      margin-right: 30rpx;
      width: 120rpx;
    }

    .content-wrapper {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;

      .nickname-input {
        flex: 1;
        font-size: 32rpx;
        color: #333;
        height: 100%;
        padding: 0;
        background: transparent;
        line-height: 1.5;
      }

      .nickname-value {
        font-size: 32rpx;
        color: #333;
        line-height: 1.5;
      }
    }
  }
}

/* 确认按钮 */
.btn-container {
  margin-top: 80rpx;
  padding: 0 30rpx;

  .confirm-btn {
    background: #07c160;
    color: #fff;
    border-radius: 50rpx;
    font-size: 32rpx;
    height: 88rpx;
    line-height: 88rpx;
    
    &::after {
      border: none;
    }
  }
}

/* 去除按钮默认样式 */
button {
  background-color: transparent;
  padding: 0;
  margin: 0;
  &[type="default"] {
    background-color: transparent;
  }
}
</style>