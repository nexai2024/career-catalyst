'use client'; // If using app directory

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const schema = z.object({
  currentPosition: z.string().min(1, 'Current position is required'),
  desiredPosition: z.string().min(1, 'Desired position is required'),
  specialRequirements: z.string().optional(),
  otherInfo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function UserMetadata() {
    const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Replace with your API call or logic
    setLoading(true);
    alert(`Form submitted!\n${JSON.stringify(data, null, 2)}`);
    try {
        const response = await fetch("/api/user/metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPosition: data.currentPosition,
            desiredPosition: data.desiredPosition,
            otberInfo: data.otherInfo,
            specialRequirements: data.specialRequirements,
            location: "Philadelphia, PA", // Example static value
            bio: "Experienced software engineer with a passion for building scalable applications.", // Example static value
            education: "Bachelor's in Computer Science", // Example static value
          }),
        });
  
        if (!response.ok) throw new Error("Failed to create assessment");
  
      } catch (error) {
        console.log("error in dialog", error)
      } finally {
        setLoading(false);
      }
    reset();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Position Application Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Current Position</label>
          <input
            {...register('currentPosition')}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.currentPosition && (
            <p className="text-red-500">{errors.currentPosition.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Desired Position</label>
          <input
            {...register('desiredPosition')}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.desiredPosition && (
            <p className="text-red-500">{errors.desiredPosition.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Special Requirements</label>
          <input
            {...register('specialRequirements')}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Other Info</label>
          <textarea
            {...register('otherInfo')}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        {isSubmitSuccessful && (
          <p className="text-green-600 mt-2">Form submitted successfully!</p>
        )}
      </form>
    </div>
  );
}