// 센터 구글 시트 연결 주소 (Apps Script 웹 앱 URL)
window.KSL_CONFIG = {
  scriptUrl: "https://script.google.com/macros/s/AKfycbwKKi8GmHB7EEBeCcyRKzpeQ3vsdqifJPeyZFoWRdWUwZ4EFB-tkXexcE9Kzhs0xqY4/exec"
};

// 카카오톡 안에서 연결 링크를 누르면 앱 설치가 되지 않으므로, 휴대폰의 기본 브라우저(크롬·사파리)로 다시 엽니다.
(function () {
  var ua = navigator.userAgent || "";
  if (/KAKAOTALK/i.test(ua) && /[#&]c=\d{8}/.test(location.hash)) {
    window.KSL_CONFIG.openedExternally = true;
    location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(location.href);
  }
})();
