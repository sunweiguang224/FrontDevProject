/**
 * 请注意，不要改动这个共通。
 * @param uri 提交的地址
 * @param data 普通参数
 * @param $fileDom jQuery包装过的input file dom类型.支持多文件上传.
 * @param cb 回调函数,有这个参数,代表异步提交,没有这个参数,代表同步提交.
 * @author yangfei
 * @deprecated
 *  异步,有文件:ninfor.post('${ctx}/printDemo.shtml?method=upfile',{},jQuery('input[type=file]'),function(sucess,message,data){alert(data.a)})
 *  同步,有文件:ninfor.post('${ctx}/printDemo.shtml?method=upfile',{},jQuery('input[type=file]'))
 *  异步,没文件:ninfor.post('${ctx}/printDemo.shtml?method=upfile',{},null,function(sucess,message,data){alert(data.a)})
 *  同步,没文件:ninfor.post('${ctx}/printDemo.shtml?method=upfile',{})
 */

var ninfor = {};
jQuery.extend(ninfor, {
  createDom: function (id, domType) {
    var formId = 'jQuery' + domType + id;
    var io = document.createElement(domType);
    io.id = formId;
    io.name = formId;
    io.style.position = 'absolute';
    io.style.top = '-1000px';
    io.style.left = '-1000px';
    document.body.appendChild(io);
    return io;
  },
  createUploadIframe: function (id) {
    return this.createDom(id, 'iframe');
  },
  createUploadForm: function (id) {
    return this.createDom(id, 'form');
  },
  ajaxUpload: function (s) {

    //回调函数.
    var uploadCallback = function () {
      var responseObj = {};
      //后台返回
      var responseText = null;
      if (io.contentDocument) {
        responseText = jQuery(io.contentWindow.document.body.innerHTML).html();
      }
      else if (io.contentWindow) {
        responseText = io.contentWindow.document.body.innerText;
      }
      s.complete(responseText);
      //setTimeout(function(){ document.body.removeChild(io);document.body.removeChild(uploadform); }, 100);
    }

    s = jQuery.extend({}, jQuery.ajaxSettings, s);

    var id = new Date().getTime();
    var io = this.createUploadIframe(id);

    var uploadform = jQuery("#" + s.fileFormId).get(0);
    jQuery(uploadform).find("input[type=hidden]").remove();
    uploadform.action = s.url;
    uploadform.method = 'POST';
    uploadform.target = io.id;
    //jQuery(uploadform).append(s.$fileDom.clone());

    //设定普通参数.
    if (s.data) {
      for (var key in s.data) {
        var thisFormEl = document.createElement('input');
        thisFormEl.type = 'hidden';
        thisFormEl.name = key;
        thisFormEl.value = s.data[key];
        uploadform.appendChild(thisFormEl);
      }
    }

    //设定是否支持文件上传.
    if (uploadform.encoding) {
      uploadform.encoding = 'multipart/form-data';
    } else {
      uploadform.enctype = 'multipart/form-data';
    }

    uploadform.submit();

    if (window.attachEvent) {
      io.attachEvent('onload', uploadCallback);
    } else {
      io.addEventListener('load', uploadCallback, false);
    }
  },
  commonUpload: function (s) {
    var id = new Date().getTime();
    var uploadform;
    if (s.fileFormId) {
      uploadform = jQuery("#" + s.fileFormId).get(0);
      //jQuery(uploadform).find("input[type=hidden]").remove();

      //设定是否支持文件上传.
      if (uploadform.encoding) {
        uploadform.encoding = 'multipart/form-data';
      } else {
        uploadform.enctype = 'multipart/form-data';
      }
    } else {
      uploadform = this.createUploadForm(id);
    }

    uploadform.action = s.url;
    uploadform.method = 'POST';

    //是否打开新窗口
    if (s.data._target) {
      uploadform.target = s.data._target;
    }

    //设定普通参数.
    if (s.data) {
      for (var key in s.data) {
        if (key.substr(0, 1) != "_") {
          var thisFormEl = document.createElement('input');
          thisFormEl.type = 'hidden';
          thisFormEl.name = key;
          thisFormEl.value = s.data[key];
          uploadform.appendChild(thisFormEl);
        }
      }
    }

    uploadform.submit();
  },
  post: function (uri, data, fileFormId, cb) {
    data = data || {};
    var createComplete = function (cb) {
      return function (data) {
        cb(data);
      };
    };
    if (typeof cb != "undefined") {
      if (fileFormId == null) {
        jQuery.post(uri, data,
          function (datas, textStatus) {
            cb(datas);
          },
          "text"
        );
      } else {
        this.ajaxUpload({
          url: uri,
          data: data,
          fileFormId: fileFormId,
          complete: createComplete(cb)
        });
      }
    } else {
      this.commonUpload({
        url: uri,
        data: data,
        fileFormId: fileFormId
      });
    }
  }
});

/**
 * 判断浏览器类型,操作系统类型.
 */
var ua = navigator.userAgent.toLowerCase();
jQuery.extend(ninfor, {
  isStrict: document.compatMode == "CSS1Compat", // 是否定义DOCUMENT类型
  isOpera: ua.indexOf("opera") > -1, // 是Opera
  isChrome: ua.indexOf("chrome") > -1, //是Chrome
  isSafari: !ninfor.isChrome && (/webkit|khtml/).test(ua), //是Safari
  isSafari3: ninfor.isSafari && ua.indexOf("webkit/5") != -1, // Safari3
  isIE: "\v" == "v", // IE
  isIE6: !ninfor.isOpera && ua.indexOf("msie") > -1, //IE6
  isIE7: !ninfor.isOpera && ua.indexOf("msie 7") > -1, // IE7
  isIE8: !ninfor.isOpera && ua.indexOf("msie 8") > -1, //IE8
  isGecko: !ninfor.isSafari && !ninfor.isChrome && ua.indexOf("gecko") > -1, // Gecko内核
  isGecko3: ninfor.isGecko && ua.indexOf("rv:1.9") > -1, // Gecko3内核
  isBorderBox: ninfor.isIE && !isStrict, // 使用盒模型
  isWindows: (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1), // 是Windows系统
  isMac: (ua.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1), // 是MacOS系统
  isAir: (ua.indexOf("adobeair") != -1), // 是用Adobe Air浏览
  isLinux: (ua.indexOf("linux") != -1), // 是Linux系统
  isSecure: window.location.href.toLowerCase().indexOf("https") == 0  // 是SSL浏览
});

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

jQuery.extend(ninfor, {
  cookie: function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
      options = options || {};
      if (value === null) {
        value = '';
        options.expires = -1;
      }
      var expires = '';
      if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        var date;
        if (typeof options.expires == 'number') {
          date = new Date();
          date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        } else {
          date = options.expires;
        }
        expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
      }
      // CAUTION: Needed to parenthesize options.path and options.domain
      // in the following expressions, otherwise they evaluate to undefined
      // in the packed version for some reason...
      var path = options.path ? '; path=' + (options.path) : '';
      var domain = options.domain ? '; domain=' + (options.domain) : '';
      var secure = options.secure ? '; secure' : '';
      document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
  }
});


/**
 * 按钮绑定,有文件上传按钮绑定,图片按钮绑定,文本框提示信息绑定.
 * @param {Object} textId
 * @param {Object} btnId
 */
jQuery(document).ready(function () {
  jQuery(":button[imgBtn=true]").each(function (index, ele) {
    var src = jQuery(ele).attr("src");
    var width = 65;
    if (jQuery(ele).attr("btnWidth")) {
      width = jQuery(ele).attr("btnWidth");
    }
    var height = 21;
    if (jQuery(ele).attr("btnHeight")) {
      height = jQuery(ele).attr("btnHeight");
    }

    jQuery(ele).css({
      backgroundImage: "url(" + src + ")",
      border: "0px solid #FFFFFF",
      padding: "0",
      width: width + "px",
      height: height + "px",
      cursor: "pointer"
    });
  });
  jQuery("input[tip]").each(function () {
    var oldVal = jQuery(this).attr("tip");
    if (jQuery(this).val() == "") {
      jQuery(this).css({"color": "#888"}).val(oldVal);
    }
    jQuery(this).focus(function () {
      if (jQuery(this).val() != oldVal) {
        jQuery(this).css({"color": "#000"});
      } else {
        jQuery(this).val("").css({"color": "#888"});
      }
    });
    jQuery(this).blur(function () {
      if (jQuery(this).val() == "") {
        jQuery(this).val(oldVal).css({"color": "#888"})
      }
    });
    jQuery(this).keydown(function () {
      jQuery(this).css({"color": "#000"})
    });
  });
});

jQuery.extend(ninfor, {
  bindFileUploadTextButton: function (textId, btnId) {
    jQuery("#" + textId).attr("readonly", true);
    jQuery("#" + textId).css("backgroundColor", "#e0e0e0");

    var fontSize = 9;
    if (ninfor.isIE) {
      fontSize = 12;
    }

    var width = 8;
    if (ninfor.isIE8) {
      width = 67;
    }

    jQuery(":button[id=" + btnId + "]").after("<span style='float:left;width:70px;margin-left:6px;background:url(../../images/btn_ll.gif) no-repeat;'><input id='" + btnId + "' name='" + btnId + "' type='file' size='1' style='width:" + width + "px;height:27px;cursor:pointer;font-size:" + fontSize + "px;position:relative;left:-3px;filter:alpha(opacity=0);opacity:0;'/></span>");
    jQuery(":button[id=" + btnId + "]").remove();
    jQuery(":file[id=" + btnId + "]").bind("change", function (event) {
      jQuery("#" + textId).val(jQuery(event.target).val());
    });
  },
  bindImgBtn: function (ele) {
    var src = jQuery(ele).attr("src");

    var width = 65;
    if (jQuery(ele).attr("btnWidth")) {
      width = jQuery(ele).attr("btnWidth");
    }
    var height = 21;
    if (jQuery(ele).attr("btnHeight")) {
      height = jQuery(ele).attr("btnHeight");
    }

    jQuery(ele).css({
      backgroundImage: "url(" + src + ")",
      border: "0px solid #FFFFFF",
      padding: "0",
      width: width + "px",
      height: height + "px",
      cursor: "pointer"
    });
  }
});


/**
 * 弹出层,请注意，不要改动这个共通，求求大家了。
 * @param {Object} contentId
 * @author 李刚
 */
jQuery.extend(ninfor, {
  openDiv: function (contentId) {
    var arrayPageSize = this.getPageSize();
    var arrayPageScroll = this.getPageScroll();

    var Template_Div = '<iframe id="loading-mask-food86-iframe"></iframe><div id="loading-mask-food86"></div>';

    if (document.getElementById("loading-mask-food86-iframe") == null) {
      this.domAppendHtml(Template_Div);
    }

    var bodyBack = document.getElementById("loading-mask-food86");
    var bodyBackFrame = document.getElementById("loading-mask-food86-iframe");

    bodyBack.style.position = "absolute";
    bodyBack.style.width = arrayPageSize[2] + "px";
    bodyBack.style.height = arrayPageSize[3] + "px";
    bodyBack.style.zIndex = 98;
    bodyBack.style.top = 0;
    bodyBack.style.left = 0;
    bodyBack.style.filter = "alpha(opacity=30)";
    bodyBack.style.opacity = 0.30;
    bodyBack.style.background = "#000";

    bodyBackFrame.style.position = "absolute";
    bodyBackFrame.style.width = arrayPageSize[2] + "px";
    bodyBackFrame.style.height = arrayPageSize[3] + "px";
    bodyBackFrame.style.zIndex = 90;
    bodyBackFrame.style.top = 0;
    bodyBackFrame.style.left = 0;
    bodyBackFrame.style.filter = "alpha(opacity=30)";
    bodyBackFrame.style.opacity = 0.30;
    bodyBackFrame.style.background = "#000";


    bodyBackFrame.style.display = "block";
    bodyBack.style.display = "block";

    popupDiv = document.getElementById(contentId);
    popupDiv.style.position = "absolute";
    popupDiv.style.border = "1px solid #ccc";
    popupDiv.style.background = "#fff";
    popupDiv.style.zIndex = 999999;
    var arrayConSize = this.getConSize(contentId);
    popupDiv.style.top = arrayPageScroll[1] + (arrayPageSize[3] - arrayConSize[1]) / 2 - 0 + "px";
    popupDiv.style.left = (arrayPageSize[0] - arrayConSize[0]) / 2 - 0 + "px";
    popupDiv.style.display = "block";
  },

  //获取内容层内容原始尺寸
  getConSize: function (contentId) {
    var conObj = document.getElementById(contentId);
    conObj.style.position = "absolute";
    conObj.style.left = -1000 + "px";
    conObj.style.display = "";
    var arrayConSize = [conObj.offsetWidth, conObj.offsetHeight];
    conObj.style.display = "none";
    return arrayConSize;
  },

  //获取滚动条的高度
  getPageScroll: function () {
    var yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
    }
    else {
      if (document.documentElement && document.documentElement.scrollTop) {
        yScroll = document.documentElement.scrollTop;
      }
      else {
        if (document.body) {
          yScroll = document.body.scrollTop;
        }
      }
    }
    arrayPageScroll = new Array("", yScroll);
    return arrayPageScroll;
  },

  //获取页面实际大小
  getPageSize: function () {
    var xScroll, yScroll;
    if (window.innerHeight && window.scrollMaxY) {
      xScroll = document.body.scrollWidth;
      yScroll = window.innerHeight + window.scrollMaxY;
    }
    else {
      if (document.body.scrollHeight > document.body.offsetHeight) {
        xScroll = document.body.scrollWidth;
        yScroll = document.body.scrollHeight;
      }
      else {
        xScroll = document.body.offsetWidth;
        yScroll = document.body.offsetHeight;
      }
    }
    var windowWidth, windowHeight;
    if (self.innerHeight) {
      windowWidth = self.innerWidth;
      windowHeight = self.innerHeight;
    }
    else {
      if (document.documentElement && document.documentElement.clientHeight) {
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;
      }
      else {
        if (document.body) {
          windowWidth = document.body.clientWidth;
          windowHeight = document.body.clientHeight;
        }
      }
    }
    var pageWidth, pageHeight;
    if (yScroll < windowHeight) {
      pageHeight = windowHeight;
    }
    else {
      pageHeight = yScroll;
    }
    if (xScroll < windowWidth) {
      pageWidth = windowWidth;
    }
    else {
      pageWidth = xScroll;
    }
    arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
    return arrayPageSize;
  },

  //关闭弹出层
  closeDiv: function (contentId) {
    document.getElementById(contentId).style.display = "none";
    document.getElementById("loading-mask-food86").style.display = "none";
    document.getElementById("loading-mask-food86-iframe").style.display = "none";
  },


  domAppendHtml: function (strHtml) {
    var oTmpDiv = document.createElement("div");
    oTmpDiv.innerHTML = strHtml;

    while (oTmpDiv.childNodes.length > 0) {
      document.body.appendChild(oTmpDiv.childNodes[0]);
    }
  }
});


/**
 * 打印
 */
jQuery.extend(ninfor, {
  printAreaCount: 0,
  print: function ($dom) {
    var ele = $dom;

    var idPrefix = "printArea_";

    this.removePrintArea(idPrefix + this.printAreaCount);

    this.printAreaCount++;

    var iframeId = idPrefix + this.printAreaCount;
    var iframeStyle = 'position:absolute;width:0px;height:0px;left:-1000px;top:-1000px;';

    iframe = document.createElement('IFRAME');

    jQuery(iframe).attr({
      style: iframeStyle,
      id: iframeId
    });

    document.body.appendChild(iframe);

    var doc = iframe.contentWindow.document;

    jQuery(document).find("link").filter(function () {
      return jQuery(this).attr("rel").toLowerCase() == "stylesheet";
    }).each(function () {
      jQuery(doc).find('head').append('<link type="text/css" rel="stylesheet" href="' + jQuery(this).attr("href") + '" >');
    });

    jQuery(doc.body).append('<div class="' + ele.attr("class") + '" >' + ele.html() + '</div>');
    doc.close();

    var frameWindow = iframe.contentWindow;
    frameWindow.close();
    frameWindow.focus();
    frameWindow.print();

  },

  removePrintArea: function (id) {
    jQuery("iframe#" + id).remove();
  }
});

/**
 * 省市区三级联动代码
 * @param {Object} provinceDomId
 * @param {Object} cityDomId
 * @param {Object} districtDomId
 */
jQuery.extend(ninfor, {
  renderPlaceSelect: function (provinceDomId, cityDomId, districtDomId) {
    return new placeObject(provinceDomId, cityDomId, districtDomId);
  }
});

var placeObject = function (provinceDomId, cityDomId, districtDomId) {
  this.provinceDomId = provinceDomId;
  this.cityDomId = cityDomId;
  this.districtDomId = districtDomId;
  this.protogetProvinces();

  jQuery("#" + this.provinceDomId).bind("change", {obj: this}, this.getCities);
  jQuery("#" + this.cityDomId).bind("change", {obj: this}, this.getDistricts);

  jQuery("#" + this.provinceDomId).get(0).val = function (value) {
    jQuery(this).val(value);
    jQuery(this).trigger("change");
  };
  jQuery("#" + this.cityDomId).get(0).val = function (value) {
    jQuery(this).val(value);
    jQuery(this).trigger("change");
  };

  if (typeof this.districtDomId != "undefined") {
    jQuery("#" + this.districtDomId).get(0).val = function (value) {
      jQuery(this).val(value);
    };
  }


}

placeObject.prototype.protogetProvinces = function () {
  var pro = "<option value=\"\">全部</option>";
  for (var i = 0; i < provinces.length; i++) {
    pro += "<option value=\"" + provinces[i][1] + "\">" + provinces[i][2] + "</option>";
  }
  jQuery("#" + this.provinceDomId).empty().append(pro);
  this.getCities();
}

placeObject.prototype.getCities = function (event) {
  var obj = (typeof event != "undefined") ? event.data.obj : this;
  var proVal = jQuery("#" + obj.provinceDomId).val();
  obj.showCities(proVal);
  obj.getDistricts();
}

placeObject.prototype.showCities = function (proVal) {
  var cit = "<option value=\"\">全部</option>";
  for (var i = 0; i < cities.length; i++) {
    if (proVal == cities[i][0]) {
      cit += "<option value=\"" + cities[i][1] + "\">" + cities[i][2] + "</option>";
    }
  }
  jQuery("#" + this.cityDomId).empty().append(cit);

}

placeObject.prototype.getDistricts = function (event) {
  var obj = (typeof event != "undefined") ? event.data.obj : this;
  var citVal = jQuery("#" + obj.cityDomId).val();
  obj.showDistricts(citVal);
}

placeObject.prototype.showDistricts = function (citVal) {
  var cou = "<option value=\"\">全部</option>";
  for (var i = 0; i < districts.length; i++) {
    if (citVal == districts[i][0]) {
      cou += "<option value=\"" + districts[i][1] + "\">" + districts[i][2] + "</option>";
    }
  }
  jQuery("#" + this.districtDomId).empty().append(cou);
}

placeObject.prototype.setDefaultPlace = function (provinceId, cityId, districtId) {
  if (jQuery.browser.msie && jQuery.browser.version == "6.0") {
    var o = this;
    setTimeout(function () {
      jQuery("option[value='" + provinceId + "']").attr("selected", true);
      o.showCities(provinceId + "");
      setTimeout(function () {
        jQuery("option[value='" + cityId + "']").attr("selected", true);
      }, 1);
      if (typeof o.districtDomId != "undefined") {
        setTimeout(function () {
          o.showDistricts(cityId + "");
        }, 1);
        jQuery("option[value='" + districtId + "']").attr("selected", true);
      }
    }, 1);
  } else {
    jQuery("#" + this.provinceDomId).val(provinceId);
    jQuery("#" + this.provinceDomId).trigger("change");
    jQuery("#" + this.cityDomId).val(cityId);
    jQuery("#" + this.cityDomId).trigger("change");
    if (typeof this.districtDomId != "undefined") {
      jQuery("#" + this.districtDomId).val(districtId);
    }
  }

  return this;
}


/**
 * 常用工具函数代码
 * @param {Object} o
 */
jQuery.extend(ninfor, {
  //把Object转化成字符串.
  obj2str: function (o) {
    var r = [];
    if (typeof o == "string")
      return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o == "object") {
      if (!o.sort) {
        for (var i in o)
          r.push(i + ":" + this.obj2str(o[i]));
        if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
          r.push("toString:" + o.toString.toString());
        }
        r = "{" + r.join() + "}"
      }
      else {
        for (var i = 0; i < o.length; i++)
          r.push(this.obj2str(o[i]))
        r = "[" + r.join() + "]"
      }
      return r;
    }
    return o.toString();
  },

  //英文数字或者字母，不包含标点符号。
  isEngDigit: function (c) {
    if ((c >= 0x30 && c <= 0x39) || (c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a)) {
      return true
    }
    else {
      return false;
    }
  },

  //判断输入是否是一个整数
  isInt: function (str) {
    var result = str.match(/^(-|\+)?\d+$/);
    if (result == null)
      return false;
    return true;
  },

  //判断输入是否是一个正整数
  isPositiveInt: function (str) {
    var result = str.match(/^\d+$/);
    if (result == null)
      return false;
    if (result == "0") {
      return false;
    }
    return true;
  },

  //数字，小数点后可以有两位。
  checkAmount: function (s) {
    var reg = /^(-|\+)?\d+[.]?\d{0,2}$/;
    return reg.test(s);
  },

  //判断字符串是否包含中文。
  isChinese: function (value) {
    if (value.length == 0) {
      return false;
    }
    for (n = 0; n < value.length; n++) {
      var c = value.charCodeAt(n);
      if (c > 127) {
        return true;
      }
    }
    return false;
  },

  //检查字符串是否包含数字
  checkHasNumber: function (str) {
    var regex = /\d+/;
    return regex.test(str);
  },

  //返回byte长度
  getStringLengthByBytes: function (str) {
    return str.replace(/[^\x00-\xFF]/g, '**').length;
  },

  //去掉首尾空格。
  trim: function (str) {
    if (str != null) {
      var i;
      for (i = 0; i < str.length; i++) {
        if (str.charAt(i) != " ") {
          str = str.substring(i, str.length);
          break;
        }
      }

      for (i = str.length - 1; i >= 0; i--) {
        if (str.charAt(i) != " ") {
          str = str.substring(0, i + 1);
          break;
        }
      }

      if (str.charAt(0) == " ") {
        return "";
      }
      else {
        return str;
      }
    }
  },

  //按照byte长度从左开始截
  leftStringByBytes: function (str, len) {
    value = trim(str);
    var valueLength = getStringLengthByBytes(value);

    if (valueLength < len || len < 0) {
      return value;
    }
    intLength = 0;
    var rtnString = "";
    for (n = 0; (n < valueLength && intLength < len); n++) {
      var c = value.charCodeAt(n);
      rtnString += value.charAt(n);
      if (c < 128) {
        intLength += 1;
      }
      else {
        intLength += 2;
      }
    }
    return rtnString;
  },

  //检查邮箱格式. null will return true.
  checkEmail: function (elm) {

    var emailStr;
    if (elm.value == null) { //it's just a variable
      elm = jQuery.trim(elm);
      emailStr = elm;
    }
    else { //it's a control
      elm.value = jQuery.trim(elm.value);
      emailStr = elm.value;
    }
    if (emailStr.length == 0) {
      return true;
    }
    var emailPat = /^(.+)@(.+)$/;
    var specialChars = "\\(\\)<>@,;:\\\\\\\"\\.\\[\\]";
    var validChars = "\[^\\s" + specialChars + "\]";
    var quotedUser = "(\"[^\"]*\")";
    var ipDomainPat = /^(\d{1,3})[.](\d{1,3})[.](\d{1,3})[.](\d{1,3})$/;
    var atom = validChars + '+';
    var word = "(" + atom + "|" + quotedUser + ")";
    var userPat = new RegExp("^" + word + "(\\." + word + ")*$");
    var domainPat = new RegExp("^" + atom + "(\\." + atom + ")*$");
    var matchArray = emailStr.match(emailPat);
    if (matchArray == null) {
      return false;
    }
    var user = matchArray[1];
    var domain = matchArray[2];
    if (user.match(userPat) == null) {
      return false;
    }
    var IPArray = domain.match(ipDomainPat);
    if (IPArray != null) {
      for (var i = 1; i <= 4; i++) {
        if (IPArray[i] > 255) {
          return false;
        }
      }
      return true;
    }
    var domainArray = domain.match(domainPat);
    if (domainArray == null) {
      return false;
    }
    var atomPat = new RegExp(atom, "g");
    var domArr = domain.match(atomPat);
    var len = domArr.length;
    if ((domArr[domArr.length - 1].length < 2) ||
      (domArr[domArr.length - 1].length > 3)) {
      return false;
    }
    if (len < 2) {
      return false;
    }
    return true;
  },

  //检查IP地址
  checkIPStr: function (ipAddress) {

    ipPartten = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    ipText = ipAddress;
    if (ipPartten.test(ipText)) {
      var values = ipText.split(".");
      for (var i = 0; i < values.length; i++) {
        var chkee = new Number(values[i]);
        if (i == 0) {
          if (chkee <= 0 || chkee > 255) {
            return false;
          }
        }
        else {
          if (chkee < 0 || chkee > 255) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },

  //检查URL地址是否合法
  checkValidUrl: function (strUrl) {
    var RegexUrl = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return RegexUrl.test(strUrl.toLowerCase());
  },

  //检查FTP地址是否合法

  checkValidFtpUrl: function (strFtpUrl) {
    var RegexUrl = /(ftp):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return RegexUrl.test(strFtpUrl.toLowerCase());
  },

  //检查手机号格式
  checkMobilePhoneNum: function (str) {
    var arr = new Array();

    for (var i = 0; i < 10; i++) {
      arr[i] = "13" + i;
      arr[10 + i] = "15" + i;
      arr[20 + i] = "18" + i;//加入18[0-9]段的号码验证
    }
    var temp_str = arr.join("|");
    var reg_str = "^(" + temp_str + ")[0-9]{8}$";
    var reg = new RegExp(reg_str);
    return reg.test(str);
  },

  //检查密码格式
  checkPassword: function (str) {
    var reg = /^[0-9a-zA-Z\.\-\?_]{6,16}$/;
    return reg.test(str);
  },

  //检查文件名格式
  checkFileName: function (fileName, suffixArray) {
    var temp_str = suffixArray.join("|");
    var reg_str = "^.+\\.(" + temp_str + ")$";
    var reg = new RegExp(reg_str);
    return reg.test(fileName.toLowerCase());
  },

  //检查日期格式 yyyy-MM-dd
  checkDate: function (str) {
    if (!str.match(/^\d{4}\-\d\d?\-\d\d?$/)) {
      return false;
    }
    var ar = str.replace(/\-0/g, "-").split("-");
    ar = new Array(parseInt(ar[0]), parseInt(ar[1]) - 1, parseInt(ar[2]));
    var d = new Date(ar[0], ar[1], ar[2]);
    return d.getFullYear() == ar[0] && d.getMonth() == ar[1] && d.getDate() == ar[2];
  },

  //判断输入是否是邮政编码
  checkPostCode: function (str) {
    var result = str.match(/[1-9]\d{5}(?!\d)/);
    if (result == null)
      return false;
    return true;
  },

  //判断输入是否是固定电话号码
  checkPhoneNum: function (str) {
    var result = str.match(/\d{3}-\d{8}|\d{4}-\d{7}|\d{11}/);
    if (result == null)
      return false;
    return true;
  },

  //检查byte长度
  checkLengthByBytes: function (str, len) {
    return this.getStringLengthByBytes(str) <= len;
  },

  //非空检查
  checkNotNull: function (str) {
    if (typeof str == "undefined" || str == null) {
      return false;
    }
    return this.getStringLengthByBytes(this.trim(str)) != 0;
  },

  /**

   //其他工具 日期控件渲染
   renderDataInput: function(id,width,date){
	   var searchDateFiled;	   
		var date = (this.checkNotNull(date))?date:"";
		if (!jQuery("#" + id).hasClass("x-form-text")) {
			searchDateFiled = new Ext.form.DateField({
				applyTo: id,
				width: width,
				format: 'Y-m-d',
				value: date,
				emptyText: '请选择日期 ...',
				editable:true
			});
		}
		return searchDateFiled;
	},

   //日期控件渲染
   DataFormatControl: function(id,width,minValue,maxValue,disabledDates){
		if (!jQuery("#" + id).hasClass("x-form-text")) {
			var arg = {
				applyTo: id,
				width: width,
				format: 'Y-m-d',
				emptyText: '请选择日期 ...',
				editable:false,
				altFormats : 'Y-m-d|Y-n-j'
			};
			if(typeof minValue !== "undefined") {
				arg.minValue = minValue;
			}
			if(typeof maxValue !== "undefined") {
				arg.maxValue = maxValue;
			}
			if(typeof disabledDates !== "undefined") {
				arg.disabledDates = disabledDates;
			}
			new Ext.form.DateField(arg);
		}
	}
   ,
   */
  //获得文件大小
  getFileSize: function ($fileDom) {
    var fileDom = $fileDom[0];
    if ("\v" == "v") {
      var image = new Image();
      image.dynsrc = fileDom.value;
      return image.fileSize;
    } else {
      return fileDom.files.item(0).fileSize;
    }
  },
  //获得序列值
  sequence: 0,
  getSequence: function () {
    this.sequence++;
    var returnValue = "S";
    for (var i = 4; i > ("" + this.sequence).length; i--) {
      returnValue += "0";
    }
    return returnValue.concat(this.sequence);
  },

  //取文本取值..从常量中.
  getTextByValue: function (value, listStr, defaultText) {
    defaultText = defaultText || "";
    if (!value) {
      return defaultText;
    }
    var list;
    eval("list = " + listStr);

    for (var i = 0; i < list.length; i++) {
      var bean = list[i];
      if (value == bean.v) {
        return bean.t;
      }
    }
    return defaultText;
  },
  //根据值取文本..从常量中.
  getValueByText: function (text, listStr, defaultValue) {
    defaultValue = defaultValue || "";
    if (!text) {
      return defaultValue;
    }
    var list;
    eval("list = " + listStr);

    for (var i = 0; i < list.length; i++) {
      var bean = list[i];
      if (text == bean.t) {
        return bean.v;
      }
    }
    return defaultValue;
  },
  //时间对象的格式化
  //注意第三个参数,指定高位补零,如果指定为false,则9月就显示为9,如果不指定第3个参数,9月显示为09
  //举例:
  //alert(ninfor.dateFormat(new Date(),"yyyy-MM-dd"));
  //alert(ninfor.dateFormat(new Date(),"yyyy-MM-dd",false));
  //alert(ninfor.dateFormat(new Date(),"yyyy年MM月dd日"));
  //alert(ninfor.dateFormat(new Date(),"hh:mm:ss"));
  dateFormat: function (date, format, bulingFlag) {
    if (typeof bulingFlag == "undefined") {
      bulingFlag = true;
    }
    var o = {
      "M+": date.getMonth() + 1,  //month
      "d+": date.getDate(),     //day
      "h+": date.getHours(),    //hour
      "m+": date.getMinutes(),  //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
      "S": date.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        if (bulingFlag) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        } else {
          format = format.replace(RegExp.$1, o[k]);
        }
      }
    }
    return format;
  },

  html2jsstr: function (str) {
    return str.replace(/<br\/>/g, "\r\n")
      .replace(/<br>/g, "\r\n")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"");
  },

  jsstr2html: function (str) {
    return str.replace(/&/g, "&amp;")
      .replace(/ /g, "&nbsp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/\r\n/g, "<br/>")
      .replace(/\r/g, "<br/>")
      .replace(/\n/g, "<br/>");
  },

  getFckHtml: function (id) {
    return jQuery("#" + id + "___Frame").contents().find("iframe").contents().find("body").html();
  },

  setFckHtml: function (id, html) {
    jQuery("#" + id + "___Frame").contents().find("iframe").contents().find("body").html(html);
  },

  //检查输入是否有字母
  isOrderNumber: function (s) {
    var reg = /[_a-zA-Z]/;
    return reg.test(s);
  }

});

