# HANDOFF — Portfolio

Trạng thái và các quyết định kiến trúc. **Đây là nguồn sự thật, không phải lịch sử chat.**

Cập nhật lần cuối: 2026-08-11

---

## 1. Trạng thái hiện tại

**🌐 Production: https://nhhan-portfolio.vercel.app**
**📦 Repo: https://github.com/nhhandevops/nhhan-portfolio** (public)

Dùng domain `nhhan-portfolio.vercel.app` khi dán link đi đâu. URL dài dạng
`nhhan-portfolio-<hash>-nhhan-personal.vercel.app` là của riêng một lần deploy,
đổi sau mỗi lần push — đừng đưa vào CV hay LinkedIn.

Trang đã lên sóng, **build sạch**, và **đã đổ nội dung thật từ CV**.

| Hạng mục | Trạng thái |
| --- | --- |
| Next.js 16.3 + TypeScript + Tailwind v4 | ✅ |
| Song ngữ `/en` + `/vi`, có nút chuyển | ✅ |
| Dark/light mode, không nháy khi tải | ✅ |
| Section: Hero, Experience, Education, Skills, Projects, GitHub, Contact | ✅ |
| Tích hợp GitHub (pinned + repo mới), cache 1h | ✅ đã chạy thật với token |
| SEO: metadata, canonical, hreflang, sitemap, robots | ✅ |
| OG image tự sinh, tĩnh, hiển thị đúng dấu tiếng Việt | ✅ |
| Nội dung thật từ CV (bản 2026-08-11) | ✅ |
| Deploy Vercel | ✅ đã verify trên production |

### 1.1 Quyết định khi trích CV — đọc trước khi sửa nội dung

- **Số điện thoại `0907 683 363` được công khai ở mục Liên hệ** — chủ trang đã cân nhắc
  và xác nhận ngày 2026-08-11 sau khi được cảnh báo về rủi ro bot scrape. Link dùng
  dạng E.164 (`tel:+84907683363`) để recruiter nước ngoài gọi được, hiển thị dạng nội địa.
  Muốn gỡ về sau: đặt `profile.phone = null`.
- **Nút "Tải CV" đã bật**, trỏ tới `public/cv/cv-en.pdf` (88 KB). Chỉ có bản tiếng Anh
  nên cả `/en` lẫn `/vi` cùng dùng file này. File có chứa số điện thoại, đã được đồng ý.
- **KHÔNG kéo repo private vào section GitHub.** Lý do: link `github.com/<user>/<repo>`
  sẽ trả 404 với mọi người xem, và tên/mô tả repo nội bộ có thể lộ thông tin công ty.
  Việc private được kể ở `src/data/projects.ts` — đúng chỗ, không cần repo.
  Filter `privacy: PUBLIC` trong `src/lib/github.ts` là cố ý, đừng bỏ.
- **Học vấn** bổ sung ngoài CV (chủ trang cung cấp 2026-08-11): Bachelor of Information
  Technology, 2019–2023.
- **IELTS 6.0** chuyển từ mục "Core Skills" sang `certifications` — đúng chỗ hơn và
  tránh trùng lặp (CV gốc ghi ở cả hai chỗ).
- **"Google Cloud" gộp vào "GCP"** trong skills, vì là một thứ.
- **4 hệ thống nội bộ ở Antsomi** (Auth, VPN, Workflow Platform, Cloud Security Labs)
  nằm ở `src/data/projects.ts` chứ không phải trong phần kinh nghiệm — chúng không có
  public repo nên sẽ không bao giờ xuất hiện ở section GitHub.
- **Chức danh giữ nguyên tiếng Anh ở cả hai bản ngôn ngữ.** Recruiter tìm theo
  "Site Reliability Engineer", không tìm theo bản dịch tiếng Việt.

---

## 1.2 Lịch sử phiên bản

Quy ước: commit theo từng đợt việc lớn, mỗi mốc quan trọng gắn một annotated tag
`v0.x`. Khi trang hoàn thiện thì lên `v1.0`. Chi tiết quy ước ở `CLAUDE.md`.

**Thêm một dòng vào bảng này mỗi lần tạo tag mới.**

| Version | Ngày | Nội dung |
| --- | --- | --- |
| `v0.1` | 2026-08-11 | Khung Next.js 16 + TS + Tailwind v4. Song ngữ EN/VI. Nội dung thật từ CV. Tích hợp GitHub (pinned + repo mới, cache 1h). SEO + hreflang + sitemap + OG image tĩnh. Dark/light mode. Nút tải CV. Bộ tài liệu đầy đủ. |
| `v0.2` | 2026-08-11 | **Lên production.** Repo public `nhhandevops/nhhan-portfolio`, deploy Vercel Hobby tại `nhhan-portfolio.vercel.app`. Đã verify thật: `/en` `/vi` 200, `/` → 307, canonical + og:url + sitemap + robots đều trỏ domain thật, section GitHub trả 6 repo, tải CV và OG image OK, `x-vercel-cache: HIT` (phục vụ từ CDN, không tốn invocation). |

---

## 2. Quyết định kiến trúc và lý do

### 2.1 Không dùng `next-intl` — tự viết dictionary

Ban đầu định dùng `next-intl` (phiên bản 4.13.6 có hỗ trợ Next 16). Đã bỏ vì:

- Docs chính thức của Next 16 (`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`)
  khuyến nghị đúng pattern `app/[lang]` + dictionary tự viết cho trường hợp đơn giản.
- Phần lớn nội dung nằm ở `src/data/*.ts` dưới dạng `{ en, vi }`, không phải file message.
  Chỉ khoảng 30 chuỗi khung giao diện cần dịch — không đáng thêm dependency.
- `next-intl` cần middleware để nhận diện locale. Next 16 đã đổi `middleware` → `proxy`,
  và middleware chạy trên **mọi** request ⇒ tốn function invocation trên Vercel.

Đổi lại, `/` được redirect về `/en` bằng `redirects()` trong `next.config.ts` — xử lý ở tầng
config, trang vẫn tĩnh 100%.

**Hệ quả:** không tự nhận diện ngôn ngữ trình duyệt. Ai vào cũng thấy tiếng Anh trước,
có nút EN/VI ở góc phải để đổi. Đây là lựa chọn có chủ ý: hành vi đoán trước được,
và không tốn invocation. Muốn đổi mặc định sang tiếng Việt: sửa `defaultLocale`
trong `src/i18n/config.ts`.

### 2.2 Tại sao trang phải là ISR chứ không phải tĩnh hoàn toàn

`export const revalidate = 3600` ở `src/app/[lang]/page.tsx` là thứ khiến dữ liệu GitHub
tự làm mới. Nếu bỏ dòng này, trang chỉ được render một lần lúc build và **sẽ đứng yên
vĩnh viễn** dù cache API có hết hạn.

Cơ chế: người xem luôn nhận HTML tĩnh từ CDN (không tốn function). Sau mỗi giờ, request
đầu tiên kích hoạt một lần sinh lại ở nền. Chi phí thực tế gần như bằng 0.

Xác minh sau mỗi lần build:

```powershell
$m = Get-Content .next\prerender-manifest.json -Raw | ConvertFrom-Json
$m.routes.'/en'.initialRevalidateSeconds   # phải ra 3600
```

### 2.3 GitHub: GraphQL + `unstable_cache`

Xem chi tiết ở `docs/warning_bug_and_solutions.md` mục **GH-001**. Tóm tắt:
pinned repos chỉ có ở GraphQL, GraphQL bắt buộc token, và Next không cache fetch POST
nên phải tự bọc `unstable_cache`.

`getGitHubRepos()` **không bao giờ throw**. Mọi lỗi trả về `{ ok: false, reason }` để
section hiển thị nhẹ nhàng hoặc tự ẩn, thay vì làm sập cả trang.

### 2.4 Không có menu hamburger trên mobile

Dưới breakpoint `md`, thanh nav ẩn hoàn toàn. Trang chỉ một cột và khá ngắn nên cuộn tay
nhanh hơn mở menu — đổi lại không phải ship phần JS của hamburger. Nút đổi ngôn ngữ và
đổi theme vẫn luôn hiện.

---

## 3. Chạy dự án

```powershell
npm run dev      # http://localhost:3000 -> tự chuyển sang /en
npm run build    # build production, có type-check
npm start        # chạy thử bản production
npx tsc --noEmit # chỉ type-check (nhẹ hơn build nhiều — dùng khi máy thiếu RAM)
```

Biến môi trường: copy `.env.example` thành `.env.local` rồi điền. **`.env.local` đã nằm
trong `.gitignore` — không bao giờ commit token.**

---

## 4. Sửa nội dung ở đâu

| Muốn sửa | Sửa file |
| --- | --- |
| Tên, chức danh, giới thiệu, email, link, đường dẫn CV | `src/data/profile.ts` |
| Kinh nghiệm làm việc | `src/data/experience.ts` |
| Học vấn | `src/data/education.ts` |
| Kỹ năng | `src/data/skills.ts` |
| **Dự án tự chọn (kể cả private/công ty)** | `src/data/projects.ts` |
| Username GitHub, URL site, số repo hiển thị | `src/data/site.ts` |
| Chữ của khung giao diện (nav, nút, tiêu đề section) | `src/i18n/dictionaries.ts` |
| Màu sắc, dark/light | `src/app/globals.css` |

Mọi field văn xuôi đều cần cả `en` và `vi`. Thiếu một bên là TypeScript báo lỗi lúc build.

**Thêm project mới:** thêm một object vào mảng trong `src/data/projects.ts` rồi push.
Không cần sửa component. Repo GitHub thì tự động, không cần đụng tay.

---

## 5. Việc còn lại

1. **Pin repo trên GitHub profile.** Hiện chưa pin repo nào nên section đang rơi về
   6 repo push gần nhất — trong đó có cả repo tập tành (`test-jenkins`, `test-pdf`).
   Vào https://github.com/nhhandevops pin những repo muốn khoe; section sẽ ưu tiên
   chúng và gắn nhãn "Pinned". Không cần sửa code.
2. Đặt ảnh đại diện vào `public/avatar.jpg`, sửa `profile.avatar` thành `"/avatar.jpg"`.
3. Thêm ảnh minh hoạ cho 4 dự án Antsomi — xem `docs/project-images.md`.
   **Che dữ liệu nhạy cảm trước khi đưa lên.**
4. Push lên GitHub. **Repo phải nằm dưới tài khoản cá nhân** — gói Vercel Hobby không
   kết nối được với repo thuộc GitHub Organization.
5. Deploy Vercel, đặt các biến môi trường `GITHUB_USERNAME`, `GITHUB_TOKEN`,
   `NEXT_PUBLIC_SITE_URL`. Sau khi đổi env phải redeploy **bỏ tick "Use existing
   Build Cache"** — xem `GH-002` trong `docs/warning_bug_and_solutions.md`.
6. **Không gắn thẻ thanh toán vào Vercel** — không có thẻ thì không thể bị trừ tiền.
   Gói Hobby vượt quota sẽ tạm dừng chứ không xuất hoá đơn.
