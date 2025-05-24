import React from "react";
import { useParams } from "react-router-dom";

function CategoryPage() {
  const { categoryName } = useParams();

  return (
    <div>
      <h1>Category: {categoryName}</h1>
      {/* Add logic to display category-specific content here */}
    </div>
  );
}

export default CategoryPage;
