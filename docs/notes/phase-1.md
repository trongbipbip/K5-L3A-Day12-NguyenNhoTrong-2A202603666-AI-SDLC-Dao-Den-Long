# Phase 1 — PRD-0

## Giả định

- Đêm 1 có 5 đèn, mỗi đèn cần 5 đom đóm để thắp.
- Mây có 5 máu/lửa và mang tối đa 5 đom đóm.
- Di chuyển dùng tốc độ 5 m/s; mô phỏng cố định 60 tick/giây.
- Tỏa sáng tốn 1 lửa, bán kính 7 m, làm Bóng Mực choáng 2 giây và đẩy lùi 4 m.
- Bóng Mực không đi vào bán kính an toàn 4 m quanh đèn đã thắp.
- Chạm Bóng Mực mất 1 lửa và rơi một nửa số đom đóm đang mang.
- Rơi khỏi bán kính đảo 30 m bị tính là va chạm rơi, nhưng vị trí được giữ ở mép đảo.
- Điểm: nhặt đom đóm 10, thắp đèn 100, làm choáng Bóng Mực 5, mỗi giây còn lại 1, mỗi lửa còn lại khi thắng 20.
- Giao diện web canvas là bản chơi thử nhẹ; Test Contract là nguồn sự thật cho logic và chấm tự động.

## Tiêu chí nghiệm thu

- [x] `game.contract.json` có contract v1.0 và các thông số trùng logic.
- [x] Chạy headless không cần GPU và tạo JSONL đúng định dạng.
- [x] Có snapshot tick 0, snapshot định kỳ, event và dòng `end` cuối cùng.
- [x] Có nhặt đom đóm, mang đom đóm, nạp đèn, thắng/thua, tính điểm.
- [x] Có Bóng Mực đuổi, va chạm gây mất lửa và pulse làm choáng/đẩy lùi.
- [x] Cùng seed/scenario/inputs cho output giống hệt nhau.
- [x] Có giao diện chơi thử và nút chơi lại.

## Đánh giá

Smoke test và kiểm tra determinism đã chạy đạt. Cần chạy thử giao diện bằng `node server.js` trên máy có màn hình và ghi ảnh/video làm bằng chứng trước khi gắn tag.
