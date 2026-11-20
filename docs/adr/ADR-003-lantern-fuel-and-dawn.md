# ADR-003 — Nhiên liệu đèn và thắng lúc bình minh

## Bối cảnh

Ticket-03 thay luật thắng sớm bằng mục tiêu giữ đảo sáng tới bình minh và cho phép đèn cạn dầu.

## Quyết định

- Lưu nhiên liệu bằng số nguyên `fuelTicks`, trong đó 60 tick = 1 đơn vị fuel; chỉ chuyển sang số thực khi xuất snapshot.
- Mỗi đèn có `fuelTicks`, `ever_lit` và `relit_count`. Đèn vừa thắp có 100 fuel; đèn từng sáng thắp lại cần 5 đom đóm.
- Mỗi tick đèn sáng mất 1/60 fuel; mỗi Bóng Mực ở trạng thái `drain` mất thêm 5/60 fuel mỗi tick.
- Thắng chỉ xét sau cập nhật cuối tick: còn sống và số đèn sáng đạt `ceil(0.6 * tổng đèn)`. Lý do thắng là `dawn_survived`; không còn `all_lit`.
- Sức chứa dùng `10 + 2 * successful_lights`, tối đa 20; scenario đặt đèn sáng không làm tăng bộ đếm.

## Hệ quả

Test Phase 1/2 kiểm tra thắng ngay khi đủ đèn đã được thay bằng test giữ đèn tới bình minh. Các test mới kiểm tra refuel, relight, drain, lantern_out và dawn_survived.
