(function () {
  const scheduleOverrides = {
    'slow-phone-before-delete-settings.html': '2026-06-29T19:00:00+09:00',
    'app-permissions-review.html': '2026-07-01T19:00:00+09:00',
    'public-wifi-security-habits.html': '2026-07-03T19:00:00+09:00',
    'photo-cleanup-app-before-use.html': '2026-07-05T19:00:00+09:00',
    'digital-subscription-cleanup.html': '2026-07-07T19:00:00+09:00',
    'smartphone-no-sound-basic-check.html': '2026-07-09T19:00:00+09:00',
    'messenger-profile-visibility.html': '2026-07-11T19:00:00+09:00',
    'phone-loss-security-before.html': '2026-07-13T19:00:00+09:00',
    'external-drive-cloud-backup-compare.html': '2026-07-15T19:00:00+09:00',
    'digital-life-total-checklist.html': '2026-07-17T19:00:00+09:00'
  };

  function parseDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function findOverrideKey(text) {
    if (!text) return null;
    return Object.keys(scheduleOverrides).find(function (key) {
      return text.indexOf(key) !== -1;
    });
  }

  function overrideDateFromLink(element) {
    const link = element.matches('a[href]') ? element : element.querySelector('a[href]');
    const key = link ? findOverrideKey(link.getAttribute('href')) : null;
    return key ? parseDate(scheduleOverrides[key]) : null;
  }

  function currentArticleOverrideDate() {
    const key = findOverrideKey(window.location.pathname);
    return key ? parseDate(scheduleOverrides[key]) : null;
  }

  function articlePublishDate(article) {
    return currentArticleOverrideDate() || parseDate(article.getAttribute('data-article-publish-at'));
  }

  function readDate(element) {
    return overrideDateFromLink(element) || parseDate(element.getAttribute('data-publish-at'));
  }

  function formatKoreanDate(date) {
    if (!date || Number.isNaN(date.getTime())) return '2026.06.23';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '.' + month + '.' + day;
  }

  function formatKoreanDateTime(date) {
    if (!date || Number.isNaN(date.getTime())) return null;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return formatKoreanDate(date) + ' ' + hours + ':' + minutes;
  }

  function updateArticleMetaDate(article, publishAt) {
    const meta = article.querySelector('.meta');
    const formatted = formatKoreanDateTime(publishAt);
    if (!meta || !formatted) return;
    meta.textContent = meta.textContent.replace(/입력 \d{4}\.\d{2}\.\d{2} \d{2}:\d{2}/, '입력 ' + formatted);
  }

  function categoryLinks(categoryText) {
    if (categoryText.indexOf('계정/보안') !== -1) {
      return [['보호나라', 'https://www.boho.or.kr/'], ['Google 계정 도움말', 'https://support.google.com/accounts/?hl=ko'], ['네이버 고객센터', 'https://help.naver.com/']];
    }
    if (categoryText.indexOf('앱 설정') !== -1) {
      return [['카카오 고객센터', 'https://cs.kakao.com/'], ['Google 고객센터', 'https://support.google.com/'], ['Apple 지원', 'https://support.apple.com/ko-kr']];
    }
    if (categoryText.indexOf('백업/저장공간') !== -1) {
      return [['Google 포토 고객센터', 'https://support.google.com/photos/?hl=ko'], ['Apple iCloud 지원', 'https://support.apple.com/ko-kr/icloud'], ['카카오 고객센터', 'https://cs.kakao.com/']];
    }
    if (categoryText.indexOf('생활 체크리스트') !== -1) {
      return [['보호나라', 'https://www.boho.or.kr/'], ['Google 안전 센터', 'https://safety.google/intl/ko/'], ['Apple 지원', 'https://support.apple.com/ko-kr']];
    }
    return [['Google 고객센터', 'https://support.google.com/'], ['Apple 지원', 'https://support.apple.com/ko-kr'], ['보호나라', 'https://www.boho.or.kr/']];
  }

  function articleDepthNotes(title, categoryText) {
    let focus = '설정 이름이 기기와 앱 버전에 따라 다를 수 있으므로, 같은 단어를 찾기보다 비슷한 기능을 차례대로 확인하는 것이 좋습니다.';
    let checks = ['설정을 바꾸기 전 현재 상태를 먼저 캡처하거나 메모하기', '변경 후 알림, 동기화, 로그인 상태가 달라졌는지 확인하기', '가족 기기나 업무용 계정은 바로 삭제하지 말고 백업 여부부터 확인하기'];

    if (title.indexOf('배터리') !== -1 || title.indexOf('느려') !== -1 || title.indexOf('소리') !== -1) {
      focus = '기기 상태 문제는 앱 삭제보다 사용량 화면, 최근 설치 앱, 자동 실행 설정을 먼저 확인해야 원인을 좁히기 쉽습니다.';
      checks = ['최근 3일 안에 설치하거나 업데이트한 앱 확인하기', '절전 모드나 방해금지 모드가 켜져 있는지 확인하기', '재부팅 후에도 같은 문제가 반복되는지 비교하기'];
    } else if (title.indexOf('카카오') !== -1 || title.indexOf('유튜브') !== -1 || title.indexOf('네이버 앱') !== -1 || title.indexOf('지도') !== -1 || title.indexOf('권한') !== -1 || title.indexOf('프로필') !== -1) {
      focus = '앱 설정은 앱 안의 설정과 스마트폰 운영체제 설정이 따로 움직이는 경우가 많아 두 위치를 함께 확인해야 합니다.';
      checks = ['앱 내부 설정에서 알림, 기록, 공개 범위 확인하기', '스마트폰 설정의 앱 권한에서 위치, 사진, 마이크 접근 확인하기', '앱 업데이트 뒤 메뉴 이름이 바뀌었는지 공식 도움말로 재확인하기'];
    } else if (title.indexOf('보안') !== -1 || title.indexOf('비밀번호') !== -1 || title.indexOf('피싱') !== -1 || title.indexOf('중고폰') !== -1 || title.indexOf('공용 와이파이') !== -1 || title.indexOf('분실') !== -1) {
      focus = '보안 관련 설정은 편의보다 복구 가능성이 중요합니다. 비밀번호나 인증 방식을 바꾸기 전 복구 이메일과 전화번호가 최신인지 먼저 확인해야 합니다.';
      checks = ['로그인 기록과 연결된 기기 목록 확인하기', '복구 이메일, 전화번호, 백업 코드 상태 점검하기', '문자 링크나 공용 와이파이에서는 금융·인증 작업 피하기'];
    } else if (title.indexOf('백업') !== -1 || title.indexOf('사진') !== -1 || title.indexOf('저장공간') !== -1 || title.indexOf('클라우드') !== -1 || title.indexOf('연락처') !== -1) {
      focus = '백업과 저장공간 정리는 삭제보다 확인이 먼저입니다. 한 기기에서 보인다고 해서 다른 기기나 클라우드에 안전하게 남아 있다고 단정하면 안 됩니다.';
      checks = ['클라우드와 다른 기기에서 같은 자료가 열리는지 확인하기', '휴지통 보관 기간과 원본 삭제 영향을 확인하기', '중요한 사진, 연락처, 대화는 두 곳 이상에 보관하기'];
    } else if (title.indexOf('여행') !== -1 || title.indexOf('부모님') !== -1 || title.indexOf('가족') !== -1 || title.indexOf('새 스마트폰') !== -1 || title.indexOf('구독') !== -1) {
      focus = '생활 체크리스트 글은 한 번에 모두 바꾸기보다 출발 전, 기기 변경 전, 월말 점검처럼 상황별로 나누어 확인하면 실수를 줄일 수 있습니다.';
      checks = ['가장 중요한 연락, 결제, 인증, 백업 항목부터 먼저 확인하기', '가족 기기는 본인 동의 없이 계정이나 결제 설정을 바꾸지 않기', '변경 후 하루 정도 실제 알림과 동기화 상태를 지켜보기'];
    }

    const platform = categoryText.indexOf('계정/보안') !== -1
      ? 'Android와 iPhone 모두 계정 보안 메뉴의 이름은 다를 수 있지만, 로그인 기록, 연결된 기기, 복구 수단, 2단계 인증이라는 네 가지 축은 거의 동일합니다.'
      : 'Android는 설정 앱 안의 앱 관리와 권한 메뉴가 자세한 편이고, iPhone은 설정 앱에서 앱 이름을 선택해 권한과 알림을 확인하는 흐름이 많습니다.';

    return '' +
      '<h2>실제 확인 포인트</h2>' +
      '<p>' + focus + ' 글을 읽은 뒤에는 바로 삭제나 초기화를 하기보다 현재 설정을 확인하고, 필요한 항목만 한 단계씩 바꾸는 방식이 안전합니다.</p>' +
      '<ul>' + checks.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul>' +
      '<h2>Android와 iPhone에서 다른 점</h2>' +
      '<p>' + platform + ' 같은 기능이라도 제조사, 통신사 앱, 운영체제 버전에 따라 메뉴 위치가 달라질 수 있으므로 검색창에 핵심 단어를 입력해 찾는 것도 좋은 방법입니다.</p>' +
      '<h2>확인 기준일</h2>' +
      '<p>이 글의 확인 기준일은 2026년 6월 27일입니다. 앱과 운영체제는 업데이트가 잦으므로 중요한 설정은 변경 직전에 공식 도움말과 현재 화면을 함께 확인하는 것이 좋습니다.</p>';
  }

  function appendQualityNotes() {
    const article = document.querySelector('[data-article-publish-at]');
    if (!article || article.querySelector('[data-quality-notes]')) return;

    const publishAt = articlePublishDate(article);
    updateArticleMetaDate(article, publishAt);

    const meta = article.querySelector('.meta');
    const heading = article.querySelector('h1');
    const categoryText = meta ? meta.textContent : '';
    const title = heading ? heading.textContent : '';
    const sourceItems = categoryLinks(categoryText).map(function (link) {
      return '<li><a href="' + link[1] + '" target="_blank" rel="noopener">' + link[0] + '</a></li>';
    }).join('');

    const note = document.createElement('section');
    note.className = 'page-copy';
    note.setAttribute('data-quality-notes', 'true');
    note.innerHTML = '' +
      articleDepthNotes(title, categoryText) +
      '<h2>작성 기준과 확인 방법</h2>' +
      '<p>이 글은 스마트폰과 주요 앱에서 실제로 확인할 수 있는 설정 순서를 기준으로 정리했습니다. 기기 제조사, 운영체제 버전, 앱 업데이트 상태에 따라 메뉴 이름이나 위치가 조금 다를 수 있어, 중요한 계정·보안·백업 설정은 공식 도움말을 함께 확인하는 것을 권장합니다.</p>' +
      '<h2>공식 확인처</h2>' +
      '<ul>' + sourceItems + '</ul>' +
      '<h2>주의사항</h2>' +
      '<p>파일 삭제, 계정 로그아웃, 백업 해제, 보안 설정 변경은 되돌리기 어려울 수 있습니다. 가족 기기나 업무용 계정은 변경 전 필요한 자료가 남아 있는지 확인하고, 중요한 내용은 별도 백업 후 진행하세요.</p>' +
      '<p><strong>최종 업데이트:</strong> ' + formatKoreanDate(publishAt) + ' · <strong>작성/검토:</strong> SY Guide 편집팀</p>';

    article.appendChild(note);
  }

  function updateEmptyStates() {
    document.querySelectorAll('[data-scheduled-empty]').forEach(function (emptyState) {
      const selector = emptyState.getAttribute('data-scheduled-empty');
      const scope = selector ? document.querySelector(selector) : document;
      const visible = scope && scope.querySelector('[data-publish-at]:not([hidden])');
      emptyState.hidden = Boolean(visible);
    });
  }

  function revealPublishedItems() {
    const now = new Date();
    let nextPublishAt = null;

    document.querySelectorAll('[data-publish-at]').forEach(function (element) {
      const publishAt = readDate(element);
      if (!publishAt) return;

      if (publishAt > now) {
        element.hidden = true;
        element.setAttribute('aria-hidden', 'true');
        if (!nextPublishAt || publishAt < nextPublishAt) nextPublishAt = publishAt;
      } else {
        element.hidden = false;
        element.removeAttribute('aria-hidden');
      }
    });

    updateEmptyStates();
    appendQualityNotes();

    if (nextPublishAt) {
      const delay = Math.min(nextPublishAt.getTime() - now.getTime() + 1000, 2147483647);
      window.setTimeout(revealPublishedItems, delay);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealPublishedItems);
  } else {
    revealPublishedItems();
  }
})();
