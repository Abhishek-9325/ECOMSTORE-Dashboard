export interface Category {
  _id: string;
  title: string;
  categoryImage: string;
  createdAt: string;
  upadtedAt: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: string;
  productImage: string;
  categories: {
    title: string;
  };
  createdAt: string;
  upadtedAt: string;
}

export interface Order {
  _id: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}
