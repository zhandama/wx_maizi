<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">选择身份</text>
			<view class="row b-b">
				<text class="ti-btn" :class="{'actived':params.auditState==2}" @click="params.auditState=2">设计师</text>
				<text class="ti-btn" :class="{'actived':params.auditState==3}" @click="params.auditState=3">业务员</text>
			</view>
		</view>
		<!-- <view class="row b-b">
			<text class="tit">上传图片</text>
			<view class="row b-b">
				<upload-images></upload-images>
			</view>
		</view>
		 -->
		 <view>
			<view><upload-images ref="uploadImages" :url="imgurl+'buyerInfo/uploadMaterial'" length="8"></upload-images></view>
		 </view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import uploadImages from '@/components/upload-images';
	export default {
		components: {
			uploadImages
		},
		data() {
			return {
				imgurl:this.$url,
				params: {
					auditState:0,
					fileUrl:''
				}
			}
		},
		onLoad(option){
			
		},
		methods: {
			confirm(){
				console.log(this.$refs.uploadImages.imageList)
				if(this.params.auditState==0){
					this.$api.msg('请选择身份');
					return;
				}
				if (this.$refs.uploadImages.imageList.length==0) {
					this.$api.msg('请至少上传一张图片作为认证信息');
					return;
				} else {
					this.params.fileUrl = this.$refs.uploadImages.imageList.map(x => x.src).join(';')
				}
				
				let params = {
					data:this.params,
					url:this.$url + 'buyerInfo/apply',
					type:'post'
				}
				this.$http(params).then(res=>{
					if (res.data.result) {
						console.log(res.data.result)
						this.$api.msg(`申请成功，请等待客服审核`)
						setTimeout(()=>{
							uni.navigateBack()
						}, 800)
					} else {
						this.$api.msg(res.data.message)
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}
	.uploadBtn{
		width:150upx;
		height:150upx;
		text-align: center;
		background: #e1e1e1;
		margin: 20upx;
		border-radius:8upx;
		padding:30upx 0;
		.yticon{
			font-size: 48upx;
		}
	}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
	.ti-btn{
		background: #f6f6f6;
		border-radius: 30upx;
		padding: 8upx 20upx;
		margin-right: 20upx;
	}
	.actived{
		background: #666 !important;
		color: #fff !important;
	}
</style>
