import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {}
	},
	mutations: {
		login(state, provider) {
			console.log(state,provider)
			if (provider && provider.parentPopuCode) {
				state.hasLogin = true;
				state.userInfo = provider;
				uni.setStorage({//缓存用户登陆状态
				    key: 'userInfo',  
				    data: provider  
				})
			} else {
				state.hasLogin = false;
				if (provider.isLoginPage){
					uni.navigateTo({
						url:'/pages/user/popuCode'
					}) 
				} else {
					uni.redirectTo({
						url:'/pages/user/popuCode'
					}) 
				}
				
				
			}
			// console.log(state.userInfo);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
          key: 'userInfo'  
      })
		}
	},
	actions: {
	
	}
})

export default store
