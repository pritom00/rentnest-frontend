"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BedDouble, Bath, Ruler, Star } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Plaque } from "@/components/ui/plaque";
import { PropertyStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, FieldError } from "@/components/ui/input";
import { useProperty } from "@/hooks/use-properties";
import { useCreateRental } from "@/hooks/use-rentals";
import { useMyRentals } from "@/hooks/use-rentals";
import { useCreateReview } from "@/hooks/use-reviews";
import { useAuthStore } from "@/lib/store/auth-store";
import { formatCurrency, formatDate, shortRef } from "@/lib/utils";
import { handleApiError } from "@/lib/handle-error";
import { rentalRequestSchema, RentalRequestFormValues } from "@/lib/validations/rental";
import { reviewSchema, ReviewFormValues } from "@/lib/validations/review";
import Link from "next/link";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading } = useProperty(params.id);
  const { user, hydrated } = useAuthStore();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const createRental = useCreateRental();
  const createReview = useCreateReview();
  const { data: myRentals } = useMyRentals();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RentalRequestFormValues>({ resolver: zodResolver(rentalRequestSchema) });

  const {
    register: registerReview,
    handleSubmit: handleReviewSubmit,
    setError: setReviewError,
    reset: resetReviewForm,
    formState: { errors: reviewErrors },
  } = useForm<ReviewFormValues>({ resolver: zodResolver(reviewSchema) });

  const onSubmit = (values: RentalRequestFormValues) => {
    if (!property) return;
    createRental.mutate(
      { propertyId: property.id, moveInDate: values.moveInDate, message: values.message || undefined },
      {
        onSuccess: () => {
          toast.success("Rental request submitted", {
            description: "The landlord will review it — track its status from your dashboard.",
          });
          router.push("/dashboard/tenant");
        },
        onError: (err) => handleApiError(err, setError),
      }
    );
  };

  const onSubmitReview = (values: ReviewFormValues) => {
    if (!property) return;
    createReview.mutate(
      { propertyId: property.id, rating: values.rating, comment: values.comment || undefined },
      {
        onSuccess: () => {
          toast.success("Review submitted — thanks for sharing your experience");
          resetReviewForm();
        },
        onError: (err) => handleApiError(err, setReviewError),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" className="mx-auto max-w-6xl flex-1 px-5 py-16 sm:px-8">
          <p className="text-ink-500">Loading listing…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto max-w-6xl flex-1 px-5 py-16 sm:px-8">
          <p className="text-ink-500">This listing could not be found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwnerOrStaff = user && (user.id === property.landlordId || user.role !== "TENANT");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8">
        <Plaque label="Unit" value={shortRef(property.id)} className="mb-3" />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-4xl italic text-ink-900">{property.title}</h1>
                <p className="mt-1 text-[14px] text-ink-500">
                  {property.address}, {property.city}
                </p>
              </div>
              <PropertyStatusBadge status={property.status} />
            </div>

            {property.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={property.images[0]}
                alt={property.title}
                className="mb-8 h-72 w-full border border-line object-cover"
              />
            ) : (
              <div className="hatch-pattern mb-8 flex h-72 w-full items-center justify-center border border-line bg-paper-100">
                <span className="plaque bg-paper-50 px-3 py-1.5">No photograph on file</span>
              </div>
            )}

            <div className="mb-8 flex flex-wrap gap-6 border-y border-line py-5">
              <span className="flex items-center gap-2 text-[13px] text-ink-700">
                <BedDouble className="h-4 w-4" /> {property.bedrooms} Bedrooms
              </span>
              <span className="flex items-center gap-2 text-[13px] text-ink-700">
                <Bath className="h-4 w-4" /> {property.bathrooms} Bathrooms
              </span>
              {property.areaSqft && (
                <span className="flex items-center gap-2 text-[13px] text-ink-700">
                  <Ruler className="h-4 w-4" /> {property.areaSqft} sqft
                </span>
              )}
              {property.category && <span className="plaque">{property.category.name}</span>}
            </div>

            <div className="mb-8">
              <p className="plaque mb-3">Description</p>
              <p className="whitespace-pre-line text-[14px] leading-relaxed text-ink-700">
                {property.description}
              </p>
            </div>

            {property.amenities?.length > 0 && (
              <div className="mb-8">
                <p className="plaque mb-3">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span key={a} className="border border-line px-3 py-1.5 text-[12px] text-ink-700">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="plaque mb-3">Reviews {property.reviews?.length ? `(${property.reviews.length})` : ""}</p>
              {!property.reviews || property.reviews.length === 0 ? (
                <p className="text-[13px] text-ink-500">No reviews yet — this listing is new to the ledger.</p>
              ) : (
                <div className="space-y-4">
                  {property.reviews.map((r) => (
                    <div key={r.id} className="border-b border-line pb-4">
                      <div className="mb-1 flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < r.rating ? "fill-ink-900 text-ink-900" : "text-line"}`}
                            />
                          ))}
                        </div>
                        <span className="text-[12px] text-ink-500">{r.tenant?.name}</span>
                      </div>
                      {r.comment && <p className="text-[13px] text-ink-700">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}

              {user?.role === "TENANT" && (() => {
                const hasCompletedRental = myRentals?.some(
                  (r) => r.propertyId === property.id && r.status === "COMPLETED"
                );
                const alreadyReviewed = property.reviews?.some((r) => r.tenant?.id === user.id);

                if (alreadyReviewed) return null;

                if (!hasCompletedRental) return null;

                return (
                  <form onSubmit={handleReviewSubmit(onSubmitReview)} className="mt-6 border-t border-line pt-6">
                    <p className="plaque mb-3">Leave a review</p>
                    <div className="mb-3">
                      <Label htmlFor="rating" required>Rating</Label>
                      <select
                        id="rating"
                        className="w-full border border-line bg-paper-50 px-3.5 py-2.5 text-[14px] text-ink-900 focus:outline-none focus:ring-1 focus:ring-ink-900"
                        {...registerReview("rating")}
                        defaultValue=""
                      >
                        <option value="" disabled>Choose a rating</option>
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
                        ))}
                      </select>
                      <FieldError message={reviewErrors.rating?.message} />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="comment">Comment</Label>
                      <Textarea id="comment" placeholder="How was your stay?" {...registerReview("comment")} />
                      <FieldError message={reviewErrors.comment?.message} />
                    </div>
                    <Button type="submit" variant="primary" size="sm" loading={createReview.isPending}>
                      Submit review
                    </Button>
                  </form>
                );
              })()}
            </div>
          </div>

          <aside className="h-fit border border-ink-900 p-6">
            <p className="plaque mb-1">Monthly rent</p>
            <p className="mb-5 font-mono text-2xl text-ink-900">{formatCurrency(property.price)}</p>

            {property.landlord && (
              <div className="hairline mb-5 pt-4">
                <p className="mb-1 text-[11px] uppercase tracking-widest2 text-ink-500">Listed by</p>
                <p className="text-[14px] text-ink-900">{property.landlord.name}</p>
                <p className="text-[12px] text-ink-500">{property.landlord.email}</p>
              </div>
            )}

            {!hydrated ? null : isOwnerOrStaff ? (
              <p className="text-[13px] text-ink-500">
                {user?.role === "TENANT"
                  ? "This is your own listing."
                  : "Sign in as a tenant to request this property."}
              </p>
            ) : !user ? (
              <div>
                <p className="mb-3 text-[13px] text-ink-500">Sign in as a tenant to request this property.</p>
                <Link href={`/auth/login?next=/properties/${property.id}`}>
                  <Button variant="primary" className="w-full">
                    Sign in to request
                  </Button>
                </Link>
              </div>
            ) : property.status !== "AVAILABLE" ? (
              <p className="text-[13px] text-ink-500">This property is not currently available.</p>
            ) : !showRequestForm ? (
              <Button variant="primary" className="w-full" onClick={() => setShowRequestForm(true)}>
                Request to rent
              </Button>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="moveInDate" required>
                    Move-in date
                  </Label>
                  <Input id="moveInDate" type="date" error={errors.moveInDate?.message} {...register("moveInDate")} />
                  <FieldError message={errors.moveInDate?.message} />
                </div>
                <div>
                  <Label htmlFor="message">Message to landlord</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell the landlord a bit about yourself…"
                    error={errors.message?.message}
                    {...register("message")}
                  />
                  <FieldError message={errors.message?.message} />
                </div>
                <Button type="submit" variant="primary" className="w-full" loading={createRental.isPending}>
                  Submit request
                </Button>
              </form>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
