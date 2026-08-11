# Sổ tay sửa nội dung

Dành cho việc tự chỉnh nội dung mà không cần biết React.

---

## Quy tắc vàng

1. **Chỉ sửa file trong `src/data/`.** Không cần đụng tới `src/components/`.
2. **Mọi câu chữ đều phải có cả `en` và `vi`.** Thiếu một bên là báo lỗi ngay.
3. **Sau mỗi lần sửa, chạy:**

   ```powershell
   npm.cmd run check
   ```

   Không in ra gì = sạch. Có chữ `error` = xem bảng lỗi ở cuối trang này.

   > Dùng `npm.cmd` chứ không phải `npm` — xem `ENV-001` trong
   > `warning_bug_and_solutions.md` nếu muốn sửa dứt điểm.

4. **Muốn xem tận mắt:** `npm.cmd run dev` rồi mở http://localhost:3000.
   File lưu là trang tự cập nhật, không cần khởi động lại.

---

## Sửa gì thì vào file nào

| Muốn sửa | File |
| --- | --- |
| Tên, chức danh, đoạn giới thiệu, "Trọng tâm", email, SĐT, link | `src/data/profile.ts` |
| Kinh nghiệm làm việc | `src/data/experience.ts` |
| Học vấn, chứng chỉ | `src/data/education.ts` |
| Kỹ năng | `src/data/skills.ts` |
| Dự án | `src/data/projects.ts` |

---

## Các thao tác hay dùng

### Xoá bớt một dự án

Xoá nguyên khối từ `{` tới `},` của dự án đó. Ví dụ xoá dự án cuối:

```ts
export const projects: Project[] = [
  { name: "Centralized Authentication with Google Workspace", /* ... */ },
  { name: "VPN Infrastructure with Netbird", /* ... */ },
  { name: "High-Availability Workflow Platform", /* ... */ },
  // ← xoá cả khối "Cloud Security, Cost, and Kubernetes Labs" ở đây
];
```

Không cần sửa gì thêm. Số cột tự co lại.

### Bớt gạch đầu dòng cho gọn

Xoá dòng ở **cả hai** mảng `en` và `vi`. Hai mảng **không bắt buộc phải bằng nhau
về số dòng** — bạn có thể để tiếng Anh 4 dòng, tiếng Việt 3 dòng. Nhưng nên giữ
bằng nhau cho nhất quán.

```ts
highlights: {
  en: [
    "Câu 1",
    "Câu 2",          // ← xoá cả dòng này
  ],
  vi: [
    "Câu 1",
    "Câu 2",          // ← và dòng tương ứng ở đây
  ],
},
```

### Bỏ hẳn một phần không muốn hiện

Để mảng rỗng — section tự ẩn, mục tương ứng trên thanh nav cũng tự biến mất:

```ts
export const education: Education[] = [];
```

Áp dụng được cho `education`, `certifications`, `skillGroups`, `projects`,
`experiences`, `focusAreas`.

### Bỏ số điện thoại khỏi trang

Trong `src/data/profile.ts`:

```ts
phone: null,
```

### Đổi trạng thái dự án

Chỉ nhận đúng **ba** giá trị này, gõ khác là báo lỗi:

| Giá trị | Hiện trên trang (EN / VI) |
| --- | --- |
| `"active"` | In progress / Đang làm |
| `"maintained"` | Maintained / Đang duy trì |
| `"completed"` | Completed / Đã hoàn thành |

### Thêm dự án mới

Copy một khối dự án có sẵn, dán vào, rồi sửa nội dung. Trường bắt buộc:
`name`, `description`, `stack`, `status`. Các trường còn lại (`role`, `period`,
`highlights`, `links`, `cover`) có thể bỏ đi.

### Thêm ảnh minh hoạ cho dự án

Xem `docs/project-images.md`.

---

## Bảng lỗi thường gặp

Chạy `npm.cmd run check` mà thấy lỗi thì tra ở đây.

| Thông báo lỗi | Nghĩa là | Sửa thế nào |
| --- | --- | --- |
| `Property 'vi' is missing in type` | Quên bản dịch tiếng Việt | Thêm dòng `vi: "..."` bên cạnh `en` |
| `Property 'en' is missing in type` | Quên bản tiếng Anh | Thêm dòng `en: "..."` |
| `Type '"..."' is not assignable to type '"active" \| "maintained" \| "completed"'` | Gõ sai `status` | Chỉ dùng đúng 3 giá trị ở bảng trên |
| `',' expected` | Thiếu dấu phẩy giữa hai mục | Thêm `,` vào cuối dòng phía trước |
| `Declaration or statement expected` | Thừa dấu `}` hoặc `]` | Xoá dấu đóng bị dư |
| `Unterminated string literal` | Chuỗi thiếu dấu nháy đóng | Thêm `"` vào cuối chuỗi |
| `Cannot find name 'xxx'` | Chữ nằm ngoài dấu nháy | Bọc lại bằng `"..."` |
| `Object literal may only specify known properties` | Gõ sai tên trường | Đối chiếu tên trường trong `src/data/types.ts` |

**Chữ tiếng Việt có dấu nháy đơn** (`'`) thì không sao, vì chuỗi dùng nháy kép.
Nhưng nếu nội dung có **dấu nháy kép** thì phải thoát bằng `\"`:

```ts
en: "He called it a \"quick fix\".",
```

---

## Sai rồi thì quay lại thế nào

Dự án dùng git, nên luôn khôi phục được — **nhưng phải có commit đầu tiên đã**:

```powershell
git add -A
git commit -m "Bản đầu tiên"
```

Có commit rồi thì:

```powershell
git diff                      # xem mình vừa đổi gì
git checkout -- src/data/     # vứt toàn bộ thay đổi trong src/data, về commit gần nhất
```

Nên commit sau mỗi lần sửa xong một mảng nội dung, để có điểm quay về.

---

## Xong rồi thì làm gì

```powershell
npm.cmd run check    # bắt buộc — phải sạch
npm.cmd run build    # kiểm tra lần cuối
```

Sau `build`, nhìn bảng Route ở cuối. `/en`, `/vi`, `/en/opengraph-image`,
`/vi/opengraph-image` phải là `●`. Nếu thấy `ƒ` là có gì đó kéo trang thành động —
báo lại, đừng bỏ qua.
