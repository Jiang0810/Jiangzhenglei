;(function($) {

//这是万恶的全局变量
var Global = {
    section_name : [],
    isScrolling : true,
    section_num : 1
};
//缓出现函数
Global.fadeInByOrder = function(selector,interval,callback){
    var i = 1,
        length = $(selector+' .fade').length + 1,
        intervala = interval || 100,
        callbacka = callback || function(){ return; };

    (function fadeInIt(){
        if ( i < length ) {
            $(selector+' .fade'+i).addClass('fade-in');
            i++;
            setTimeout( arguments.callee , intervala );
            if ( i === length) {
                callbacka();
            }
        }
    })();
};
//函数节流
Global.throttle = function(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
};
//重新计算元素位置
Global.reCal = function(){

    //居中加载动画
    (function centerLoading() {
        if ( !$('body').hasClass('finish-loading') ) {
            var topOffset = ( $(window).height() - 175 ) / 2  ,
                leftOffset = ( $(window).width() - $('loading').width() ) / 2 - 60;

            $('.loading').css({
                top: topOffset,
                left: leftOffset,
                right: 'auto',
                bottom: 'auto'
            });
        }
    })();

    //处理每个区块
    $('.section-wrap').each(function(index, el) {
        Global.section_name[index] = $(this).attr('class').substr(($(this).attr('class').indexOf('section-wrap ')+13));
        $(this).find('.section').height($(window).height());
    });

    //高度居中主体内容
    $('.section-content').each(function(){
        $(this).css({
            marginTop: ( $(window).height() - 40 - $(this).height() ) / 2
        });
    });

};
//处理首页背景图片
Global.fixedbg = function(){
    var slide_rate = 1000 / 667,
        window_rate;
    (function(){
        window_rate = $(window).width() / $(window).height();
        if ( window_rate < slide_rate ) {
            $('.home-bg img').css({height:$(window).height()+'px',width:($(window).height()*slide_rate)+'px','margin-left':'-'+($(window).height()*slide_rate-$(window).width())/2+'px'});
        }else{
            $('.home-bg img').css({height:($(window).width()/slide_rate)+'px',width:$(window).width()+'px','margin-left':0});
        }
    })();
};
//头部交互
Global.shrinkHeader = function(doShrink){
    if (doShrink) {
        $('.section-header').addClass('shrink');
    }else{
        $('.section-header').removeClass('shrink');
    }
};
//高亮菜单
Global.fire_nav = function(theNav){
    $('.nav .fade').removeClass('hover');
    switch(theNav){
        case 2:
            $('.nav .fade1').addClass('hover');
            break;
        case 3:
            $('.nav .fade4').addClass('hover');
            break;
        case 4:
            $('.nav .fade2').addClass('hover');
            break;
        case 5:
            $('.nav .fade3').addClass('hover');
            break;
    }
};
//鼠标滚动后处理函数
Global.scrollHandle = function(scrollDown){
    if (!Global.isScrolling) {
        
        Global.isScrolling = true;
        var targetScrollTopValue = scrollDown ? Global.targetScrollTop(++Global.section_num) : Global.targetScrollTop(--Global.section_num);
        
        if ( scrollDown ) {
            if ( Global.section_num > 1 ) {
                Global.shrinkHeader(true);
            }
        }else{
            if ( Global.section_num === 1 ) {
                Global.shrinkHeader(false);
            }
        }

        $('html,body').animate({scrollTop: targetScrollTopValue}, 600,function(){
            Global.isScrolling = false;
        });
        Global.fire_nav(Global.section_num);
    
    }
};
//计算要滚动到的高度
Global.targetScrollTop = function(n){
    if(n > Global.section_name.length){
        Global.section_num = Global.section_name.length;    
    }
    if(n < 1){
        Global.section_num = 1; 
    }
    return ($(window).height() * (Global.section_num - 1));
};
//根据 CSS3 判断屏幕
//原理：http://yujiangshui.com/use-javascript-css-media-queries-detect-device-state/
Global.forRetina = function(){

    $('body').append('<div class="state-indicator"></div>');

    function getDeviceState() {
        switch(parseInt($('.state-indicator').css('z-index'),10)) {
            case 1:
                return false;
            case 2:
                return true;
        }
    }

    if( getDeviceState() ){
        Global.changeDBImg();
    }

    $('.state-indicator').remove();
};
//将 img 处理成 @2x 像素
Global.changeDBImg = function(){
    function changeDBURL(imgURL,imgType){
        return imgURL.substring(0,imgURL.indexOf('.'+imgType)) + '@2x.' + imgType;
    }
    $('.my-photo').attr('src',function(){
        return changeDBURL($(this).attr('src'),'jpg');
    });
};
//面向平板电脑的触摸手势
Global.handleTouchEvent = function(event){
    if (event.touches.length == 1) {

        var touchStartY,
            touchMoveY;

        switch (event.type) {
            case "touchstart":
                touchStartY =  event.touches[0].clientY;
                break;
            case "touchmove":
                touchMoveY  =  event.changedTouches[0].clientY;
                break;
        }
        Global.scrollHandle( touchStartY > touchMoveY ? true : false );

    }
    event.preventDefault();
};


$(document).ready(function() {

    $('a[href="#"]').click( function(e) { e.preventDefault(); return false; } );

    Global.reCal();
    Global.fixedbg();
    Global.forRetina();

    $('.nav a').click(function(e) {

        var target = $(this).attr('href');
        switch(target){
            case '#top':
                target = 1;
                break;
            case '#about':
                target = 2;
                break;
            case '#works':
                target = 3;
                break;
            case '#skill':
                target = 4;
                break;
            case '#contact':
                target = 5;
                break;
        }
        Global.section_num = target;
        if ( target == 1 ) {
            Global.shrinkHeader(false);
            $('.nav .fade').removeClass('hover');
        }else{
            Global.fire_nav(target);
            Global.shrinkHeader(true);
        }
        $('body,html').animate({scrollTop:Global.targetScrollTop(target)},600,function(){
            
        });

        e.preventDefault(); return false;
    });

    $('.scroll-tip').click(function(event) {
        if (!Global.isScrolling) {
            Global.isScrolling = true;
            $('html,body').animate({scrollTop: Global.targetScrollTop(++Global.section_num)}, 400,function(){
                Global.isScrolling = false;
            });
            if ( Global.section_num > 1 ) {
                Global.shrinkHeader(true);
            }
        }
    });

});


window.onresize = Global.throttle(function(){
        Global.reCal();
        Global.fixedbg();
    },50);


$(window).load(function() {

    Global.fixedbg();
    Global.reCal();
    $('html,body').animate({scrollTop:0}, 100);
    Global.isScrolling = false;

    // Directly show content — skip loading spinner
    $('.back-home').css('opacity',1);
    $('.loading').remove();
    $("body").addClass('finish-loading');
    $('body').removeClass('loading-process');

    Global.fadeInByOrder('.nav',80,function(){
        Global.fadeInByOrder('.section-fristpage',120);
    });

});

window.onscroll = Global.throttle(function(){

        $('body').removeClass('finish-loading');
        var fadeInTarget;
        switch(Global.section_num){
            case 1:
                fadeInTarget = '.section-fristpage';
                $('body').addClass('finish-loading');
                break;
            case 2:
                fadeInTarget = '.about-content';
                break;
            case 3:
                fadeInTarget = '.works-list';
                break;
            case 4:
                fadeInTarget = '.skill-content';
                break;
            case 5:
                fadeInTarget = '.contact-content';
                break;
        }

        Global.fadeInByOrder(fadeInTarget,100);

    },50);

//判断鼠标滚动方向
$(document).on('mousewheel DOMMouseScroll', function(e){
    var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail,
        isMouseScrollDown = delta < 0 ? true : false;

    //处理好上下元素数组，开始滚动
    if (isMouseScrollDown) { //鼠标向下滚动

        Global.scrollHandle(true);

    }else{

        Global.scrollHandle(false);

    }

    e.preventDefault();
});


})(jQuery);

/* ============================================
   Edit Mode — toggle contenteditable & save
   ============================================ */
(function() {
  'use strict';

  var editBtn = document.querySelector('.edit-btn');
  if (!editBtn) return;

  var isEditing = false;
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  var pendingImg = null;

  // Elements that should be editable
  var TEXT_SELECTORS = 'p, h1, h2, li, .nav li a, .contact-ways li, .section-content p';

  function enableEditMode() {
    document.body.classList.add('is-editing');
    editBtn.classList.add('is-active');
    editBtn.textContent = '💾';
    editBtn.title = '保存修改';
    isEditing = true;

    // Make text editable
    var els = document.querySelectorAll(TEXT_SELECTORS);
    for (var i = 0; i < els.length; i++) {
      els[i].setAttribute('contenteditable', 'true');
      // Prevent link navigation while editing
      els[i].addEventListener('click', preventNav);
    }

    // Make images clickable for replacement
    var imgs = document.querySelectorAll('img');
    for (var j = 0; j < imgs.length; j++) {
      imgs[j].addEventListener('click', imgClickHandler);
    }
  }

  function disableEditMode() {
    document.body.classList.remove('is-editing');
    editBtn.classList.remove('is-active');
    editBtn.textContent = '✎';
    editBtn.title = '编辑模式';
    isEditing = false;

    // Remove contenteditable and nav listeners
    var els = document.querySelectorAll(TEXT_SELECTORS);
    for (var i = 0; i < els.length; i++) {
      els[i].removeAttribute('contenteditable');
      els[i].removeEventListener('click', preventNav);
    }

    // Remove image listeners
    var imgs = document.querySelectorAll('img');
    for (var j = 0; j < imgs.length; j++) {
      imgs[j].removeEventListener('click', imgClickHandler);
    }
  }

  function preventNav(e) {
    if (!isEditing) return;
    if (e.currentTarget.tagName === 'A') e.preventDefault();
  }

  function imgClickHandler(e) {
    if (!isEditing) return;
    e.preventDefault();
    pendingImg = { el: e.currentTarget, isAvatar: false };
    fileInput.click();
  }

  function saveHTML() {
    // Before saving, exit edit mode to clean up attributes
    if (isEditing) disableEditMode();

    var html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  editBtn.addEventListener('click', function() {
    if (isEditing) {
      saveHTML();
    } else {
      enableEditMode();
    }
  });

  // Avatar background-image replacement
  var avatarEl = document.querySelector('.nav .back-home a');
  if (avatarEl) {
    avatarEl.addEventListener('click', function(e) {
      if (!isEditing) return;
      e.preventDefault();
      pendingImg = { isAvatar: true, el: avatarEl };
      fileInput.click();
    });
  }

  // Unified fileInput change handler for both <img> and CSS avatar

  fileInput.addEventListener('change', function() {
    if (!pendingImg || !fileInput.files || !fileInput.files[0]) return;
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(ev) {
      if (pendingImg.isAvatar) {
        pendingImg.el.style.backgroundImage = 'url(' + ev.target.result + ')';
        // Also update the loading avatar and favicon
        var avatarImgs = document.querySelectorAll('.loading-avatar img');
        for (var k = 0; k < avatarImgs.length; k++) {
          avatarImgs[k].src = ev.target.result;
        }
        var favicon = document.querySelector('link[rel="shortcut icon"]');
        if (favicon) favicon.href = ev.target.result;
      } else if (pendingImg.el.tagName === 'IMG') {
        pendingImg.el.src = ev.target.result;
      }
      pendingImg = null;
      fileInput.value = '';
    };
    reader.readAsDataURL(file);
  });

  // Keyboard shortcut: Esc to cancel edit mode
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isEditing) {
      disableEditMode();
      editBtn.textContent = '✎';
      editBtn.title = '编辑模式';
    }
  });
})();

/* ============================================
   Project Detail Overlay
   ============================================ */
(function() {
  var overlay = document.getElementById('project-overlay');
  if (!overlay) return;
  var backBtn = document.getElementById('detail-back');
  var titleEl = document.getElementById('detail-title');
  var subEl = document.getElementById('detail-sub');
  var bodyEl = document.getElementById('detail-body');
  var linkEl = document.getElementById('detail-link');

  var showcaseEl = document.getElementById('detail-showcase');
  var showcaseLink = document.getElementById('detail-showcase-link');
  var videoPlaceholder = document.getElementById('video-placeholder');
  var detailVideo = document.getElementById('detail-video');

  var projects = {
    shenfei: {
      title: '✈ 航空工业沈阳飞机工业集团有限公司',
      sub: '智能化数字化中心 · AI应用工程师 · 2026.2 – 2026.4',
      body: '<p><strong>基于大语言模型采用RAG检索增强的航空零件工艺生成系统</strong></p>' +
        '<p><strong>1. RAG工艺生成链搭建</strong><br>' +
        '针对传统工艺生成效率低的问题，使用 Claude Code 基于 Langchain 框架构建 RAG 检索增强生成链，结合 BGE 中文嵌入模型与 FAISS 向量索引库。完成 6k+ 条数据的清洗、预处理与向量化。</p>' +
        '<p><strong>2. 对比实验与效果评估</strong><br>' +
        '设计并执行 5 组对比实验，覆盖检索策略、示例数量与模型架构等。实现编辑距离、BLEU-1/4、ROUGE-L 三类评估指标，在 5,533 样本上达到工艺相似率 0.93。</p>' +
        '<p><strong>3. Prompt工程与缓存优化</strong><br>' +
        '设计多层级 Prompt 模板引导大模型输出结构化工序序列。编写工序简述实现信息去噪，设计 RAG 缓存预计算机制提升检索效率。</p>',
      link: 'https://github.com/Jiang0810',
      showcaseLink: null,
      video: null
    },
    hetao: {
      title: '🧠 北京聪明核桃教育科技有限公司',
      sub: '教研部 · AI产品经理 · 2026.5 – 2026.7',
      body: '<p><strong>Dify 工作流搭建 · 课程内容生成 Agent 系统</strong></p>' +
        '<ul>' +
        '<li>输出完整 PRD 需求文档，明确系统功能架构、调用链路与验收标准</li>' +
        '<li>设计并落地基于 Dify 平台的课程内容生成 Agent 系统</li>' +
        '<li>独立开发编程题解生成专属 Skill 嵌入工作流</li>' +
        '<li>单课时生产周期从 <strong>3 天缩短至 4 小时</strong></li>' +
        '<li>支撑暑期 20+ 节 AI 启蒙课的规模化内容交付</li>' +
        '</ul>',
      link: 'https://github.com/Jiang0810',
      showcaseLink: null,
      video: null
    },
    missile: {
      title: '🚀 导弹协同攻击系统',
      sub: '第二作者 / Python开发 / 全国计算机设计大赛二等奖',
      body: '<ul>' +
        '<li>基于 Python + A* 搜索算法实现导弹协同供给系统</li>' +
        '<li>采用 Voronoi 图对战场建模，极大加快搜索速度</li>' +
        '<li>结合威胁代价等多价值综合设计目标函数</li>' +
        '<li>本人负责编写 A* 算法核心逻辑</li>' +
        '</ul>',
      link: 'https://github.com/Jiang0810/Missle',
      showcaseLink: null,
      video: null
    },
    'phantom-go': {
      title: '⚫ Phantom-Go 围棋博弈程序',
      sub: '第一作者 / C++开发 / 全国计算机博弈大赛三等奖',
      body: '<ul>' +
        '<li>基于 C++ + 蒙特卡洛树搜索（MCTS）实现围棋对战程序</li>' +
        '<li>前期固定策略 + 后期启发式搜索策略</li>' +
        '<li>动态轮数迭代搜索（10w → 3w）</li>' +
        '<li>本人负责除测试外的全部开发工作</li>' +
        '</ul>',
      link: 'https://github.com/Jiang0810/Phantom-Go',
      showcaseLink: null,
      video: null
    },
    'rapid-dev': {
      title: '⚡ 一小时快速开发 APP 与管理系统',
      sub: 'AI辅助全链路开发 · Uniapp + Vue3 + SpringBoot · 2小时交付',
      body: '<p><strong>vibe-coding 快速开发实践</strong></p>' +
        '<p>基于 AI 编程方法论（需求描述 → AI生成 → Review → 测试 → 交付），在 1-2 小时内完成从前端到后端的全链路功能开发：</p>' +
        '<ul>' +
        '<li><strong>微信小程序</strong>：使用 Uniapp + HBuilderX 快速搭建，AI 辅助生成页面结构与交互逻辑</li>' +
        '<li><strong>iOS / Android App</strong>：基于 Uniapp 跨端编译，一套代码多端发布</li>' +
        '<li><strong>Web 后台管理系统</strong>：Vue3 + SpringBoot + MybatisPlus，包含权限管理、数据可视化等模块</li>' +
        '<li><strong>数据库设计</strong>：AI 辅助完成 MySQL 表结构设计与 SQL 优化</li>' +
        '</ul>' +
        '<p>技术栈：Uniapp、HBuilderX、Vue3、JavaScript、CSS、HTML、SpringBoot、MybatisPlus、MySQL</p>',
      link: 'https://github.com/Jiang0810',
      showcaseLink: null,
      video: null
    },
    certificates: {
      title: '🏆 获奖证书与证明材料',
      sub: '竞赛奖项 · 技能认证 · 英语能力',
      body: '<p><strong>竞赛获奖</strong></p>' +
        '<ul>' +
        '<li>🥈 全国大学生计算机设计大赛 · <strong>全国二等奖</strong></li>' +
        '<li>📊 第32次CCF-CSP认证（算法比赛）· <strong>全国前20%</strong></li>' +
        '<li>🥉 全国大学生计算机博弈大赛 · <strong>全国三等奖</strong></li>' +
        '</ul>' +
        '<p><strong>英语能力</strong></p>' +
        '<ul>' +
        '<li>📝 英语六级 · <strong>488分</strong>，具备基本的口语交流能力</li>' +
        '</ul>' +
        '<p><strong>学历背景</strong></p>' +
        '<ul>' +
        '<li>🎓 沈阳航空航天大学 · 计算机科学与技术 · 2022.09 – 2026.07</li>' +
        '<li>📚 高考 583 分，主修：数据结构、算法、OS、计网、数据库、软件工程</li>' +
        '</ul>',
      link: null,
      showcaseLink: null,
      video: null
    }
  };

  function openProject(id) {
    var p = projects[id];
    if (!p) return;
    titleEl.textContent = p.title;
    subEl.textContent = p.sub;
    bodyEl.innerHTML = p.body;
    linkEl.href = p.link;
    linkEl.style.display = 'inline-block';

    // Showcase link
    if (p.showcaseLink) {
      showcaseEl.style.display = 'block';
      showcaseLink.href = p.showcaseLink;
      showcaseLink.style.display = 'inline-flex';
    } else {
      showcaseLink.style.display = 'none';
    }

    // Video
    if (p.video) {
      videoPlaceholder.style.display = 'none';
      detailVideo.style.display = 'block';
      detailVideo.src = p.video;
      detailVideo.load();
      showcaseEl.style.display = 'block';
    } else {
      videoPlaceholder.style.display = 'flex';
      detailVideo.style.display = 'none';
      detailVideo.src = '';
    }

    if (!p.showcaseLink && !p.video) {
      showcaseEl.style.display = 'none';
    }

    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeProject() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.works-item[data-project]').forEach(function(el) {
    el.addEventListener('click', function() {
      openProject(this.getAttribute('data-project'));
    });
  });

  // Video upload via placeholder click (uses edit mode file input)
  videoPlaceholder.addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var url = URL.createObjectURL(file);
      videoPlaceholder.style.display = 'none';
      detailVideo.style.display = 'block';
      detailVideo.src = url;
      detailVideo.load();
      showcaseEl.style.display = 'block';
    };
    input.click();
  });

  backBtn.addEventListener('click', closeProject);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeProject();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeProject();
  });
})();

