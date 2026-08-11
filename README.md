# Portfolio

Trang portfolio cá nhân song ngữ (Việt / Anh), tự kéo repository từ GitHub.

**Next.js 16 · TypeScript · Tailwind CSS v4 · deploy Vercel (gói Hobby, $0)**

## Chạy dự án

```powershell
npm install
Copy-Item .env.example .env.local   # rồi điền giá trị
npm run dev                          # http://localhost:3000
```

| Lệnh | Việc |
| --- | --- |
| `npm run dev` | Server phát triển |
| `npm run build` | Build production (có type-check) |
| `npm start` | Chạy thử bản production |
| `npx tsc --noEmit` | Chỉ type-check — nhẹ hơn build nhiều |
| `npm run lint` | ESLint |

## Cấu trúc

```
src/
  app/[lang]/          layout, page, opengraph-image  (root layout nằm ở đây)
  app/                 globals.css, robots.ts, sitemap.ts
  components/          các section giao diện
  data/                ← NỘI DUNG NẰM Ở ĐÂY: profile, experience, education,
                         skills, projects, site
  i18n/                config (danh sách locale) + dictionaries (chữ khung giao diện)
  lib/                 github.ts (GraphQL + cache), format.ts
docs/                  warning_bug_and_solutions.md
HANDOFF.md             quyết định kiến trúc + việc còn lại
```

Sửa nội dung: chỉ đụng vào `src/data/`. Mọi field văn xuôi cần cả `en` lẫn `vi` —
thiếu một bên là TypeScript báo lỗi lúc build.

## Biến môi trường

Xem `.env.example`. `GITHUB_TOKEN` là bắt buộc để section GitHub hoạt động
(GraphQL API của GitHub luôn yêu cầu token, kể cả với dữ liệu công khai).
Không có token thì section tự ẩn, trang vẫn chạy bình thường.

## Tài liệu

- **[docs/editing-content.md](docs/editing-content.md) — sổ tay tự sửa nội dung. Đọc cái này trước.**
- [docs/project-images.md](docs/project-images.md) — thêm ảnh minh hoạ cho dự án
- [HANDOFF.md](HANDOFF.md) — trạng thái, quyết định kiến trúc, việc còn lại
- [docs/warning_bug_and_solutions.md](docs/warning_bug_and_solutions.md) — lỗi đã gặp và cách sửa
