import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PokerResultTable({
  chartData,
}: Readonly<{
  chartData: {
    name: any;
    value: number;
  }[];
}>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Points</TableHead>
          <TableHead>Votes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chartData.map((item) => (
          <TableRow key={item.name}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
