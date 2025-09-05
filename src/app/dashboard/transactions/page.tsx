import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const transactions = [
  { id: 'TXN-73920', productId: 'PROD-001', type: 'Payment', amount: '2,500 INR', status: 'Verified', date: '2023-10-26' },
  { id: 'TXN-73921', productId: 'PROD-002', type: 'Transfer', amount: 'N/A', status: 'Pending', date: '2023-10-25' },
  { id: 'TXN-73922', productId: 'PROD-003', type: 'Quality Check', amount: 'N/A', status: 'Verified', date: '2023-10-24' },
  { id: 'TXN-73923', productId: 'PROD-004', type: 'Payment', amount: '500 INR', status: 'Verified', date: '2023-10-23' },
];

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Transaction Verification</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Review and verify transactions on the blockchain.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.id}</TableCell>
                  <TableCell>{txn.productId}</TableCell>
                  <TableCell>{txn.type}</TableCell>
                  <TableCell>{txn.amount}</TableCell>
                  <TableCell>
                    <Badge variant={txn.status === 'Verified' ? 'default' : 'secondary'} className={txn.status === 'Verified' ? 'bg-primary/80' : ''}>
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" disabled={txn.status === 'Verified'}>
                      Verify
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
