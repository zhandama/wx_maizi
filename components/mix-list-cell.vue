<template>
	<view class="content">		
		<view v-if="!share" class="mix-list-cell" :class="border" @click="eventClick" hover-class="cell-hover"  :hover-stay-time="50">
			<text
				v-if="icon"
				class="cell-icon yticon"
				:style="[{
					color: iconColor,
				}]"
				:class="icon"
			></text>
			<text class="cell-tit clamp">{{title}}</text>
			<text v-if="tips" class="cell-tip">{{tips}}</text>
			<text v-if="nomore" class="cell-more yticon"
				:class="typeList[navigateType]"
			></text>
		</view>
		<button v-if="share" open-type="share" class="mix-list-cell buttonS" @click="eventClick" hover-class="cell-hover"  :hover-stay-time="50">
			<text
				v-if="icon"
				class="cell-icon yticon"
				:style="[{
					color: iconColor,
				}]"
				:class="icon"
			></text>
			<text class="cell-tit clamp">{{title}}</text>
			<text v-if="tips" class="cell-tip">{{tips}}</text>
			<text v-if="nomore" class="cell-more yticon"
				:class="typeList[navigateType]"
			></text>
		</button>
	</view>
</template>
 
<script>
	/**
	 *  简单封装了下， 应用范围比较狭窄，可以在此基础上进行扩展使用
	 *  比如加入image， iconSize可控等
	 */
	export default {
		data() {
			return {
				typeList: {
					left: 'icon-zuo',
					right: 'icon-you',
					up: 'icon-shang',
					down: 'icon-xia'
				},
			}
		},
		props: {
			icon: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: '标题'
			},
			tips: {
				type: String,
				default: ''
			},
			navigateType: {
				type: String,
				default: 'right'
			},
			share: {
				type: Boolean,
				default: false
			},
			border: {
				type: String,
				default: 'b-b'
			},
			hoverClass: {
				type: String,
				default: 'cell-hover'
			},
			iconColor: {
				type: String,
				default: '#333'
			},
			nomore:{
				type: Boolean,
				default: true
			}
		},
		methods: {
			eventClick(){
				this.$emit('eventClick');
			}
		},
	}
</script>

<style lang='scss'>
	.content{
		height:100upx;
	}
	.buttonS{
		text-align: left;background: #fff;border:none;outline:none;height:100upx;
	}
	.buttonS::after{
		position: absolute;transform: scaleY(.5);border-left:0;border-right:0;border-top:0;border-bottom: 1px solid #E4E7ED;left: 30upx;border-radius: 0;content: '';
	}
	.icon .mix-list-cell.b-b:after{
		left: 90upx;
	}
	.mix-list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}

		.cell-icon{
			align-self:center;
			width:56upx;
			max-height:60upx;
			font-size:38upx;
		}
		.cell-more{
			align-self: center;
			font-size:30upx;
			color:$font-color-base;
			margin-left:$uni-spacing-row-sm;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-sm+2upx;
			color: $font-color-light;
		}
	}
</style>
