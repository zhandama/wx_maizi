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
                resolve(res)
            },
            fail: res => {
                reject(res)
            },
        });
    })
}