<template>
	<view>
		<view class="notice-item" v-if="detail">
			<view class="title">{{detail.title}}</view>
			<view class="content" v-html="detail.newsContent">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail:''
			}
		},
		onLoad(options) {
			this.getDetail(options.id);
		},
		onShareAppMessage(options) {
			return {
			  title: '',
			  path: '/pages/about/case?id=' + options.id
			}
		},
		methods: {
			getDetail(id) {
				let params = {
					data:{
						id
					},
					url:this.$url + 'content/selectById'
				}
				this.$http(params).then(res=>{
					if (res.data.result) {
						this.detail = res.data.result
						uni.setNavigationBarTitle({
							title:this.detail.title
						})
					}
				})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #fff;
		padding-bottom: 30upx;
	}
	.notice-item{
		padding:25upx;
		image{
			max-width: 100%;
		}	
	}
	.content{
		margin-top:20upx;
		font-size: 24upx;
	}
	.title{
		font-size: 30upx;
		padding:20upx 0;
		font-weight: bold;
		border-bottom: 1px solid #f1f1f1;
	}

</style>
