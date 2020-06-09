<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scrolltolower="loadmore()">
			<view class="t-list">
				<view @click="navToDetailPage(titem.goodsId)" class="t-item" v-for="titem in goodsList" :key="titem.id">
					<image :src="imgUrl + titem.goodsAttr"></image>
					<text class="goods-title">{{titem.title}}</text>
					<text class="goods-price">￥{{titem.initPrice}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl:this.$imgUrl,
				nomore: false,
				currentId: '',
				flist: [{name:'全部',id:'all'},{name:'热销',id:'isHot'}],
				goodsList: [],
				total: 0,
				loading:false,
				params:{
					pageNum:1,
					pageSize:10
				}
			}
		},
		onShow() {
			if (this.currentId!=wx.getStorageSync('currentId')) {
				this.currentId = wx.getStorageSync('currentId')
				this.tabtap({id:this.currentId})
			}
		},
		onLoad(options){
			if(wx.getStorageSync('currentId')){
				this.currentId = wx.getStorageSync('currentId')
			}
			this.loadData();
			this.getgoodsList(this.currentId)
		},
		methods: {
			async loadData(){
				let params = {
					url:this.$url + 'category/selectAllEnableCatory',
					type:'post'
				} 
				let res = await this.$http(params)
				if (res.data.result) {
				  res.data.result.forEach(item=>{
					this.flist.push(item);
				  })
				}
				if(!this.currentId){
					this.currentId = this.flist[0].id
				}
			},
			getgoodsList(id){
				if (this.loading){
					return
				}
				this.loading = true
				if (id && id=='isHot'){
					this.params.isHot = true
					wx.setStorage({key:'currentId',data:'isHot'})
					delete this.params.rootCategoryId
				} else if(id && id!=='all') {
					wx.setStorage({key:'currentId',data:id})
					this.params.rootCategoryId=id
					delete this.params.isHot
				} else {
					wx.setStorage({key:'currentId',data:'all'})
					delete this.params.rootCategoryId
					delete this.params.isHot
				}
				let params = {
					data:this.params,
					url:this.$url + 'goodsInfo/selectByPage',
				}
				this.$http(params).then(res=>{
					if (res.data.result) {
						let data = res.data.result
						this.loading = false
						this.goodsList = this.goodsList.concat(data.list)
						this.total = data.total
					}
				})
			},
			loadmore(){
				if (this.nomore) {
					return
				}
				if (this.goodsList.length<this.total) {
					this.params.pageNum++
					this.getgoodsList(this.currentId);
				} else {
					this.nomore = true
				}
			},
			//一级分类点击
			tabtap(item){
				this.currentId = item.id
				this.params.pageNum = 1
				this.goodsList = []
				this.nomore = false
				this.getgoodsList(item.id)
			},
			//详情页
			navToDetailPage(goodsId) {
				uni.navigateTo({
					url: `/pages/product/product?goodsId=${goodsId}`
				})
			},
			// navToList(sid, tid){
			// 	uni.navigateTo({
			// 		url: `/pages/product/list?fid=${this.currentId}&sid=${sid}&tid=${tid}`
			// 	})
			// }
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #fff;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 150upx;
		height: 100%;
		background-color: #f8f8f8;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 85upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #fff;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 276upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		.goods-title{
			width: 90%;
			font-size: 29upx;
			padding:5upx 0 0 0 ;
			text-align: center;
			white-space: nowrap;
			text-overflow: ellipsis;
			word-break: break-all;
			overflow: hidden;
		}
		.goods-price{
			color:#DD524D;
		}
		image{
			width: 240upx;
			height: 240upx;
		}
	}
</style>
