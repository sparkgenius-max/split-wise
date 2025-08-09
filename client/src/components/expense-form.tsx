import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ExpenseForm() {
  const { toast } = useToast();
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const { user } = useAuth();

  const { data: groups = [] } = useQuery({
    queryKey: ["/api/groups"],
    retry: false,
  });

  const createExpenseMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/expenses", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/balance"] });
      toast({
        title: "Success",
        description: "Expense added successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const amount = formData.get("amount") as string;
    const description = formData.get("description") as string;
    const groupId = selectedGroupId;

    if (!title.trim() || !amount || !groupId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = parseFloat(amount);
    if (totalAmount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const selectedGroup = groups.find((g: any) => g.id === groupId);
    if (!selectedGroup) {
      toast({
        title: "Error",
        description: "Please select a valid group.",
        variant: "destructive",
      });
      return;
    }

    // Calculate equal splits among all group members (excluding the payer)
    const memberCount = selectedGroup.memberCount;
    if (memberCount <= 1) {
      toast({
        title: "Error",
        description: "Group must have at least 2 members to split expenses.",
        variant: "destructive",
      });
      return;
    }

    const splitAmount = totalAmount / (memberCount - 1); // Exclude the payer

    const splits = selectedGroup.members
      .filter((member: any) => member.id !== user?.id) // Exclude the payer
      .map((member: any) => ({
        userId: member.id,
        amount: splitAmount.toFixed(2),
        settled: false,
      }));

    createExpenseMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      amount: totalAmount.toFixed(2),
      groupId,
      splits,
    });
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Add New Expense</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="title">What did you pay for? *</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Dinner, Gas, Groceries"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <Label htmlFor="group">Group *</Label>
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group: any) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Additional details about the expense"
            rows={3}
          />
        </div>
        
        <div className="flex space-x-4 pt-4">
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-primary to-secondary"
            disabled={createExpenseMutation.isPending}
          >
            {createExpenseMutation.isPending ? "Adding..." : "Add Expense"}
          </Button>
        </div>
      </form>
    </div>
  );
}
