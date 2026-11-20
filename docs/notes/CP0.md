# CP0 — Chuẩn bị

## Trạng thái

- Repo cá nhân: đã có remote GitHub đúng tên; cần xác nhận repo ở chế độ Public.
- Công cụ hiện có: Git, Node.js, npm.
- Godot/Godot 4: chưa cài hoặc chưa có trong PATH.
- GitHub CLI (`gh`): chưa cài hoặc chưa có trong PATH.
- Lab board Claude: cần người dùng đăng nhập và mở tab Phase 1 thủ công.

## Quyết định ban đầu

- Dùng một smoke test headless không phụ thuộc package để xác nhận môi trường Node.js.
- Chưa khóa engine cuối cùng trước khi đọc PRD-0 và Test Contract của Phase 1.
- Ưu tiên engine có thể chạy trên macOS/Linux và hỗ trợ tách logic headless khỏi hiển thị.

## Bằng chứng CP0

Chạy:

```bash
node tools/hello_headless.js
```

Kết quả mong đợi là một JSON có `game: "Dao Den Long"`, `mode: "headless"` và `status: "ready"`.

## Việc còn cần người dùng xác nhận

- [ ] Repo GitHub đang ở chế độ Public.
- [ ] Đăng nhập `claude.ai`.
- [ ] Mở Lab board và xác nhận tab Phase 1 hoạt động.
- [ ] Đọc PRD-0 và Test Contract trước khi chọn engine chính thức.
- [ ] Kiểm tra deadline của buổi lab với Coach.
