import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Flame, Dumbbell, DollarSign, Upload, Trash2, Edit2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { MenuItem } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CATEGORIES = [
  { value: "Starters", label: "Starters" },
  { value: "BBQ", label: "BBQ" },
  { value: "Karahi & Curries", label: "Karahi & Curries" },
  { value: "Rice & Biryani", label: "Rice & Biryani" },
  { value: "Naans & Breads", label: "Naans & Breads" },
  { value: "Drinks", label: "Drinks" },
];

const dishFormSchema = z.object({
  name: z.string().min(1, "Dish name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Price must be a positive number"),
  calories: z.string().min(1, "Calories is required").refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, "Calories must be a non-negative number"),
  protein: z.string().min(1, "Protein is required").refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, "Protein must be a non-negative number"),
  image: z.string().min(1, "Image URL is required").url("Please enter a valid URL"),
  category: z.string().min(1, "Category is required"),
});

type DishFormData = z.infer<typeof dishFormSchema>;

export default function AddDish() {
  const [, setLocation] = useLocation();
  const { currentUser, getUserRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const form = useForm<DishFormData>({
    resolver: zodResolver(dishFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      calories: "",
      protein: "",
      image: "",
      category: "",
    },
  });

  const { data: menuItemsData, isLoading: menuItemsLoading } = useQuery<{ items: MenuItem[] }>({
    queryKey: ["/api/menu-items"],
    enabled: isAdmin,
  });

  const menuItems = menuItemsData?.items || [];

  const createDishMutation = useMutation({
    mutationFn: async (data: DishFormData) => {
      const response = await apiRequest("POST", "/api/menu-items", {
        name: data.name,
        description: data.description,
        price: data.price,
        calories: data.calories,
        protein: data.protein,
        image: data.image,
        category: data.category,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      form.reset();
      toast({
        title: "Success",
        description: "Dish added successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add dish",
        variant: "destructive",
      });
    },
  });

  const updateDishMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: DishFormData }) => {
      const response = await apiRequest("PATCH", `/api/menu-items/${id}`, {
        name: data.name,
        description: data.description,
        price: data.price,
        calories: data.calories,
        protein: data.protein,
        image: data.image,
        category: data.category,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      form.reset();
      setEditingItem(null);
      toast({
        title: "Success",
        description: "Dish updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update dish",
        variant: "destructive",
      });
    },
  });

  const deleteDishMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/menu-items/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setShowDeleteDialog(false);
      setItemToDelete(null);
      toast({
        title: "Success",
        description: "Dish deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete dish",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!currentUser) {
        setLocation("/signin");
        return;
      }

      const role = await getUserRole(currentUser.uid);
      if (role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        setLocation("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminAccess();
  }, [currentUser, getUserRole, setLocation, toast]);

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      calories: item.calories,
      protein: item.protein,
      image: item.image,
      category: item.category,
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    form.reset();
  };

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const onSubmit = (data: DishFormData) => {
    if (editingItem) {
      updateDishMutation.mutate({ id: editingItem.id, data });
    } else {
      createDishMutation.mutate(data);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/admin")}
              data-testid="button-back-admin"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold" data-testid="title-add-dish">
              Manage Menu
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card data-testid="card-add-dish-form">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingItem ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingItem ? "Edit Dish" : "Add New Dish"}
              </CardTitle>
              <CardDescription>
                {editingItem ? "Update the dish details below" : "Fill in the details to add a new dish to your menu"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dish Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Chicken Biryani"
                            {...field}
                            data-testid="input-dish-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the dish..."
                            className="resize-none"
                            {...field}
                            data-testid="input-dish-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-dish-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value} data-testid={`option-category-${category.value}`}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            Price
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              data-testid="input-dish-price"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="calories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Flame className="h-4 w-4" />
                            Calories
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              data-testid="input-dish-calories"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="protein"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Dumbbell className="h-4 w-4" />
                            Protein (g)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              data-testid="input-dish-protein"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Upload className="h-4 w-4" />
                          Image URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/dish-image.jpg"
                            {...field}
                            data-testid="input-dish-image"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("image") && (
                    <div className="relative w-full h-48 rounded-md overflow-hidden border">
                      <img
                        src={form.watch("image")}
                        alt="Dish preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                        }}
                        data-testid="img-dish-preview"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    {editingItem && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        data-testid="button-cancel-edit"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={createDishMutation.isPending || updateDishMutation.isPending}
                      data-testid="button-submit-dish"
                    >
                      {createDishMutation.isPending || updateDishMutation.isPending ? (
                        "Saving..."
                      ) : editingItem ? (
                        <>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Update Dish
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Dish
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card data-testid="card-menu-items-list">
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>
                {menuItems.length} dish{menuItems.length !== 1 ? "es" : ""} in your menu
              </CardDescription>
            </CardHeader>
            <CardContent>
              {menuItemsLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading menu items...
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No dishes added yet. Add your first dish using the form.
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {menuItems.map((item) => (
                    <Card key={item.id} className="border" data-testid={`card-menu-item-${item.id}`}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/100x100?text=No+Image";
                              }}
                              data-testid={`img-menu-item-${item.id}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <h3 className="font-semibold truncate" data-testid={`text-menu-item-name-${item.id}`}>
                                {item.name}
                              </h3>
                              <span className="text-sm font-medium text-primary" data-testid={`text-menu-item-price-${item.id}`}>
                                ${item.price}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-md">
                                {item.category}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                {item.calories} cal
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Dumbbell className="h-3 w-3" />
                                {item.protein}g
                              </span>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditClick(item)}
                                data-testid={`button-edit-${item.id}`}
                              >
                                <Edit2 className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteClick(item)}
                                className="text-destructive border-destructive/50"
                                data-testid={`button-delete-${item.id}`}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent data-testid="dialog-delete-confirm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Dish
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setItemToDelete(null);
              }}
              disabled={deleteDishMutation.isPending}
              data-testid="button-cancel-delete"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => itemToDelete && deleteDishMutation.mutate(itemToDelete.id)}
              disabled={deleteDishMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteDishMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
