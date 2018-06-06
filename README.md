# RWD圖片輪播插件 RWD Image slider
## 可拖曳、點擊切換、自訂寬高比例，自訂按鈕顏色，使用jquery.

live demo https://hsimao.github.io/slider-image-jq/

### 使用方式1 - 引入插件CSS
    <link rel="stylesheet" href="./css/style.css">
### 使用方式2 - 引入jQuery
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
### 使用方式3 - 引入插件js
    <script src="./js/js.js"></script>

### 基礎設置
    $('.slider')._slider('')

### 自訂參數
    $('.slider')._slider({
        duration: 4000,       //輪播間隔
        color: 'yellow',      //自訂顏色
        aspectRatio: '9/18',  //比例設定
        height: '250px',      //自訂高度
        maxWidth: '900px',    //自訂最大寬度
        isShadow: true        //顯示陰影
    })