import React from "react";

interface Props {
  dateFrom: string;
  dateTo?: string;
}

function formatTime(time?: string) {
  if (!time) return "";
  const [year, month = ""] = time.split("-");
  return `${year}. ${month}`;
}

export default function Period({ dateFrom, dateTo }: Props) {
  const showTilde = dateFrom.includes("-") && (!dateTo || dateTo !== dateFrom);
  const showDateTo = dateTo && dateTo !== dateFrom;

  return (
    <span>
      <time dateTime={dateFrom}>{formatTime(dateFrom)}</time>
      {showTilde && " ~ "}
      {showDateTo && <time dateTime={dateTo}>{formatTime(dateTo)}</time>}
    </span>
  );
}
