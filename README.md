# Quiz App — Public Mode (No PIN)

누구나 `/manage`에서 퀴즈와 정답을 자유롭게 추가/삭제할 수 있는 공개 모드.
베이지+블랙 미니멀 디자인, 카드 클릭 시 **퀴즈 → 정답** 전환.

## 로컬 실행
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

- `/` : 퀴즈 페이지
- `/manage` : 항목 관리(로그인 없음)
- `/api/items` : JSON API

## Vercel 배포
- `vercel.json` 포함 (Python 런타임 자동 인식)
- 환경변수(선택): `DATA_FILE=/tmp/data.json` — Vercel에서 쓰기 가능한 경로

> ⚠️ /tmp 저장소는 영속적이지 않을 수 있습니다. 장기 저장은 S3/Supabase 등 외부 저장 권장.
