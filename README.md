# count-down-timer
## jQuery extend 倒數計時器插件

live demo https://hsimao.github.io/jquery-count-down-timer

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