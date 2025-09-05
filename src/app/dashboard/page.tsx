import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, CheckCircle, Search, Tractor } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const overviewCards = [
  { title: 'Products Tracked', value: '1,250', icon: Tractor },
  { title: 'Transactions Verified', value: '5,820', icon: CheckCircle },
  { title: 'Anomalies Detected', value: '12', icon: Search },
  { title: 'Avg. Price Accuracy', value: '98.5%', icon: BarChart },
];

const recentActivity = [
  { id: 'PROD-001', type: 'Tomatoes', status: 'In Transit', location: 'Warehouse A', image: 'https://picsum.photos/id/1080/40/40', dataAiHint: 'tomatoes produce' },
  { id: 'PROD-002', type: 'Wheat', status: 'Delivered', location: 'Retailer X', image: 'https://picsum.photos/id/152/40/40', dataAiHint: 'wheat field' },
  { id: 'PROD-003', type: 'Apples', status: 'Processing', location: 'Farmstead Orchards', image: 'https://picsum.photos/id/1025/40/40', dataAiHint: 'red apple' },
  { id: 'PROD-004', type: 'Milk', status: 'In Transit', location: 'Dairy Co.', image: 'https://picsum.photos/id/628/40/40', dataAiHint: 'milk bottle' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image src={activity.image} alt={activity.type} width={40} height={40} className="rounded-md" data-ai-hint={activity.dataAiHint} />
                      <span className="font-medium">{activity.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{activity.id}</TableCell>
                  <TableCell>
                    <Badge variant={activity.status === 'Delivered' ? 'default' : 'secondary'} className={activity.status === 'Delivered' ? 'bg-primary/80' : ''}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
