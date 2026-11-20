# AGENTS.md — Đảo Đèn Lồng

## Mục tiêu

Xây game 3D Đảo Đèn Lồng qua 4 phase. Ưu tiên đúng yêu cầu của phase, logic chạy được headless và bằng chứng thật.

## Quy tắc làm việc

- Đọc yêu cầu và Test Contract của phase hiện tại trước khi sửa code.
- Lập kế hoạch kiểm chứng trước khi xây dựng.
- Không tự bịa yêu cầu chưa có trong ticket.
- Không sửa tay output kiểm chứng; yêu cầu chưa đạt phải ghi rõ.
- Giữ logic game tách khỏi phần hiển thị để chạy được headless.
- Sau mỗi thay đổi, chạy lệnh kiểm tra được ghi trong README hoặc tài liệu phase.

## Lệnh hiện tại

```text
node tools/hello_headless.js
```

Lệnh chạy game và Test Contract sẽ được bổ sung sau khi chọn engine ở Phase 1.

## Bảo mật

Không commit `.env`, API key, token hoặc dữ liệu cá nhân.
