<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image
							:src="imgUrl + item" 
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="introduce-section" v-if="detail">
			<text class="title">{{detail.title}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{detail.skuPrice||detail.initPrice}} </text>
				<!-- <text class="m-price">¥{{detail.initPrice}}</text> -->
				<text>元/件</text>
			</view>
			<view class="bot-row">
				<text>销量: {{detail.saleCount}}</text>
				<!-- <text>库存: 4690</text> -->
				<text>热度: {{detail.hotCount}}</text>
			</view>
		</view>
		
		<!--  分享 -->
		<!-- <view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				 返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
		</view> -->
		
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec" v-if="showProperty">
				<text class="tit">选择规格</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in property" :key="sIndex" v-if="sItem.userSelect">
						{{sItem.propertyValue}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
		<!-- 	<view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view> -->
			<view class="c-row b-b" v-if="!sItem.userSelect && sItem.propertyValue" v-for="(sItem, sIndex) in detail.goodsPropertyList" :key="sIndex">
				<text class="tit">{{sItem.name}}</text>
				<view class="bz-list con">
					<text>{{sItem.propertyValue}}</text>
				</view>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text :nodes="detail.description"></rich-text>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="addcart">加入购物车</button>
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
			</view>
		</view>
		
		
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image  v-if="detail && detail.goodsAttr" :src="imgUrl + detail.goodsAttr"></image>
					<view class="right">
						<text class="price">¥{{detail.skuPrice||detail.initPrice}} </text>
						<!-- <text class="stock">库存：188件</text> -->
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in property" :key="sIndex" v-if="sItem.userSelect">
								{{sItem.propertyValue}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in property" :key="index" class="attr-list" v-if="item.userSelect">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text 
							v-for="(childItem, childIndex) in item.propertyChild" 
							:key="childIndex" class="tit"
							:class="{selected: item.propertyValue==childItem}"
							@click="selectSpec(item, childItem)"
						>
							{{childItem}}
						</text>
					</view>
				</view>
				<view class="attr-list" style="position: relative;">
					<text>数量</text>
					<uni-number-box
						class="step"
						:min="1" 
						:max="99"
						:value="count>99?99:count"
						:isMax="count>=99?true:false"
						:isMin="count===1"
						@eventChange="numberChange"
						style="height:70upx;float: right;margin-top:10upx"
					></uni-number-box>
				</view>
				
				<button class="btn" @click="toggleSpec('go')">完成</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'; 
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default{
		components: {
			uniNumberBox
		},
		data() {
			return {
				imgUrl:this.$imgUrl,
				specClass: 'none',
				detail:{},
				imgList: [],
				property:[],
				showProperty:false,
				toggleType:'',
				count:1
			};
		},
		async onLoad(options){
			
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			let goodsId = options.goodsId;
			if(goodsId){
				this.getdetail(goodsId)
			}
			
		},
		onShareAppMessage(options) {
			return {
			  title: '自定义分享标题',
			  path: '/pages/product/product?goodsId=' + options.goodsId
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods:{
			getdetail(goodsId){
				let params = {
					data:{
						goodsId:goodsId,
					},
					url:this.$url + 'goodsInfo/selectByGoodsId'
				}
				this.$http(params).then(res=>{
					if (res.data.result) {
						this.detail = res.data.result
						this.detail.goodsPropertyList.map(x=>{
							var obj = {
								id:x.id,
								name:x.name,
								fieldName:x.fieldName,
								propertyValue:'',
								propertyChild:x.propertyValue.split(';'),
							}
							if (x.userSelect) {
								this.showProperty = true
								obj.userSelect=true
							} else {
								obj.propertyValue = x.propertyValue
								obj.userSelect = false
							}
							this.property.push(obj)
						})
						this.imgList = this.detail.goodsImg.split(';')
					}
				})
			},
			numberChange(data){
				this.count = data.number;
			},
			addcart() {
				if (this.propertyV()) {
					this.$api.msg(`请选择规格`);
					this.specClass = 'show'
					this.toggleType = 'addcart'
					return
				}
				this.notUserSelect()
				if (!this.detail.skuId) {
					this.$api.msg(`该系列暂未定价，请联系商家处理`);
					return
				}
				let params = {
					data:{
						goodsId:this.detail.goodsId,
						addGoodsPropertyRequestList:this.property,
						skuIdList:[this.detail.skuId]
					},
					url:this.$url + 'shoppingCart/addShoppingCart',
					type:'post'
				}
				this.$http(params).then(res=>{
					if (res.data.result) {
						this.$api.msg(`加入购物车成功`);
					} else {
						this.$api.msg(`添加购物车失败`);
					}
				})
			},
			propertyV(){
				let ok = false
				if(this.property.length>0) {
					this.property.map(x=>{
						if(x.propertyValue==''&&x.userSelect) {
							ok = true
						}
					})
				}
				return ok
			},
			notUserSelect(){
				if (this.detail.goodsPropertySkuList.length==1 && !this.propertyV()) {
					this.detail.skuId = this.detail.goodsPropertySkuList[0].skuId
					console.log(this.detail.skuId)
				}
			},
			//规格弹窗开关
			toggleSpec(qw) {
				if(this.detail.skuId && qw == 'go') {
					if (this.toggleType == 'buy'){
						this.buy()
					} else {
						this.addcart()
					}
				}
				
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
				
			},
			//选择规格
			selectSpec(item, childItem){
				this.$set(item, 'propertyValue', childItem);
				var list = this.property.map(x=>{
					var obj = {
						fieldName:x.fieldName,
						name:x.name,
						propertyValue:x.propertyValue,
					}
					return obj
				})
				var sku =  JSON.stringify(list)
				this.detail.goodsPropertySkuList.map(n=>{
					if (n.sku == sku) {
						this.detail.skuPrice = n.price
						this.detail.skuId = n.skuId
						this.$set(this.detail,'skuPrice',n.price)
					}
				})
			},
			buy(){
				if (this.propertyV()) {
					this.$api.msg(`请选择规格`);
					this.specClass = 'show'
					this.toggleType = 'buy'
					return
				}
				this.notUserSelect()
				if (!this.detail.skuId) {
					this.$api.msg(`该系列暂未定价，请联系商家处理`);
					return
				}
				let order = {
				    count: this.count,
				    goodsId: this.detail.goodsId,
					title:this.detail.title,
				    initPrice: this.detail.skuPrice||this.detail.initPrice,
					goodsAttr:this.detail.goodsAttr,
					property:this.property,
					skuId:this.detail.skuId
				}
				let orderList = []
				console.log(order)
				orderList.push(order)
				// for (var i=0;i<3;i++) {
				// 	orderList.push(order)
				// }
				wx.setStorage({key:'orderList',data:orderList})
				if(!this.hasLogin){
					uni.navigateTo({
						url: `/pages/public/login`
					})
				} else {
					uni.navigateTo({
						url: `/pages/order/createOrder`
					})
				}
				
			},
			stopPrevent(){}
		},

	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position:relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}
	
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10upx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 10upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				/* height: 60upx; */
				padding: 10upx 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 210upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
