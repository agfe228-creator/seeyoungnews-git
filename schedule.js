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

  function isFuture(element, now) {
    const publishAt = readDate(element);
    return publishAt && publishAt > now;
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
      return [
        ['보호나라', 'https://www.boho.or.kr/'],
        ['Google 계정 도움말', 'https://support.google.com/accounts/?hl=ko'],
        ['네이버 고객센터', 'https://help.naver.com/']
      ];
    }
    if (categoryText.indexOf('앱 설정') !== -1) {
      return [
        ['카카오 고객센터', 'https://cs.kakao.com/'],
        ['Google 고객센터', 'https://support.google.com/'],
        ['Apple 지원', 'https://support.apple.com/ko-kr']
      ];
    }
    if (categoryText.indexOf('백업/저장공간') !== -1) {
      return [
        ['Google 포토 고객센터', 'https://support.google.com/photos/?hl=ko'],
        ['Apple iCloud 지원', 'https://support.apple.com/ko-kr/icloud'],
        ['카카오 고객센터', 'https://cs.kakao.com/']
      ];
    }
    if (categoryText.indexOf('생활 체크리스트') !== -1) {
      return [
        ['보호나라', 'https://www.boho.or.kr/'],
        ['Google 안전 센터', 'https://safety.google/intl/ko/'],
        ['Apple 지원', 'https://support.apple.com/ko-kr']
      ];
    }
    return [
      ['Google 고객센터', 'https://support.google.com/'],
      ['Apple 지원', 'https://support.apple.com/ko-kr'],
      ['보호나라', 'https://www.boho.or.kr/']
    ];
  }

  function appendQualityNotes() {
    const article = document.querySelector('[data-article-publish-at]');
    if (!article || article.querySelector('[data-quality-notes]')) return;

    const publishAt = articlePublishDate(article);
    if (publishAt && !Number.isNaN(publishAt.getTime()) && publishAt > new Date()) return;
    updateArticleMetaDate(article, publishAt);

    const meta = article.querySelector('.meta');
    const categoryText = meta ? meta.textContent : '';
    const links = categoryLinks(categoryText);
    const sourceItems = links.map(function (link) {
      return '<li><a href="' + link[1] + '" target="_blank" rel="noopener">' + link[0] + '</a></li>';
    }).join('');

    const note = document.createElement('section');
    note.className = 'page-copy';
    note.setAttribute('data-quality-notes', 'true');
    note.innerHTML = '' +
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

  function protectFutureArticle() {
    const article = document.querySelector('[data-article-publish-at]');
    if (!article) return false;

    const publishAt = articlePublishDate(article);
    if (!publishAt || Number.isNaN(publishAt.getTime()) || publishAt <= new Date()) return false;

    article.innerHTML = '<span class="meta">예약 글</span><h1>아직 공개 전인 글입니다</h1><p>이 글은 예약된 공개 시간이 지난 뒤 확인할 수 있습니다.</p><p><a href="../">홈으로 돌아가기</a></p>';
    document.title = '예약 글 | SY Guide';
    return true;
  }

  function revealPublishedItems() {
    const now = new Date();
    let nextPublishAt = null;

    document.querySelectorAll('[data-publish-at]').forEach(function (element) {
      const publishAt = readDate(element);
      if (!publishAt) return;

      if (isFuture(element, now)) {
        element.hidden = true;
        element.setAttribute('aria-hidden', 'true');
        if (!nextPublishAt || publishAt < nextPublishAt) nextPublishAt = publishAt;
      } else {
        element.hidden = false;
        element.removeAttribute('aria-hidden');
      }
    });

    updateEmptyStates();
    if (!protectFutureArticle()) appendQualityNotes();

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
