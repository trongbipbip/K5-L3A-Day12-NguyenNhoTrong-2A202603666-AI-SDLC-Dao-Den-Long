# Changelog

## Phase 3 — Contract v1.2

- BREAKING: `contract_version` tăng từ 1.1 lên 1.2.
- BREAKING: Đêm 1/2/3 đổi thời lượng thành 240/270/300 giây.
- BREAKING: Đèn có fuel, có thể cạn và phải châm lại; đèn từng sáng có chi phí relight 5.
- BREAKING: Không còn thắng sớm khi tất cả đèn sáng; thắng/thua xét ở bình minh theo tỷ lệ 60%.
- BREAKING: Công thức điểm chuyển sang nạp đom đóm, thắp/relight, điểm bình minh và lửa còn lại.
- BREAKING: Snapshot thêm fuel, ever_lit, relit_count, capacity; game over dùng `dawn_survived` thay `all_lit`.
