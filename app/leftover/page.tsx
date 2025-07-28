"use client";

import { useEffect, useState } from "react";
import { format, differenceInDays, addDays, isBefore, isWithinInterval } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

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

export default function LeftoverPage() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [form, setForm] = useState<Omit<FoodItem, "id" | "expiration_date" | "status">>({
    name: "",
    category: "",
    quantity: 1,
    food_size: "",
    estimation_price: 0,
    purchase_date: format(new Date(), "yyyy-MM-dd")
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/leftover/api")
      .then(res => res.json())
      .then(setItems);
  }, []);

  const refreshItems = async () => {
    const data = await fetch("/leftover/api").then(res => res.json());
    setItems(data);
  };

  const saveItem = async () => {
    const expirationDate = format(addDays(new Date(form.purchase_date), 5), "yyyy-MM-dd");
    const newItem: FoodItem = {
      id: editingId || crypto.randomUUID(), // ✅ replaced uuidv4
      ...form,
      expiration_date: expirationDate,
      status: "active"
    };

    if (editingId) {
      await fetch(`/leftover/api/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(newItem)
      });
    } else {
      await fetch("/leftover/api", {
        method: "POST",
        body: JSON.stringify(newItem)
      });
    }

    setEditingId(null);
    resetForm();
    refreshItems();
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      quantity: 1,
      food_size: "",
      estimation_price: 0,
      purchase_date: format(new Date(), "yyyy-MM-dd")
    });
  };

  const deleteItem = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this item? It will be marked as trashed before deletion.");
    if (!confirm) return;

    const target = items.find(i => i.id === id);
    if (target) {
      await markStatus(id, "trashed");
    }

    await fetch(`/leftover/api/${id}`, { method: "DELETE" });
    refreshItems();
  };

  const markStatus = async (id: string, status: "used" | "trashed") => {
    const confirm = window.confirm(`Are you sure you want to mark this item as "${status}"?`);
    if (!confirm) return;

    const updated = items.find(i => i.id === id);
    if (!updated) return;

    const updatedItem = { ...updated, status };
    await fetch(`/leftover/api/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedItem)
    });

    setItems(prev => prev.map(i => i.id === id ? updatedItem : i));
  };

  const alerts = (item: FoodItem) => {
    const today = new Date();
    const expiration = new Date(item.expiration_date);
    if (isBefore(expiration, today)) return "❗Expired";
    if (isWithinInterval(expiration, { start: today, end: addDays(today, 1) })) return "⚠️ Expires soon";
    return "";
  };

  const activeItems = items.filter(i => i.status === "active");
  const usedCount = items.filter(i => i.status === "used").length;
  const trashCount = items.filter(i => i.status === "trashed").length;

  return (
    <div className="p-4 space-y-6">
      {/* Add/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Food Item" : "Add Food Item"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {["name", "category", "food_size"].map((key) => (
            <Input
              key={key}
              placeholder={key}
              value={(form as any)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}
          <Input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Estimation Price"
            value={form.estimation_price}
            onChange={(e) => setForm({ ...form, estimation_price: Number(e.target.value) })}
          />
          <Input
            type="date"
            placeholder="Purchase Date"
            value={form.purchase_date}
            onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
          />
          <Button onClick={saveItem}>{editingId ? "Update" : "Add"}</Button>
        </CardContent>
      </Card>

      {/* Active Item Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeItems.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              {alerts(item) && <p className="text-red-500 text-sm">{alerts(item)}</p>}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Size:</strong> {item.food_size}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> ${item.estimation_price}</p>
              <p><strong>Expires:</strong> {item.expiration_date}</p>
              <Progress value={Math.min(100, 100 - differenceInDays(new Date(item.expiration_date), new Date()) * 20)} />
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => {
                  setForm({
                    name: item.name,
                    category: item.category,
                    food_size: item.food_size,
                    quantity: item.quantity,
                    estimation_price: item.estimation_price,
                    purchase_date: item.purchase_date
                  });
                  setEditingId(item.id);
                }}>
                  Edit
                </Button>
                <Button variant="outline" onClick={() => deleteItem(item.id)}>Delete</Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button variant="default" onClick={() => markStatus(item.id, "used")}>Mark as Used</Button>
                <Button variant="destructive" onClick={() => markStatus(item.id, "trashed")}>Mark as Trash</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={[
              { name: "Used", count: usedCount, fill: "#10b981" },
              { name: "Trashed", count: trashCount, fill: "#ef4444" }
            ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-100">
            <Link href="/leftover/history">
              <Button variant="outline">View All History</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
