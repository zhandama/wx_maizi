<template>
	<view class="container">
		<!-- 头部轮播 -->
		<view class="topmain clearfix">
			<view class="topnav" @click="navTo('/pages/about/news?newsType=5')">公司<br>文化</view>
			<view class="topnav" @click="navToList()">旗下<br>品牌</view>
			<!-- <view class="topnav">全国<br>门店</view> -->
			<view class="topnav" @click="navTo('/pages/about/caseList')">设计<br>案例</view>
			<view class="topnav" @click="navTo('/pages/about/artsList')">视觉<br>形象</view>
		</view>
<!-- 		<button class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN" @getuserinfo="wxGetUserInfo">
			授权登录
		</button>	
		<button open-type="getPhoneNumber"  @getphonenumber="wxGetPhoneNumber" ></button> -->
		
		<!-- <button open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber"></button> -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<swiper class="carousel" circular @change="swiperChange">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navTo('/pages/about/caseList')">
					<image :src="imgUrl+item.titleAttr" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>
		<view class="title1">
			<image src="/static/images/hot_title.jpg" mode="widthFix"></image>
		</view>
		<view class="homeHot clearfix">
			<view class="homeHot-list" :class="{'mg-r':(index+1)%3!=0}" v-for="(item, index) in hotList" :key="index"  @click="navToDetailPage(item.goodsId)">
				<view class="homeHot-img">
					<image :src="imgUrl+item.goodsAttr" mode="widthFix"></image>
				</view>
				<view class="homeHot-title">{{item.title}}<span><image class="more" src="/static/images/more1.jpg" mode="widthFix"></image></span></view>
			</view>
		</view>
		<view class="title2" @click="navToList('isHot')">
			<image src="/static/images/more2.jpg" mode="widthFix"></image>
		</view>
		<view class="home-pel"  @click="navToList('all')">
			<image src="/static/images/hone_man.jpg" mode="widthFix"></image>
		</view>
		
		<view v-for="(item,index) in flist" :key="item.id">
			<view class="homePo" @click="navToList(item.id)">
				<view class="title3">
					<view class="cn">{{item.name}}</view>
					<view class="en">{{item.remark}}</view>
				</view>
				<view class="cont">
					<image :src="imgUrl+itemUrl" mode="widthFix" v-for="(itemUrl, sunIndex) in item.imgUrl" :key="sunIndex"></image>
				</view>
				<view class="title2">
					<image src="/static/images/more2.jpg" mode="widthFix"></image>
				</view>
			</view>
			<view class="home-pel" v-if="index==2" @click="navToList('all')">
				<image src="/static/images/hone_woman.jpg" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				imgUrl:this.$imgUrl,
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				hotList:[],
				flist:[]
			};
		},
		
		onLoad() {
			this.loadData();
		},
		onShareAppMessage() {
			return {
			  title: '麦兹家具整装中心',
			  path: '/pages/index/index'
			}
		},
		methods: {
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			async loadData() {
				this.getbanner()
				this.gethotList()
				
				let params = {
					url:this.$url + 'category/selectAllEnableCatory',
					type:'post'
				} 
				let res = await this.$http(params)
				if (res.data.result) {
				  this.flist = res.data.result
				  if(this.flist.length>0) {
					  this.flist.map(x=>{
						  x.imgUrl = x.imageUrl.split(";")
					  })
				  }
				}
			},
			getbanner() {
				let params = {
					data:{
						pageNum:1,
						pageSize:10,
						newsType:1
					},
					url:this.$url + 'content/selectByPage'
				}
				this.$http(params).then(res=>{
					if (res.data.result) {
						this.carouselList = res.data.result.list
						this.swiperLength = this.carouselList.length
					}
				})
			},
			wxGetPhoneNumber(e) {
				console.log(e)
			},
			gethotList(){
				let params = {
					data:{
						pageNum:1,
						pageSize:6,
						isHot:true
					},
					url:this.$url + 'goodsInfo/selectByPage'
				}
				this.$http(params).then(res=>{
					if (res.data.result) {
						this.hotList = res.data.result.list
					}
				})
			},
			wxGetUserInfo() {
				console.log(111)
				uni.getUserInfo({
				  provider: 'weixin',
				  success: function (infoRes) {
					console.log('用户昵称为：',infoRes);
				  }
				});
			},
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
			},
			//详情页
			navToDetailPage(goodsId) {
				uni.navigateTo({
					url: `/pages/product/product?goodsId=${goodsId}`
				})
			},
			navToList(id) {
				wx.setStorage({key:'currentId',data:id})
				uni.switchTab({
					url: `/pages/category/category?id=${id}`
				})
			},
			navTo(url){
				uni.navigateTo({  
					url
				})  
			},
		},
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			this.$api.msg('点击了搜索框');
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.$api.msg('点击了扫描');
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		}
		// #endif
	}
</script>

<style lang="scss">
	/* #ifdef MP */
	page{
		.cate-section{
			position:relative;
			z-index:5;
			border-radius:16upx 16upx 0 0;
			margin-top:-20upx;
		}
		.carousel-section{
			padding: 0;
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel{
				.carousel-item{
					padding: 0;
				}
			}
			.swiper-dots{
				left:45upx;
				bottom:40upx;
			}
		}
	}
	/* #endif */
	
	
	page {
		background: #f5f5f5;
	}
	.m-t{
		margin-top: 16upx;
	}
	.topmain {
		background: #fff;
		padding:0 30upx 20upx 30upx;
		.topnav {
			float:left;width:25%;text-align: center;line-height: 40upx;
		}
	}
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}
	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
		}
	}
	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	.title1{
		width: 100%;
		height: 110upx;
		padding: 10upx 0;
		background: #fff;
		text-align: center;
		image{
			width:35%; 
			height: auto;
		}
	}
	.title2{
		width: 100%;
		height: 110upx;
		padding-top: 35upx;
		background: #fff;
		text-align: center;
		image{
			width:20%; 
			height: auto;
		}
	}
	.title3{
		width: 100%;
		height: 95upx;
		background: #fff;
		text-align: center;
		padding-top:15upx;
		overflow:hidden;
		.en{
			font-size: 22upx;
		}
	}
	.homeHot{
		padding:20upx 20upx 0 20upx
	}
	.homeHot-list {
		float:left;
		height:300upx;
		margin-bottom:20upx;
		width: 31%;
		overflow: hidden;
		background:#fff;
		.homeHot-img{
			height:240upx;
			line-height:240upx;
			overflow: hidden;
			image{
				width:100%;
				height:240upx;
				vertical-align: middle;
			}
		}
		.homeHot-title {
			padding:10upx;
			  height:50upx;
			  font-size:28upx;
			  width: 100%;
			  padding-right:50upx;
			  white-space: nowrap;
			  text-overflow: ellipsis;
			  word-break: break-all;
			  overflow: hidden;
			  position: relative;
			.more{
				position: absolute;
				top:10upx;
				right:5upx;
				width: 40upx;
				margin-right: 5upx;
			}
		}
	}
	.home-pel {
		margin:30upx 0;
		padding:50upx 20upx;
		overflow: hidden;
		background:#fff;
		image{
			width:100%;
		}
	}
	.homePo{
		margin-bottom:30upx;
		.cont{
			padding:0 30upx;
			background:#fff;
			image{
				width:100%;
				border-radius: 10upx;
				margin-top:20upx
			}
		}
	}
	
	.nomargin{margin:0 !important}
	.mg-r {margin-right: 3%;}
	.clearfix:after { content:"."; display:block; height:0; visibility:hidden; clear:both; }
</style>
