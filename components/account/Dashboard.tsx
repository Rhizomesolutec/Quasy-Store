"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import { SHARED_SPIDER_IMAGES } from "@/lib/sharedImages";

type Tab = "overview" | "orders" | "addresses" | "wishlist" | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "addresses", label: "Addresses" },
  { id: "wishlist", label: "Wishlist" },
  { id: "settings", label: "Settings" },
];

const MOCK_ORDERS = [
  { id: "QS-10482", date: "2026-06-18", status: "Delivered", total: 185, items: 1, image: SHARED_SPIDER_IMAGES.two },
  { id: "QS-10311", date: "2026-05-02", status: "Shipped", total: 302, items: 2, image: SHARED_SPIDER_IMAGES.three },
  { id: "QS-10098", date: "2026-03-27", status: "Delivered", total: 96, items: 1, image: SHARED_SPIDER_IMAGES.one },
];

export function Dashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { wishlist } = useWishlist();

  return (
    <div className="w-full grid md:grid-cols-[220px_1fr] gap-10 md:gap-16">
      {/* Sidebar */}
      <aside>
        <div className="mb-8">
          <p className="font-heading text-lg text-[#D8CFC0]">Welcome back</p>
          <p className="font-sans text-xs text-[#D8CFC0]/40 truncate">{email}</p>
        </div>
        <nav className="flex flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-left px-4 py-2.5 font-sans text-xs uppercase tracking-widest transition-colors ${
                tab === t.id ? "bg-[#8E1F1F]/10 text-[#8E1F1F] border-l-2 border-[#8E1F1F]" : "text-[#D8CFC0]/60 hover:text-[#D8CFC0] border-l-2 border-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={onSignOut}
            className="text-left px-4 py-2.5 font-sans text-xs uppercase tracking-widest text-[#D8CFC0]/40 hover:text-[#8E1F1F] transition-colors mt-4 border-t border-white/[0.06] pt-4"
          >
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Content */}
      <div>
        {tab === "overview" && (
          <div className="space-y-8">
            <h2 className="font-heading text-2xl text-[#D8CFC0]">Account Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Orders", value: MOCK_ORDERS.length },
                { label: "Wishlist", value: wishlist.length },
                { label: "Reward Points", value: 240 },
              ].map((stat) => (
                <div key={stat.label} className="border border-white/[0.08] p-5 text-center">
                  <p className="font-heading text-3xl text-[#8E1F1F]">{stat.value}</p>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/50 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="font-heading text-lg text-[#D8CFC0] mb-4">Most Recent Order</h3>
              <OrderRow order={MOCK_ORDERS[0]} />
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-6">
            <h2 className="font-heading text-2xl text-[#D8CFC0] mb-2">Order History</h2>
            {MOCK_ORDERS.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        )}

        {tab === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl text-[#D8CFC0]">Saved Addresses</h2>
              <Button variant="outline" size="sm" onClick={() => setShowAddressForm((s) => !s)}>
                {showAddressForm ? "Cancel" : "Add Address"}
              </Button>
            </div>

            {showAddressForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowAddressForm(false);
                }}
                className="border border-white/[0.08] p-6 grid sm:grid-cols-2 gap-4"
              >
                <input required placeholder="Full Name" className="bg-[#1a1a1a] border border-white/[0.08] px-3 py-2.5 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 sm:col-span-2" />
                <input required placeholder="Street Address" className="bg-[#1a1a1a] border border-white/[0.08] px-3 py-2.5 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50 sm:col-span-2" />
                <input required placeholder="City" className="bg-[#1a1a1a] border border-white/[0.08] px-3 py-2.5 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50" />
                <input required placeholder="Postal Code" className="bg-[#1a1a1a] border border-white/[0.08] px-3 py-2.5 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50" />
                <Button type="submit" variant="filled" size="md" className="sm:col-span-2">
                  Save Address
                </Button>
              </form>
            )}

            <div className="border border-white/[0.08] p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-[#8E1F1F] mb-2">Default</p>
              <p className="font-sans text-sm text-[#D8CFC0]">Alex Sterling</p>
              <p className="font-sans text-sm text-[#D8CFC0]/60">14 Cathedral Row, Suite 3</p>
              <p className="font-sans text-sm text-[#D8CFC0]/60">New Haven Quarter, NH 06510</p>
            </div>
          </div>
        )}

        {tab === "wishlist" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl text-[#D8CFC0]">Wishlist</h2>
              <Link href="/wishlist" className="font-sans text-xs uppercase tracking-widest text-[#8E1F1F] hover:text-[#a32727]">
                View Full Wishlist →
              </Link>
            </div>
            {wishlist.length === 0 ? (
              <p className="font-sans text-sm text-[#D8CFC0]/50">You haven&apos;t saved any pieces yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {wishlist.slice(0, 6).map((item) => (
                  <Link key={item.productId} href={`/shop/${item.slug}`} className="border border-white/[0.08] p-3">
                    <div className="relative aspect-[4/5] bg-black rounded-sm overflow-hidden mb-2">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <p className="font-sans text-xs text-[#D8CFC0] truncate">{item.name}</p>
                    <p className="font-sans text-xs text-[#8E1F1F]">{formatPrice(item.price)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className="space-y-6 max-w-md">
            <h2 className="font-heading text-2xl text-[#D8CFC0] mb-2">Settings</h2>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/50 mb-2">Email</label>
                <input defaultValue={email} className="w-full bg-[#1a1a1a] border border-white/[0.08] px-4 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50" />
              </div>
              <div>
                <label className="block font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/50 mb-2">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-[#1a1a1a] border border-white/[0.08] px-4 py-3 text-sm text-[#D8CFC0] outline-none focus:border-[#8E1F1F]/50" />
              </div>
              <label className="flex items-center gap-2.5">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-[#8E1F1F]" />
                <span className="font-sans text-xs text-[#D8CFC0]/70">Email me about restocks and new collections</span>
              </label>
              <Button type="submit" variant="filled" size="md">
                Save Changes
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: (typeof MOCK_ORDERS)[number] }) {
  return (
    <div className="flex items-center gap-4 border border-white/[0.08] p-4">
      <div className="relative w-14 aspect-[4/5] bg-black rounded-sm overflow-hidden flex-shrink-0">
        <Image src={order.image} alt="" fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm text-[#D8CFC0]">{order.id}</p>
        <p className="font-sans text-[10px] uppercase tracking-widest text-[#D8CFC0]/40">
          {order.date} · {order.items} item{order.items > 1 ? "s" : ""}
        </p>
      </div>
      <span
        className={`font-sans text-[10px] uppercase tracking-widest px-2.5 py-1 border ${
          order.status === "Delivered" ? "border-green-700 text-green-500" : "border-[#8E1F1F]/40 text-[#8E1F1F]"
        }`}
      >
        {order.status}
      </span>
      <span className="font-mono text-sm text-[#D8CFC0] flex-shrink-0">{formatPrice(order.total)}</span>
    </div>
  );
}
