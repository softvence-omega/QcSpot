import { useEffect, useState } from "react";

interface Value {
  valueID: string;
  value: string;
  valueTrans: string;
  image: string;
}

interface Attr {
  attrID: string;
  attr: string;
  attrTrans: string;
  values: Value[];
}

interface Sku {
  skuID: string;
  name: string;
  nameTrans: string;
  imgUrl: string;
  stock: number;
  propsID: string;
  propsCode: number[];
  specId: string;
  price: string;
}

interface Product {
  productAttr: Attr[];
  skus: Sku[];
}

interface Props {
  product: Product;
  selectedSku: Sku | null;
  setSelectedSku: React.Dispatch<React.SetStateAction<Sku | null>>;
}

const parsePropsID = (propsID: string): Record<string, number> => {
  const result: Record<string, number> = {};
  const pairs = propsID.split(";");
  for (const pair of pairs) {
    const [key, value] = pair.split(":");
    result[key] = Number(value);
  }
  return result;
};

const ProductSelector = ({ product, selectedSku, setSelectedSku }: Props) => {
  const { productAttr, skus } = product;
  const [selectedValues, setSelectedValues] = useState<Record<string, number>>(
    {}
  );

  const getSkusByImage = (image: string): Sku[] =>
    skus.filter((sku) => sku.imgUrl === image);

  const getImageOptions = (): string[] =>
    Array.from(new Set(skus.map((sku) => sku.imgUrl)));

  const findMatchingSKU = (values: Record<string, number>): Sku | undefined =>
    skus.find((sku) => {
      const parsed = parsePropsID(sku.propsID);
      return Object.entries(parsed).every(([key, val]) => values[key] === val);
    });

  const handleImageClick = (image: string) => {
    const firstSku = getSkusByImage(image)[0];
    if (firstSku) {
      const parsed = parsePropsID(firstSku.propsID);
      setSelectedValues(parsed);
      setSelectedSku(firstSku);
    }
  };

  const handleOptionClick = (attrID: string, valueID: number) => {
    const updated = { ...selectedValues, [attrID]: valueID };
    const matched = findMatchingSKU(updated);
    if (matched) {
      setSelectedValues(parsePropsID(matched.propsID));
      setSelectedSku(matched);
    }
  };

  useEffect(() => {
    if (skus.length > 0) {
      const firstSku = skus[0];
      setSelectedSku(firstSku);
      setSelectedValues(parsePropsID(firstSku.propsID));
    }
  }, [skus]);

  const getValidOptionsPerAttr = (): Record<string, Set<number>> => {
    const valid: Record<string, Set<number>> = {};
    if (!selectedSku) return valid;

    const imageSkus = getSkusByImage(selectedSku.imgUrl);

    for (const sku of imageSkus) {
      const parsed = parsePropsID(sku.propsID);
      for (const [attrID, valueID] of Object.entries(parsed)) {
        if (!valid[attrID]) valid[attrID] = new Set();
        valid[attrID].add(valueID);
      }
    }
    return valid;
  };

  const validOptions = getValidOptionsPerAttr();
  const imageOptions = getImageOptions();

  return (
    <div className="space-y-4 mb-5">
      {/* Image thumbnails */}
      <div className="flex flex-wrap gap-4 justify-center">
        {imageOptions.map((image) => (
          <img
            key={image}
            src={image}
            alt="Product Image Not Found"
            onClick={() => handleImageClick(image)}
            className={`w-20 h-20 cursor-pointer border-2 rounded ${
              selectedSku?.imgUrl === image ? "border-btn" : "border-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Filter Options */}
      {productAttr.map((attr) => (
        <div key={attr.attrID} className="mb-4">
          <h4 className="font-semibold mb-2">{attr.attrTrans}</h4>
          <div className="flex flex-wrap gap-2">
            {attr.values.map((value) => {
              const valueID = Number(value.valueID);
              const isSelected = selectedValues[attr.attrID] === valueID;
              const isValid = validOptions[attr.attrID]?.has(valueID) ?? false;

              return (
                <button
                  key={value.valueID}
                  onClick={() =>
                    isValid && handleOptionClick(attr.attrID, valueID)
                  }
                  disabled={!isValid}
                  className={`border rounded px-3 py-1 text-sm transition
                    ${isSelected ? "bg-green-700 text-white" : ""}
                    ${
                      !isValid || value.valueTrans == ""
                        ? "hidden"
                        : "bg-gray-100 text-black"
                    }
                  `}
                >
                  {value.valueTrans}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSelector;
