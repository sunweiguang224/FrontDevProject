<script>
  (function () {
    var designWidth = window.designWidth;
    window.addEventListener("resize", (function () {
      var width = designWidth || 414;		// 设计稿宽度 || iPhone 6 plus宽度
      document.documentElement.style.fontSize = (document.documentElement.clientWidth / width) * 100 + "px";
      return arguments.callee
    })(), false);
    window.designWidth = null;
  })();
</script>
