# Warning, Bug & Solutions

Ghi lại mọi lỗi/cảnh báo gặp trong lúc làm dự án này.
Format: **triệu chứng → nguyên nhân gốc → cách xác minh → cách sửa → ngày**.

---

## BUILD-001 — `next build` chết với "Zone Allocation failed - process out of memory"

**Triệu chứng:** `npm run build` báo `✓ Compiled successfully` rồi crash ngay ở bước
`Running TypeScript ...`:

```
FATAL ERROR: Zone Allocation failed - process out of memory
Failed to type check.
```

**Nguyên nhân gốc:** KHÔNG phải lỗi code và KHÔNG phải heap cap của Node (heap cap
đo được là 4288 MB, lúc crash mới dùng ~170 MB). Máy hết RAM vật lý thật —
hệ điều hành từ chối cấp thêm bộ nhớ. "Zone Allocation" là vùng cấp phát V8 xin
trực tiếp từ OS, nên nó chết trước cả khi chạm giới hạn heap.

**Cách xác minh — 2 lệnh:**

```powershell
# 1. RAM trống. Lúc gặp lỗi: 0.6 GB trống / 15.8 GB tổng.
$os = Get-CimInstance Win32_OperatingSystem
"Free: {0:N1} GB / {1:N1} GB" -f ($os.FreePhysicalMemory/1MB), ($os.TotalVisibleMemorySize/1MB)

# 2. Ai đang giữ RAM.
Get-Process | Group-Object ProcessName | ForEach-Object {
  [PSCustomObject]@{ Name=$_.Name; GB=[math]::Round((($_.Group|Measure-Object WorkingSet64 -Sum).Sum/1GB),2) }
} | Sort-Object GB -Descending | Select-Object -First 10
```

Nếu tổng của Brave/Chrome + VS Code + VMware đã chiếm gần hết ⇒ đúng là ca này.

**Cách sửa:** đóng bớt tab trình duyệt hoặc tạm dừng máy ảo VMware rồi build lại.
Không cần đụng gì tới `NODE_OPTIONS` — tăng `--max-old-space-size` KHÔNG cứu được
lỗi này vì vấn đề nằm ở RAM vật lý, không phải trần heap.

**Mẹo tách nguyên nhân:** chạy `npx tsc --noEmit` riêng. Lệnh này nhẹ hơn nhiều so
với `next build`. Nếu `tsc` chạy xong sạch ⇒ chắc chắn là vấn đề bộ nhớ, không phải
lỗi type.

**Ngày:** 2026-08-11

---

## I18N-001 — `as const` làm bản dịch tiếng Việt không compile

**Triệu chứng:** ~33 lỗi TypeScript trong `src/i18n/dictionaries.ts`:

```
error TS2322: Type '"Kinh nghiệm"' is not assignable to type '"Experience"'.
```

**Nguyên nhân gốc:** `const en = { ... } as const` biến mọi giá trị thành **literal
type** thay vì `string`. `Dictionary = typeof en` do đó yêu cầu bản `vi` phải chứa
đúng từng chuỗi tiếng Anh — tức là không bao giờ dịch được.

**Cách xác minh:** hover vào `Dictionary` trong VS Code, thấy kiểu là các chuỗi cụ thể
(`title: "Experience"`) thay vì `title: string`.

**Cách sửa:** bỏ `as const`. Kiểm tra thiếu/thừa key vẫn hoạt động đầy đủ vì
`const vi: Dictionary` vẫn được so khớp cấu trúc.

**Ngày:** 2026-08-11

---

## NEXT16-001 — Không có helper toàn cục `ImageProps`

**Triệu chứng:** `error TS2552: Cannot find name 'ImageProps'. Did you mean 'PageProps'?`
trong `src/app/[lang]/opengraph-image.tsx`.

**Nguyên nhân gốc:** `next typegen` chỉ sinh ba helper toàn cục: `PageProps`,
`LayoutProps`, `RouteContext`. Route ảnh metadata (`opengraph-image`, `icon`,
`twitter-image`) không có helper tương ứng.

**Cách sửa:** khai báo tay. Lưu ý Next 16 đổi `params` của hàm sinh ảnh thành Promise:

```ts
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
}
```

**Ngày:** 2026-08-11

---

## NEXT16-002 — `opengraph-image` bị render động, tốn function invocation

**Triệu chứng:** output của `next build` đánh dấu route là động:

```
├ ƒ /[lang]/opengraph-image
ƒ  (Dynamic)  server-rendered on demand
```

Mỗi lần link được dán lên LinkedIn/Zalo/Slack là một lần chạy serverless function —
đi ngược mục tiêu $0.

**Nguyên nhân gốc:** route ảnh metadata **không kế thừa** `generateStaticParams` của
`layout.tsx`. Thiếu khai báo riêng thì Next không biết trước danh sách locale.

**Cách xác minh:** đọc bảng Route ở cuối `next build`. Muốn tĩnh thì phải thấy
`● /en/opengraph-image` và `● /vi/opengraph-image`, không phải `ƒ /[lang]/opengraph-image`.

**Cách sửa:** export thêm `generateStaticParams` ngay trong chính file
`opengraph-image.tsx`.

**Ngày:** 2026-08-11

---

## GH-001 — GitHub GraphQL bắt buộc có token, và fetch POST không được Next cache

**Triệu chứng (dự phòng, chưa xảy ra):** section GitHub trống hoặc hiện thông báo
"chưa tải được".

**Nguyên nhân gốc — hai thứ độc lập:**

1. **Danh sách repo đã ghim (pinned) chỉ có ở GraphQL API**, mà GraphQL của GitHub
   **luôn** yêu cầu `Authorization`, kể cả khi chỉ đọc dữ liệu công khai. REST API
   thì đọc ẩn danh được nhưng không trả về danh sách ghim.
2. **Next không cache fetch POST.** Cơ chế Data Cache (`next: { revalidate }`) chỉ áp
   dụng cho GET. GraphQL bắt buộc dùng POST ⇒ đặt `next.revalidate` lên nó là vô nghĩa.

**Cách xác minh:** không có `GITHUB_TOKEN` thì `getGitHubRepos()` trả về
`{ ok: false, reason: "no-token" }` và section tự ẩn. Xem log server tìm tiền tố `[github]`.

**Cách sửa (đã áp dụng):**

- Bọc lời gọi trong `unstable_cache(..., { revalidate: 3600 })` thay vì dựa vào Data Cache.
- Thêm `export const revalidate = 3600` ở `src/app/[lang]/page.tsx`. **Cả hai đều cần:**
  `unstable_cache` giữ kết quả API, còn `revalidate` của segment mới là thứ khiến trang
  HTML được sinh lại. Thiếu cái sau thì trang đứng yên mãi ở nội dung lúc build.
- Xác minh ISR bằng cách đọc `.next/prerender-manifest.json`, trường
  `routes["/en"].initialRevalidateSeconds` phải bằng `3600`.

**Nợ kỹ thuật:** `unstable_cache` đã bị Next 16 đánh dấu deprecated, khuyến nghị thay
bằng directive `use cache` + `cacheComponents: true`. Chưa migrate vì bật
`cacheComponents` là đổi cả mô hình render (dữ liệu chưa cache nằm ngoài `<Suspense>`
sẽ làm build fail), không đáng cho quy mô hiện tại. Xem
`node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md` khi cần làm.

**Ngày:** 2026-08-11

---

## GH-002 — Thêm `GITHUB_TOKEN` rồi build lại nhưng section GitHub vẫn ẩn

**Triệu chứng:** đã điền `GITHUB_TOKEN` vào `.env.local`, chạy `npm run build` lại,
nhưng section GitHub vẫn không hiện. Không có lỗi nào trong log.

**Nguyên nhân gốc:** `unstable_cache` lưu kết quả xuống **`.next/cache`** và **cache
này sống sót qua các lần build**. Lần build trước (khi chưa có token) đã cache lại giá
trị `{ ok: false, reason: "no-token" }` với `revalidate: 3600`. Build sau đó trong vòng
1 giờ chỉ việc đọc lại giá trị cũ, không gọi GitHub lần nào.

Điểm mấu chốt: **khoá cache chỉ gồm `keyParts` và tham số của hàm.** Biến môi trường
KHÔNG nằm trong khoá, nên đổi env không hề làm cache mất hiệu lực.

**Cách xác minh:**

```powershell
Remove-Item -Recurse -Force .next
npm run build
```

Nếu sau khi xoá `.next` mà section hiện ra ⇒ đúng là ca này.

**Cách sửa:** xoá `.next` mỗi khi đổi biến môi trường có ảnh hưởng tới hàm được cache
(`GITHUB_TOKEN`, `GITHUB_USERNAME`).

**⚠️ Điều tương tự xảy ra trên Vercel.** Vercel giữ lại build cache giữa các lần deploy.
Sau khi thêm hoặc sửa biến môi trường trên Vercel, phải vào **Deployments → ⋯ → Redeploy**
rồi **BỎ TICK "Use existing Build Cache"**. Chỉ bấm Redeploy bình thường là vẫn dính
giá trị cũ.

**Ngày:** 2026-08-11

---

## ENV-001 — `npm : File ... npm.ps1 cannot be loaded because running scripts is disabled`

**Triệu chứng:** gõ `npm run dev` trong PowerShell thì bị chặn:

```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts
is disabled on this system.
    + FullyQualifiedErrorId : UnauthorizedAccess
```

**Nguyên nhân gốc:** trong PowerShell, `npm` phân giải thành `npm.ps1` — một PowerShell
script, nên chịu ràng buộc của execution policy. Cả `CurrentUser` lẫn `LocalMachine`
đang là `Undefined`, Windows bản client rơi về mặc định `Restricted` = chặn mọi `.ps1`.

Không liên quan gì tới Node hay dự án. `cmd.exe` và Git Bash không dính lỗi này.

**Cách xác minh:**

```powershell
Get-ExecutionPolicy -List
# CurrentUser / LocalMachine = Undefined  ⇒ đúng ca này
```

**Cách sửa — chọn một:**

```powershell
# 1. Không đổi thiết lập nào. npm.cmd là batch file, không chịu execution policy.
npm.cmd run dev

# 2. Sửa dứt điểm, không cần quyền admin. Đây là cấu hình khuyến nghị cho máy dev.
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. Chỉ cho phiên terminal hiện tại, đóng terminal là mất.
Set-ExecutionPolicy -Scope Process -Bypass
```

Quay lại như cũ: `Set-ExecutionPolicy -ExecutionPolicy Restricted -Scope CurrentUser`.

**Vì sao tool của agent chạy npm được mà terminal người dùng thì không:** tiến trình
PowerShell của agent chạy ở scope `Process = Bypass`. Đừng dựa vào việc "agent chạy
được" để kết luận môi trường không có vấn đề.

**Ngày:** 2026-08-11

---

## NPM-001 — Cảnh báo `npm warn allow-scripts`

**Triệu chứng:** mỗi lần `npm install` đều in:

```
npm warn allow-scripts 3 packages have install scripts not yet covered by allowScripts:
npm warn allow-scripts   unrs-resolver@1.12.2, @parcel/watcher@2.6.0, @swc/core@1.15.47
```

**Nguyên nhân gốc:** npm 11 mặc định chặn install script của dependency (biện pháp
chống supply-chain attack). Đây là **cảnh báo, không phải lỗi**.

**Cách xác minh:** `npm run build` vẫn chạy xong sạch ⇒ không có script nào thực sự cần thiết.

**Cách sửa:** không cần làm gì. Chỉ chạy `npm approve-scripts` nếu sau này build thật sự
hỏng vì thiếu native binary.

**Ngày:** 2026-08-11
