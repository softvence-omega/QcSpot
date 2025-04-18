const TimeAgo = (dateStr: string) => {
  const now = new Date().getTime();
  const date = new Date(dateStr).getTime();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "yr", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "m", seconds: 60 },
    { label: "s", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label} ago`;
    }
  }

  return "just now";
};

export default TimeAgo;
