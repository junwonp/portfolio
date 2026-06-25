import React from "react";

interface Props {
  dateFrom: string;
  dateTo?: string;
}

export default function Period({ dateFrom, dateTo }: Props) {
  const timeFormatter = (time?: string) => {
    if (!time) return "";
    const [year, month = ""] = time.split("-");
    return `${year}. ${month}`;
  };

  const showTilde = dateFrom.includes("-") && (!dateTo || dateTo !== dateFrom);
  const showDateTo = dateTo && dateTo !== dateFrom;

  return (
    <span>
      <time dateTime={dateFrom}>{timeFormatter(dateFrom)}</time>
      {showTilde && " ~ "}
      {showDateTo && <time dateTime={dateTo}>{timeFormatter(dateTo)}</time>}
    </span>
  );
}
