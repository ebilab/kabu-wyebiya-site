/* ==========================================================================
   wyEBIYA site — script
   - モバイルメニューの開閉のみを担当する軽量スクリプト
   - 機能追加時はここに関数を足してください
   ========================================================================== */

(function () {
  "use strict";

  const toggle = document.querySelector(".site-nav__toggle");
  const menu = document.querySelector(".site-nav__list");

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener("click", function () {
    const isOpen = menu.getAttribute("data-open") === "true";
    menu.setAttribute("data-open", String(!isOpen));
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  /* メニュー内のリンクをクリックしたら閉じる(モバイル時) */
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.matchMedia("(max-width: 768px)").matches) {
        menu.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ウィンドウサイズが戻ったときにメニューを開いた状態のままにしない */
  window.addEventListener("resize", function () {
    if (!window.matchMedia("(max-width: 768px)").matches) {
      menu.setAttribute("data-open", "false");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ==========================================================================
   実践メモ カテゴリ絞り込み (practice.html)
   - .filter-bar[data-filter-bar] 内の <button data-filter="..."> を起点に動作
   - 各 .practice-card[data-categories] の data-categories(空白区切り) と
     ボタンの data-filter を照合し、一致しないカードは hidden 属性で非表示
   - data-filter="all" のボタンは全件表示
   - フィルター対象が無いページではこのモジュールは何もしない
   ========================================================================== */

(function () {
  "use strict";

  const filterBar = document.querySelector("[data-filter-bar]");
  if (!filterBar) {
    return;
  }

  const buttons = filterBar.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".practice-card[data-categories]");
  const emptyMessage = document.querySelector("[data-filter-empty]");
  const countElement = document.querySelector("[data-filter-count]");

  function applyFilter(value) {
    let visibleCount = 0;

    cards.forEach(function (card) {
      let show;
      if (value === "all") {
        show = true;
      } else {
        const cats = (card.dataset.categories || "")
          .split(/\s+/)
          .filter(Boolean);
        show = cats.indexOf(value) !== -1;
      }
      card.hidden = !show;
      if (show) {
        visibleCount += 1;
      }
    });

    buttons.forEach(function (btn) {
      const isActive = btn.dataset.filter === value;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount > 0;
    }

    if (countElement) {
      countElement.textContent = String(visibleCount);
    }
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyFilter(btn.dataset.filter);
    });
  });
})();

/* ==========================================================================
   実践メモ 詳細モーダル (practice.html)
   - .practice-card__more (data-modal-trigger) クリックでモーダルを開く
   - 各カードの <template class="practice-card__detail"> の中身を
     #modal-content に複製挿入する
   - 閉じる手段: × ボタン / 背景クリック / Esc キー
   - 開閉時に body へ .is-modal-open を付与してスクロールを抑止
   - フォーカスは開いたら閉じるボタンへ、閉じたら起点ボタンへ戻す
   ========================================================================== */

(function () {
  "use strict";

  const modal = document.querySelector("[data-modal]");
  if (!modal) {
    return;
  }

  const modalContent = modal.querySelector("[data-modal-content]");
  const closeButtons = modal.querySelectorAll("[data-modal-close]");
  const triggers = document.querySelectorAll("[data-modal-trigger]");

  /* 開く前にフォーカスが当たっていた要素 (閉じたあと戻す) */
  let lastTrigger = null;

  function openModal(card, triggerEl) {
    if (!card || !modalContent) {
      return;
    }
    const template = card.querySelector("template.practice-card__detail");
    if (!template) {
      return;
    }

    /* 内容を入れ替え */
    modalContent.innerHTML = "";
    modalContent.appendChild(template.content.cloneNode(true));

    /* 表示 */
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-modal-open");

    lastTrigger = triggerEl || null;

    /* 閉じるボタンへフォーカス */
    const firstCloseBtn = modal.querySelector(".modal__close");
    if (firstCloseBtn) {
      firstCloseBtn.focus();
    }
  }

  function closeModal() {
    if (modal.hidden) {
      return;
    }
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-modal-open");
    if (modalContent) {
      modalContent.innerHTML = "";
    }
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
    lastTrigger = null;
  }

  triggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const card = btn.closest(".practice-card");
      openModal(card, btn);
    });
  });

  closeButtons.forEach(function (el) {
    el.addEventListener("click", function () {
      closeModal();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
})();
