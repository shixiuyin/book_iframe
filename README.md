# Java核心快速入门


<link rel="stylesheet" href="//cdn.bootcss.com/gitalk/1.5.0/gitalk.min.css">
<script src="//cdn.bootcss.com/gitalk/1.5.0/gitalk.min.js"></script>
<div id="gitalk-container"></div>
<script>
    var gitalk = new Gitalk({
    clientID: 'ea29097a2b9bf811f1db', // GitHub Application Client ID
    clientSecret: 'cdf360ca85cf7193dc4faa9467adf8c4068d9049', // GitHub Application Client Secret
    repo: 'blog-comments',              // 存放评论的仓库
    owner: 'shixiuyin',          // 仓库的创建者，
    admin: ['shixiuyin','hzittest'],        // 如果仓库有多个人可以操作，那么在这里以数组形式写出
    id: location.pathname,      // 用于标记评论是哪个页面的，确保唯一，并且长度小于50
    });
    gitalk.render('gitalk-container');    // 渲染Gitalk评论组件
 </script>