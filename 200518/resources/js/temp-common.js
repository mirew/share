/*
* name : temp-common.js
* desc : 페이지내 실행되어야하는 임시 공통함수들모음
* writer : glim
* date : 2019/08/13
* last : 2020/05/19
* 20190813 temp-pc.js >> temp-common.js 파일명 변경
* 20200424 추천 키워드 UI 변경
* 20200511 textareaScrollbarInit() 로컬 환경에서 콘솔 에러 발생하여 임시 주석처리, testMmenuSearch, testMmenuSearchReset 추가
* 20200519 testScrapSearchtest(), ScrapSearchReset() 추가, 추천 키워드 8글자 이하 더보기 해제 추가
*
* */

$(document).ready(function() {

	//메뉴편집 dragndrop init
	initDragDropBind();

	//textarea scroll init
	// textareaScrollbarInit('body'); // 20200511 수정 : 로컬 환경에서 콘솔 에러 발생하여 임시 주석처리. 개발시 주석 해제 필요

	//20200424 삭제 // gotobottom bind pc/mo 분기처리
	/*$('.js-go-bottom').click(function(e){
		$(".js-chat").mCustomScrollbar("scrollTo","bottom",{ scrollInertia:0 });
	});*/

	/*메시지 입력시 체크*/
	$('.js-ip-chat').bind('keyup change', function(ev) {
		// pull in the new value
		var word = $(this).val();

		if ( word.length > 0 ) {
			relativeSearcheslayerOnOff(1);
		}else{
			relativeSearcheslayerOnOff(0);
		}
	});

	if($('.js-link-more-menu').length > 0){//메뉴더보기 - 설정더보기, 입력창더보기

		$(".js-link-more-menu").each(function(n){

			$(this).bind('click', function(e){
				var tg = $('.'+$(this).data('href'));

				if ( $(this).hasClass('is-active')){//hide
					$(this).removeClass('is-active');
					$(tg).hide();
				}else{//show
					if($('.js-link-more-menu.is-active').length > 0 ){ $(document).trigger('click');}
					$(this).addClass('is-active');
					$(tg).show();
				}
				return false;
			});
		});

		/*focusout 닫기*/
		$(document).click(function(e){
			if ( $('.js-more-menu:visible').length > 0 ) {
				$('.js-more-menu:visible').each(function () {
					var tg = $('.' + $(this).data('link'));
					$(tg).trigger('click');
				});
			}
		});
	}

	// S : 20200519 추가 | 쪽지보내기 UI TEST
	$('.js-ip-receiver').bind('keyup change', function(ev) {
		// pull in the new value
		var word = $(this).val();

		if ( word.length > 0 ) {
			receiverLayerOnOff(1);
		}else{
			receiverLayerOnOff(0);
		}
	});
	// E : 20200519 추가 | 쪽지보내기 UI TEST
});


/**********************************************************************************
 ** Textarea - 20200511 수정 : 로컬 환경에서 콘솔 에러 발생하여 임시 주석처리. 개발시 주석 해제 필요
 ***********************************************************************************/
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

		$(this).mCustomScrollbar({
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
 ** S : REMOVE 채팅입력 - 20200424 삭제 ui.mo, ui.pc에서 동일한 이름 함수 사용 중복 실행됨
 ***********************************************************************************/
/*
* date : 20190719
* last : 20190719
* name : relativeSearcheslayerOnOff( val )
* pram : val (1 열기 / 0 닫기 )
* desc : 채팅입력시 연관검색어창
*/
/*function relativeSearcheslayerOnOff(val){

	if ( val == 1 ){
		$('.js-related-layer').show(0);
		$('body').addClass('is-relative-open');
	}else{

		$('.js-related-layer').hide(0);
		$('body').removeClass('is-relative-open');
	}

}*/
/**********************************************************************************
 ** E : REMOVE 채팅입력 - 20200424 삭제 ui.mo, ui.pc에서 동일한 이름 함수 사용 중복 실행됨
 ***********************************************************************************/

/**********************************************************************************
 ** S: ADD 채팅입력 열림/닫힘 높이 TEST  ---  20200519 수정 : 추천키워드 갯수가 줄어들면 '추천 키워드 접기' 버튼 비활성화 수정
 ***********************************************************************************/
/*
* date : 20200424
* last : 20200519
* name : relativeSearcheslayerHeightTest( val )
* pram : val (1 열기 / 0 닫기 )
* desc : 채팅입력시 추천 키워드 열림/닫힘 높이 TEST
*/
function relativeSearcheslayerHeightTest(val) {
	if (val == 1) { // 추천 키워드 열림
		/*
			:: DESC ::
			** 추천 키워드 갯수에 따라 높이 변경. body에 멀티클래스로 제어함.
			- CASE 1. 4개 이하 : default
			- CASE 2. 5개 ~ 8개 : body.is-rec-large
			- CASE 3. 9개 이상 : body.is-rec-expanded 추천 더보기 버튼 활성화 되어 버튼 click시 최대 높이 제어 이벤트 발생 - relativeSearchesMore()
		*/
		/* testKeywordLength*/
		//UI 확인을 위해 채팅창에 입력되는 value 값 length 로 키워드 높이 함수 적용 테스트 진행하였습니다. 개발시 참고만 해주세요
		var testKeywordLength = $('.js-ip-chat').val().length;

		if (testKeywordLength >= 5) {//추천키워드 9개 이상 실행 케이스

			//추천키워드 높이 기본 8개 으로 변경
			$('body').addClass('is-rec-large');
			// 추천 키워드 더보기 버튼 활성화
			if (testKeywordLength >= 9) {//9개 이상일때만 더보기 버튼 활성화
				$('.js-btn-rec-more').prop('disabled', false);//활성화

				// TEST 추천 키워드 목록 append (개발시 필요없음)
				testAppendList(50, "8개 이상. 최대 높이 확인은 추천키워드 더보기 클릭");
			}else{
				if($('body').hasClass('is-rec-expanded')) $('.js-btn-rec-more').trigger('click'); // 20200519 추가
				$('.js-btn-rec-more').prop('disabled', true);//비활성화

				// TEST 추천 키워드 목록 append (개발시 필요없음)
				testAppendList(8, "8개 고정 높이. 8개 고정 높이");
			}


		}else{//추천키워드 4개 이하 케이스
			if($('body').hasClass('is-rec-expanded')) $('.js-btn-rec-more').trigger('click'); // 20200519 추가
			$('.js-btn-rec-more').prop('disabled', true);//추천키워드 더보기 버튼 비활성화

			// 4개 이하 높이 변경 클래스 삭제
			if ($('body').hasClass('is-rec-large')) $('body').removeClass('is-rec-large');

			// TEST 추천 키워드 목록 append (개발시 필요없음)
			testAppendList(3, "4개 고정 높이 4개 고정 높이");
		}


		// only pc scroll update
		if ($.isFunction(window.mCustomScrollbar)) $('.js-related-layer .js-related-wrap').mCustomScrollbar('update');
	}
}

/**********************************************************************************
 ** E: ADD 채팅입력 열림/닫힘 높이 TEST  ---  20200424 추가
 ***********************************************************************************/

/* 추천키워드 임시 append list - 20200424 */
function testAppendList(count, text){
	$('.js-related-wrap .list').empty();
	for (var i = 0; i < count; i++) {
		var list = '<li class="item">\n' +
			'                            <span class="rc-item mark">\n' +
			'                                <input id="ex-radio-1-' + (i + 1) + '" type="radio" name="ex-radio-1">\n' +
			'                                <label for="ex-radio-1-' + (i + 1) + '">\n' +
			'                                    <span class="lb">\n' +
			'                                        <a href="#" class="link ellipsis"> ' + text + (i + 1) + '</a>\n' +
			'                                    </span>\n' +
			'                                </label>\n' +
			'                            </span>\n' +
			'                        </li>';

		$('.js-related-wrap .list').append(list);
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

	if ( val == 1 ){
		$('.js-write-search').show(0);
	}else{
		$('.js-write-search').hide(0);
	}

}


/**********************************************************************************
 ** 메뉴 > 메뉴편집
 ***********************************************************************************/
/*
* date : 20190719
* last : 20190813
* name : asideOpen( val )
* pram : val = menunumber 0~4
* desc : 메뉴오픈
* 20190723 param 관련수정
* 20190813 모바일 nav-list control add
*/
function asideOpen (val){
	//	console.log('.js-aside-menu')
	$('body').addClass('is-aside-open');
	var name = 'js-aside-menu';//$(el).data('href'); 20190723 update
	var tg = $('.'+name +'-'+val);
	$(tg).siblings('.'+name).hide().end().show();

	$( 'a[data-href='+name+']' ).parent().removeClass('is-active');
	$( 'a.js-menu-open[data-idx='+val+']' ).parent().addClass('is-active');

	if ( $('.js-nav-list').length > 0 ){//20190813 모바일 추가
		if ( val < 3 ){
			$('.js-nav-list').show();
		}else {
			$('.js-nav-list').hide();
		}
	}


}
/*
* date : 20190719
* last : 20190719
* name : asideClose( val )
* pram :
* desc : 메뉴 닫기
*/
function asideClose (){
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
/*function initDragDropBind(){

	if ( $('.js-mymenu-selected').find('li').length > 1 ){

		/!* draggable *!/
		$( '> li' , '.js-mymenu-selected').draggable({
			/!*handle: ".drag_handler",*!/
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

}*/

/*
 * date : 20190723
 * update : 20190723
 * name : dragnDropSwap
 * dsec : 드래그앤 드랍시 컨텐츠 변경처리 (ele 자체가 이동변경됨)
 * pram : dragEl (drag target), dropEl (drop target)
 */
/*function dragnDropSwap (dragEl, dropEl){
	//console.log ( "dragEl : ", $(dragEl).data('idx') ,"-", "dropEl : ", $(dropEl).data('idx'));
	//ui-droppable-hover

	var dragTgNext = $(dragEl).next();
	$(dragEl).insertAfter(dropEl).addClass( "dropable-highlight" );
	$(dropEl).insertBefore(dragTgNext).addClass( "dropable-highlight" );

	setTimeout(function(){//변경컨텐츠
		$(dragEl).removeClass("dropable-highlight");
		$(dropEl).removeClass("dropable-highlight");
	}, 600);
}*/

/*
 * date : 20190723
 * update : 20190723
 * name : addToMymenu
 * dsec : 마이메뉴 추가
 * pram : dragEl (drag target), dropEl (drop target)
 */
function addToMymenu (el){
	var papa= $(el).parents('li');
	papa.clone().appendTo('.js-mymenu-selected');
	papa.addClass('is-selected');
	$('.js-mymenu-selected').siblings('.nomenu').hide();
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
/*function deleteToMymenu (el){
	var idx= $(el).parents('li').data('idx');

	$( "li[data-idx ="+idx+"]" ,'.js-mymenu-selected').remove();
	$( "li[data-idx ="+idx+"]" ,'.js-menu-bank').removeClass('is-selected');

	$(el).stopPropagation();
}*/




/**********************************************************************************
 ** 팝업
 * 문서선택양식
 * 서류선택양식
 * 질문선택양식
 ***********************************************************************************/

/*
문서양식선택 Event Bind
Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testDocFormSelectedInit(container){

	$(container).find('input[type="checkbox"]').each(function(n){

		$(this).change(function() {

			var id = $(this).attr('id');

			if($(this).is(":checked")) {
				var title = $(this).parent().find('.lb').text();
				var aa = '<li data-id="'+id+'"><span class="lb ellipsis">'+title+'</span><a href="#" onclick="testDoclistDelete($(this),'+"'.js-doc-form-selected-wrap'"+');" class="ibtn-delete"><i class="ico ico-16-x js-tooltip" title="삭제"></i></a></li>';
				$('.js-selected > ul', container).append(aa);
			}else{
				$('.js-selected', container).find("[data-id ="+id+"]").remove();
			}
			textDocListChange($(this), container);
		});
	});
	$(container).find('.js-paging').data('page', 0);
}

/*
testDocFormlistSearch : 검색버튼클릭시 동작 :: 검색전 >> 검색결과있을때 >> 검색결과없을때 >> 검색전
Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testDocFormlistSearch(container){

	if ($(container).find('.js-result-data:visible').length == 0 && $('.js-doc-search-keyword', container).val().length == 0 ){
		//검색
		$('.js-first-nodata', container).hide();
		$('.js-nodata', container).hide();
		$('.js-result-data', container).show();

		$('.js-doc-search-keyword', container).val("건강보험");
		$('.js-btn-search-reset', container).show();
	}else if ($(container).find('.js-result-data:visible').length != 0 && $('.js-doc-search-keyword', container).val().length > 0 ){
		//검색결과없음
		$('.js-nodata', container).show();
		$('.js-result-data', container).hide();
		$('.js-first-nodata', container).hide();

		$('.js-doc-search-keyword', container).val("검색~결과없음");
		$('.js-btn-search-reset', container).show();
	}else {
		//검색전
		$('.js-nodata', container).hide();
		$('.js-first-nodata', container).show();
		$('.js-result-data', container).hide();

		$('.js-doc-search-keyword', container).val("");
		$('.js-btn-search-reset', container).hide();
	}
}
/*
testDoclistSearch : 검색결과시 검색 초기화
Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testDocFormlistSearchReset(container){
	$('.js-doc-search-keyword', container).val("");
	$('.js-btn-search-reset', container).hide();

	$('.js-first-nodata', container).show();
	$('.js-result-data', container).hide();
	$('.js-nodata', container).hide();
}



/*
서류선택관련 Event Bind
Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testDocSelectedInit(container){

	$(container).find('input[type="checkbox"]').each(function(n){

		$(this).change(function() {
			var count = $(this).parents('.js-doc-group').find('.js-count');
			var id = $(this).attr('id');

			if($(this).is(":checked")) {
				var title = $(this).parent().find('.lb').text();
				var aa = '<li data-id="'+id+'"><span class="lb ellipsis">'+title+'</span><a href="#" onclick="testDoclistDelete($(this),'+"'.js-doc-selected-wrap'"+');" class="ibtn-delete"><i class="ico ico-16-x js-tooltip" title="삭제"></i></a></li>';
				$('.js-selected > ul', container).append(aa);
			}else{
				$('.js-selected', container).find("[data-id ="+id+"]").remove();
			}
			textDocListChange($(this), container);
		});
	});

	$(container).find('.js-paging').data('page', 0);
}

/*
testDoclistSearch : 검색버튼클릭시 동작
Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testDoclistSearch(container){
	$('.js-doc-search-keyword', container).val("건강보험");
	$('.js-btn-search-reset', container).show();

	$('.js-doc-list .js-doc-group .lb', container).each(function(n){
		if ( $(this).text().indexOf('건강보험') == -1 ){
			$(this).parents('li').hide();
		}else{
			$(this).html( $(this).text().replace('건강보험', '<span class="fc-mark">건강보험</span>' ) );
		}
	});

	$('.js-doc-list .js-doc-group .rc-list', container).each(function(n){
		var papa = $(this).parents('.js-doc-group');
		if ($(this).find('.fc-mark').length == 0){
			papa.find('.js-nodata').show();
			papa.removeClass('is-active');
			papa.find('.cont').hide();
			papa.find('.js-link-doc-fold').removeClass('is-active');
		}else{
			papa.addClass('is-active');
			papa.find('.cont').show();
			papa.find('.js-link-doc-fold').addClass('is-active');
		}
	});
}

/*
testDoclistSearchReset : 검색결과시 검색 초기화
- 서류선택/문서양식선택 동일사용
Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testDoclistSearchReset(container){
	$('.js-doc-search-keyword', container).val("");
	$('.js-btn-search-reset', container).hide();

	if ( $('.js-doc-list .js-doc-group .lb', container).length > 0 ){//서류선택리스트
		$('.js-doc-list .js-doc-group .lb', container).each(function(n){
			$(this).parents('li').show();
			$(this).html( $(this).html().replace('<span class="fc-mark">건강보험</span>' ,'건강보험') );
		});
	}

	$(container).find('.js-doc-group .js-nodata').hide();
}

/*
testDoclistDelete : 선택된 리스트 삭제
- 서류선택/문서양식선택 동일사용
Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testDoclistDelete(el, container){
	var id = $(el).parent('li').data('id');
	var tg = $(el).parents('.list-selected').siblings('.js-doc-list').find('#'+id);
	var papa = $(el).parents(container);
	tg.removeAttr('checked');
	$(el).parent('li').remove();
	textDocListChange(tg, papa);
}

/*
textDocListChange : 선택된 리스트 변경시 카운트 및 선택목록 초기화
- 서류선택/문서양식선택 동일사용
Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function textDocListChange(el, container){
	var tg = $(el).parents('.js-doc-group');
	if (el == null){
		$('.js-count', $(container)).text ('');
	}else {
		var count = $(el).parents('.js-doc-group').find('.js-count');
		var checkedLen = $(el).closest('ul').find(':checked').length;
		count.text( (checkedLen > 0) ? '('+checkedLen+')':'' );
	}
	var len = $(container).find('.js-selected > ul > li').length;
	if ( len > 0){
		$(container).find('.js-noselected').hide(0);
		$(container).find('.js-selected').show(0);
	}else{
		$(container).find('.js-noselected').show(0);
		$(container).find('.js-selected').hide(0);
	}

	testDocSelectedPagingRefresh(container);
}


/*
testDocSelectedPagingRefresh : 페이징 선택된 리스트갯수 변경시
- 서류선택/문서양식선택 동일사용
- Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testDocSelectedPagingRefresh(container) {

	var paging = $('.js-paging', container);
	var len = $(container).find('.js-selected > ul > li').length;
	var list = $(container).find('.js-selected > ul');
	var totalPage = Math.ceil(len/4);
	var currentPage = Number(paging.data('page'));
	paging.find('.js-total').text(totalPage);
	paging.find('.js-current').text(currentPage+1);

	if ( len < 5 ){
		paging.addClass('disabled');
		paging.find('.js-total').text(1);
		paging.find('.js-current').text(1);
		list.children().show();
		paging.find('.bnt-prev').removeAttr('disabled');
		paging.find('.bnt-next').removeAttr('disabled');
	}else{//페이징처리
		if ( (currentPage+1) > totalPage ){
			testDocSelectedPaging (-1, container);
		}else {
			paging.removeClass('disabled');

			if ( currentPage == 0 ){
				paging.find('.bnt-prev').prop('disabled', true);
				paging.find('.bnt-next').removeAttr('disabled');
			}else if (currentPage == (totalPage-1) ){
				paging.find('.bnt-prev').removeAttr('disabled');
				paging.find('.bnt-next').prop('disabled', true);
			}else{
				paging.find('.bnt-prev').removeAttr('disabled');
				paging.find('.bnt-next').removeAttr('disabled');
			}
		}

	}
}
/*
testDocSelectedPaging : 페이징 이전다음
- 서류선택/문서양식선택 동일사용
- Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function  testDocSelectedPaging(val, container) {
	var view;
	var viewnum = 4;//4개씩보임
	var papa = $(container);
	var paging = $('.js-paging', container);
	var list = $('.js-selected > ul', container);
	var currentEl = papa.find('.js-current');//현재페이지 el
	var len = list.children().length;
	var totalPage = Math.ceil(len/viewnum);
	var currentPage = Number(paging.data('page')+1);//현재페이지 num
	list.children(':lt('+viewnum+')').show();

	if ( val == -1 ){
		currentPage--;
		view = viewnum*currentPage;
		list.children().hide();
		list.children().slice(view-viewnum,  view).show();
	}else {
		view = viewnum*currentPage;
		list.children().hide();
		list.children().slice(view, view+viewnum).show();
		currentPage++;
	}
	currentEl.text(currentPage);
	paging.data('page', currentPage-1);

	testDocSelectedPagingRefresh(container);
}

/*
textDocListChange : 선택된 리스트 전체 해제시
- 서류선택/문서양식선택 동일사용
Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testDoclistAllDelete(container){
	$('.js-selected > ul', container).empty();
	$(container).find('input[type="checkbox"]').removeAttr('checked');

	textDocListChange(null, container);
}


/*
testlistSearch : 통화검색 동작 공통임
Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testlistSearchReset (container){

	$('.js-list-search-keyword', container).val("");
	$('.js-btn-search-reset', container).hide();
	$('.js-btn-more', container).show();

	$('.js-group-list .js-nodata', container).hide();
	$('.js-group-list .js-result-data', container).show();

	$('.js-group-list .js-group .lb', container).each(function(n){
		if ( $(this).text().indexOf('남아프리카') == -1 ){//검색어마크삭제
			$(this).parents('li').show();
		}else{
			$(this).html( $(this).text().replace('<span class="fc-mark">남아프리카</span>' ), '남아프리카' );
		}
	});



}

/*
testlistSearch : 통화검색 동작 공통임
Desc: 서류선택 관련된 함수나 이벤트는 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testlistSearch(container){
	if ( $('.js-list-search-keyword', container).val() == '검색어-남아프리카'){//검색결과-없을때처리


		$('.js-list-search-keyword', container).val("검색어-결과없음");
		$('.js-btn-search-reset', container).show();
		$('.js-btn-more', container).hide();


		$('.js-group-list .js-nodata', container).show();
		$('.js-group-list .js-result-data', container).hide();

		$('.js-group-list .js-group .lb', container).each(function(n){//검색어마크삭제
			if ( $(this).text().indexOf('남아프리카') == -1 ){
				$(this).parents('li').show();
			}else{
				$(this).html( $(this).text().replace('<span class="fc-mark">남아프리카</span>' ), '남아프리카' );
			}
		});
	}else if ($('.js-list-search-keyword', container).val() == '검색어-결과없음'){//첫화면

		$('.js-list-search-keyword', container).val("");
		$('.js-btn-search-reset', container).hide();
		$('.js-btn-more', container).show();

		$('.js-group-list .js-nodata', container).hide();
		$('.js-group-list .js-result-data', container).show();

		$('.js-group-list .js-group .lb', container).each(function(n){
			if ( $(this).text().indexOf('남아프리카') == -1 ){//검색어마크삭제
				$(this).parents('li').show();
			}else{
				$(this).html( $(this).text().replace('<span class="fc-mark">남아프리카</span>' ), '남아프리카' );
			}
		});
	}else{
		//검색결과-있을
		$('.js-list-search-keyword', container).val("검색어-남아프리카");
		$('.js-btn-search-reset', container).show();
		$('.js-btn-more', container).hide();

		$('.js-group-list .js-nodata', container).hide();
		$('.js-group-list .js-result-data', container).show();

		$('.js-group-list .js-group .lb', container).each(function(n){
			if ( $(this).text().indexOf('남아프리카') == -1 ){
				$(this).parents('li').hide();
			}else{
				$(this).html( $(this).text().replace('남아프리카', '<span class="fc-mark">남아프리카</span>' ) );
			}
		});
	}

}

/**********************************************************************************
 ** testEventChat - 20200429 추가
 ***********************************************************************************/
/*
* date : 20200429
* last : 20200429
* name : testEventChat()
* pram :
* desc : 해당 함수는 이벤트 선택시 채팅 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testEventChat(tg) {
	var eventVal = tg.find('.event-desc').text();

	if(eventVal == ''){
		eventVal = tg.find('img').attr('alt');
	}

	var eventAppend = '<div class="c-msg ai">\n' +
		'            <div class="inner">\n' +
		'                <!--S:ballon-->\n' +
		'                <div class="ballon">\n' +
		'                    <div class="t-desc">\n' + eventVal +
		'                        <br />바로 시작해 볼까요?\n' +
		'                    </div>\n' +
		'                    <div class="btn-list-group vertical">\n' +
		'                        <a href="#" class="btn-pos arrow">다른 이벤트 볼래요.</a>\n' +
		'                        <a href="#" class="btn-pos arrow">네, 시작할게요</a>\n' +
		'                        <a href="#" class="btn-pos arrow">아니요, 다음에 할래요</a>\n' +
		'                    </div>\n' +
		'                </div>\n' +
		'                <!--E:ballon-->\n' +
		'                <span class="time">오후 01:00</span>\n' +
		'            </div>\n' +
		'        </div>';

	$('.js-chat .mCSB_container').append(eventAppend);

	if($(".js-chat").hasClass('mCustomScrollbar')){ // pc
		$(".js-chat").mCustomScrollbar("scrollTo", "bottom", {scrollInertia: 0});
	}else{ //mo
		$('.js-chat .mCustomScrollBox').scrollTop($('.js-chat .mCSB_container').height());
	}
}


/**********************************************************************************
 ** testMmenuSearch - 20200511 추가
 ***********************************************************************************/
/*
* date : 20200511
* last : 20200511
* name : testMmenuSearch()
* pram :
* desc : 해당 함수는 검색버튼 클릭시 검색 단어 하이라이트 처리 확인을 위해 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testMmenuSearch(container) {
	$('.js-mmenu-search-keyword').val("금융");

	$('.js-menu-list li .lb', container).each(function (n) {
		if ($(this).text().indexOf('금융') == -1) {
			$(this).parents('li').hide();
		} else {
			$(this).html($(this).text().replace('금융', '<span class="fc-spot">금융</span>'));
		}
	});
}

/**********************************************************************************
 ** testMmenuSearchReset - 20200511 추가
 ***********************************************************************************/
/*
* date : 20200511
* last : 20200511
* name : testMmenuSearchReset()
* pram :
* desc : 해당 함수는 검색창 닫기시 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
//testDoclistSearchReset
function testMmenuSearchReset(container) {
	$('.js-mmenu-search-keyword').val("");

	if ($('.js-menu-list li .lb', container).length > 0 ){//서류선택리스트
		$('.js-menu-list li .lb', container).each(function(n){
			$(this).parents('li').show();
			$(this).html($(this).text().replace('<span class="fc-spot">금융</span>', '금융'));
		});
	}
}

/**********************************************************************************
 ** testScrapSearch - 20200519 추가
 ***********************************************************************************/
/*
* date : 20200519
* last : 20200519
* name : testScrapSearch()
* pram :
* desc : 해당 함수는 스크랩 검색버튼 클릭시 검색 단어 하이라이트 처리 확인을 위해 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testScrapSearch(container) {
	$('.js-scrap-search-keyword').val("안내");
	$('.js-btn-search-reset', container).show();

	$('.js-scrap-list .list-item > .lb', container).each(function (n) {
		if ($(this).text().indexOf('안내') == -1) {
			$(this).parents('li').hide();
		} else {
			$(this).html($(this).text().replace('안내', '<span class="fc-spot">안내</span>'));
		}
	});
}

/**********************************************************************************
 ** testScrapSearchReset - 20200519 추가
 ***********************************************************************************/
/*
* date : 20200519
* last : 20200519
* name : testScrapSearchReset()
* pram :
* desc : 해당 함수는 스크랩 검색창 닫기시 UI 확인을 위해서 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testScrapSearchReset(container) {
	$('.js-mmenu-search-keyword, container').val("");
	$('.js-btn-search-reset', container).hide();

	if ($('.js-scrap-list .list-item > .lb', container).length > 0 ){
		$('.js-scrap-list .list-item > .lb', container).each(function(n){
			$(this).parents('li').show();
			$(this).html($(this).text().replace('<span class="fc-spot">안내</span>', '안내'));
		});
	}
}

/**********************************************************************************
 ** testSetScrapEdit - 20200519 추가
 ***********************************************************************************/
/*
* date : 20200519
* last : 20200519
* name : testSetScrapEdit()
* pram :
* desc : 해당 함수는 스크랩 편집 텍스트 적용 확인 test를 위해 작성되었으니 개발시 참고만 부탁드립니다.
*/
function testSetScrapEdit() {
	if($('.js-my-edit-list li .edit-item').length > 0){
		$('.js-my-edit-list li .edit-item').each(function(){
			var testValue = $(this).val().replace(/(\n|\r\n)/g, '<br>');
			$('#scrapTestBox .inner').append('<div style="padding: 10px; margin-bottom: 10px; border: 1px solid #d5d5d5; background: #fff; border-radius: 8px;">'+testValue+'</div>');
		});
	}
}