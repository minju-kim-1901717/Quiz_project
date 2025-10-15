(() => {
  let items = (SERVER_ITEMS || []).map((d, i) => ({
    id: d.id ?? i+1,
    question: d.question,
    answer: d.answer,
    revealed: false,
  }));

  const $grid = document.getElementById("grid");
  const $shuffle = document.getElementById("shuffle");
  const $resetFront = document.getElementById("resetFront");
  const $hideSolved = document.getElementById("hideSolved");
  const $count = document.getElementById("count");

  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const updateCount = () => {
    const total = items.length;
    const solved = items.filter(x => x.revealed).length;
    if ($count) $count.textContent = `${solved}/${total}`;
  };

  const render = () => {
    const hideSolved = $hideSolved && $hideSolved.checked;
    $grid.innerHTML = "";
    let visibleCount = 0;

    items.forEach((item) => {
      if (hideSolved && item.revealed) return;
      visibleCount++;

      const card = document.createElement("button");
      card.className = "card";
      card.type = "button";
      card.dataset.revealed = String(item.revealed);
      card.dataset.solved = String(item.revealed);
      card.setAttribute("aria-label", item.revealed ? `${item.answer} (정답 공개됨)` : `${item.question} (클릭하여 정답 확인)`);

      const pill = document.createElement("div");
      pill.className = "pill" + (item.revealed ? " ans" : "");
      pill.textContent = item.revealed ? "정답" : "퀴즈";

      const hobby = document.createElement("div");
      hobby.className = "hobby";
      hobby.textContent = item.question;

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = item.answer;

      card.appendChild(pill);
      card.appendChild(hobby);
      card.appendChild(name);

      card.addEventListener("click", () => {
        item.revealed = !item.revealed;
        card.dataset.revealed = String(item.revealed);
        card.dataset.solved = String(item.revealed);
        pill.className = "pill" + (item.revealed ? " ans" : "");
        pill.textContent = item.revealed ? "정답" : "퀴즈";
        card.setAttribute("aria-label", item.revealed ? `${item.answer} (정답 공개됨)` : `${item.question} (클릭하여 정답 확인)`);
        updateCount();
        if (hideSolved && item.revealed) {
          setTimeout(() => { card.remove(); updateCount(); }, 150);
        }
      });

      card.addEventListener("keydown", (e) => {
        if (e.code === "Space") { e.preventDefault(); card.click(); }
      });

      $grid.appendChild(card);
    });

    if (visibleCount === 0) {
      const empty = document.createElement("div");
      empty.className = "muted";
      empty.textContent = "표시할 카드가 없습니다. (상단 '항목 추가'에서 만들어보세요)";
      $grid.appendChild(empty);
    }
    updateCount();
  };

  if ($shuffle) $shuffle.addEventListener("click", () => { shuffleArray(items); render(); });
  if ($resetFront) $resetFront.addEventListener("click", () => { items.forEach(i => i.revealed = false); if ($hideSolved) $hideSolved.checked = false; render(); });
  if ($hideSolved) $hideSolved.addEventListener("change", () => render());

  render();
})();