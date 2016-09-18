<script>
  (function () {
    var designWidth = window.designWidth;
    window.addEventListener("resize", (function () {
      var width = designWidth || 720;		// 设计稿宽度 || iPhone 6 plus宽度
      var clientWidth = document.documentElement.clientWidth;
      if(clientWidth > 720){
        clientWidth = 720;
      }else if(clientWidth < 360){
        clientWidth = 360;
      }
      document.documentElement.style.fontSize = (clientWidth / width) * 100 + "px";
      return arguments.callee
    })(), false);
    window.designWidth = null;
  })();
</script>
