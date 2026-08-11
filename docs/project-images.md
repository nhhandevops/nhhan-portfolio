# Ảnh minh hoạ dự án

Đặt ảnh chụp màn hình / sơ đồ kiến trúc của các dự án vào thư mục này, rồi khai báo
trong `src/data/projects.ts`:

```ts
{
  name: "VPN Infrastructure with Netbird",
  // ...
  cover: {
    src: "/projects/netbird-dashboard.png",
    alt: {
      en: "Netbird admin dashboard showing connected peers",
      vi: "Bảng điều khiển Netbird hiển thị các peer đang kết nối",
    },
  },
}
```

## ⚠️ Che dữ liệu nhạy cảm trước khi đưa lên

Thư mục `public/` là URL công khai — ai cũng tải được và Google index được.
Xoá khỏi trang sau đó **không** gỡ được bản đã bị thu thập.

Trước khi lưu ảnh, che hết:

- Tên khách hàng, tên công ty đối tác
- Email và tên nhân viên
- Hostname, IP nội bộ, tên bucket / cluster / VPC
- Token, API key, session ID trên thanh URL
- Số liệu kinh doanh (doanh thu, số lượng khách hàng)

Nếu không chắc công ty cho phép công khai giao diện hệ thống nội bộ, **hãy tự vẽ
sơ đồ kiến trúc** thay vì chụp màn hình thật. Sơ đồ thể hiện năng lực thiết kế tốt
hơn ảnh chụp, và không có rủi ro rò rỉ.

## Quy cách ảnh

- Định dạng: PNG cho ảnh giao diện, SVG cho sơ đồ
- Tỉ lệ: 16:9 (card hiển thị dạng `aspect-video`, ảnh khác tỉ lệ sẽ bị cắt bớt)
- Chiều rộng: khoảng 1600px là đủ, đừng để file quá 500 KB
- Đặt tên bằng chữ thường có gạch nối: `netbird-dashboard.png`
