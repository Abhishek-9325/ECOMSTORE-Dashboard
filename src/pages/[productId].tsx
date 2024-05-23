import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { editProduct, getProductById } from "@/http/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  price: z.string().min(2, {
    message: "Price must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  categories: z.string().min(2, {
    message: "Categories must be at least 2 characters.",
  }),
  productImage: z
    .instanceof(FileList)
    .optional()
    .refine((file) => {
      return file && file.length <= 1;
    }, "Only one product image is allowed"),
});

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const { data } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    staleTime: 10000, // in Milli-seconds
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: "",
      description: "",
      categories: "",
    },
    values: {
      title: data?.data?.title,
      price: data?.data?.price,
      description: data?.data?.description,
      categories: data?.data?.categories?.title,
    },
  });

  const productImageRef = form.register("productImage");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formdata: FormData) => editProduct(productId, formdata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", productId] });
      navigate("/dashboard/products");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formdata = new FormData();
    formdata.append("title", values.title);
    formdata.append("price", values.price);
    formdata.append("description", values.description);
    formdata.append("categories", values.categories);

    if (values.productImage && values.productImage.length > 0) {
      formdata.append("productImage", values.productImage[0]);
    }

    mutation.mutate(formdata);
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard/products">
                    Products
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4">
              <Link to="/dashboard/products">
                <Button variant={"outline"}>
                  <span className="ml-2">Cancel</span>
                </Button>
              </Link>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <LoaderCircle className="animate-spin" />
                )}
                <span className="ml-2">Submit</span>
              </Button>
            </div>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Edit Product</CardTitle>
              <CardDescription>
                Fill out the form below to edit the product.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
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
                        <Textarea className="min-h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <FormControl>
                        <Input type="text" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productImage"
                  render={() => (
                    <FormItem>
                      <FormLabel>Product Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          className="w-full"
                          {...productImageRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </section>
  );
};

export default EditProduct;
