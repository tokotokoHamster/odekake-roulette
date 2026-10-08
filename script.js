// 好きな地名や行動は、ここの "..." を増やすだけで追加できます。
const places = [
  "高円寺","吉祥寺","下北沢","中野","阿佐ヶ谷","荻窪","西荻窪","三鷹","武蔵境","国分寺",
  "立川","国立","調布","府中","深大寺","三軒茶屋","駒沢大学","自由が丘","学芸大学","都立大学",
  "代々木上原","代々木公園","神保町","浅草","上野","谷中","日暮里","蔵前","浅草橋","清澄白河",
  "門前仲町","月島","築地","日本橋","人形町","赤羽","王子","十条","神楽坂","飯田橋",
  "四ツ谷","市ヶ谷","原宿","表参道","青山一丁目","恵比寿","中目黒","目黒","五反田","大崎",
  "池袋","目白","新宿","新大久保","渋谷","代官山","押上","錦糸町","亀戸","柴又",
  "北千住","南千住","町屋","西日暮里","大塚","巣鴨","駒込","田端","御茶ノ水","秋葉原",
  "浜松町","品川","大井町","大森","蒲田","二子玉川","等々力","下高井戸","豪徳寺","経堂",
  "登戸","向ヶ丘遊園","横浜","桜木町","元町・中華街","鎌倉","江の島","川崎","浦和","大宮"
];
const actions = [
  "町中華を食べる", "カレーを食べる", "その街でいちばんおいしそうなパンを1個買う",
  "500円以内で食べたことのないものを買う", "おいしい餃子を探す", "和菓子を買う",
  "1000円でいちばんいい買い物をする", "古着屋をのぞく", "古本屋をのぞく",
  "レコードを探す", "ガチャガチャを回す", "その街で一生通いたい店を決める",
  "自分へのおみやげを買う", "今日の短歌を一首つくる", "写真を10枚撮る",
  "今日いちばん気に入った景色を1枚撮る", "その街を舞台にした架空の映画のタイトルを考える", "友達に送りたい写真を1枚撮る",
  "今日の思い出をレシート1枚で残す", "街で見つけた気になる言葉を3つメモする", "カフェで日記を書く",
  "自分が住むならどの家がいいか決める", "その街に引っ越してきた自分の休日を妄想する", "その街で架空のデートプランを考える",
  "路地裏を探検する", "その街でいちばん古そうな店を見つける", "かわいい看板を探す",
  "銭湯に行く", "神社に寄る", "商店街の端まで歩く"
];

const placeElement = document.getElementById('place');
const actionElement = document.getElementById('action');
const resultPlace = document.getElementById('resultPlace');
const resultAction = document.getElementById('resultAction');
const result = document.getElementById('result');
const button = document.getElementById('spinButton');
let running = false;
const pick = (items) => items[Math.floor(Math.random() * items.length)];

button.addEventListener('click', () => {
  if (running) return;
  running = true;
  button.disabled = true;
  button.textContent = '☆ NOW LOADING... ☆';
  result.hidden = true;
  document.querySelectorAll('.reel').forEach(el => el.classList.add('spinning'));
  let count = 0;
  const spin = setInterval(() => {
    placeElement.textContent = pick(places);
    actionElement.textContent = pick(actions);
    count++;
    if (count < 27) return;
    clearInterval(spin);
    const place = pick(places);
    const action = pick(actions);
    placeElement.textContent = place;
    actionElement.textContent = action;
    resultPlace.textContent = place;
    resultAction.textContent = action;
    document.querySelectorAll('.reel').forEach(el => el.classList.remove('spinning'));
    result.hidden = false;
    button.disabled = false;
    button.textContent = 'READY GO(^.^)/~~~';
    running = false;
    updateShareUrl(place, action);
    result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  }, 70);
});

document.getElementById('topLink').addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({top: 0, behavior: 'smooth'});
});


// 公開サイトでは結果をURLにも保存して、受け取った友達が同じ結果を見られるようにする。
function makeResultUrl(place, action) {
  if (!/^https?:$/.test(window.location.protocol)) return '';
  const url = new URL(window.location.href);
  url.searchParams.set('place', place);
  url.searchParams.set('action', action);
  url.hash = 'result';
  return url.toString();
}
function updateShareUrl(place, action) {
  const url = makeResultUrl(place, action);
  if (url && window.history.replaceState) {
    try { window.history.replaceState(null, '', url); } catch (_) { /* ファイル表示時などは変更しない */ }
  }
}
function getSharePayload() {
  const place = resultPlace.textContent;
  const action = resultAction.textContent;
  const url = makeResultUrl(place, action);
  const message = `🐬 おでかけルーレットの結果 ★

📍 ${place} で
✨ ${action}

☆ READY GO(^.^)/~~~`;
  return { title: '★ おでかけルーレット ★', text: message, url };
}
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; } catch (_) {}
  }
  // file:// でのローカル確認時や一部のブラウザ用
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch (_) {}
  input.remove();
  return copied;
}
const shareStatus = document.getElementById('shareStatus');
document.getElementById('copyButton').addEventListener('click', async () => {
  const {text, url} = getSharePayload();
  const ok = await copyText(text + (url ? '\n\n' + url : ''));
  shareStatus.textContent = ok ? '★ コピーしたヨ！LINEなどに貼り付けてネ ★' : 'コピーできませんでした。ブラウザの共有機能をお試しください。';
});
document.getElementById('shareButton').addEventListener('click', async () => {
  const {title, text, url} = getSharePayload();
  if (navigator.share) {
    try {
      await navigator.share(url ? {title, text, url} : {title, text});
      shareStatus.textContent = '★ シェア画面を開いたヨ ★';
      return;
    } catch (error) {
      if (error && error.name === 'AbortError') return;
    }
  }
  const ok = await copyText(text + (url ? '\n\n' + url : ''));
  shareStatus.textContent = ok ? '★ 文章をコピーしたヨ！好きなアプリに貼り付けてネ ★' : 'このブラウザでは共有・コピーができませんでした。';
});

// 共有URLから開いた場合に、送った人と同じ結果を表示する。
const sharedParams = new URLSearchParams(window.location.search);
const sharedPlace = sharedParams.get('place');
const sharedAction = sharedParams.get('action');
if (places.includes(sharedPlace) && typeof sharedAction === 'string' && sharedAction.length > 0 && sharedAction.length <= 120) {
  placeElement.textContent = sharedPlace;
  actionElement.textContent = sharedAction;
  resultPlace.textContent = sharedPlace;
  resultAction.textContent = sharedAction;
  result.hidden = false;
}


// 結果URLと区別して、サイトのトップページだけを共有する。
function makeSiteUrl() {
  if (!/^https?:$/.test(window.location.protocol)) return '';
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  return url.toString();
}

document.getElementById('siteShareButton').addEventListener('click', async () => {
  const status = document.getElementById('siteShareStatus');
  const url = makeSiteUrl();
  if (!url) {
    status.textContent = '☆ サイトを公開するとURLを共有できるヨ！ ☆';
    return;
  }
  if (navigator.share) {
    try {
      await navigator.share({ title: '🐬 おでかけルーレット', text: '☆ どこでなにする？ 一緒に回してみよう！ ☆', url });
      status.textContent = '☆ 共有メニューを開いたヨ！ ☆';
      return;
    } catch (error) {
      if (error && error.name === 'AbortError') return;
    }
  }
  const ok = await copyText(url);
  status.textContent = ok ? '☆ URLをコピーしたヨ！LINEに貼り付けてネ ☆' : 'コピーできない場合はブラウザのアドレス欄からURLをコピーしてネ';
});
