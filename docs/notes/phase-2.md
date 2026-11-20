# Phase 2 — Ticket-02

## Chuẩn hóa đã áp dụng

- Tốc độ 6 m/s, nhảy 7 m/s, trọng lực -20 m/s².
- Dash 14 m/s trong 12 tick, hồi chiêu 90 tick.
- Sức chứa 10, nhặt trong 1 m, đèn cần 10 đom đóm, tương tác trong 2 m.
- 3 Ngọn Lửa; Tỏa Sáng tốn 3 đom đóm, bán kính 5 m, hồi 180 tick.
- Bóng Mực 4 m/s (Đêm 3 là 4.5 m/s), vùng an toàn 6 m.
- Đêm 1/2/3 lần lượt 300/330/360 giây.
- Điểm nạp đom đóm +10, đèn +100, choáng +5, thắng còn thời gian x2 và lửa x50.

## Acceptance criteria

- [x] Contract v1.1 chấp nhận `--night 1`, `2`, `3`.
- [x] Snapshot có `night`, `wind`, `vel`, `grounded`, cooldown, charm, motes, drifters, charms.
- [x] Dash, nhảy, pause/resume và bộ đếm mô phỏng được kiểm tra headless.
- [x] Headless có ba cấu hình đêm, đèn, điểm đom đóm và lịch sinh riêng.
- [x] Gió Lạc cướp đom đóm; Tỏa Sáng làm nó flee/drop.
- [x] Bùa Gió có thời lượng và hồi xuất hiện.
- [x] Tuning Phase 1 được thay bằng số chuẩn Ticket-02.

## Phần còn lại cần hoàn thiện trước khi chốt Phase 2

- [ ] Giao diện WebGL cần menu chuỗi 3 Đêm, camera/địa hình riêng cho Đảo Cau và Đảo Chuông, cầu/bục/tầng/dốc theo bản đồ chuẩn.
- [ ] Giao diện cần HUD đầy đủ của Ticket-02, pause menu, cài đặt lưu được và âm thanh theo danh sách yêu cầu.
- [ ] Cần đo FPS trung bình ở 1280×720 và lưu bằng chứng.

Các mục trên chưa được đánh dấu đạt; headless contract và logic kiểm chứng là phần đã hoàn thành trong commit này.

## Bằng chứng

Chạy `node tests/test_phase2.js`. Scenario này kiểm tra dash, pulse, pause, snapshot paused và drifter steal. Test Phase 1 vẫn chạy lại bằng `node tests/test_contract.js`.
