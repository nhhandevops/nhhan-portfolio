# HANDOFF — Portfolio

Trạng thái và các quyết định kiến trúc. **Đây là nguồn sự thật, không phải lịch sử chat.**

Cập nhật lần cuối: 2026-08-11

---

## 0. Bắt đầu trên một máy mới

### 0.1 Đọc theo thứ tự này

1. File này — trạng thái, quyết định kiến trúc, việc còn lại
2. `docs/warning_bug_and_solutions.md` — các lỗi đã gặp thật. **Đọc trước khi debug bất
   cứ thứ gì**: nhiều lỗi trông như lỗi code nhưng thực ra là môi trường.
3. `docs/editing-content.md` — cách sửa nội dung mà không cần biết React
4. `CLAUDE.md` — quy tắc dự án + quy ước commit/version
5. `AGENTS.md` — nhắc rằng Next 16 khác nhiều so với kiến thức có sẵn, phải đọc docs
   trong `node_modules/next/dist/docs/` trước khi viết code

### 0.2 Yêu cầu môi trường

| | |
| --- | --- |
| Node.js | **≥ 20.9** (Next 16 bắt buộc; Node 18 không chạy) |
| TypeScript | ≥ 5.1 |
| git | bất kỳ |

### 0.3 Cài đặt

```powershell
git clone https://github.com/nhhandevops/nhhan-portfolio.git
cd nhhan-portfolio
npm install
```

### 0.4 ⚠️ Tạo `.env.local` — bước dễ quên nhất

`.env.local` **KHÔNG nằm trong repo** (cố ý — nó chứa token). Máy mới clone về sẽ không
có file này, và hậu quả là **section GitHub tự ẩn mà không báo lỗi gì**.

```powershell
Copy-Item .env.example .env.local
```

Rồi điền 3 giá trị:

| Biến | Giá trị | Lấy ở đâu |
| --- | --- | --- |
| `GITHUB_USERNAME` | `nhhandevops` | Điền thẳng |
| `GITHUB_TOKEN` | token GitHub | Lấy lại từ Vercel → Project → Settings → Environment Variables, hoặc tạo token mới (xem dưới) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Chỉ cho máy local. Trên Vercel là URL production |

**Tạo token mới:** https://github.com/settings/personal-access-tokens/new → Repository
access = **Public Repositories (read-only)**, không cần thêm permission nào. GraphQL API
của GitHub **luôn** đòi token, kể cả khi chỉ đọc dữ liệu công khai.

Tạo token mới thì nhớ cập nhật cả trên Vercel, và **redeploy có bỏ tick "Use existing
Build Cache"** — xem `GH-002`.

### 0.5 Chạy

```powershell
npm run dev      # http://localhost:3000, tự chuyển sang /en
npm run check    # type-check + lint, ~10 giây. Chạy sau mỗi lần sửa
npm run build    # build production đầy đủ
npm start        # chạy thử bản production sau khi build
```

**Windows, nếu `npm` báo "running scripts is disabled":** dùng `npm.cmd` thay cho `npm`,
hoặc sửa dứt điểm — xem `ENV-001`.

**Máy hết RAM khi build:** xem `BUILD-001`. Chạy `npx tsc --noEmit` trước để loại trừ
lỗi type. Đừng đụng `NODE_OPTIONS`, không liên quan.

**Đừng dùng `Set-Content` của PowerShell 5.1 để sửa file tiếng Việt** — xem `ENC-001`.

### 0.6 Vòng làm việc

```powershell
# sửa nội dung trong src/data/ ...
npm run check                    # bắt buộc, phải sạch
git add -A
git commit -m "<mô tả đợt việc>"
git push
```

**Push lên `main` là Vercel tự deploy**, không cần bấm gì trên Vercel. Mốc quan trọng thì
tag thêm — xem quy ước commit/version trong `CLAUDE.md`.

Chỉ sửa nội dung mà không có máy: vào repo trên GitHub bấm phím `.` để mở editor trong
trình duyệt, sửa và commit thẳng ở đó.

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

### 1.2 Lịch sử phiên bản

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

## 3. Sửa nội dung ở đâu

| Muốn sửa | Sửa file |
| --- | --- |
| Tên, chức danh, giới thiệu, email, SĐT, link, đường dẫn CV | `src/data/profile.ts` |
| Khối "Trọng tâm" ở đầu trang | `focusAreas` trong `src/data/profile.ts` |
| Kinh nghiệm làm việc | `src/data/experience.ts` |
| Học vấn **và chứng chỉ** (chung một file) | `src/data/education.ts` |
| Kỹ năng | `src/data/skills.ts` |
| **Dự án tự chọn (kể cả private/công ty)** | `src/data/projects.ts` |
| Username GitHub, URL site, số repo hiển thị | `src/data/site.ts` |
| Chữ của khung giao diện (nav, nút, tiêu đề section) | `src/i18n/dictionaries.ts` |
| Màu sắc, dark/light | `src/app/globals.css` |

Mọi field văn xuôi đều cần cả `en` và `vi`. Thiếu một bên là TypeScript báo lỗi lúc build.

**Thêm project mới:** thêm một object vào mảng trong `src/data/projects.ts` rồi push.
Không cần sửa component. Repo GitHub thì tự động, không cần đụng tay.

---

## 4. Việc còn lại

Xếp theo mức ảnh hưởng. **Không cái nào chặn trang chạy** — production đang sống bình thường.

### 4.1 ⭐ Rà soát câu chữ cho khớp kinh nghiệm thật

Nội dung sinh từ CV, nhưng **những chỗ sau là suy diễn, không có trong CV** — chủ trang
cần xác nhận hoặc sửa:

| Chỗ | Đang ghi | Vấn đề |
| --- | --- | --- |
| `role` của cả 4 dự án | "Design, deployment, and operations" | **Rủi ro cao.** CV không nói vai trò từng dự án. Nếu làm cùng team chứ không chủ trì thì đang nói quá |
| `period` của cả 4 dự án | "2024 — nay" | CV không ghi mốc riêng từng dự án |
| `status` | 3 × `maintained`, 1 × `active` | Suy ra từ ngữ cảnh |
| Câu mô tả đầu mỗi project card | Tự viết hoàn toàn | Xem 4 cụm bên dưới |
| `profile.summary` | "Currently going deeper on Kubernetes" | CV ghi "Strong interest in Kubernetes" — bản trên trang mạnh hơn |

Bốn cụm thêm vào mà CV không hề có, cần kiểm chứng: *"so the Infrastructure team stops
creating accounts by hand"* · *"managed through a UI instead of hand-edited configs"* ·
*"without waiting on engineering"* · *"hardening AWS accounts… toward CKA"*.

**Toàn bộ bản tiếng Việt là bản dịch**, xưng hô "mình". Muốn trang trọng hơn thì đổi
thành "tôi" ở `profile.summary` và `contact.subtitle` trong `src/i18n/dictionaries.ts`.

### 4.2 Lọc bớt nội dung thừa

- **Dự án #4 "Cloud Security, Cost, and Kubernetes Labs"** là mắt xích yếu nhất: ba dự án
  kia là hệ thống chạy thật, cái này là mảng nghiên cứu, chữ "Labs" đứng cạnh chúng dễ bị
  đọc thành "chưa làm thật". Cân nhắc đổi tên theo kết quả (ví dụ *AWS Account Hardening
  & Cost Governance*) hoặc cắt hẳn, chuyển ý vào phần Kinh nghiệm.
- **Nhóm "Networking & Security"** có 11 mục; `Security Groups` và `NACLs` là kiến thức
  AWS cơ bản, đứng cạnh `GuardDuty`/`Detective` làm loãng cả nhóm.
- **Nhóm "Data & Messaging"** có 9 mục. Giữ cái nào vận hành thật, bỏ cái nào chỉ chạm
  qua — liệt kê ra là phỏng vấn sẽ hỏi vào đó.
- Phần Dự án đang có ~18 gạch đầu dòng. Rút xuống 3 dòng mỗi dự án thì đọc thoáng hơn.

### 4.3 Pin repo trên GitHub profile

Chưa pin repo nào nên section GitHub rơi về "6 repo push gần nhất", trong đó có
`test-jenkins`, `test-pdf`, `multibranch-pipeline`. Vào https://github.com/nhhandevops
pin 4–6 repo đáng khoe — section sẽ ưu tiên chúng và gắn nhãn "Pinned".

**Không cần sửa code, không cần deploy lại.** Trang tự cập nhật trong vòng 1 giờ nhờ ISR.

### 4.4 Ảnh

- Ảnh đại diện: đặt vào `public/avatar.jpg`, sửa `profile.avatar` thành `"/avatar.jpg"`.
- Ảnh minh hoạ dự án: xem `docs/project-images.md`. **Che dữ liệu nhạy cảm trước khi đưa
  lên**, hoặc dùng sơ đồ kiến trúc tự vẽ thay cho ảnh chụp hệ thống nội bộ.

### 4.5 Khi trang đã ưng hoàn toàn

Tag `v1.0` theo quy ước trong `CLAUDE.md`, và thêm dòng vào bảng Lịch sử phiên bản.

---

## 5. Nguyên tắc vận hành — đừng phá

- **Không gắn thẻ thanh toán vào Vercel.** Không có thẻ thì không thể bị trừ tiền; gói
  Hobby vượt quota sẽ tạm dừng tới đầu tháng sau chứ không xuất hoá đơn.
- **Không bật Speed Insights / Observability Plus** trên Vercel — đó là add-on tính phí.
- **Repo phải nằm dưới tài khoản cá nhân.** Vercel Hobby không kết nối được với repo
  thuộc GitHub Organization.
- **Giữ trang tĩnh 100%.** Đừng thêm middleware/proxy. Sau mỗi lần build phải kiểm tra
  bảng Route: `/en`, `/vi`, `/en/opengraph-image`, `/vi/opengraph-image` đều phải là `●`
  (SSG). Thấy `ƒ` (Dynamic) là có gì đó kéo route thành động — phải tìm ra nguyên nhân.
- **Đổi biến môi trường trên Vercel → phải redeploy có bỏ tick "Use existing Build
  Cache".** Xem `GH-002`. Bấm Redeploy thường là dính lại giá trị cũ.
- **`.env.local` không bao giờ được commit.** Đã có trong `.gitignore`.
