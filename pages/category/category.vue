<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" :scroll-top="tabScrollTop">
			<view class="t-list">
				<view @click="navToList(item.id, titem.id)" v-if="titem.pid === item.id" class="t-item" v-for="titem in tlist" :key="titem.id">
					<image :src="titem.picture"></image>
					<text>{{titem.name}}</text>
				</view>
				<view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view>
				<view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view>
				<view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view>
				<view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view>
				<view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view>
				<view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view><view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view><view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view><view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view><view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view><view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view><view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view><view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view><view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view><view  class="t-item">
					<image src="/static/images/img2.jpg"></image>
					<text>123123123123</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				flist: [{name:'全部',id:'-1'}],
				slist: [],
				params:{
					pageNum:1,
					pageSize:20
				}
			}
		},
		onLoad(){
			this.loadData();
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
					// if (item.categoryInfoList) {
					//   item.categoryInfoList.forEach(itemSon=>{
					// 	this.slist.push(itemSon)
					//   })
					// }
				  })
				}
				this.currentId = this.flist[0].id
        
				// let list = await this.$api.json('cateList');
				// list.forEach(item=>{
				// 	if(!item.pid){
				// 		this.flist.push(item);  //pid为父级id, 没有pid或者pid=0是一级分类
				// 	}else if(!item.picture){
				// 		this.slist.push(item); //没有图的是2级分类
				// 	}else{
				// 		this.tlist.push(item); //3级分类
				// 	}
				// })
			},
			getgoodsList(){
				
			},
			//下拉刷新
			onPullDownRefresh(){
				this.loadData('refresh');
			},
			//加载更多
			onReachBottom(){
				this.loadData();
			},
			//一级分类点击
			tabtap(item){
				this.currentId = item.id;
			},
			navToList(sid, tid){
				uni.navigateTo({
					url: `/pages/product/list?fid=${this.currentId}&sid=${sid}&tid=${tid}`
				})
			}
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
		
		image{
			width: 240upx;
			height: 240upx;
		}
	}
</style>
