<template>
	<view>
		<view class="notice-item">
			<view class="content" v-for="(item,index) in list" :key="index" @click="navToDetail(item.id)">
				<view class="img-wrapper">
					<image class="pic" :src="imgUrl+item.titleAttr"></image>
				</view>
				<view class="title">
					<view class="title1">{{item.title}}</view>
				</view>
			</view>
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
		onLoad() {
			this.getList();
		},
		methods: {
			getList() {
				let params = {
					data:{
						pageNum:1,
						pageSize:100,
						newsType:3
					},
					url:this.$url + 'content/selectByPage'
				}
				this.$http(params).then(res=>{
					if (res.data.result) {
						this.list = res.data.result.list
					}
				})
			},
			navToDetail(id){
				uni.navigateTo({
					url: '/pages/about/caseDetail?id='+id
				})
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #ecefed;
		padding-bottom: 30upx;
	}
	.content{
		width: 100%;
		height: 240upx;
		padding:30upx 30upx 0 30upx;
		clear: both;
		overflow: hidden;
	}
	.img-wrapper{
		float:left;
		width: 60%;
		height: 240upx;
		overflow: hidden;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.title{
		float:left;
		width: 40%;
		padding:80upx 30upx;
		background: #d4d4d4;
		height: 240upx;
		color:#1f1f1f;
	}
	.title1{
		font-size: 26upx;
		text-align: center;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

</style>
