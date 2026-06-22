# SY Guide 예약 발행 사용법

이 저장소에는 `schedule.js`가 들어가 있습니다. 홈과 카테고리 페이지에서는 미래 날짜 글 카드가 자동으로 숨겨지고, 시간이 지나면 표시됩니다.

## 1. 목록 카드 예약

홈이나 카테고리 페이지의 글 카드에 `data-publish-at`을 추가합니다.

```html
<article class="article-card" data-publish-at="2026-07-01T13:00:00+09:00">
  <a class="article-thumb" href="./articles/example.html"><img src="./assets/articles/example.png" alt="예시 글 대표 이미지"></a>
  <span class="meta">앱 설정</span>
  <h3><a href="./articles/example.html">예시 글 제목</a></h3>
  <p>예시 글 설명입니다.</p>
</article>
```

## 2. 글 상세페이지 공개 전 보호

새 글 상세페이지의 본문 article에 `data-article-publish-at`을 추가하고, 맨 아래에 `../schedule.js`를 연결합니다.

```html
<article class="article-body" data-article-publish-at="2026-07-01T13:00:00+09:00">
  ...글 내용...
</article>

<script src="../schedule.js"></script>
</body>
</html>
```

## 3. 시간 형식

한국 시간 기준으로 아래 형식을 사용합니다.

```text
2026-07-01T13:00:00+09:00
```

## 4. 주의사항

- 공개 전 글은 사이트맵에 넣지 않습니다.
- 공개 전 글 URL을 검색콘솔에 제출하지 않습니다.
- 공개 전 글 링크를 다른 글 본문에 걸지 않습니다.
- 홈/카테고리 목록에는 `data-publish-at`을 꼭 넣습니다.
- 새 글 상세페이지에는 `data-article-publish-at`과 `../schedule.js`를 같이 넣습니다.
