# HANDOFF — Portfolio

Trạng thái và các quyết định kiến trúc. **Đây là nguồn sự thật, không phải lịch sử chat.**

Cập nhật lần cuối: **2026-08-12** · đã xác minh trên production ở tag `v0.5`

**Đang ở đâu:** trang chạy production ổn định, nội dung đã rà soát và chủ trang xác nhận
xong. Còn **3 việc mở, không cái nào chặn**: ghim repo trên GitHub (mục 4.3), ảnh minh hoạ
dự án (4.4 — đã hoãn có chủ ý), và nội dung CV PDF còn lệch với trang (4.5 — **việc còn
lại duy nhất cần đụng vào code/nội dung**).

Bắt đầu phiên mới thì đọc mục **1.3** trước để biết cái gì đã được đo thật và đo lúc nào.

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
npx next typegen     # ⚠️ đừng bỏ, xem ngay dưới
```

**`npx next typegen` là bắt buộc trên máy mới.** `PageProps` và `LayoutProps` là helper
toàn cục do Next sinh ra vào `.next/types/`, mà `.next` nằm trong `.gitignore` nên clone
về là không có. Bỏ qua bước này thì `npm run check` hỏng ngay với
`Cannot find name 'PageProps'` dù chưa sửa dòng code nào — xem `SETUP-001`.

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
| Nội dung thật từ CV, đã rà soát và chủ trang xác nhận | ✅ |
| Ảnh đại diện, favicon | ✅ |
| Chặn render động cho path lạ (`dynamicParams = false`) | ✅ |
| a11y: skip link, `color-scheme`, `alt=""` | ✅ |
| Deploy Vercel | ✅ đã verify trên production |
| Ảnh minh hoạ dự án | ⏸️ chủ trang hoãn, sẽ bổ sung sau |
| Ghim repo trên GitHub profile | ⏳ chưa ghim cái nào |
| Nội dung CV PDF khớp với trang | ⏳ còn lệch, xem mục 4.5 |

### 1.1 Quyết định khi trích CV — đọc trước khi sửa nội dung

- **Số điện thoại `0907 683 363` được công khai ở mục Liên hệ** — chủ trang đã cân nhắc
  và xác nhận ngày 2026-08-11 sau khi được cảnh báo về rủi ro bot scrape. Link dùng
  dạng E.164 (`tel:+84907683363`) để recruiter nước ngoài gọi được, hiển thị dạng nội địa.
  Muốn gỡ về sau: đặt `profile.phone = null`.
- **Nút "Tải CV" đã bật**, trỏ tới `public/cv/cv-en.pdf` (58 KB). Chỉ có bản tiếng Anh
  nên cả `/en` lẫn `/vi` cùng dùng file này.

  **⚠️ Bản CV thay ngày 2026-08-12 CÓ chứa số điện thoại và email** ngay dòng liên hệ đầu
  trang — bản trước đó thì không. Đã kiểm bằng cách trích text từ content stream. Chủ
  trang đã đồng ý công khai cả hai (xem gạch đầu dòng phía trên) nên đây là mở rộng phạm
  vi có chủ ý. **Hệ quả cần nhớ:** muốn gỡ số điện thoại thì `profile.phone = null` chỉ
  xử lý được phần HTML, file PDF vẫn còn — phải xuất lại CV mới sạch hẳn.

  URL giữ nguyên `/cv/cv-en.pdf` cho link cũ khỏi gãy; thẻ `<a download="...">` trong
  `hero.tsx` đặt tên lúc tải xuống thành `Nguyen_Huu_Hoang_An_CV.pdf`. Đổi file thì giữ
  nguyên tên đường dẫn, đừng đổi thành tên file mới.
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

**Thêm một dòng vào bảng này mỗi lần tạo tag mới. Giữ thứ tự tăng dần** — bảng lộn xộn
thì đọc lịch sử không ra được trình tự.

| Version | Ngày | Nội dung |
| --- | --- | --- |
| `v0.1` | 2026-08-11 | Khung Next.js 16 + TS + Tailwind v4. Song ngữ EN/VI. Nội dung thật từ CV. Tích hợp GitHub (pinned + repo mới, cache 1h). SEO + hreflang + sitemap + OG image tĩnh. Dark/light mode. Nút tải CV. Bộ tài liệu đầy đủ. |
| `v0.2` | 2026-08-11 | **Lên production.** Repo public `nhhandevops/nhhan-portfolio`, deploy Vercel Hobby tại `nhhan-portfolio.vercel.app`. Đã verify thật: `/en` `/vi` 200, `/` → 307, canonical + og:url + sitemap + robots đều trỏ domain thật, section GitHub trả 6 repo, tải CV và OG image OK, `x-vercel-cache: HIT` (phục vụ từ CDN, không tốn invocation). |
| `v0.3` | 2026-08-11 | **Sẵn sàng bàn giao.** `HANDOFF.md` đủ để một máy khác clone về và làm tiếp mà không cần hỏi lại: hướng dẫn setup, cách tạo `.env.local`, vòng làm việc, danh sách việc còn lại kèm lý do, và các ràng buộc vận hành không được phá. Thêm `.gitattributes` chuẩn hoá xuống dòng. |
| `v0.4` | 2026-08-11 | **Nội dung đã rà soát.** Chủ trang xác nhận toàn bộ chỗ suy diễn từ CV là đúng thực tế (mục 4.1 đóng, không sửa gì). Lọc bớt phần thừa (mục 4.2): dự án #4 đổi tên thành *AWS Account Hardening & Cost Governance*, skills bỏ `Security Groups`/`NACLs`/`Trino`, bullet dự án 18 → 12 dòng. Thêm `SETUP-001` (máy mới phải chạy `npx next typegen`). Bổ sung dòng `v0.3` còn thiếu trong bảng này. |
| `v0.5` | 2026-08-12 | **Ảnh, bịt lỗ render động, dọn CV.** Ảnh đại diện 340×340. `dynamicParams = false` chặn mọi path lạ khỏi chạy function — trước đó `/<bất kỳ>/opengraph-image` trả 200 kèm PNG 44 KB. Thêm favicon, `x-default` hreflang, skip link, `color-scheme`, `alt=""`; bỏ prop `priority` đã deprecated. Meta description 533 → 149 ký tự. Thay CV mới và dọn metadata (`Spartan`, `Codex` đã sạch). Chặn `test-jenkins`/`test-pdf` khỏi section GitHub. Bản `vi` thêm "chạy production", bỏ "toàn bộ". |

### 1.3 Xác minh production gần nhất

**Đo thật lúc 2026-08-12 09:04** trên `https://nhhan-portfolio.vercel.app`, ở commit
`9530fa4` (tag `v0.5`). Đây là kết quả **đo được**, không phải tuyên bố từ code.

| Kiểm tra | Kết quả |
| --- | --- |
| `/en`, `/vi` | 200 |
| `/` | 307 → `/en` |
| `x-vercel-cache` | **HIT** — phục vụ từ CDN, không tốn function invocation |
| canonical | `https://nhhan-portfolio.vercel.app/en` (đúng domain) |
| `x-default` hreflang | có |
| Meta description | 149 ký tự (dưới ngưỡng Google cắt) |
| Ảnh đại diện, `color-scheme`, skip link | đều có trong HTML |
| `/icon.png` | 200 · 3 KB |
| `/xx/opengraph-image` | **404** — `dynamicParams = false` chạy đúng |
| `/admin` | 404 |
| `/wp-login.php` | 403 (Vercel firewall chặn trước, không chạm tới function) |
| Section GitHub | 6 repo, `test-jenkins`/`test-pdf` đã bị lọc |
| Ghim repo | **chưa có repo nào được ghim** — vẫn đang rơi về nhánh "push gần nhất" |

Repo đang hiện: `nhhan-portfolio`, `multilingual-studies`, `multibranch-pipeline`,
`cicd-gcp`, `azure-data-factory`, `aws-k8s`.

**Chạy lại bộ kiểm tra này** sau mỗi lần deploy lớn:

```powershell
$base = "https://nhhan-portfolio.vercel.app"
$en = Invoke-WebRequest "$base/en" -UseBasicParsing
"cache : $($en.Headers.'x-vercel-cache')"          # phai la HIT
"canon : $([regex]::Match($en.Content,'canonical" href="([^"]+)"').Groups[1].Value)"
foreach ($p in @("/xx/opengraph-image","/admin")) {  # ca hai phai 404
  try { "$p -> $((Invoke-WebRequest "$base$p" -UseBasicParsing).StatusCode) <-- SAI" }
  catch { "$p -> $($_.Exception.Response.StatusCode.value__) (dung)" }
}
```

**Cập nhật mục này mỗi lần verify lại**, kèm mốc thời gian và commit. Một bảng trạng thái
không có mốc thời gian thì sau vài tuần không ai dám tin.

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

### 4.1 ✅ Rà soát câu chữ — ĐÃ XONG (2026-08-11)

Chủ trang đã rà từng chỗ suy diễn và **xác nhận tất cả đều đúng thực tế**. Không sửa gì.
Ghi lại đây để lần sau không ai "sửa cho an toàn" những câu đã được kiểm chứng:

| Chỗ | Kết luận |
| --- | --- |
| `role` của cả 4 dự án — "Design, deployment, and operations" | ✅ Đúng, chủ trì cả ba khâu |
| `period` của cả 4 dự án — "2024 — nay" | ✅ Đúng, giữ nguyên |
| *"so the Infrastructure team stops creating accounts by hand"* | ✅ Đúng |
| *"managed through a UI instead of hand-edited configs"* | ✅ Đúng |
| *"without waiting on engineering"* | ✅ Đúng |
| *"…toward CKA"* | ✅ Đúng, đang thật sự hướng tới chứng chỉ |
| `profile.summary` — "Currently going deeper on Kubernetes" | ✅ Giữ bản mạnh hơn CV, có lab EKS/GKE thật đỡ lưng |

**Còn một mục chưa hỏi:** `status` của 4 dự án (3 × `maintained`, 1 × `active`) vẫn là suy
ra từ ngữ cảnh. Ảnh hưởng thấp — chỉ đổi một cái nhãn nhỏ trên card.

**Toàn bộ bản tiếng Việt là bản dịch**, xưng hô "mình". Muốn trang trọng hơn thì đổi
thành "tôi" ở `profile.summary` và `contact.subtitle` trong `src/i18n/dictionaries.ts`.

### 4.2 ✅ Lọc bớt nội dung thừa — ĐÃ XONG (2026-08-11)

- **Dự án #4 đổi tên** "Cloud Security, Cost, and Kubernetes Labs" → **"AWS Account
  Hardening & Cost Governance"**. Bỏ chữ "Labs" khỏi tiêu đề vì đứng cạnh 3 hệ thống
  production dễ bị đọc thành "chưa làm thật"; phần EKS/GKE vẫn giữ nguyên trong bullet
  nên không giấu gì. Cắt luôn 2 bullet lạc đề (AWS Marketplace, Google AI Studio) và bỏ
  `Google AI Studio` khỏi `stack` cho khớp tên mới.
- **"Networking & Security"** 11 → 9 mục: bỏ `Security Groups`, `NACLs`.
- **"Data & Messaging"** 9 → 8 mục: bỏ `Trino` (chỉ chạm qua, không vận hành thật).
  8 mục còn lại đều được xác nhận là vận hành thật, trả lời được khi hỏi sâu.
- **Bullet dự án 18 → 12**, mỗi dự án đúng 3 dòng theo mạch *làm gì — tích hợp gì — vận
  hành thế nào*. Các dòng bị cắt đều trùng ý với `description` của chính card đó.

### 4.3 Section GitHub — đã chặn repo test, còn lại là ghim

**Làm rõ một hiểu nhầm dễ mắc:** hiện **chưa ghim repo nào cả**. Chính vì thế section
mới rơi về nhánh dự phòng "6 repo push gần nhất", và đó là lý do `test-jenkins` với
`test-pdf` lọt vào — không phải vì chúng được ghim.

**✅ Đã xử lý bằng code (2026-08-12).** `site.githubExclude` trong `src/data/site.ts`
liệt kê repo không bao giờ được hiện, áp cho **cả** danh sách ghim lẫn danh sách push
gần nhất, so khớp không phân biệt hoa thường:

```ts
githubExclude: ["test-jenkins", "test-pdf"],
```

Thêm repo cần giấu thì thêm tên vào mảng này, không phải sửa gì khác. `multibranch-pipeline`
cố tình **chưa** đưa vào — chủ trang chỉ yêu cầu hai cái kia; thấy thừa thì tự thêm.

Đây chỉ là **bộ lọc hiển thị**. Repo vẫn công khai trên GitHub và ai gõ thẳng URL vẫn
thấy. Muốn giấu hẳn thì đổi sang private hoặc xoá bên GitHub.

**Còn lại (việc trên GitHub, không phải code):** vào https://github.com/nhhandevops ghim
4–6 repo đáng khoe. Section sẽ ưu tiên chúng và gắn nhãn "Pinned" thay vì đoán theo ngày
push. **Không cần deploy lại** — trang tự cập nhật trong vòng 1 giờ nhờ ISR.

### 4.4 Ảnh

- **Ảnh đại diện: ✅ xong (2026-08-11).** `public/avatar.jpg`, 340×340, 27.5 KB,
  `profile.avatar = "/avatar.jpg"`.

  **Ảnh đại diện bắt buộc phải vuông và cắt sát mặt.** `hero.tsx` render bằng
  `rounded-full object-cover`, tức trình duyệt cắt ô vuông ở *chính giữa* ảnh. Bản đầu
  đưa vào là ảnh chân dung dọc 772×1206 — ô giữa rơi xuống ngực, khung tròn 96px không
  thấy mặt. Build vẫn xanh nên **không có gì báo cho biết**, phải tự nhìn mới ra.

  Trước khi đưa ảnh bất kỳ vào `public/`: xoá EXIF (nhất là toạ độ GPS) và kiểm tra
  không có người lạ nhận diện được ở hậu cảnh. `public/` là URL công khai, Google index
  được, gỡ sau không thu hồi được bản đã bị lấy về.

- Ảnh minh hoạ dự án: **chưa có — chủ trang hoãn lại, sẽ bổ sung sau (xác nhận
  2026-08-12).** Không phải bỏ sót. Xem `docs/project-images.md` khi làm. **Che dữ liệu
  nhạy cảm trước khi đưa lên**, hoặc dùng sơ đồ kiến trúc tự vẽ thay cho ảnh chụp hệ
  thống nội bộ.

### 4.5 ⭐ CV PDF — đã thay bản mới, nội dung vẫn còn lệch với trang

Chủ trang đưa bản CV mới ngày **2026-08-12** (xuất từ LibreOffice 24.2, 2 trang, 58 KB),
đã cài vào `public/cv/cv-en.pdf`.

#### ✅ Metadata: sạch, không cần làm lại

| Trường | Giá trị |
| --- | --- |
| `/Title` | `Nguyen Huu Hoang An - SRE CV` |
| `/Author` | `Nguyen Huu Hoang An` (bản gốc là `Un-named` — mặc định của LibreOffice) |
| XMP, `/Producer`, `/Creator` | đã xoá hẳn |

"Spartan" (tên một công ty chủ trang từng định ứng tuyển) đã sạch ở cả bản này lẫn bản
trước. Đã đối chiếu trước/sau khi dọn metadata: text trích ra **giống hệt**, render ra
ảnh thì bố cục và font nguyên vẹn.

#### ❌ Nội dung: vẫn chưa theo kịp đợt lọc ở mục 4.2

Bản mới **có sửa** hai chỗ: bỏ "Spartan" khỏi tiêu đề, và bỏ `Codex` bị lặp hai lần ở
dòng *AI & Automation*. Nhưng bảng dưới đây vẫn còn nguyên — đã đếm trên text trích từ
chính file đang chạy:

| Trong PDF | Trên trang | Vì sao cần sửa |
| --- | --- | --- |
| `Trino` | đã bỏ | **Quan trọng nhất.** Bỏ khỏi trang vì chỉ chạm qua, không vận hành thật. PDF vẫn đang đưa recruiter đúng cái tuyên bố mà chủ trang đã quyết là không đỡ nổi khi bị hỏi sâu |
| `Security Groups`, `NACLs` | đã bỏ | Cắt cho gọn, không phải vấn đề độ tin cậy — để lại cũng được |
| `Cloud Security, Cost, and Kubernetes Labs` | đã đổi tên | Tên cũ, đúng cái chữ "Labs" đã quyết bỏ |
| Bullet AWS Marketplace, Google AI Studio | đã cắt | Lạc đề với tên dự án mới |
| `GCP` **và** `Google Cloud` cùng dòng | đã gộp | Là một thứ, xem mục 1.1 |
| `Claude` | `Claude Code` | Tên sản phẩm |

**Cách làm:** sửa file nguồn cho khớp `src/data/` rồi xuất lại đè lên `public/cv/cv-en.pdf`
(**giữ nguyên tên đường dẫn**, đừng đổi thành tên file mới — xem mục 1.1).

⚠️ **Xuất lại là metadata bẩn trở lại.** LibreOffice ghi `/Producer` và Author `Un-named`;
Word ghi `/Producer` và lấy Author từ tài khoản Office. Sau mỗi lần xuất phải dọn rồi kiểm:

```bash
grep -a -c -i "codex\|spartan\|un-named\|libreoffice\|microsoft" public/cv/cv-en.pdf   # phải ra 0
```

Dọn bằng PyMuPDF (`pip install pymupdf`), đặt `title`/`author`, gọi `del_xml_metadata()`,
lưu với `garbage=4, deflate=True, clean=True`. **Luôn đối chiếu text trước/sau** để chắc
chắn chỉ metadata thay đổi.

Lưu ý: các bản cũ **đã công bố rồi** — dọn bây giờ không thu hồi được bản người khác đã tải.

**Quy tắc rút ra:** nội dung bị cắt vì **lý do độ chính xác** (khác với cắt cho gọn hay
cho đẹp bố cục) thì phải cắt khỏi cả CV PDF, vì trang đăng lại chính file đó.

### 4.6 ✅ Việc từ đợt audit 2026-08-12 — ĐÃ XONG

Đợt audit ra 30 phát hiện, 15 sống sót sau phản biện. Toàn bộ phần sửa được bằng code đã
xong, chia hai commit: `f054a9e` (đợt đầu) và đợt 2026-08-12 dưới đây.

1. **Câu chữ tiếng Việt** — chủ trang đã quyết:
   - `profile.ts` bản `vi` giờ ghi *"các service nội bộ **chạy production**"*, khớp với
     *"internal production services"* của bản `en`. Với hồ sơ SRE, "production" là chữ
     phân biệt hệ thống chạy thật với lab. Chủ trang lưu ý: **"trước mắt nên vậy, về sau
     thấy không ổn sẽ đổi"** — nên nếu có ngày muốn nói nhẹ hơn thì đó là quyết định đã
     lường trước, không phải sửa sai.
   - `projects.ts` dự án #1 bỏ **"toàn bộ"** và trả lại vế "service": *"trên các ứng dụng
     và service nội bộ"*. Giờ khớp đúng phạm vi bản `en` (*"internal apps and services"*),
     vốn đã được xác nhận là đúng thực tế ở mục 4.1.

2. **`<meta description>`** rút từ 533 → **149 ký tự** (bản vi 494 → 136). Thêm field
   `seoDescription: Localized` vào `Profile`, dùng riêng cho metadata; `summary` dài vẫn
   để cho phần đầu trang. **Sửa `summary` thì ngó lại `seoDescription`** — hai chỗ nên
   cùng nói một thứ, không có gì tự đồng bộ giúp.

3. **Đã có skip link.** `<main id="content" tabIndex={-1}>` trong `page.tsx`, anchor
   `sr-only focus:not-sr-only` là con đầu tiên của `<header>`, chữ nằm trong
   `dictionaries.ts` (`nav.skipToContent`). Kiểm bằng cách bấm Tab ngay khi trang vừa tải.

   **Đừng bỏ `tabIndex={-1}` khỏi `<main>`.** Thẻ `<main>` vốn không nhận focus được, nên
   thiếu nó thì trên Safari bấm skip link xong trang có cuộn nhưng con trỏ bàn phím vẫn
   kẹt ở header — tab tiếp là quay lại đúng chỗ cũ, tức skip link vô dụng đúng với nhóm
   người dùng nó sinh ra để phục vụ. `-1` chỉ cho phép focus bằng script/fragment, không
   chen thêm điểm dừng vào thứ tự tab. (Sót ở lần làm đầu, bổ sung 2026-08-12.)

**Đã kiểm và KHÔNG phải vấn đề** (đừng mở lại): `next/image` phục vụ avatar qua
`/_next/image` không phá cam kết tĩnh — bị bác hai lần trong audit; độ tương phản màu ở
cả hai theme đều đạt; `og:locale:alternate` không cần; `/` trả 307 về `/en` là đúng và
không cần vào sitemap.

### 4.7 Khi trang đã ưng hoàn toàn

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
