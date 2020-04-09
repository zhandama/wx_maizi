export default function(param){
    let headerUserToken = wx.getStorageSync('headerUserToken');
    let header = {
        'content-type': 'application/json'
    }
    if(headerUserToken){
        header['headerUserToken'] = headerUserToken
    }
    return new Promise((resolve,reject) => {
        wx.request({
            header:header,
            url: param.url,
            data: param.data,
            method: param.type,
            dataType: 'json',
            success: res => {
				// 需要增加token失效补偿机制
				if (res.data.success){
					resolve(res)
				} else {
					wx.login({
					  success (data) {
					    if (data.code) {
					      //发起网络请求
						  wx.request({
						    url: 'https://www.metsco.net/wx-restapi/api/buyerInfo/login',
						    data: {
						      code: data.code
						    },
							success:function(_data){
								if(_data && _data.data) {
									wx.setStorage({key:'headerUserToken',data:_data.data.result})
									resolve(res)
								}
							}
						  })
					    }
					  }
					})
				}
                // resolve(res)
            },
            fail: res => {
                reject(res)
            },
        });
    })
}