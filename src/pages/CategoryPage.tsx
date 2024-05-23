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
import { deleteCategory, getCategories } from "@/http/api";
import { Category } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, MoreHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CategoryPage = () => {
  // todo: add loading spinner, and error message
  // @ts-ignore

  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: getCategories,
    staleTime: 10000, // in Milli-seconds
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      console.log("Category deleted successfully");
      navigate("/dashboard/category");
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
              <BreadcrumbPage>Category</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Link to="/dashboard/category/create">
          <Button>
            <CirclePlus size={20} />
            <span className="ml-2">Add Category</span>
          </Button>
        </Link>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Category</CardTitle>
          <CardDescription>Manage your category.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  Image
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((category: Category) => {
                return (
                  <TableRow key={category._id}>
                    <TableCell className="hidden sm:table-cell">
                      <img
                        alt={category.title}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={category.categoryImage}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {category.createdAt}
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
                              to={`/dashboard/category/edit/${category._id}`}
                            >
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleMutation(category._id)}
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

export default CategoryPage;
