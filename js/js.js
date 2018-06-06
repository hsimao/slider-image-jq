$.fn.extend({
    _slider: function(def){
        // base 參數
        let speed = 0
        let currentValue = 0
        let index = 0
        let current = null
        let imgWidth = this.css('width') // 取得item寬
        let items = this.find('.slider-item')
        let timer = null
        let timerAuto = null
        let touchDiff = 0
        let startX = null
        // dom
        let box = this.find('.slider-box')
        let _this = this


        // 自訂參數
        var def = {
            color: def.color || '#8e44ad',
            duration: def.duration || 3000,
            aspectRatio: def.aspectRatio || '9 / 16',
            height: def.height || 'auto',
            maxWidth: def.maxWidth || '1140px',
            isShadow: def.isShadow || false

        }


        // 計算 width, 設定比例
        const calcWidth = function(){
            imgWidth = _this.css('width')
            const link = box.find('.slider-link')
            // _this.css('maxWidth', def.maxWidth)
            box.css('width', `${items.length*100}%`)
            box.css('height', def.height)
            for (let i=0; i<items.length; i++) {
                items.eq(i).css('width', `${100/items.length}%`)
                link.eq(i).css('padding-top', `calc(100% * (${def.aspectRatio}))`)
            }
        }


        const createTool = function(){
            const colorPrev = `style='border-color: transparent ${def.color} transparent transparent'`
            const colorNext = `style='border-color: transparent transparent transparent ${def.color}'`
            const tool = $('<div class="slider-tool"></div>')
            const prev = $('<div class="slider-prev"><span class="slider-prev-bg"></span><span class="slider-prev-icon"'+colorPrev+'></span></div>')
            const next = $('<div class="slider-next"><span class="slider-next-bg"></span><span class="slider-next-icon"'+colorNext+'></span></div>')
            $(tool).append(prev)
            $(tool).append(next)

            // create btn
            const btn = $('<div class="slider-btn"></div>')
            for (let i=0; i<items.length; i++) {
                const color = `style="background-color: ${def.color}"`
                const item = $('<div class="btn"><span class="btn-bg" '+color+'></span></div>')
                item.attr('data-item', i)
                item.click(() => updateIndex(i)) // bind event
                btn.append($(item))
            }
            tool.append(btn)
            _this.append(tool)
        }


        const renderActive = function(){
            if (def.isShadow) _this.addClass('shadow')
            $('.slider-tool .btn-bg').removeClass('active')
            $('.slider-tool .btn-bg').eq(index).addClass('active')
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


        const updateIndex = function(target){
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
                e.preventDefault()
                clearInterval(timerAuto)
                startX = e.pageX || e.originalEvent.touches[0].pageX
                _this.on('mousemove touchmove', function(e){
                    const x = e.pageX || e.originalEvent.touches[0].pageX;
                    touchDiff = Math.floor((startX - x) / parseInt(imgWidth) * 70);
                    if ((!index && touchDiff < 0) || (index === index-1 && touchDiff > 0)) touchDiff /= 2;
                    box.css('marginLeft', `calc(-${index*100}% - ${touchDiff}px)`)
                })
            })
        }


        const touchout = function() {
            _this.on('mouseup touchend', function(e){
                e.preventDefault()
                $(_this).off('mousemove touchmove') //取消touch事件

                if (e.pageX == startX ) {
                    //如果沒有移動,當成點擊切換
                    if (e.target.classList.contains('slider-next')) updateIndex('next')
                    if (e.target.classList.contains('slider-next-bg')) updateIndex('next')
                    if (e.target.classList.contains('slider-prev')) updateIndex('prev')
                    if (e.target.classList.contains('slider-prev-bg')) updateIndex('prev')

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
            $(window).resize(()=>{
                calcWidth()
            })
        }()

    }
})