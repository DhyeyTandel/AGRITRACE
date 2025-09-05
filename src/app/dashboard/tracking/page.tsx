import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function TrackingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Product Tracking</h1>
      <Card>
        <CardHeader>
          <CardTitle>Track a Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" placeholder="Enter Product ID" />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Track
            </Button>
          </div>
          <div className="mt-8 text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
            <p>Product journey will be displayed here.</p>
            <p className="text-sm">Enter a product ID to begin tracking.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
