import type { PriceObservation } from "../data/types";
import { formatCurrency, formatDate } from "../lib/format";

export function PriceHistorySparkline({ observations }: { observations: PriceObservation[] }) {
  if (observations.length === 0) return <p>No price observations yet.</p>;

  const width = 240;
  const height = 48;
  const prices = observations.map((o) => o.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = observations.map((o, i) => {
    const x = observations.length === 1 ? width / 2 : (i / (observations.length - 1)) * (width - 8) + 4;
    const y = height - 4 - ((o.price - min) / range) * (height - 8);
    return { x, y, o };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Price history from ${formatCurrency(prices[0])} on ${formatDate(observations[0].date)} to ${formatCurrency(
          prices[prices.length - 1],
        )} on ${formatDate(observations[observations.length - 1].date)}.`}
      >
        <path d={path} fill="none" stroke="var(--color-info)" strokeWidth={2} />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="var(--color-info)" />
        ))}
      </svg>
      <table style={{ width: "100%", fontSize: "var(--font-size-small)", marginTop: "var(--space-2)" }}>
        <caption className="visually-hidden">Price and mileage observations over time</caption>
        <thead>
          <tr>
            <th scope="col" style={{ textAlign: "left" }}>
              Date
            </th>
            <th scope="col" style={{ textAlign: "left" }}>
              Price
            </th>
            <th scope="col" style={{ textAlign: "left" }}>
              Mileage
            </th>
            <th scope="col" style={{ textAlign: "left" }}>
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {observations.map((o) => (
            <tr key={o.date + o.price}>
              <td>{formatDate(o.date)}</td>
              <td>{formatCurrency(o.price)}</td>
              <td>{o.mileage ? `${o.mileage.toLocaleString()} mi` : "—"}</td>
              <td>{o.note ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
