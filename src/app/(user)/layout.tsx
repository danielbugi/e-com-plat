import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { User, ShoppingBag, Heart, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-2xl font-bold">
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h2 className="font-bold text-lg">{session.user?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {session.user?.email}
                </p>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  Wishlist
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
