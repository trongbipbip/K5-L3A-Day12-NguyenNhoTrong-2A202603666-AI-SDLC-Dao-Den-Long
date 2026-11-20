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

## Phase 3 contract v1.2

```text
node --check game.js
node tests/test_contract.js
node tests/test_phase2.js
node tests/test_phase3.js
```

- Headless nhận `--night 1|2|3`, chạy 60 tick/giây và xuất JSONL.
- Không thay đổi tuning chuẩn trong `game.contract.json`.
- Khi sửa logic, chạy lại cả test Phase 1 và scenario Phase 2.
- Scenario mới phải kiểm tra ít nhất một tính năng mới bằng headless.
- Không dùng luật thắng sớm `all_lit`; phải kiểm tra fuel và kết thúc ở bình minh.
- Fuel dùng số nguyên tick trong logic, chỉ làm tròn khi xuất snapshot.

## Bảo mật

Không commit `.env`, API key, token hoặc dữ liệu cá nhân.
