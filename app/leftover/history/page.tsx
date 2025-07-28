"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  food_size: string;
  estimation_price: number;
  purchase_date: string;
  expiration_date: string;
  status: "active" | "used" | "trashed";
}

export default function HistoryPage() {
  const [history, setHistory] = useState<FoodItem[]>([]);

  useEffect(() => {
    fetch("/leftover/api")
      .then((res) => res.json())
      .then((data: FoodItem[]) => {
        const filtered = data
          .filter((item) => item.status === "used" || item.status === "trashed")
          .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime());
        setHistory(filtered);
      });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leftover History</h1>
        <Link href="/leftover">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{item.name}</CardTitle>
              <Badge
                className={
                  item.status === "used"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }
              >
                {item.status.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Size:</strong> {item.food_size}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Estimated Price:</strong> ${item.estimation_price}</p>
              <p><strong>Purchase Date:</strong> {item.purchase_date}</p>
              <p><strong>Expiration Date:</strong> {item.expiration_date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
