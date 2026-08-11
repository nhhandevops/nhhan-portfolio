@AGENTS.md

# Portfolio — hướng dẫn cho agent

Trước khi làm bất cứ việc gì: đọc `HANDOFF.md` (quyết định kiến trúc, việc còn lại)
và `docs/warning_bug_and_solutions.md` (lỗi đã gặp, đừng lặp lại).

## Quy tắc riêng của dự án

- **Nội dung chỉ nằm trong `src/data/`.** Không hardcode chữ vào component.
  Chữ của khung giao diện thì vào `src/i18n/dictionaries.ts`.
- **Mọi field văn xuôi phải có cả `en` và `vi`.** Kiểu `Localized<T>` ép điều này
  lúc build — đừng lách bằng `as any`.
- **Đừng thêm middleware/proxy.** Trang cố ý giữ tĩnh 100% để không tốn function
  invocation trên gói Vercel Hobby. `/` được redirect bằng `redirects()` trong
  `next.config.ts`.
- **Đừng bỏ `export const revalidate = 3600`** ở `src/app/[lang]/page.tsx`.
  Đó là thứ duy nhất khiến dữ liệu GitHub tự làm mới.
- **Route ảnh metadata cần `generateStaticParams` riêng**, không kế thừa từ layout.
  Thiếu là nó bị render động.
- `getGitHubRepos()` không được throw. Lỗi thì trả `{ ok: false, reason }`.

## Quy ước commit và version

- **Commit theo từng đợt task/phase lớn**, không commit vụn từng file. Một commit =
  một mảng việc hoàn chỉnh và đã chạy `npm run check` sạch.
- **Mỗi mốc quan trọng thì đánh version** bằng git tag, theo dãy `v0.1`, `v0.2`, …
  `v0.N`. Tăng dần cho tới khi trang hoàn thiện thì đổi thành **`v1.0`**.
- Tag phải là **annotated tag** (`git tag -a`), không dùng lightweight tag, để còn
  ghi được mô tả mốc đó gồm những gì.
- **Mỗi lần tag phải ghi thêm một dòng vào bảng "Lịch sử phiên bản" trong
  `HANDOFF.md`.** Tag mà không ghi lại nội dung thì sau này không ai biết mốc đó có gì.

```powershell
npm run check
git add -A
git commit -m "<mô tả đợt việc>"
git tag -a v0.2 -m "<mốc này gồm gì>"
git tag -n9          # xem lại danh sách version
```

## Kiểm tra trước khi báo xong

```powershell
npx tsc --noEmit    # chạy cái này trước, nhẹ hơn build nhiều
npm run build
```

Sau khi build, kiểm tra bảng Route: `/en`, `/vi`, `/en/opengraph-image`,
`/vi/opengraph-image` đều phải là `●` (SSG). Nếu thấy `ƒ` (Dynamic) là có gì đó
đã kéo route thành động — phải tìm ra nguyên nhân, không được bỏ qua.

## Lưu ý về máy này

Máy hay hết RAM vật lý khi build (xem `BUILD-001`). Nếu `next build` chết ở bước
type-check, chạy `npx tsc --noEmit` trước để loại trừ lỗi type, rồi bảo người dùng
đóng bớt trình duyệt / máy ảo. Đừng đi chỉnh `NODE_OPTIONS` — không liên quan.
