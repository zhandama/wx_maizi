<template>
	<view>
		<view class="list" v-for="(item,index) in list" :key="index">
			<view class="content">
				<video :src="imgUrl+item.videoUrl" ></video>
			</view>
			<view class="title">{{item.title}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl:this.$imgUrl,
				list:[]
			}
		},
		onLoad(options) {
			this.getList();
		},
		methods: {
			getList() {
				let params = {
					data:{
						pageNum:1,
						pageSize:100,
						newsType:4
					},
					url:this.$url + 'content/selectByPage'
				}
				this.$http(params).then(res=>{
					if (res.data.result) {
						this.list = res.data.result.list
					}
				})
			},
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #fff;
		padding-bottom: 30upx;
	}
	.list{
		margin-bottom:10upx
	}
	.content video{max-height:400upx;width: 100%;}
	.title{text-align: center;}
</style>
