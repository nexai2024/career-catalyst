"use client";

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const subscriptionSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  features: z.string().min(2, {
    message: "Features must be at least 2 characters.",
  }),
});

const featureSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

export default function AdminPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [isSubscriptionEditDialogOpen, setIsSubscriptionEditDialogOpen] = useState(false);
  const [isFeatureEditDialogOpen, setIsFeatureEditDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const subscriptionForm = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      price: 0,
      features: "{}",
    },
  });

  const featureForm = useForm<z.infer<typeof featureSchema>>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const editSubscriptionForm = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
  });

  const editFeatureForm = useForm<z.infer<typeof featureSchema>>({
    resolver: zodResolver(featureSchema),
  });

  useEffect(() => {
    fetch('/api/subscriptions')
      .then((res) => res.json())
      .then((data) => setSubscriptions(data));
    fetch('/api/features')
      .then((res) => res.json())
      .then((data) => setFeatures(data));
  }, []);

  const onSubscriptionSubmit = async (values: z.infer<typeof subscriptionSchema>) => {
    await fetch('/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...values, features: JSON.parse(values.features) }),
    });
    // Refresh subscriptions
    fetch('/api/subscriptions')
      .then((res) => res.json())
      .then((data) => setSubscriptions(data));
  };

  const onSubscriptionEdit = async (values: z.infer<typeof subscriptionSchema>) => {
    await fetch(`/api/subscriptions/${selectedSubscription.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...values, features: JSON.parse(values.features) }),
    });
    setIsSubscriptionEditDialogOpen(false);
    // Refresh subscriptions
    fetch('/api/subscriptions')
      .then((res) => res.json())
      .then((data) => setSubscriptions(data));
  };

  const onFeatureSubmit = async (values: z.infer<typeof featureSchema>) => {
    await fetch('/api/features', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    // Refresh features
    fetch('/api/features')
      .then((res) => res.json())
      .then((data) => setFeatures(data));
  };

  const onFeatureEdit = async (values: z.infer<typeof featureSchema>) => {
    await fetch(`/api/features/${selectedFeature.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    setIsFeatureEditDialogOpen(false);
    // Refresh features
    fetch('/api/features')
      .then((res) => res.json())
      .then((data) => setFeatures(data));
  };

  const onSubscriptionDelete = async (id: string) => {
    await fetch(`/api/subscriptions/${id}`, {
      method: 'DELETE',
    });
    // Refresh subscriptions
    fetch('/api/subscriptions')
      .then((res) => res.json())
      .then((data) => setSubscriptions(data));
  };

  const onFeatureDelete = async (id: string) => {
    await fetch(`/api/features/${id}`, {
      method: 'DELETE',
    });
    // Refresh features
    fetch('/api/features')
      .then((res) => res.json())
      .then((data) => setFeatures(data));
  };

  const openSubscriptionEditDialog = (subscription: any) => {
    setSelectedSubscription(subscription);
    editSubscriptionForm.reset({
      name: subscription.name,
      price: subscription.price,
      features: JSON.stringify(subscription.features, null, 2),
    });
    setIsSubscriptionEditDialogOpen(true);
  };

  const openFeatureEditDialog = (feature: any) => {
    setSelectedFeature(feature);
    editFeatureForm.reset({
      name: feature.name,
      description: feature.description,
    });
    setIsFeatureEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <div className="border p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Create New Subscription</h3>
          <Form {...subscriptionForm}>
            <form onSubmit={subscriptionForm.handleSubmit(onSubscriptionSubmit)} className="space-y-4">
              <FormField
                control={subscriptionForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subscriptionForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="9.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subscriptionForm.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{ "assessment_generation": 10, "document_generation": 5 }'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create Subscription</Button>
            </form>
          </Form>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.name}</TableCell>
                <TableCell>${subscription.price}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openSubscriptionEditDialog(subscription)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onSubscriptionDelete(subscription.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Feature Management</h2>
        <div className="border p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Create New Feature</h3>
          <Form {...featureForm}>
            <form onSubmit={featureForm.handleSubmit(onFeatureSubmit)} className="space-y-4">
              <FormField
                control={featureForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Assessment Generation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={featureForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Allows users to generate assessments."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create Feature</Button>
            </form>
          </Form>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.id}>
                <TableCell>{feature.name}</TableCell>
                <TableCell>{feature.description}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openFeatureEditDialog(feature)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onFeatureDelete(feature.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isSubscriptionEditDialogOpen} onOpenChange={setIsSubscriptionEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update the details of the subscription plan.
            </DialogDescription>
          </DialogHeader>
          <Form {...editSubscriptionForm}>
            <form onSubmit={editSubscriptionForm.handleSubmit(onSubscriptionEdit)} className="space-y-4">
              <FormField
                control={editSubscriptionForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editSubscriptionForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editSubscriptionForm.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features (JSON)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isFeatureEditDialogOpen} onOpenChange={setIsFeatureEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Feature</DialogTitle>
            <DialogDescription>
              Update the details of the feature.
            </DialogDescription>
          </DialogHeader>
          <Form {...editFeatureForm}>
            <form onSubmit={editFeatureForm.handleSubmit(onFeatureEdit)} className="space-y-4">
              <FormField
                control={editFeatureForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editFeatureForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
