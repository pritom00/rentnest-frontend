"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Users, Building2, ClipboardList, Tag } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { UserStatusBadge, PropertyStatusBadge, RentalStatusBadge } from "@/components/ui/badge";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationBar } from "@/components/ui/pagination";
import { Plaque } from "@/components/ui/plaque";
import { cn, formatCurrency, formatDate, shortRef } from "@/lib/utils";
import { handleApiError } from "@/lib/handle-error";
import {
  useAdminUsers,
  useUpdateUserStatus,
  useAdminProperties,
  useAdminRentals,
  useCreateCategory,
  useDeleteCategory,
} from "@/hooks/use-admin";
import { useCategories } from "@/hooks/use-categories";
import { Pagination } from "@/lib/api/properties";
import { categorySchema, CategoryFormValues } from "@/lib/validations/category";

type Tab = "users" | "properties" | "rentals" | "categories";

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "users", label: "Users", icon: Users },
  { id: "properties", label: "Properties", icon: Building2 },
  { id: "rentals", label: "Rentals", icon: ClipboardList },
  { id: "categories", label: "Categories", icon: Tag },
];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("users");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8">
        <p className="plaque mb-2">Platform Ledger</p>
        <h1 className="mb-10 font-display text-4xl italic text-ink-900">Admin dashboard</h1>

        <div className="mb-8 flex flex-wrap gap-2 border-b border-ink-900">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-[12px] uppercase tracking-widest2 transition-colors",
                tab === t.id ? "border-ink-900 text-ink-900" : "border-transparent text-ink-500 hover:text-ink-900"
              )}
            >
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "users" && <UsersTab />}
        {tab === "properties" && <PropertiesTab />}
        {tab === "rentals" && <RentalsTab />}
        {tab === "categories" && <CategoriesTab />}
      </main>
      <Footer />
    </div>
  );
}

function UsersTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers(page);
  const updateStatus = useUpdateUserStatus();

  const toggleBan = (id: string, current: "ACTIVE" | "BANNED") => {
    const next = current === "ACTIVE" ? "BANNED" : "ACTIVE";
    updateStatus.mutate(
      { id, status: next },
      {
        onSuccess: () => toast.success(`User ${next === "BANNED" ? "banned" : "unbanned"}`),
        onError: (err) => handleApiError(err),
      }
    );
  };

  if (isLoading) {
    return (
      <table className="w-full">
        <tbody>
          <TableRowSkeleton cols={5} />
          <TableRowSkeleton cols={5} />
        </tbody>
      </table>
    );
  }

  if (!data || data.data.length === 0) {
    return <EmptyState icon={Users} title="No users found" />;
  }

  return (
    <>
      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-ink-900 text-[11px] uppercase tracking-widest2 text-ink-500">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0 hover:bg-paper-100">
                <td className="px-4 py-4 text-ink-900">{u.name}</td>
                <td className="px-4 py-4 text-ink-700">{u.email}</td>
                <td className="px-4 py-4"><span className="plaque">{u.role}</span></td>
                <td className="px-4 py-4"><UserStatusBadge status={u.status} /></td>
                <td className="px-4 py-4 text-right">
                  {u.role !== "ADMIN" && (
                    <Button
                      size="sm"
                      variant={u.status === "ACTIVE" ? "stamp" : "outline"}
                      onClick={() => toggleBan(u.id, u.status)}
                      loading={updateStatus.isPending}
                    >
                      {u.status === "ACTIVE" ? "Ban" : "Unban"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationBar pagination={data.meta?.pagination as Pagination | undefined} onPageChange={setPage} />
    </>
  );
}

function PropertiesTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProperties(page);

  if (isLoading) {
    return (
      <table className="w-full">
        <tbody>
          <TableRowSkeleton cols={5} />
        </tbody>
      </table>
    );
  }

  if (!data || data.data.length === 0) {
    return <EmptyState icon={Building2} title="No properties found" />;
  }

  return (
    <>
      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-ink-900 text-[11px] uppercase tracking-widest2 text-ink-500">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Landlord</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Rent</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper-100">
                <td className="px-4 py-4 text-ink-900">
                  {p.title}
                  <Plaque label="Unit" value={shortRef(p.id)} className="mt-1 block" />
                </td>
                <td className="px-4 py-4 text-ink-700">{p.landlord?.name}</td>
                <td className="px-4 py-4 text-ink-700">{p.city}</td>
                <td className="px-4 py-4 font-mono text-ink-900">{formatCurrency(p.price)}</td>
                <td className="px-4 py-4"><PropertyStatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationBar pagination={data.meta?.pagination as Pagination | undefined} onPageChange={setPage} />
    </>
  );
}

function RentalsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminRentals(page);

  if (isLoading) {
    return (
      <table className="w-full">
        <tbody>
          <TableRowSkeleton cols={5} />
        </tbody>
      </table>
    );
  }

  if (!data || data.data.length === 0) {
    return <EmptyState icon={ClipboardList} title="No rental requests found" />;
  }

  return (
    <>
      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-ink-900 text-[11px] uppercase tracking-widest2 text-ink-500">
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Tenant</th>
              <th className="px-4 py-3 font-medium">Move-in</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((r) => (
              <tr key={r.id} className="border-b border-line last:border-0 hover:bg-paper-100">
                <td className="px-4 py-4 text-ink-900">
                  {r.property?.title}
                  <Plaque label="Req" value={shortRef(r.id)} className="mt-1 block" />
                </td>
                <td className="px-4 py-4 text-ink-700">{r.tenant?.name}</td>
                <td className="px-4 py-4 text-ink-700">{formatDate(r.moveInDate)}</td>
                <td className="px-4 py-4"><RentalStatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationBar pagination={data.meta?.pagination as Pagination | undefined} onPageChange={setPage} />
    </>
  );
}

function CategoriesTab() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  const submit = (values: CategoryFormValues) => {
    createCategory.mutate(
      { name: values.name.trim(), description: values.description?.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Category created");
          reset();
        },
        onError: (err) => handleApiError(err, setError),
      }
    );
  };

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    deleteCategory.mutate(id, {
      onSuccess: () => toast.success("Category deleted"),
      onError: (err) => handleApiError(err),
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
      <div>
        {isLoading ? (
          <table className="w-full">
            <tbody>
              <TableRowSkeleton cols={3} />
            </tbody>
          </table>
        ) : !categories || categories.length === 0 ? (
          <EmptyState icon={Tag} title="No categories yet" />
        ) : (
          <div className="overflow-x-auto border border-line">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-ink-900 text-[11px] uppercase tracking-widest2 text-ink-500">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0 hover:bg-paper-100">
                    <td className="px-4 py-4 text-ink-900">{c.name}</td>
                    <td className="px-4 py-4 text-ink-500">{c.description}</td>
                    <td className="px-4 py-4 text-right">
                      <Button size="sm" variant="stamp" onClick={() => remove(c.id, c.name)} loading={deleteCategory.isPending}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(submit)} className="h-fit border border-ink-900 p-5">
        <p className="plaque mb-4">New Category</p>
        <div className="mb-4">
          <Label htmlFor="cat-name" required>Name</Label>
          <Input id="cat-name" placeholder="e.g. Penthouse" error={errors.name?.message} {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>
        <div className="mb-4">
          <Label htmlFor="cat-desc">Description</Label>
          <Textarea
            id="cat-desc"
            placeholder="Optional description"
            error={errors.description?.message}
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>
        <Button type="submit" variant="primary" className="w-full" loading={createCategory.isPending}>
          Add category
        </Button>
      </form>
    </div>
  );
}
