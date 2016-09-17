

var emitter = {
  // 注册事件
  on: function(event, fn) {
    var handles = this._handles || (this._handles = {}),
      calls = handles[event] || (handles[event] = []);

    // 找到对应名字的栈
    calls.push(fn);

    return this;
  },
  // 解绑事件
  off: function(event, fn) {
    //没有传入event或者handles未定义
    if(!event || !this._handles) this._handles = {};
    //再次判断handles是否未定义
    if(!this._handles) return;

    var handles = this._handles , calls;
    //如果事件对应的处理函数存在
    if (calls = handles[event]) {
      //如果fn不存在就解绑所有绑定的函数
      if (!fn) {
        handles[event] = [];
        return this;
      }
      // 否则找到栈内对应listener 并移除
      for (var i = 0, len = calls.length; i < len; i++) {
        if (fn === calls[i]) {
          calls.splice(i, 1);
          return this;
        }
      }
    }
    return this;
  },
  // 触发事件
  emit: function(event){
    var args = [].slice.call(arguments, 1),//传入一个参数时为空数组，多个参数为回调函数所需要的参数
      handles = this._handles, calls;
    //如果handles未定义或者这个事件未定义
    if (!handles || !(calls = handles[event])) return this;
    // 触发所有对应名字的listeners
    for (var i = 0, len = calls.length; i < len; i++) {
      calls[i].apply(this, args)
    }
    return this;
  }
}
//自运行
!function(){
  // 辅助函数：html2node,extend
  // ----------

  // 将HTML转换为节点
  function html2node(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
  }

  // 赋值属性
  // extend({a:1}, {b:1, a:2}) -> {a:1, b:1}
  function extend(o1, o2){
    for(var i in o2) if(typeof o1[i] === 'undefined'){
      o1[i] = o2[i]
    } 
    return o1
  }




  // Modal
  // -------

  var template = 
  '<div class="m-modal">\
    <div class="modal_wrap">\
      <div class="modal_head">标题</div>\
      <div class="modal_body">内容</div>\
      <div class="modal_foot">\
        <a class="confirm" href="#">确认</a>\
        <a class="cancel" href="#">取消</a>\
      </div>\
    </div>\
  </div>';





  function Modal(options){
    options = options || {};
    // 即 div.m-modal 节点
    this.container = this._layout.cloneNode(true);
    // body 用于插入自定义内容
    this.body = this.container.querySelector('.modal_body');
    // 将options 复制到 组件实例上
    extend(this, options);


    this._initEvent();

  }



  extend(Modal.prototype, {
    //下划线代表私有 不推荐组件直接调用
    _layout: html2node(template),

    setContent: function(content){
      if(!content) return;

      //支持两种字符串结构和DOM节点
      if(content.nodeType === 1){ //元素节点

        this.body.innerHTML = 0;
        this.body.appendChild(content);

      }else{

        this.body.innerHTML = content;
      }
    },

    // 显示弹窗
    show: function(content){
      
      if(content) this.setContent(content);

      document.body.appendChild(this.container);
    },

    hide: function(){

      var container = this.container;
      document.body.removeChild(container);
    },



    // 初始化事件
    _initEvent: function(){

      this.container.querySelector('.confirm').addEventListener(
        'click', this._onConfirm.bind(this)
      )
      this.container.querySelector('.cancel').addEventListener(
        'click', this._onCancel.bind(this)
      )
    },

    _onConfirm: function(){
      //第二个参数为注册事件回调需要传入的参数
      this.emit('confirm',"测试")
      this.hide();
    },

    _onCancel: function(){
      this.emit('cancel')
      this.hide();
    }

  })


  // 使用混入Mixin的方式使得Slider具有事件发射器功能
  extend(Modal.prototype, emitter);
  






  //          5.Exports
  // ----------------------------------------------------------------------
  // 暴露API:  
  
    // 直接暴露到全局
    window.Modal = Modal;



}()

