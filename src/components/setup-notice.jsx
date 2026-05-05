export function SetupNotice({ compact = false }) {
  return (
    <div
      className={`rounded-[1.5rem] border border-amber-200 bg-amber-50 text-amber-950 ${
        compact ? "px-4 py-3 text-sm" : "px-6 py-5"
      }`}
    >
      <h2 className={`font-semibold ${compact ? "text-sm" : "text-lg"}`}>
        Supabase chưa được kết nối
      </h2>
      <p className={`mt-2 leading-6 ${compact ? "text-sm" : "text-base"}`}>
        Bản web mới đã được viết theo hướng có admin thật. Để bật chế độ lưu
        nội dung và đăng nhập quản trị, bạn cần tạo Supabase project, chạy file
        `supabase/schema.sql`, sau đó điền `.env`.
      </p>
    </div>
  );
}

