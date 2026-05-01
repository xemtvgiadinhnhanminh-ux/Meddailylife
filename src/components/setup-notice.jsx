export function SetupNotice({ compact = false }) {
  return (
    <div
      className={`rounded-[1.5rem] border border-amber-200 bg-amber-50 text-amber-950 ${
        compact ? "px-4 py-3 text-sm" : "px-6 py-5"
      }`}
    >
      <h2 className={`font-semibold ${compact ? "text-sm" : "text-lg"}`}>
        Supabase chua duoc ket noi
      </h2>
      <p className={`mt-2 leading-6 ${compact ? "text-sm" : "text-base"}`}>
        Ban web moi da duoc viet theo huong co admin that. De bat che do luu
        noi dung va dang nhap quan tri, ban can tao Supabase project, chay file
        `supabase/schema.sql`, sau do dien `.env`.
      </p>
    </div>
  );
}

