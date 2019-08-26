module.exports = function(id) {
    if (!id) {
        throw new Error('请填写百度统计id');
    }
    var elm = document.createElement('script');
    elm.src = '//hm.baidu.com/hm.js?' + id;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(elm);
}