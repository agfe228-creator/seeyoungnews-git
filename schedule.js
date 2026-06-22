(function () {
  function readDate(element) {
    const value = element.getAttribute('data-publish-at');
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function isFuture(element, now) {
    const publishAt = readDate(element);
    return publishAt && publishAt > now;
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
    if (!article) return;

    const value = article.getAttribute('data-article-publish-at');
    const publishAt = value ? new Date(value) : null;
    if (!publishAt || Number.isNaN(publishAt.getTime()) || publishAt <= new Date()) return;

    article.innerHTML = '<span class="meta">예약 글</span><h1>아직 공개 전인 글입니다</h1><p>이 글은 예약된 공개 시간이 지난 뒤 확인할 수 있습니다.</p><p><a href="../">홈으로 돌아가기</a></p>';
    document.title = '예약 글 | SY Guide';
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
    protectFutureArticle();

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
