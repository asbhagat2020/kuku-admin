import React from "react";
import { X } from "lucide-react";

const ProductViewModel = ({
  showModals,
  selectedProduct,
  closeModal,
  getCategoryName,
  getSubCategoryName,
  getBrandName,
  getConditionName,
  getSizeName,
}) => {
  if (!showModals || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {showModals && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-2xl mx-auto overflow-hidden">
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-white">
                {selectedProduct.name}
              </h2>
              <p className="text-blue-100 mt-1">Product Details</p>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Product Image
                    </label>
                    <img
                      src={
                        selectedProduct.images &&
                        selectedProduct.images.length > 0
                          ? selectedProduct.images[0]
                          : "https://via.placeholder.com/150"
                      }
                      alt={selectedProduct.name}
                      className="mt-1 h-32 w-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Product ID
                    </label>

                    <p className="mt-1 text-gray-900">#{selectedProduct._id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Product Type
                    </label>
                    <p className="mt-1 text-gray-900">
                      {selectedProduct.productType}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Product Name
                    </label>
                    <p className="mt-1 text-gray-900">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <p className="mt-1 text-gray-900">
                      {selectedProduct.description}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Category
                    </label>
                    <p className="mt-1 text-gray-900">
                      {getCategoryName(selectedProduct)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Sub Category
                    </label>
                    <p className="mt-1 text-gray-900">
                      {getSubCategoryName(selectedProduct)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Price
                    </label>
                    <p className="mt-1 text-gray-900">
                      ${selectedProduct.price}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Usage
                    </label>
                    <p className="mt-1 text-gray-900">
                      {getConditionName(selectedProduct)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Brand
                    </label>
                    <p className="mt-1 text-gray-900">
                      {getBrandName(selectedProduct)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Size
                    </label>
                    <p className="mt-1 text-gray-900">
                      {getSizeName(selectedProduct)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Usage
                    </label>
                    <p className="mt-1 text-gray-900">
                      {selectedProduct.usage}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Price
                    </label>
                    <p className="mt-1 text-gray-900">
                      ${selectedProduct.price}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Damages
                    </label>
                    <p className="mt-1 text-gray-900">
                      {selectedProduct.damages}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rent Option
                    </label>
                    <p className="mt-1 text-gray-900">
                      {selectedProduct.openToRent}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Images
                    </label>
                    <div className="mt-1 flex space-x-2">
                      {Array.isArray(selectedProduct.images) &&
                        selectedProduct.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${selectedProduct.name} image ${index + 1}`}
                            className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductViewModel;
