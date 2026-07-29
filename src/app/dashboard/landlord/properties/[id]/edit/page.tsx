"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PropertyForm } from "@/components/property/property-form";
import { useProperty, useUpdateProperty } from "@/hooks/use-properties";
import { handleApiError } from "@/lib/handle-error";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading } = useProperty(params.id);
  const updateProperty = useUpdateProperty(params.id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto max-w-2xl flex-1 px-5 py-16 sm:px-8">
          <p className="text-ink-500">Loading listing…</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 sm:px-8">
        <p className="plaque mb-2">Edit Entry</p>
        <h1 className="mb-8 font-display text-3xl italic text-ink-900">Edit listing</h1>

        {property && (
          <PropertyForm
            defaultValues={property}
            submitLabel="Save changes"
            isSubmitting={updateProperty.isPending}
            onSubmit={(values) => {
              updateProperty.mutate(values, {
                onSuccess: () => {
                  toast.success("Listing updated");
                  router.push("/dashboard/landlord");
                },
                onError: (err) => handleApiError(err),
              });
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
