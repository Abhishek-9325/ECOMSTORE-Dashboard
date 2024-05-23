import { Badge } from "@/components/ui/badge";
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
import { deleteProduct, getProducts } from "@/http/api";
import { Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, MoreHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ProductsPage = () => {
  // todo: add loading spinner, and error message
  // @ts-ignore
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 10000, // in Milli-seconds
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      console.log("Product deleted successfully");
      navigate("/dashboard/products");
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
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link to="/dashboard/products/create">
          <Button>
            <CirclePlus size={20} />
            <span className="ml-2">Add Product</span>
          </Button>
        </Link>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Image
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[150px]">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Product Description
                </TableHead>
                <TableHead>Categories</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((product: Product) => {
                return (
                  <TableRow key={product._id}>
                    <TableCell className="hidden sm:table-cell">
                      <img
                        alt={product.title}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.productImage}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Rs. {product.price}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.description}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.createdAt}
                    </TableCell>
                    <TableCell className="md:table-cell">
                      {product.categories?.title}
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
                          <DropdownMenuItem>
                            <Link
                              to={`/dashboard/products/edit/${product._id}`}
                            >
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleMutation(product._id)}
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
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductsPage;
