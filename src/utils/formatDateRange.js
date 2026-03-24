export const formatDateRange = (start, end) => {
  const s = new Date(start);
  if (end === "0000-00-00" || !end || start === end) {
    return s.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  const e = new Date(end);
  if (s.getMonth() === e.getMonth()) {
    return `${s.getDate()}-${e.getDate()} ${s.toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    })}`;
  }
  return `${s.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} - ${e.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`;
};
