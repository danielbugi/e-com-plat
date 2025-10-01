"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Package, ShoppingCart, Users, Server } from "lucide-react";
import { useEffect, useState } from "react";

interface SystemStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalCategories: number;
}

export function SystemInfo() {
  const [stats, setStats] = useState<SystemStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Server className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Platform</p>
                <p className="font-semibold">Next.js 15.5.4</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Database className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Database</p>
                <p className="font-semibold">PostgreSQL + Prisma</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Package className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="font-semibold">{stats.totalProducts}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="font-semibold">{stats.totalOrders}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="font-semibold">{stats.totalUsers}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Database className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="font-semibold">{stats.totalCategories}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Node Version</span>
              <span className="font-medium">{process.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environment</span>
              <span className="font-medium">
                {process.env.NODE_ENV || "development"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
