import { comparisonRows, onHand, type Alternative } from "@/lib/alternatives";

export default function ComparisonTable({ alternative }: { alternative: Alternative }) {
  return (
    <div className="table-scroll">
      <table className="comparison">
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">On Hand</th>
            <th scope="col">{alternative.name}</th>
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.key}>
              <th scope="row">{row.label}</th>
              <td>{onHand[row.key]}</td>
              <td>{alternative.comparison[row.key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
