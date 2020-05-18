/*
* name : ui.mo.js
* desc : 기본 UI 관련 스크립트
* writer : glim
* date : 2019/07/17
* last : 2020/05/19
* 2020년01월08일 모바일전용으로 생성
* * 20200424 추천 키워드 UI 변경
* * 20200511 textareaScrollbarInit() 로컬 환경에서 콘솔 에러 발생하여 임시 주석처리, popup create시 팝업 레이아웃 깨짐 수정(p-cont 엘리먼트 생성)
* * 20200511 latestMenuRemove, mmenuSearchToggle 추가, mo tooltip 주석처리 해제, 메뉴편집, 서류관리, 메일그룹관리 메뉴 오픈시 전체메뉴 탭 삭제
* * 20200519 tooltip open시 width check 추가, 쪽지보내기 수신자 목록 OnOff, 수신자 선택 추가
* */

var _minWidth = 493;//
var _minHeight = 864;

$( function() {

	$.datepicker.setDefaults({
		numberOfMonths: 1,
		dateFormat: 'yy-mm-dd',
		monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
		dayNamesMin: ['SU','MO','TH','WE','TH','FR','SA'],
		showMonthAfterYear: true,
		showOn: 'button',
		buttonImage : '../../resources/images/mo/ui/ui_ico_calendar.png',
		buttonImageOnly: false,// 수정 웹접근성 관련
		buttonText: 'Select date',
		currentText: 'Now',
		prevText: '이전달',
		nextText: '다음달',
	});

	// 팝업 기본 설정
	$.extend($.ui.dialog.prototype.options, {
		height: "auto",
		modal: true,
		autoOpen: false,
		closeText: "닫기",
		resize:false,
		draggable: false,
		position: {
			my : 'center center ',
			at : 'center center ',
			of : 'body'
		},
		create: function( event, ui ) {
			$(event.target).dialog("option", {
				"width" : ($(event.target).data("width")==350)? 290:250,//20200511 수정
				"title" : $(this).find('.js-title').text(),
			});//width 재설정

			// 20190829 add
			if ( $(event.target).hasClass('pop-loading')){
				$(event.target).parents('.ui-dialog').addClass('no-bg');
			}
		},
		open: function( event, ui ) {
			//chat size에 따라 위치 변경
			/*var posx = $('.js-chat').offset().left + $('.js-chat').outerWidth()/2 - $(event.target).parent().outerWidth()/2;
			var posy = $(window).scrollTop() + $(window).height()/2 - $(this).parent().outerHeight()/2;
			$(event.target).parent().css({
				'top' : posy,
				'left' : posx
			});*/
			$('.overlay-dialog').show();
		},
		close: function( event, ui ) {
			$('.overlay-dialog').hide();
		}
	});
    
	//tooltip defualt setting 20190730 update
	// S : 20200511 수정 S:모바일에서 툴팁 복구
	$.widget("ui.tooltip", $.ui.tooltip, {
		options: {
			show:{effect:"none"},
			hide:{effect:"none"},
			content: function() {
				if ($(this).hasClass('ellipsis') == true && this.offsetWidth - 20 < this.scrollWidth){
					return $(this).text();
				}else if ($(this).hasClass('ellipsis-child') == true && $(this).parent('.ellipsis').outerWidth() - 20  < $(this).parent('.ellipsis')[0].scrollWidth) {
					return $(this).parent('.ellipsis').text();
				}else if ($(this).hasClass('js-tooltip') == true){
					return $(this).prop('title');
				}
				return false;
			},
			open: function(e,ui){ // 20200519 추가 : 브라우저 확장시 툴팁 width 깨짐 수정
				var el = $(e.originalEvent.target);
				var tooltipVal = $(ui.tooltip).find('.ui-tooltip-content').text();

				if($(ui.tooltip).width() < 50 && el.hasClass('js-pos-right-bottom')){
					if(tooltipVal.length < 6){
						$(ui.tooltip).position({my: 'right-15 top+10', of: e});
					}else{
						$(ui.tooltip).position({my: 'right-50 top+10', of: e});
					}
				}
			},
			close: function (){
				$('.ui-helper-hidden-accessible').empty();
			},
		}
	});
	// E : 20200511 수정 S:모바일에서 툴팁 복구

	// 20200424 수정 : 로컬환경에서 에러발생하여 임의로 주석처리(개발시 주석 해제 필요)
	// $("#lbl_today_date").text(todayFormatDate());
	
	//getUserInfo();
})

$(document).ready(function() {

	//팝업초기화
	$("[data-role=dialog]").dialog();

	//tooltip 초기화 실행 update
	// S : 20200511 수정 S:모바일에서 툴팁 복구
	$( document).tooltip({
		items: '.ellipsis , .ellipsis-child , .js-tooltip,  :not(.ui-dialog-titlebar-close,ui-dialog-titlebar-close)'
	});
	// e : 20200511 수정 S:모바일에서 툴팁 복구

	$('.ellipsis').children().addClass('ellipsis-child');
	
	//textarea scroll init
	// textareaScrollbarInit('body'); // 20200511 수정 : 로컬 환경에서 콘솔 에러 발생하여 임시 주석처리. 개발시 주석 해제 필요

	$( window ).resize(function() { resize(); });
	resize();

	//20200424 추가 - 추천키워드 키보드 노출시 최대높이 해제
	$('.js-ip-chat').on('focusin', function () {
		$('body').removeClass('is-rec-expanded');
		$('.js-btn-rec-more').find('.btn-text').text('추천 키워드 더보기');
		$('.js-btn-rec-more').removeClass('is-active');
		relativeSearchHeight(0);
	});

	//gotobottom bind 20200424 추가 - bottom 버튼 mo에서 custom scroll 미사용으로 pc, mo 스크립트 분기
	$('.js-go-bottom').click(function (e) {
		var bottomMoveVal = $('.js-chat').height();
		$('.js-chat').scrollTop(bottomMoveVal);
	});

});

function addWelcomeMessage() {
	putMessage($("#div_template_welcome").clone().removeAttr("id").css("display", ""));
}

/**********************************************************************************
 ** Textarea -  수정 : 로컬 환경에서 콘솔 에러 발생하여 임시 주석처리. 개발시 주석 해제 필요
 *******************20200511****************************************************************/
/*function textareaScrollbarInit(container){

	$('.js-textarea', container).each(function(n){

		/!*
		* <!-- wrap textarea in a .textarea-wrapper div -->
		<div class="textarea-wrapper">
			<textarea>Start typing...</textarea>
			<!-- add an extra .textarea-clone div -->
			<div class="textarea-clone"></div>
		</div>
		* *!/

		var textareaLineHeight=parseInt($('textarea', $(this)).css("line-height"));


		var	textareaWrapper=$(this),
			textarea=$('textarea', textareaWrapper),
			textareaClone=$(".textarea-clone", textareaWrapper);

		textareaClone.css('min-height',textareaWrapper.height());
		textarea.css('min-height',textareaWrapper.height());

		$(this).mCustomScrollBox({
			scrollInertia:0,
			advanced:{autoScrollOnFocus:false},
			mouseWheel:{disableOver:["select","option","keygen","datalist",""]},
			keyboard:{enable:false},
			snapAmount:textareaLineHeight
		});

		textarea.bind("keyup keydown",function(e){
			var $this=$(this),textareaContent=$this.val(),clength=textareaContent.length,cursorPosition=textarea.getCursorPosition();
			textareaContent="<span>"+textareaContent.substr(0,cursorPosition)+"</span>"+textareaContent.substr(cursorPosition,textareaContent.length);
			textareaContent=textareaContent.replace(/\n/g,"<br />");
			textareaClone.html(textareaContent+"<br />");
			$this.css("height",textareaClone.outerHeight());

			var textareaCloneSpan=textareaClone.children("span"),textareaCloneSpanOffset=0,
				viewLimitBottom=(parseInt(textareaClone.css("min-height")))-textareaCloneSpanOffset,viewLimitTop=textareaCloneSpanOffset,
				viewRatio=Math.round(textareaCloneSpan.height()+textareaWrapper.find(".mCSB_container").position().top);
			if(viewRatio>viewLimitBottom || viewRatio<viewLimitTop){
				if((textareaCloneSpan.height()-textareaCloneSpanOffset)>0){
					textareaWrapper.mCustomScrollbar("scrollTo",textareaCloneSpan.outerHeight()-textareaCloneSpanOffset-textareaLineHeight);
				}else{
					textareaWrapper.mCustomScrollbar("scrollTo","top");
				}
			}
		});

		textarea.bind("focusin focusout",function(event){
			if ( event.type == 'focusin'){
				textareaWrapper.addClass('is-active');
			}else{
				textareaWrapper.removeClass('is-active');
			}
			event.stopPropagation();
		});

		$.fn.getCursorPosition=function(){
			var el=$(this).get(0),pos=0;
			if("selectionStart" in el){
				pos=el.selectionStart;
			}else if("selection" in document){
				el.focus();
				var sel=document.selection.createRange(),selLength=document.selection.createRange().text.length;
				sel.moveStart("character",-el.value.length);
				pos=sel.text.length-selLength;
			}
			return pos;
		}

		textarea.trigger('keydown');
	});
}*/



/**********************************************************************************
 ** popCustomCreate - 20200511 수정
 ***********************************************************************************/
function popCustomCreate(selector, opt) {
	
	var width = 300;
	var idval = "";
	if (opt.hasOwnProperty("width")) {
		width = opt.width
	}
	if (opt.hasOwnProperty("id")) {
		idval = "id=\""+opt.id+"\"";
	}

	/* S : 20200511 수정 | popup create시 팝업 레이아웃 깨짐 수정(p-cont 엘리먼트 생성)  */
	$('<div '+idval+' class=" '+ selector +'"  data-role="dialog" data-width="'+width+'"><div class="p-cont">' + opt.dialogMsg + '</div></div>').dialog({
	/* E : 20200511 수정 */
		height: "auto",
		modal: true,
		autoOpen: false,
		closeText: "닫기",
		resize:false,
		draggable: false,
		title: "Confirm",
		position: {
			my : "center center ",
			at : "center center ",
			of : "body"
		},
		create: function( event, ui ) {
			$(event.target).dialog("option", {
				"width" : opt.width,
				"title" : opt.dialogTitle,
			});//width 재설정
		},
		open: function( event, ui ) { $('.overlay-dialog').show(); },
		close: function( event, ui ) { $('.overlay-dialog').hide(); },
		buttons: opt.buttons
	});
}

function popCustomCreate2(selector, opt) {
	$('<div class=" '+ selector +'"  data-role="dialog" data-width="300"><div class="p-cont">' + opt.dialogMsg + '</div></div>').dialog({
		height: "auto",
		modal: true,
		autoOpen: false,
		closeText: "닫기",
		resize:false,
		draggable: false,
		title: 'Confirm',
		position: {
			my : 'center center ',
			at : 'center center ',
			of : 'body'
		},
		create: function( event, ui ) {
			$(event.target).dialog("option", {
				"width" : opt.width,
				"title" : opt.dialogTitle,
			});//width 재설정
		},
		open: function( event, ui ) { $('.overlay-dialog').show(); },
		close: function( event, ui ) { $('.overlay-dialog').hide(); },
		buttons: opt.buttons
	});
}


/*
* date : 20190724
* last : 20190724
* name : searchResultNodataShow( val )
* pram :
* desc : 검색결과없을때 show 1초후에 hide
* searchResultNodataShow();
*/
function searchResultNodataShow(){

	$('.js-search-result-nodata').show().delay(1000).queue(function(n) {
		$(this).fadeOut(100); n();
	});

}


/*
* date : 20190724
* last : 20190724
* name : questionFold( val )
* pram : this, containerSelector
* desc : 인기질문 더보기 접기
* questionFold($(this),'.js-more-target');
*/
function questionFold(el, container){

	var _el = $(el)
	var _container = $(_el).siblings(container);
	if ( el.hasClass('is-active')){
		_el.removeClass('is-active');
		_el.find('.lb').text(_el.find('.lb').text().replace('접기', '더보기'));
		_container.removeClass('is-more');
	}else{
		_el.addClass('is-active');
		_el.find('.lb').text(_el.find('.lb').text().replace('더보기', '접기'));
		_container.addClass('is-more');
	}

}

/*
* date : 20190719
* last : 20190719
* name : tabsOnOff(el, wrap, list, callback)
* pram :
	- el(필수) : 클릭된 타겟
	- wrap(필수) : 탭을 전체 감싸고 있는 영역
	- list(필수) : 탭 list 영역
	- callback : 탭을 클릭 후 활성화 된 후 callback 함수
* desc : 기본 탭클릭 onoff
	- 탭 클릭시 활성화 클래스 : .is-active
	- 클릭된 타겟의 상위 리스트 클래스 : .tab-list
	- 클릭된 타겟의 상위 리스트 클래스 : .tab-item
	- 공통 버튼 클래스 : .tab-link
	- 컨텐츠명 데이터 속성 : data-content
*/
function tabsOnOff(el, wrap, list, callback) {

	var tabitem = $(wrap).find(el).parents('li');
	if ( $(tabitem).hasClass ("is-active") ) { //클릭된타겟 활성화일경우 return
		return false;
	}

	var oldTabitem = $(list).find('> .tab-list').find('> li.is-active');
	//off
	if ( oldTabitem.length > 0 ) {
		//기존 활성화탭 off
		$(oldTabitem).removeClass('is-active');
		$(wrap).find('.'+$(oldTabitem).find('.tab-link').attr("data-content")).hide();
	}

	//on
	tabitem.addClass('is-active');//tab active
	if( $(wrap).find('.' + el.attr("data-content")).length > 0 ) {
		$(wrap).find('.' + el.attr("data-content")).show(0, function() {//tab show
			if ( callback != null && typeof callback === "function" ) {
				callback.apply ( null, [el]);
			}
		});
	}else {
		if ( callback != null && typeof callback === "function" ) {
			callback.apply ( null, [el]);
		}
	}

	return false;
}


/**********************************************************************************
 ** 채팅 유의사항 토글
 ***********************************************************************************/
/*
* date : 20190724
* last : 20190724
* name : chatAiBallonToggle( el )
* pram : el 클릭타겟 / container
* desc : 채팅 유의사항 토글
*/
function chatBallonToggle(el, container){
	var _el = $(el);
	var tg = $(_el).closest(container);

	if ( _el.is('.is-active')){
		tg.find('.js-fold-cont').removeClass('is-active');
		_el.removeClass('is-active');
		_el.find('.offscreen').text('열기');
	}else{
		tg.find('.js-fold-cont').addClass('is-active');
		_el.addClass('is-active');
		_el.find('.offscreen').text('닫기');
	}
}

/**********************************************************************************
 ** S : 채팅입력 -- 20200424 수정
 ***********************************************************************************/
/*
* date : 20190719
* last : 20200424
* name : relativeSearcheslayerOnOff( val )
* pram : val (1 열기 / 0 닫기 )
* desc : 채팅입력시 연관검색어창
*/
function relativeSearcheslayerOnOff(val){

	if ( val == 1 ){
		$('body').addClass('is-relative-open');
		relativeSearcheslayerHeightTest(1);
	}else{
		$('body').removeClass('is-relative-open is-rec-expanded');
		relativeSearcheslayerHeightTest(0);
		relativeSearchHeight(0);
	}

}


/*
* date : 20190719
* last : 20190719
* name : writeSearchOnOff( val )
* pram : el 클릭타겟 / val (1 열기 / 0 닫기 )
* desc : 이전대화검색 온오프
*/
function writeSearchOnOff(val){
	var msg = "<dl class=\"list-dl\"><dt style=\"height: 50px; font-size: 20px; margin-bottom: 5px;\">CTRL + F</dt></dl>" ;
	msg += "<div style=\"text-align: left;\"><em class=\"fc-pos\"><b>※ CTRL + F를 입력하여 지난대화에서 키워드를 검색해보세요.</b></em></div>";
	popCustomCreate("popup_find_text_guide", {
        "dialogTitle" : "이전 대화 검색"
          , "dialogMsg": "<div class=\"p-cont\"><div class=\"t-desc\" style=\"text-align: center;\">"+msg+"</div></div>"
          , width:280
//          ,
//          buttons : [
//              {
//                  text: "취소",
//                  class: "btn-pos",
//                  click: function () {
//                	  $(this).dialog('close');//삭제
//                	  $(this).dialog('destroy');//삭제
//                  }
//              }
//          ]
    	}
	);
	$(".popup_find_text_guide").dialog("open");
/*
	if ( val == 1 ){
		$('.js-write-search').show(0);
	}else{
		$('.js-write-search').hide(0);
	}
*/

}

/**********************************************************************************
 ** 메뉴 > 메뉴편집 - 20200511 수정 : 메뉴편집, 서류관리, 메일그룹관리 메뉴 오픈시 전체메뉴 탭 삭제
 ***********************************************************************************/
/*
* date : 20190719
* last : 20200511
* name : asideOpen( val )
* pram : val = menunumber 0~4
* desc : 메뉴오픈
* 20190723 param 관련수정
*/
function asideOpen (val){
	//	console.log('.js-aside-menu')
	$('body').addClass('is-aside-open');
	var name = 'js-aside-menu';//$(el).data('href'); 20190723 update
	var tg = $('.'+name +'-'+val);
	$(tg).siblings('.'+name).hide().end().show();

	// 테스트 필요
	//alert($(tg).siblings('.'+name));
	
	$( 'a[data-href='+name+']' ).parent().removeClass('is-active');
	$( 'a.js-menu-open[data-idx='+val+']' ).parent().addClass('is-active');

	
	//검색기록 조회
	if (val == 2) {
		getQueryHistoryList(val);
	} else if (val == "4") { //서류외부발송
		getDocuemntList("2");//서류외부발송
	} else if (val == "5") {//알림톡
		getDocuemntList("1");//알림톡	
	} else if (val == "6") {//자주쓰는 메일 주소
		com_popupEMailList("3");
	}

	/* S : 20200511 추가 */
	if ( $('.js-nav-list').length > 0 ){
		if ( val < 3 ){
			$('.js-nav-list').show();
		}else {
			$('.js-nav-list').hide();
		}
	}
	/* E : 20200511 추가 */
}
/*
* date : 20190719
* last : 20190719
* name : asideClose( val )
* pram :
* desc : 메뉴 닫기
*/
function asideClose() {
	$('body').removeClass('is-aside-open');
	$('.js-menu-open').parent().removeClass('is-active');
}


/**********************************************************************************
 ** 메뉴편집
 ***********************************************************************************/
/*
 * date : 20190723
 * update : 20190723
 * name : initDragnDropBind
 * dsec : drag n drop event bind
 * pram : dragEl (drag target), dropEl (drop target)
 */
function initDragDropBind(){
	if ( $('.js-mymenu-selected').find('li').length > 1 ){

		/* draggable */
		$( '> li' , '.js-mymenu-selected').draggable({
			/*handle: ".drag_handler",*/
			scroll: false,
			revert: "invalid",
			revertDuration: 50,
			helper: "clone",
			start: function( event, ui ) {
				//$(ui.helper).css("width", $(event.target).width());
			}
		});

		//droppable
		$( '> li' , '.js-mymenu-selected').droppable({
			classes: {
				"ui-droppable-hover": "dropable-active"
			},
			drop: function( event, ui ) {
				//console.log ( "drop", $(this).data('idx'));
				//console.log ( "draggable", $(ui.draggable).data('idx'));
				dragnDropSwap ($(ui.draggable), $(this) );
				return false;
			}
		});

	}

}

/*
 * date : 20190723
 * update : 20190723
 * name : dragnDropSwap
 * dsec : 드래그앤 드랍시 컨텐츠 변경처리 (ele 자체가 이동변경됨)
 * pram : dragEl (drag target), dropEl (drop target)
 */
function dragnDropSwap (dragEl, dropEl){
	//console.log ( "dragEl : ", $(dragEl).data('idx') ,"-", "dropEl : ", $(dropEl).data('idx'));
	//ui-droppable-hover

	var dragTgNext = $(dragEl).next();
	$(dragEl).insertAfter(dropEl).addClass( "dropable-highlight" );
	$(dropEl).insertBefore(dragTgNext).addClass( "dropable-highlight" );

	setTimeout(function(){//변경컨텐츠
		$(dragEl).removeClass("dropable-highlight");
		$(dropEl).removeClass("dropable-highlight");
	}, 600);
}

/*
 * date : 20190723
 * update : 20190723
 * name : addToMymenu
 * dsec : 마이메뉴 추가
 * pram : dragEl (drag target), dropEl (drop target)
 */
function addToMymenu (el){
	if ($("#div_ul_mymenu_config_select").find("li").length < 8) {
		var papa= $(el).parents('li');
		papa.clone().appendTo('.js-mymenu-selected');
		papa.addClass('is-selected');
		$('.js-mymenu-selected').siblings('.nomenu').hide();

	} else {
		if ($(".dialog_myMenuAddMaxNoti").text().split(" ").join("") == "") {
			popCustomCreate("dialog_myMenuAddMaxNoti"
	        		, {
	        			  "dialogTitle" : "메뉴 등록 갯수 초과"
	        			, "dialogMsg": "<div class=\"ac\">나의 메뉴는 최대 8개까지 등록할 수 있습니다.</div>"
	        			, width:300
	        		}
	        );
		}
        $(".dialog_myMenuAddMaxNoti").dialog('open');//popCustomCreate
	}
	initDragDropBind();
}


/*
 * date : 20190723
 * update : 20190723
 * name : deleteToMymenu
 * dsec : 마이메뉴 삭제
 * pram : el
 * 메뉴리스트/선택된메뉴리스트 클릭되면 넘어옴
 */
function deleteToMymenu (el){
	var idx= $(el).parents('li').data('idx');

	$( "li[data-idx ="+idx+"]" ,'.js-mymenu-selected').remove();
	$( "li[data-idx ="+idx+"]" ,'.js-menu-bank').removeClass('is-selected');
}


/**********************************************************************************
 ** 메뉴 > 서류관리 폴딩
 ***********************************************************************************/
/*
* date : 20190722
* last : 20190730
* name : docManagerGroupToggle( el , container)
* pram : el 클릭타겟
* desc : 서류관리 리스트 토글
* 20190730 함수파라메터 및 안의 내용 마크업 수정
*/
function docManagerGroupToggle(el, container){
	var _el = $(el);
	var tg = $(_el).closest(container);

	if ( _el.is('.is-active')){
		tg.removeClass('is-active');
		tg.find('.cont').slideUp(300);
		_el.removeClass('is-active');
		_el.find('.offscreen').text('열기');
	}else{
		tg.addClass('is-active');
		tg.find('.cont').slideDown(300);
		_el.addClass('is-active');
		_el.find('.offscreen').text('닫기');
	}
}


/**********************************************************************************
 ** 질문선택 폴딩
 ***********************************************************************************/
/*
* date : 20190722
* last : 20190802
* name : foldingGroupToggle( el , container)
* pram : el 클릭타겟 container
* desc : 리스트 토글
*/
function foldingGroupToggle(el, container){
	var _el = $(el);
	var tg = $(_el).closest(container);

	if ( tg.is('.is-active')){
		tg.removeClass('is-active');
		tg.find('.cont').slideUp(300);
		_el.find('.offscreen').text('열기');
	}else{
		tg.addClass('is-active');
		tg.find('.cont').slideDown(300);
		_el.find('.offscreen').text('닫기');
	}
}



/* RESIZE  */
var _ww,_hh;
function resize (){

	var ww = $( window ).width();
	var hh = $( window ).height();

	/*$( window ).scroll(function() {
		scrollEventlistener();
	});*/

	if (_ww != ww || _hh != hh){

		/*ie 에서 작아질경우 스크롤*/
		if ( ww < _minWidth || hh < _minHeight ){
			//console.log(ww,hh);
			var rw = Math.max(_minWidth, ww);
			var rh = Math.max(_minHeight, hh);
			//window.resizeTo(rw,rh);
		}
	}

	// 브라우저 리사이징시 팝업 사이즈 설정
	if ( $(".ui-dialog-content.ui-widget-content:visible").length > 0 ){

		//asideClose();//aside가 확장된 상태일때 팝업이 열려있고 resize 발생시 강제로 닫음

		// s: 팝업 중앙 정렬
		$(".ui-dialog-content:visible").each(function (n) {
			var tg = $( this ).data( "dialog" );
			$( this ).dialog("option", {
				"position":{my: "center center", at: "center center", "collision": "flipfit", of: window }
			});
		});
		// e: 팝업 중앙 정렬
	}

	_ww = ww;

	// 20200424 추가 - android 키보드 노출시 height resize로 인식하여 높이 재계산
	relativeSearchHeight(1);
}


/**********************************************************************************
 ** 튜토리얼
 ***********************************************************************************/
/*
* date : 20191030
* last : 20191030
* name : tutoriallayerOnOff( val )
* pram : val (1 열기 / 0 닫기 )
* desc : 튜토리얼 열기닫기
*/
var _tutorialSwiper = null;//튜토리얼 swiper
function tutorialLayerOnOff(val){
	if ( val == 1 ){
		$('.js-tutorial-wrap').show(0);
		setTimeout(tutorialSwipeInit, 3000);
	}else{
		$('.js-tutorial-wrap').hide(0);
		if (_tutorialSwiper != null) {
			_tutorialSwiper.slideTo(0,0);//close index 0;
		}
	}
}

function tutorialSwipeInit() {

	/* 메인 Home 이벤트 배너*/
	if ($('.js-tutorial-swiper').length > 0 && _tutorialSwiper == null){
		_tutorialSwiper = new Swiper($('.js-tutorial-swiper'), {
			slidesPerView: 1,//ie11 error
			spaceBetween: 0,
			grabCursor: true,
			touchEnabled: true,
			speed:300,
			observer: true,
			observeParents: true,
			navigation: {
				nextEl: '.btn-arrow.next',
				prevEl: '.btn-arrow.prev',
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			on: {
				init: function () {},
				slideChange : function (){
					//console.log(this.pagination.bullets.length, this.activeIndex);
					if ( (this.pagination.bullets.length-1) == this.activeIndex ){
						$('.js-btn-tutorial-go').addClass('is-active');
					}else{
						$('.js-btn-tutorial-go').removeClass('is-active');
					}
				}
			},
		});
	}

}
function resetSize() {
//	
//	var _minWidth = 493;//
//	var _minHeight = 864;
//	
	window.resizeTo(_minWidth,_minHeight);
}

/**********************************************************************************
 ** S:추천 키워드 더보기 -- 20200424 추가
 ***********************************************************************************/

/*
* date : 20200424
* last : 20200424
* name : relativeSearchesMore()
* pram :
* desc : 채팅입력시 연관검색어창 더보기 클릭시 최대 높이 조절, 버튼 ui 변경, 스크롤 이동
*/
function relativeSearchesMore() {
	var scrollVal = $('.js-related-wrap').scrollTop();

	if ($('body').hasClass('is-rec-expanded')) {
		$('body').removeClass('is-rec-expanded');
		$('.js-btn-rec-more').find('.btn-text').text('추천 키워드 더보기');
		$('.js-btn-rec-more').removeClass('is-active');
		relativeSearchHeight(0);

		relativeSearcheslayerHeightTest(1);
	} else {
		$('body').addClass('is-rec-expanded');
		$('.js-btn-rec-more').find('.btn-text').text('추천 키워드 접기');
		$('.js-btn-rec-more').addClass('is-active');
		relativeSearchHeight(1);
	}

	$('.js-related-wrap').scrollTop(scrollVal);
}

/**********************************************************************************
 ** 추천 키워드 높이 -- 20200424 추가
 ***********************************************************************************/

/*
* date : 20200424
* last : 20200424
* name : relativeSearchHeight()
* pram :
* desc : 추천 키워드 최대 높이 계산
*/

function relativeSearchHeight(val) {
	if (val == 1) { // 최대높이
		if ($('body').hasClass('is-rec-expanded')) {
			var keywordHeight = $(window).height() - 50 - 45 - 97 - 42 - 16; // nav - search input - chat space - margin val - padding val
			var chatHeight = keywordHeight + 50 + 45 + 42 + 16;  // keywordHeight + nav + search input + margin val + padding val

			$('.js-related-layer').animate({'height': keywordHeight + 42 + 16}, 30);
			$('.js-related-wrap').css('height', keywordHeight);
			$('.js-chat').css('height', $(window).height() - chatHeight);
			$('.js-go-bottom').css('bottom', chatHeight - 30);
		}
	} else { // 최대높이 해제
		if ($('body').hasClass('is-rec-expanded') == 0) {
			$('.js-related-wrap, .js-related-layer, .js-chat, .js-go-bottom').removeAttr('style');
		}
	}
}

/**********************************************************************************
 ** 이벤트 배너 실행 -- 20200429 추가
 ***********************************************************************************/
/*
* date : 20200429
* last : 20200429
* name : setEventSwiper()
* pram :
* desc : 이벤트 배너 swipe 실행
*/
var eventSwiper = null;
function eventSwiperInit() {
	if ($('.js-event-banner').find('.event-item').length > 1 ){ //이벤트 배너 1개 이상일경우 swiper 실행
		eventSwiper = new Swiper('.js-event-banner', {
			pagination: {
				el: '.swiper-pagination',
			},
			autoplay: {
				delay: 3000,
			},
			loop: true,
		});
	}
}

/**********************************************************************************
 ** 이벤트 배너 닫기 -- 20200429 추가
 ***********************************************************************************/

/*
* date : 20200429
* last : 20200429
* name : eventAreaClose()
* pram :
* desc : 이벤트 배너 닫기
*/
function eventAreaClose(){
	$('.js-event-banner').addClass('is-hidden');

	if(eventSwiper !== null){
		setTimeout(function () {
			eventSwiper.destroy();
		}, 300);
	}
}


/**********************************************************************************
 ** latestMenuRemove - 20200511 추가
 ***********************************************************************************/
/*
* date : 20200511
* last : 20200511
* name : latestMenuRemove()
* pram :
* desc : 최근메뉴 삭제
*/
function latestMenuRemove(tg) {
	$(tg).parents('.js-latest-item').remove();
	$('.js-latest-list').append('<li class="item js-latest-item"><div class="link add"><i class="ico ico-alert24"></i><em class="lb">최근메뉴가<br>없습니다</em></div></li>');
	if($('.js-latest-list').find('.js-latest-item > .link.add').length === 4) $('.js-latest-list').empty();
}

/**********************************************************************************
 ** mmenuSearchToggle - 20200511 추가
 ***********************************************************************************/
/*
* date : 20200511
* last : 20200511
* name : mmenuSearchToggle()
* pram :
* desc : 전체메뉴 검색 클릭시 검색 input On/Off
*/
function mmenuSearchToggle() {
	var searchBox = $('.js-btn-search-menu, .js-mmenu-search-box');

	if(searchBox.hasClass('is-active')){
		searchBox.removeClass('is-active');
		testMmenuSearchReset('.js-main-menu-wrap');
	}else{
		searchBox.addClass('is-active');
	}

}

/**********************************************************************************
 ** receiverLayerOnOff - 20200519 추가
 ***********************************************************************************/
/*
* date : 20200519
* last : 20200519
* name : receiverLayerOnOff()
* pram :
* desc : 쪽지보내기 수신자 목록 OnOff
*/
function receiverLayerOnOff(val){
	if(val == 0){
		$('.js-note-receiver-wrap .js-note-receiver').hide();
	}else{ // val == 1
		$('.js-note-receiver-wrap .js-note-receiver').show();
	}
}

/**********************************************************************************
 ** receiverSelect - 20200519 추가
 ***********************************************************************************/
/*
* date : 20200519
* last : 20200519
* name : receiverSelect()
* pram :
* desc : 쪽지보내기 수신자 선택
*/
function receiverSelect(tg){
	var receiver = $(tg).text();
	$('.js-ip-receiver').val(receiver);
	receiverLayerOnOff(0);
}