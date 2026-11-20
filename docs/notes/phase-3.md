# Phase 3 — Ticket-03 acceptance criteria

- [x] Contract v1.2, fuel 100, decay 1/60 per tick, drain 5/60 per shade/tick.
- [x] Đèn có `fuel`, `ever_lit`, `relit_count`; đèn cạn phát `lantern_out`.
- [x] Tương tác chọn đèn gần nhất; đèn đang sáng châm dầu, đèn từng sáng relight với 5 đom đóm.
- [x] Bóng Mực `wander` chọn đèn yếu, chuyển `drain`, bị đẩy/choáng đúng hướng xử lý.
- [x] Không thắng sớm; bình minh thắng khi đạt 60% đèn và còn lửa.
- [x] Sức chứa tăng 10 + 2 lần thắp thành công, tối đa 20.
- [x] Điểm mới và các event `refuel`, `fuel_drain`, `lantern_out`, `dawn_survived`.
- [x] Snapshot fuel làm tròn 1 chữ số và có các trường v1.2.
- [x] Có ADR và changelog breaking changes.

## Test thay đổi

Test cũ không bị bỏ âm thầm: `test_contract.js` và `test_phase2.js` vẫn chạy hồi quy. Test Phase 3 thêm scenario riêng cho refuel, relight, drain và dawn survival trong `tests/test_phase3.js`.
