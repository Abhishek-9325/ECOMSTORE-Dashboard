import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteOrder, getOrders } from "@/http/api";
import { Order, Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  // todo: add loading spinner, and error message
  // @ts-ignore

  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["order"],
    queryFn: getOrders,
    staleTime: 10000, // in Milli-seconds
  });

  console.log(data);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order"] });
      console.log("Order deleted successfully");
      navigate("/dashboard/orders");
    },
  });

  const handleMutation = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage your Orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Image
                </TableHead>
                <TableHead className="w-[350px]">Title</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((order: Order) => {
                return (
                  <TableRow key={order._id}>
                    <TableCell className="hidden sm:table-cell">
                      {order?.products?.map((product: Product) => {
                        return (
                          <img
                            src={product.productImage}
                            alt={product.title}
                            className="h-12 w-12 object-cover rounded-md mb-2"
                          />
                        );
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order?.products?.map((product: Product) => {
                        return (
                          <div className="mb-3" key={product._id}>
                            <p>{product.title}</p>
                          </div>
                        );
                      })}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {order.createdAt}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleMutation(order._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> orders
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrdersPage;
