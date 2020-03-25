<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">邀请码</text>
			<input class="input" type="text" maxlength="9" v-model="popuCode" placeholder="请输入邀请码" placeholder-class="placeholder" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popuCode: ''
			}
		},
		onLoad(option){
			
		},
		methods: {
			confirm(){
				if(!this.popuCode){
					this.$api.msg('请输入邀请码');
					return;
				}
				let params = {
					data:this.popuCode,
					url:this.$url + 'buyerInfo/popu',
					type:'post'
				}
				this.$http(params).then(res=>{
					if (res.data.result) {
						console.log(res.data.result)
						this.$api.msg(`绑定成功`)
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
</style>
