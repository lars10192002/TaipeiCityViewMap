var noDataText = '未提供'; //無資料時顯示的文字
var pageViewQty = 12; //每頁顯示的景點數量



let viewData = '';
function getAreaViewData() {
    let data = new XMLHttpRequest();
    data.open('get', 'data/viewData.json', true);
    data.send(null);
    data.onload = function () {
        if (data.status == 200) {
            viewData = JSON.parse(data.responseText);
            //console.log("in "+data.responseText);

            //缺一段要檢查localstage
            selectArea();
        } else {
            document.querySelector('.box-area').innerHTML = '<h2>取得資料時發生錯誤，請檢查網路狀態並重新整理：）</h2>';
        }

    }
}

function selectArea(areaName, pageNo) {
    //alert("go");

    if (!pageNo) {
        pageNo = 1;
        areaName = document.querySelector('.content__select').selectedOptions[0].text;
    }
    setViewData(areaName, pageNo);

}

let currAreaName = '';
let currViewData = [];
let currViewDataCount = 0;
function setViewData(areaName, pageNo) {
    if (currAreaName != areaName) {
        currAreaName = areaName;
        currViewData = [];
        for (let i in viewData) {

            let dataNo = viewData[i].RowNumber || noDataText;
            let dataAreaName = viewData[i].address.substr(5, 3) || noDataText;
            let dataTitle = viewData[i].stitle || noDataText;
            let dataDesc = viewData[i].xbody || noDataText;
            let dataLongitude = viewData[i].longitude ||noDataText;
            let dataLatitude = viewData[i].latitude ||noDataText;
            let dataMRT = viewData[i].MRT || noDataText;
            let dataInfo = viewData[i].info || noDataText;
            let dataOpenTime = viewData[i].MEMO_TIME || noDataText;
            let dataAddress = viewData[i].address || noDataText;
            let dataTel = viewData[i].MEMO_TEL || noDataText;
            let dataPic;
            let dataPicDesc;
            if (viewData[i].file.img.length === undefined) {
                dataPic = viewData[i].file.img['#text'] || '';
                dataPicDesc = viewData[i].file.img['-description'] || noDataText;
            } else {
                dataPic = viewData[i].file.img[0]['#text'] || '';
                dataPicDesc = viewData[i].file.img[0]['-description'] || noDataText;

            }

            if (dataAreaName == currAreaName) {

                currViewData.push({
                    'dataNo': dataNo,
                    'dataAreaName': dataAreaName,
                    'dataTitle': dataTitle,
                    'dataDesc': dataDesc,
                    'dataLatitude':dataLatitude,
                    'dataLongitude':dataLongitude,
                    'dataMRT': dataMRT,
                    'dataInfo': dataInfo,
                    'dataOpenTime': dataOpenTime,
                    'dataAddress': dataAddress,
                    'dataTel': dataTel,
                    'dataPic': dataPic,
                    'dataPicDesc': dataPicDesc,
                });
            }
            currViewDataCount = currViewData.length;

        }

        currViewDataCount = currViewData.length;
    }
    //重新計算view,tab的顯示位置
    if (!pageNo) {
        pageNo = '1';
    }
    createView(pageNo);
    createPageBtn(pageNo);
    document.querySelector('.content__select').selectedOptions[0].text = currAreaName;
}

function createView(pageNo) {
    let viewBox = '';
    let pageStart = 0;
    let pageEnd = 0;
    if (pageNo == 1) {// 第一頁 0~12
        pageStart = 0;
        pageEnd = pageViewQty;
    } else {//第二頁 以上
        pageStart = parseInt(pageNo * pageViewQty - pageViewQty);
        pageEnd = parseInt(pageNo * pageViewQty);
    }

    for (let i = pageStart; i < pageEnd; i++) {
        if (i == currViewDataCount) {
            break;
        }
        viewBox +=
            '<div class="info-box">' +
            '<div class="info-box__top">' +
            '<img class="info-box__img" src="' + currViewData[i].dataPic + '" alt="' + currViewData[i].dataPicDesc + '">' +
            '<h3 class="info-box__view-name">' + currViewData[i].dataTitle + '</h3>' +
            '<p class="info-box__area-name">' + currAreaName + '</p>' +
            '</div>' +
            '<div class="info-box__bottom">' +
            '<p class="info-box__span"><b>地址:</b>' + currViewData[i].dataAddress + '</p>' +
            '<p class="info-box__span"><b>電話:</b>' + currViewData[i].dataTel + '</p>' +
            //'<span class="info-box__span"><b>時間:</b>' + currViewData[i].dataOpenTime + '</span>' +
            '<button type="button" class="button button--readMore" data-viewNo="' + currViewData[i].dataNo + '">景點位置</span>' +
            '</div>' +
            '</div>';
    }
    document.querySelector('.box-area').innerHTML = viewBox;

    setReadMoreButton();
}

function setReadMoreButton() {
    var readMoreButton = document.querySelectorAll('.button--readMore');
    for (var i = 0; i < readMoreButton.length; i++) {
        readMoreButton[i].addEventListener('click', function (e) {
            showViewData(e.srcElement.getAttribute('data-viewNo'));
            // alert(e.srcElement.getAttribute('data-viewNo'));

        }, false);
    }
}

function showViewData(viewNo) {
    // alert(viewNo);
    for (var i = 0; i < currViewData.length; i++) {
        if (viewNo == currViewData[i].dataNo) {
            document.querySelector('.view-title').textContent = currViewData[i].dataTitle;
            //document.querySelector('.view-img').setAttribute('src', currViewData[i].dataPic);
            //document.querySelector('.view-img').setAttribute('alt', currViewData[i].dataPicDesc);
            //document.querySelector('.view-content').innerHTML = replaceAll(currViewData[i].dataDesc, '。', '。<br />');
            document.querySelector('.view-add').innerHTML = currViewData[i].dataAddress;
            //document.querySelector('.view-tel').innerHTML = currViewData[i].dataTel;
            //document.querySelector('.view-time').innerHTML = replaceAll(currViewData[i].dataOpenTime, /\n/g, '<br />');
            document.querySelector('.view-MRT').textContent = currViewData[i].dataMRT;
            //document.querySelector('.view-info').innerHTML = replaceAll(currViewData[i].dataInfo, '。', '。<br />');

            initMap(currViewData[i].dataLatitude,currViewData[i].dataLongitude);
            
            break;
        }
    }
    document.querySelector('.modal').style.display = 'block';
}
function initMap(latitude,longitude) {
    console.log(latitude+"  "+longitude);

    var uluru = { lat: +latitude, lng: +longitude };

    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 14, center: uluru,mapTypeId: 'roadmap' });
    var marker = new google.maps.Marker({ position: uluru, map: map });
}
function listenModalClose() {
    var closeModalEl = document.querySelector('.modal');
    closeModalEl.addEventListener('click', function(e) {
        if (e.target.className == 'modal' || e.target.classList.contains('button--close')) {
            document.querySelector('.modal').style.display = 'none';
        }
    })
}


function createPageBtn(pageNo) {
    let page = '';
    let pageCnt = Math.ceil(currViewDataCount / pageViewQty);

    if (pageCnt > 1) {
        for (let i = 0; i < pageCnt; i++) {
            let setNo = parseInt(i + 1);
            if (pageNo == setNo) {
                page += '<li class="paging__pages paging__pages--active">' + setNo + '</li>';
            } else {
                page += '<li class="paging__pages">' + setNo + '</li>';
            }
        }
        document.querySelector('.paging').innerHTML = page;
        setPageButton();

    }

}

function setPageButton() {
    let pageEl = document.querySelectorAll('.paging__pages');
    for (let i = 0; i < pageEl.length; i++) {
        pageEl[i].addEventListener('click', function (e) {

            pageNo = e.srcElement.textContent;
            // window.scrollTo(0, 300);
            //建立對應頁碼的景點資料
            createView(pageNo);
            //建立對應頁碼的分頁按鈕
            createPageBtn(pageNo);

        }, false);
    }

}

let zipData = '';
function getAreaCodeData() { //取得行政區資料
    let zip = new XMLHttpRequest();
    zip.open('get', 'data/viewZip.json', true);
    zip.send(null);
    zip.onload = function () {
        if (zip.status == 200) {
            zipData = JSON.parse(zip.responseText);

            createAreaSelect(zipData);//建立行政區下拉選單
            getAreaViewData();//取得景點資料
        } else {
            document.querySelector('.box-area').innerHTML = '<h2>取得資料時發生錯誤，請檢查網路狀態並重新整理：）</h2>';
        }
    }
}
//組合行政區選單資料
function createAreaSelect(areadata) {
    let areaOptions = '';
    for (let i in areadata) {
        let areaName = areadata[i].District;
        let areaCode = areadata[i].zipcode;
        areaOptions += '<option value = "' + areaCode + '">' + areaName + '</option> ';
    }
    document.querySelector('.content__select').innerHTML = areaOptions;
}

function goStart() {
    console.log("init")
    //取得行政區資料
    getAreaCodeData();
    //偵測行政區選擇框
    listenSelect();
    // //偵測行政區選擇框
    listenModalClose();
}

function listenSelect() {//set option EventListener
    var selectEl = document.querySelector('.content__select');
    selectEl.addEventListener('change', selectArea, false);
    //alert(selectEl);
}
window.onload = goStart();