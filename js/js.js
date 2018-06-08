$.fn.extend({
    _slider: function(def){
        // base 參數
        let index = 0
        let nextIndex = 0
        let imgWidth = null  // 取得item寬
        let items = this.find('.u-slider-item')
        let timer = null     // 切換動換timmer
        let timerAuto = null // 自動切換timer
        let touchDiff = 0    // 拖曳距離
        let startX = null    // 點擊當下x軸
        // dom
        let box = this.find('.u-slider-box')
        let _this = this
        let lastMove = null
        let img = this.find('.u-slider-img')


        // 自訂參數
        var def = {
            color: def.color || '#8e44ad',
            duration: def.duration || 3000,
            aspectRatio: def.aspectRatio || '56.25%',
            height: def.height || 'auto',
            maxWidth: def.maxWidth || '1140px',
            isShadow: def.isShadow || false
        }


        // 計算 width, 設定比例、初始自訂顏色
        const calcWidth = function(){
            _this.css('max-width', def.maxWidth)
            _this.css('background-color', def.color)
            const link = box.find('.u-slider-link')
            box.css('width', `${items.length*100}%`)
            box.css('height', def.height)
            imgWidth = _this.css('width')
            for (let i=0; i<items.length; i++) {
                items.eq(i).css('width', `${100/items.length}%`)
                link.eq(i).css('padding-top', def.aspectRatio)
            }
        }


        const createTool = function(){
            const colorPrev = `style='border-color: transparent ${def.color} transparent transparent'`
            const colorNext = `style='border-color: transparent transparent transparent ${def.color}'`
            const tool = $('<div class="u-slider-tool"></div>')
            const prev = $('<div class="u-slider-prev"><span class="u-slider-prev-bg"></span><span class="u-slider-prev-icon"'+colorPrev+'></span></div>')
            const next = $('<div class="u-slider-next"><span class="u-slider-next-bg"></span><span class="u-slider-next-icon"'+colorNext+'></span></div>')
            $(tool).append(prev)
            $(tool).append(next)

            // create btn
            const btn = $('<div class="u-slider-btn"></div>')
            for (let i=0; i<items.length; i++) {
                const color = `style="background-color: ${def.color}"`
                const item = $('<div class="u-btn"><span class="u-btn-bg" '+color+'></span></div>')
                item.attr('data-item', i)
                btn.append($(item))
            }
            tool.append(btn)
            _this.append(tool)
        }


        const renderActive = function(){
            if (def.isShadow) _this.addClass('shadow')
            _this.find('.u-slider-tool .u-btn-bg').removeClass('active')
            _this.find('.u-slider-tool .u-btn-bg').eq(index).addClass('active')
        }


        const autoChange = function(){
            clearInterval(timerAuto)
            timerAuto = setInterval(()=>{
                index++
                if (index > items.length -1) {
                    index = 0
                    updateIndex(index)
                } else {
                    updateIndex(index)
                }
            },def.duration)
        }


        // 元素動畫方法
        const makeChange = (el, attr, value, afterFu) => {
            clearInterval(timer)
            let speed = 0
            let currentValue = 0
            timer = setInterval(() => {
                // 換算成百分比
                currentValue = Math.abs(Math.floor((parseInt(el.css(attr)) / parseInt(imgWidth))*100))
                speed = ((value*100) - currentValue) / 7
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)

                if (currentValue == value*100) {
                    el.css(attr, '-'+value*100 + '%')
                    clearInterval(timer)
                    if (afterFu) {
                        afterFu(el)
                    }
                } else {
                    currentValue += speed
                    el.css(attr, '-'+currentValue+'%')
                }
            },30)
        }

        // 轉場期間添加class
        const addClass = () => {
            img.removeClass('before')
            img.removeClass('active')
            img.removeClass('after')
            img.eq(nextIndex+1).addClass('before')
            img.eq(nextIndex-1).addClass('before')
            img.eq(index).addClass('active')
            img.eq(nextIndex-1).addClass('after')
        }

        const updateIndex = function(target){
            // 取出nextIndex
            if (target == 'prev') {
                if (index == 0) {
                    nextIndex = items.length-1
                } else {
                    nextIndex = index-1
                }
            }

            if (target == 'next') {
                if (index == items.length-1) {
                    nextIndex = 0
                } else {
                    nextIndex = index+1
                }
            }

            // addClass()

            if (target === 'prev') {
                index--
                if (index < 0) {
                    index = items.length-1
                    makeChange(box, 'marginLeft' , index)
                } else {
                    makeChange(box, 'marginLeft' , index)
                }
            } else if (target === 'next') {
                index++
                if (index > items.length -1) {
                    index = 0
                    makeChange(box, 'marginLeft' , index)
                } else {
                    makeChange(box, 'marginLeft' , index)
                }
            } else if(typeof target != 'numner') {
                index = target
                makeChange(box, 'marginLeft' , target)
            }
            renderActive()
        }


        const hover = function(){
            $(_this).mouseover(function(){
                clearInterval(timerAuto)
                $(this).addClass('active')
            })
            $(_this).mouseleave(function(){
                $(this).removeClass('active')
                autoChange()
            })
        }()


        const touch = function() {
            _this.on('mousedown touchstart', function(e){
                lastMove = e //將事件儲存
                e.preventDefault()
                clearInterval(timerAuto)
                startX = e.pageX || e.originalEvent.touches[0].pageX
                _this.on('mousemove touchmove', function(e){
                    lastMove = e //將事件儲存
                    const x = lastMove.pageX || lastMove.originalEvent.touches[0].pageX;
                    touchDiff = Math.floor((startX - x) / parseInt(imgWidth) * 70);
                    if ((!index && touchDiff < 0) || (index === index-1 && touchDiff > 0)) touchDiff /= 2;
                    box.css('marginLeft', `calc(-${index*100}% - ${touchDiff}px)`)
                })
            })
        }


        const touchout = function() {
            _this.on('mouseup touchend', function(e){
                // touchen沒有事件座標,必須向上取得touchmove或touchstart資訊
                let lastPageX = lastMove.pageX || lastMove.originalEvent.touches[0].pageX
                e.preventDefault()
                $(_this).off('mousemove touchmove') //取消touch事件
                if (lastPageX == startX ) {
                    //如果沒有移動,當成點擊切換
                    if (e.target.classList.contains('u-btn')) updateIndex($(e.target).attr('data-item'))
                    if (e.target.classList.contains('u-slider-next')) updateIndex('next')
                    if (e.target.classList.contains('u-slider-next-bg')) updateIndex('next')
                    if (e.target.classList.contains('u-slider-prev')) updateIndex('prev')
                    if (e.target.classList.contains('u-slider-prev-bg')) updateIndex('prev')

                } else if (touchDiff > 0 ) {
                    //往左拖曳下一頁
                    updateIndex('next')
                } else if (touchDiff < 0) {
                    //往右拖曳回上一頁
                    updateIndex('prev')
                }
            })
        }


        const init = function() {
            calcWidth()
            createTool()
            renderActive()
            autoChange()
            touch()
            touchout()
            // addClass()
            $(window).resize(()=>{
                calcWidth()
            })
        }()

    }
})
