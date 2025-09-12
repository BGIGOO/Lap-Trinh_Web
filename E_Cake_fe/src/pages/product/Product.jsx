import CategoryProducts from "./CategoryProducts";
import ProductFilter from "./ProductFilter";
function Product() {
  return (
    <>
      <ProductFilter></ProductFilter>
      <CategoryProducts heading="Ưu đãi hôm nay"></CategoryProducts>
      <CategoryProducts heading="Món mới"></CategoryProducts>
    </>
  );
}
export default Product;
